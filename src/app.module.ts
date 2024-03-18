import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity'
import { Role } from './user/entities/role.entity'
import { Permission } from './user/entities/permission.entity'
import { LoginGuard } from './login.guard'
import { PermissionGuard } from './permission.guard'

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'ssy',
      signOptions: {
        expiresIn: '7d'
      }
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "1234qwer!",
      database: "hello-world",
      synchronize: true,
      logging: true,
      entities: [User, Role, Permission],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      }
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    }
  ],
})
export class AppModule { }
