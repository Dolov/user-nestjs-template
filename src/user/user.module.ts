import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity'
import { Role } from './entities/role.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role])
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
