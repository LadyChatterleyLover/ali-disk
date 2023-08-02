import {
  Controller,
  Post,
  UseInterceptors,
  UseGuards,
  Req,
  Body,
  UploadedFiles,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('file')
@UseGuards(AuthGuard('jwt'))
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('file', 10))
  async upload(
    @UploadedFiles() file: Express.Multer.File[],
    @Body() params: { dirId: number },
    @Req() req,
  ) {
    return this.fileService.upload(file, req.user.id, params.dirId)
  }

  @Post('cancelUpload')
  async cancelUpload(@Body() params: { name: string }) {
    return this.fileService.cancelUpload(params.name)
  }

  @Post()
  async findAll(
    @Body()
    params: {
      name: string
      type: string
      dirId: number
      isDir: boolean
      isRecovery: boolean
      isShared: boolean
    },
    @Req() req,
  ) {
    return this.fileService.findAll(
      req.user.id,
      params.name,
      params.type,
      params.dirId,
      params.isDir,
      params.isRecovery,
      params.isShared,
    )
  }

  @Post('createDir')
  async createDir(
    @Body() params: { name: string; dirId?: number },
    @Req() req,
  ) {
    return this.fileService.createDir(params.name, req.user.id, params.dirId)
  }

  @Post('patchDelete')
  async patchDelete(@Body() ids: number[]) {
    return this.fileService.patchDelete(ids)
  }

  @Post('recoveryFile')
  async recoveryFile(@Body() ids: number[], @Req() req) {
    return this.fileService.recoveryFile(ids, req.user.id)
  }

  @Post('reductionFile')
  async reductionFile(@Body() ids: number[], @Req() req) {
    return this.fileService.reductionFile(ids, req.user.id)
  }

  @Post('updateFile')
  async update(@Body() updateFileDto) {
    console.log('update')
    return this.fileService.updateFile(updateFileDto)
  }

  @Post('copyFile')
  async copyFile(@Body() params: { id: number }, @Req() req) {
    return this.fileService.copyFile(params.id, req.user.id)
  }

  @Post('shareFile')
  async shareFile(
    @Body()
    params: {
      ids: number[]
      effectiveTime: number
      extractedMethod: string
      extractedCode?: string
    },
  ) {
    return this.fileService.shareFile(
      params.ids,
      params.effectiveTime,
      params.extractedMethod,
      params.extractedCode,
    )
  }

  @Post('cancelShare')
  async cancelShare(@Body() params: { ids: number[] }) {
    return this.fileService.cancelShare(params.ids)
  }

  @Post('findFileByCode')
  async findFileByCode(@Body() params: { code: string }) {
    return this.fileService.findFileByCode(params.code)
  }

  @Post('extractFile')
  async extractFile(@Body() params: { urlCode: string; code: string }) {
    return this.fileService.extractFile(params.urlCode, params.code)
  }
}
