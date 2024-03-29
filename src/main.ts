import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe())
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  await app.listen(port);
}
bootstrap();
