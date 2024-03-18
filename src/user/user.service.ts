import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { md5 } from '../utils'
import { PermissionTypeEnum } from './interface'


@Injectable()
export class UserService {

  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>

  async register(userDto: RegisterDto) {
    const { username, password } = userDto
    const user = await this.userRepository.findOneBy({
      username,
    })

    if (user) {
      throw new HttpException('用户已存在', HttpStatus.OK)
    }

    const newUser = new User();
    newUser.username = username;
    newUser.password = md5(password);

    try {
      const user = await this.userRepository.save(newUser);
      return {
        id: user.id,
        username: user.username
      }
    } catch(e) {
      throw new HttpException('用户存储失败', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async login(userDto: LoginDto) {
    const { username } = userDto
    const user = await this.userRepository.findOneBy({
      username
    })

    const errorMsg = '账号或密码错误'

    if (!user) {
      throw new HttpException(errorMsg, HttpStatus.OK)
    }

    if(user.password !== md5(userDto.password)) {
      throw new HttpException(errorMsg, HttpStatus.OK);
    }

    return {
      id: user.id,
      username,
    }
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
      relations: {
        roles: true,
        permissions: true,
      }
    })
    return user
  }
}
