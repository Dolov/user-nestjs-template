
import { CanActivate, Inject, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs';
import { Request } from 'express';
import { noLoginMetadata } from './utils'


export class LoginGuard implements CanActivate {

  @Inject(JwtService)
  private jwtService: JwtService

  @Inject(Reflector)
  private reflector: Reflector

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const noLogin = this.reflector.getAllAndOverride(noLoginMetadata, [
      context.getClass(),
      context.getHandler(),
    ])
    
    if (noLogin === true) return true

    const request: Request = context.switchToHttp().getRequest()
    const authorization: string = request.header('authorization') || ''
    const bearer = authorization.split(' ')
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('用户未登录')
    }
    const token = bearer[1];

    try {
      const info = this.jwtService.verify(token);
      (request as any).user = info.user;
      return true;
    } catch(e) {
      throw new UnauthorizedException('登录失效，请重新登录');
    }
  }
}