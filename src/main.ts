import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'
import { AppModule } from './app.module';
import { LoginGuard } from './login.guard'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe())
  // app.useGlobalGuards(new LoginGuard())

  await app.listen(3000);
}
bootstrap();
