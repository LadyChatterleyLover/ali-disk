import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'
import { AuthGuard } from '@nestjs/passport'

// @UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userDto: UserDto) {
    return await this.userService.register(userDto)
  }

  @Post('login')
  async login(@Body() userDto: UserDto) {
    return await this.userService.login(userDto)
  }

  @Get()
  async getUser(@Req() req) {
    return this.userService.getUser(req.user.id)
  }
}
