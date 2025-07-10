import './instrument';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DatabaseInterceptor } from './app/common/interceptors/database.interceptor';
import { CronJob } from 'cron';
import { removeExpiredUrlsProcessor } from './infra/processors/remove-expired-urls.processor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new DatabaseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Short URLs API')
    .setDescription('API for creating and managing short URLs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  Logger.log('Swagger is running at /docs');

  await app.listen(process.env.PORT ?? 3333);

  new CronJob(
    '0 59 23 * * *', //all days at 23:59:00
    removeExpiredUrlsProcessor,
    null,
    true,
    'America/Sao_Paulo',
  );
}
bootstrap();
