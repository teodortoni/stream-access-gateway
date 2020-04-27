import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  logger.verbose(`App running on port ${config.get('app.port')}`);
  await app.listen(config.get('app.port'));
}
bootstrap();
