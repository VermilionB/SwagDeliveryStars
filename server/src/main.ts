import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // игнорировать лишние поля в запросе
        forbidNonWhitelisted: true, // выбрасывать ошибку, если запрос содержит лишние поля
        transform: true, // автоматическое преобразование типов (например, строка '42' в число 42)
      }),
  );
  await app.listen(5000);
}
bootstrap();
