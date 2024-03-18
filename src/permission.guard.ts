import { CanActivate, ExecutionContext, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs';
import { Request } from 'express'
import { UserService } from './user/user.service';
import { PermissionTypeEnum } from './user/interface'
import { Permission } from './user/entities/permission.entity'

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
    /** 如果没有登录则不处理，会被登录守卫处理 */
    if (!request.user) return true

    const username = request.user.username
    const user = await this.userService.findByUsername(username);
    const permission = this.reflector.getAllAndOverride('permission', [
      context.getClass(),
      context.getHandler()
    ])

    /** 如果没有设置鉴权元数据则认为不需要鉴权 */
    if (!permission) return true

    const { permissionType, roles } = user
    /** 默认为 ACL 模型 */
    let permissions: Permission[] = user.permissions
    /** 处理 RBAC 模型 */
    if (permissionType === PermissionTypeEnum.RBAC) {
      const roleIds = roles.map(item => item.id)
      const roleWithPermissions = await this.userService.findRolesByIds(roleIds)
      permissions = roleWithPermissions.reduce((total, current) => {
        total.push(...current.permissions);
        return total;
      }, []);
    }

    const withPermission = permissions.find(item => item.name === permission)
    if (withPermission) {
      return true
    }
    
    throw new UnauthorizedException('没有权限访问该接口');
  }
}
