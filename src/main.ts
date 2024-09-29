import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import { initializeTransactionalContext } from 'typeorm-transactional';
import helmet from 'helmet';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(compression());
  app.use(helmet());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
