import { NestFactory } from '@nestjs/core';
import { QueryModule } from './query.module';

async function bootstrap() {
  const app = await NestFactory.create(QueryModule, { cors: true });
  await app.listen(3000);
}
bootstrap();
