import { jwtConstants } from './constants'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { checkPassword } from 'src/utils/crypto'
import { User } from '../user/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({
      where: {
        username,
      },
    })
    if (!user) {
      return {
        code: 3,
        user: null,
      }
    }
    const userPassword = user.password
    const checked = await checkPassword(password, userPassword)
    if (checked) {
      if (user) {
        return {
          code: 1,
          user,
        }
      }
    } else {
      return {
        code: 2,
        user: null,
      }
    }
  }

  async certificate(user: User): Promise<any> {
    const payload = JSON.parse(JSON.stringify(user))
    try {
      const token = this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
      })
      const res = JSON.parse(JSON.stringify(user))
      delete res.password
      return {
        code: 200,
        data: {
          token: 'Bearer ' + token,
          user: res,
        },
        msg: `登录成功`,
      }
    } catch (error) {
      console.log('err', error)
      return {
        code: 500,
        msg: `账号或密码错误`,
      }
    }
  }
}
