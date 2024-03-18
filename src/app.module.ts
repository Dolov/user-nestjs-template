import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity'
import { Role } from './user/entities/role.entity'
import { Permission } from './user/entities/permission.entity'
import { LoginGuard } from './login.guard'
import { PermissionGuard } from './permission.guard'
import { env } from './utils'

const dev = "./development.env"
const prod = "./production.env"

const envFilePath = env ? [dev]: [dev, prod]
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config) {
        return {
          secret: config.get('jwt_secret'),
          // signOptions: {
          //   expiresIn: config.get('jwt_expires')
          // }
        }
      }
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config) {
        return {
          type: config.get('orm_type'),
          host: config.get('orm_host'),
          port: config.get('orm_port'),
          logging: false,
          username: config.get('orm_username'),
          password: config.get('orm_password'),
          database: config.get('orm_database'),
          entities: [User, Role, Permission],
          poolSize: config.get('orm_pool_size'),
          synchronize: true,
          connectorPackage: config.get('orm_connector_pkg'),
          extra: {
            authPlugin: config.get('orm_auth_plugin'),
          }
        }
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
