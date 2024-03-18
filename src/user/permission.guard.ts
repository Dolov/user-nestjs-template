import { CanActivate, ExecutionContext, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs';
import { Request } from 'express'
import { UserService } from './user.service';
import { PermissionTypeEnum } from './interface'

declare module 'express' {
  interface Request {
    user: {
      id: number
      username: string
    }
  }
}


@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;


  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const username = request.user.username
    const user = await this.userService.findByUsername(username);
    const permission = this.reflector.get('permission', context.getHandler())
    const { permissionType, roles, permissions } = user
    if (permissionType === PermissionTypeEnum.ACL) {
      const withPermission = permissions.find(item => item.name === permission)
      if (withPermission) {
        return true
      }
    }

    if (permissionType === PermissionTypeEnum.RBAC) {
      
    }
    
    throw new UnauthorizedException('没有权限访问该接口');
  }
}
