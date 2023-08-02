import { Injectable } from '@nestjs/common'
import * as OSS from 'ali-oss'
import { InjectRepository } from '@nestjs/typeorm'
import { File } from './entities/file.entity'
import { Repository } from 'typeorm'
import { User } from '../user/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { generateRandomCode, generateUUID } from 'src/utils/generate'
import { UploadGateway } from '../gateway/upload.gateway'
import * as fs from 'node:fs'
import * as path from 'node:path'
const dayjs = require('dayjs')

const host = 'http://localhost:5173/share'

const imgType = ['bmp', 'jpg', 'jpeg', 'png', 'gif']
const videoType = ['mp4', 'ogg', 'flv', 'avi', 'wmv', 'rmvb', 'mov']
const audioType = [
  'mpeg',
  'mp3',
  'wma',
  'aac',
  'ogg',
  'mpc',
  'flac',
  'ape',
  'wv',
]

@Injectable()
export class FileService {
  public client: OSS
  public uploadId: string | null

  constructor(
    private readonly uploadGateway: UploadGateway,
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.client = new OSS({
      region: this.configService.get('OSS_REGION'),
      accessKeyId: this.configService.get('OSS_ACCESSKEYID'),
      accessKeySecret: this.configService.get('OSS_ACCESSKEYSECRET'),
      bucket: this.configService.get('OSS_BUCKET'),
    })
    this.uploadId = null
  }

  async upload(files: Express.Multer.File[], user_id: number, dirId = 0) {
    const file = files[0]
    const size = file.size
    const ext = file.mimetype.split('/')[1]
    let type = ''
    let filename = decodeURI(escape(file.originalname))
    if (imgType.includes(ext.toLowerCase())) {
      type = 'image'
    } else if (videoType.includes(ext.toLowerCase())) {
      type = 'video'
    } else if (audioType.includes(ext.toLowerCase())) {
      type = 'audio'
    } else if (
      ext === 'pdf' ||
      ext.includes('.sheet') ||
      ext.includes('.document')
    ) {
      type = 'text'
    } else {
      type = 'other'
    }
    const existFiles = await this.fileRepository.find({
      where: {
        name: filename,
      },
    })
    if (existFiles.length) {
      filename = `${filename.replace(`.${ext}`, '')}_${dayjs().format(
        'YYYYMMDD',
      )}_${dayjs().format('HHmmss')}.${ext}`
    }
    const url = await this.uploadFile(file)
    if (!url) {
      return
    }
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    })
    const remainingMemory = Number(user.remainingMemory) - file.size
    if (remainingMemory < 0) {
      return {
        code: 500,
        msg: '内存不足',
      }
    }
    const newUser = {
      ...user,
      remainingMemory: String(remainingMemory),
    }
    await this.userRepository.save(newUser)
    const res = await this.fileRepository.save({
      name: filename,
      size,
      ext,
      url,
      user: newUser,
      dirId: dirId || 0,
      type,
    })
    if (res) {
      return {
        code: 200,
        msg: '上传成功',
        data: res,
      }
    } else {
      return {
        code: 500,
        msg: '上传失败',
      }
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const filename = decodeURI(escape(file.originalname))
    const tempFolderPath = path.resolve(__dirname, '..', 'temp')
    if (!fs.existsSync(tempFolderPath)) {
      fs.mkdirSync(tempFolderPath)
    }
    const tempFilePath = path.resolve(tempFolderPath, filename)
    fs.writeFileSync(tempFilePath, file.buffer)
    const filePath = path.resolve(__dirname, '..', 'temp', filename)
    try {
      await this.cancelUpload(filename)
      this.uploadId = await this.initMultipartUpload(filename)
      const result = await this.client.multipartUpload(filename, filePath, {
        progress: (p) => {
          const progressPercentage = Math.round(p * 100)
          this.uploadGateway.sendUploadProgress(progressPercentage)
        },
        headers: {
          'Cache-Control': 'public, max-age=31536000',
        },
        timeout: 60 * 1000,
        partSize: 1024 * 1024,
      })
      fs.unlinkSync(filePath)
      this.uploadId = null
      return (result.res as any).requestUrls[0].split('?')[0]
    } catch (e) {
      console.log('err', e)
    }
  }

  async cancelUpload(name: string) {
    try {
      if (!this.uploadId) {
        return
      }
      const { uploads } = await this.client.listUploads({ prefix: name })
      // 遍历并取消分片上传
      for (const upload of uploads) {
        await this.client.abortMultipartUpload(name, upload.uploadId)
      }
      // 重置 uploadId
      this.uploadId = null
    } catch (error) {
      console.error('Failed to cancel multipart upload:', error)
    }
  }

  async initMultipartUpload(fileName: string): Promise<string> {
    const result = await this.client.initMultipartUpload(fileName)
    return result.uploadId
  }

  async createDir(name: string, user_id: number, dirId = 0) {
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    })
    const existDir = await this.fileRepository.findOne({
      where: {
        name,
        isDir: 1,
        dirId,
      },
    })
    if (existDir) {
      return {
        code: 500,
        msg: '文件夹已存在',
      }
    }
    const data = await this.fileRepository.save({
      name,
      isDir: 1,
      user,
      dirId,
    })
    if (data) {
      return {
        code: 200,
        msg: '创建成功',
        data,
      }
    } else {
      return {
        code: 500,
        msg: '创建失败',
      }
    }
  }

  async findAll(
    userId: number,
    name = '',
    type = '',
    dirId: number,
    isDir?: boolean,
    isRecovery?: boolean,
    isShared?: boolean,
  ) {
    const query = this.fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.user', 'user')
      .where('user.id = :userId', { userId })
    if (name) {
      query.andWhere('file.name LIKE :name', { name: `%${name}%` })
    }
    if (type) {
      query.andWhere('file.type LIKE :type', { type: `%${type}%` })
    }
    if (dirId) {
      query.andWhere('file.dirId = :dirId', { dirId })
    } else {
      query.andWhere({ dirId: 0 })
    }
    if (isDir) {
      query.andWhere({ isDir: 1 })
    }
    if (isRecovery) {
      query.andWhere({ isRecovery: 1 })
    } else {
      query.andWhere({ isRecovery: 0 })
    }
    if (isShared) {
      query.andWhere({ isShared: 1 })
    }

    query.orderBy('file.isDir', 'DESC')
    const data = await query.getMany()
    return {
      code: 200,
      msg: '查询成功',
      data,
    }
  }

  async patchDelete(ids: number[]) {
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .delete()
      .whereInIds(ids)
      .execute()
    if (res) {
      return {
        code: 200,
        msg: '删除成功',
      }
    } else {
      return {
        code: 500,
        msg: '删除失败',
      }
    }
  }

  async updateFile(updateFileDto) {
    const data = await this.fileRepository.findOne({
      where: {
        id: updateFileDto.id,
      },
    })
    const newData = Object.assign(data, { ...updateFileDto })
    if (updateFileDto.users && updateFileDto.users.length) {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .whereInIds(updateFileDto.users)
        .getMany()
      newData.users = users
    }
    const res = await this.fileRepository.save(newData)
    if (res) {
      return {
        code: 200,
        msg: '修改成功',
      }
    } else {
      return {
        code: 500,
        msg: '修改失败',
      }
    }
  }

  // 回收文件
  async recoveryFile(ids: number[], user_id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    })
    const files = await this.fileRepository
      .createQueryBuilder('file')
      .whereInIds(ids)
      .getMany()
    let totalSize = 0
    files.map((item) => {
      totalSize += item.size
    })
    const newUser = {
      ...user,
      remainingMemory: String(Number(user.remainingMemory) + totalSize),
    }
    await this.userRepository.save(newUser)
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .update()
      .set({
        isRecovery: 1,
        deleteAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })
      .whereInIds(ids)
      .execute()

    if (res) {
      return {
        code: 200,
        msg: '删除成功',
      }
    } else {
      return {
        code: 500,
        msg: '删除失败',
      }
    }
  }

  // 还原文件
  async reductionFile(ids: number[], user_id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: user_id,
      },
    })
    const files = await this.fileRepository
      .createQueryBuilder('file')
      .whereInIds(ids)
      .getMany()
    let totalSize = 0
    files.map((item) => {
      totalSize += item.size
    })
    const newUser = {
      ...user,
      remainingMemory: String(Number(user.remainingMemory) - totalSize),
    }
    await this.userRepository.save(newUser)
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .update()
      .set({
        isRecovery: 0,
      })
      .whereInIds(ids)
      .execute()
    if (res) {
      return {
        code: 200,
        msg: '还原成功',
      }
    } else {
      return {
        code: 500,
        msg: '还原成功',
      }
    }
  }

  async copyFile(id: number, userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    })
    const file = await this.fileRepository.findOne({
      where: {
        id,
      },
    })
    if (!file) {
      return {
        code: 500,
        msg: '文件不存在',
      }
    }
    const name = `${file.name.replace(`.${file.ext}`, '')}_${dayjs().format(
      'YYYYMMDD',
    )}_${dayjs().format('HHmmss')}.${file.ext}`
    const newFile = {
      ...file,
      user,
      name,
    }
    delete newFile.id
    const res = await this.fileRepository.save(newFile)
    if (res) {
      return {
        code: 200,
        msg: '复制成功',
      }
    } else {
      return {
        code: 500,
        msg: '复制成功',
      }
    }
  }

  async shareFile(
    ids: number[],
    effectiveTime: number,
    extractedMethod: string,
    extractedCode?: string,
  ) {
    let code = ''
    if (extractedMethod === 'custom') {
      if (!extractedCode) {
        return {
          code: 500,
          msg: '自定义提取码不能为空',
        }
      }
    }
    if (extractedMethod === 'system') {
      code = generateRandomCode()
    }
    const url = `${host}/${generateUUID()}`
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .update()
      .set({
        shareAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        shareUrl: url,
        isShared: 1,
        expirationTime: effectiveTime,
        extractedCode: code,
      })
      .whereInIds(ids)
      .execute()
    if (res) {
      return {
        code: 200,
        msg: '生成分享链接成功',
        data: {
          code,
          url,
        },
      }
    } else {
      return {
        code: 500,
        msg: '生成分享链接失败',
      }
    }
  }

  async cancelShare(ids: number[]) {
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .update()
      .set({
        isShared: 0,
        shareAt: '',
        shareUrl: '',
        expirationTime: 0,
      })
      .whereInIds(ids)
      .execute()
    if (res) {
      return {
        code: 200,
        msg: '取消分享成功',
      }
    } else {
      return {
        code: 500,
        msg: '取消分享失败',
      }
    }
  }

  async findFileByCode(code: string) {
    const file = await this.fileRepository
      .createQueryBuilder('file')
      .leftJoinAndSelect('file.user', 'user')
      .where({ shareUrl: `${host}/${code}` })
      .getOne()
    if (file) {
      return {
        code: 200,
        msg: '查询成功',
        data: {
          name: file.name,
          username: file.user.username,
          avatar: file.user.avatar,
          shareAt: file.shareAt,
        },
      }
    } else {
      return {
        code: 500,
        msg: '文件不存在',
        data: null,
      }
    }
  }

  // 提取文件
  async extractFile(urlCode: string, code: string) {
    const file = await this.fileRepository.findOne({
      where: {
        shareUrl: `${host}/${urlCode}`,
      },
    })
    if (!file) {
      return {
        code: 500,
        msg: '文件不存在',
      }
    }
    const diff = dayjs().valueOf() - dayjs(file.shareAt).valueOf()
    if (file.extractedCode !== code) {
      return {
        code: 500,
        msg: '提取码不正确',
      }
    } else if (diff > file.expirationTime * 1000 * 60 * 60 * 24) {
      return {
        code: 500,
        msg: '文件已过期',
      }
    } else {
      const newFile = {
        ...file,
        viewCount: file.viewCount + 1,
      }
      await this.fileRepository.save(newFile)
      return {
        code: 200,
        msg: '提取文件成功',
        data: file,
      }
    }
  }
}
