// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { AllExceptionsFilter } from './common/filters/all-exception';
import { RequestResponseLoggingInterceptor } from './common/interceptors/request-response-logging.interceptor';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const prisma = app.get(PrismaService);
  app.useGlobalInterceptors(new RequestResponseLoggingInterceptor(prisma));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('blog-platform-be/v1');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
