import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { UserDto } from './dto/user.dto'
import { createPassword } from 'src/utils/crypto'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async register(userDto: UserDto) {
    const { username, password, email } = userDto
    const existUser = await this.userRepository.findOne({
      where: {
        username,
      },
    })
    if (existUser) {
      return {
        code: 500,
        msg: '用户已存在',
      }
    }
    const res = await this.userRepository.save({
      username,
      password: createPassword(password),
      email,
    })
    if (res) {
      delete res.password
      return {
        code: 200,
        msg: '注册成功',
        data: res,
      }
    } else {
      return {
        code: 500,
        msg: '注册失败',
      }
    }
  }

  async login(userDto: UserDto) {
    const authResult = await this.authService.validateUser(
      userDto.username,
      userDto.password,
    )
    switch (authResult.code) {
      case 1:
        return this.authService.certificate(authResult.user)
      case 2:
        return {
          code: 500,
          msg: `账号或密码不正确`,
        }
      default:
        return {
          code: 500,
          msg: '该账号没有注册',
        }
    }
  }

  async getUser(userId: number) {
    const res = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    })
    if (res) {
      return {
        code: 200,
        msg: '查询成功',
        data: res,
      }
    } else {
      return {
        code: 500,
        msg: '查询失败',
      }
    }
  }
}
