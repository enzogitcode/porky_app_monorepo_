import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // 🔥 NECESARIO PARA COOKIES

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const configService = app.get(ConfigService);
  const localhost = configService.get<number>('LOCAL_HOST');

  app.enableCors(
    {
      credentials: true,
      origin: true
    }
  )

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`Escuchando en el puerto ${port}`);
}
bootstrap();
