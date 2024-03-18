import { HttpStatus, Controller, Get, Post, Body, Res, Inject, Headers, UnauthorizedException, Query } from '@nestjs/common';
import { Request, Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { NotNeedLogin } from '../utils'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService

  @Inject(ConfigService)
  private configService: ConfigService

  @Get('refreshToken')
  @NotNeedLogin()
  async refreshToken(@Query('refresh_token') refreshToken: string, @Res({ passthrough: true }) response: Response) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findByUsername(data.username);
      const res = await this.setToken(user, response)
      return res
    } catch (error) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }    
  }

  @Post('login')
  @NotNeedLogin()
  async login(@Body() userDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const user = await this.userService.login(userDto)
    const res = await this.setToken(user, response)
    return res
  }

  async setToken(user: { id: number, username: string }, response: Response) {
    const { id, username } = user
    const access_token = await this.jwtService.signAsync({
      id,
      username,
    }, {
      expiresIn: this.configService.get('jwt_expires')
    })

    const refresh_token = await this.jwtService.signAsync({
      id,
      username,
    }, {
      expiresIn: this.configService.get('jwt_refresh_expires')
    })

    response.setHeader('access_token', access_token)
    response.setHeader('refresh_token', refresh_token)

    return {
      status: HttpStatus.OK,
      data: {
        id,
        username,
        access_token,
        refresh_token,
      }
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
