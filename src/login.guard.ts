
import { CanActivate, Inject, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs';
import { Request } from 'express';


export class LoginGuard implements CanActivate {

  @Inject(JwtService)
  private jwtService: JwtService

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    if (request.url.includes('/user/')) return true
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