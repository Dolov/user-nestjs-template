import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity'
import { PermissionGuard } from './permission.guard'

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  exports: [UserService, PermissionGuard],
  controllers: [UserController],
  providers: [UserService, PermissionGuard]
})
export class UserModule {}