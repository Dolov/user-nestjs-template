import { HttpStatus, Controller, SetMetadata, Post, Body, Res, Inject, Headers, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { NotNeedLogin } from '../utils'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService

  @Post('login')
  @NotNeedLogin()
  async login(@Body() userDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const user = await this.userService.login(userDto)
    const token = await this.jwtService.signAsync({
      id: user.id,
      user: user.username,
    })

    response.setHeader('token', token)

    return {
      status: HttpStatus.OK,
      data: user
    }
  }

  @Post('register')
  @NotNeedLogin()
  async register(@Body() userDto: RegisterDto) {
    const user = await this.userService.register(userDto)
    return {
      status: HttpStatus.OK,
      data: user,
    }
  }
}
