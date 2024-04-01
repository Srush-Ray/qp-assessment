import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as rTracer from 'cls-rtracer';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import RestError from './common/error/rest-error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose', 'debug'],
  });
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });
  app.use(rTracer.expressMiddleware());
  app.useGlobalPipes(new ValidationPipe());
  try {
    const config = new DocumentBuilder()
      .setTitle('grocery')
      .setDescription('The grocery API description')
      .setVersion('1.0')
      .addTag('grocery')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('open-api', app, document);
  } catch (error) {
    throw new RestError(error.message, 400);
  }
  await app.listen(3000);
}
bootstrap();
