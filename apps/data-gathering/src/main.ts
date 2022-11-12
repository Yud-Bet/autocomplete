import { NestFactory } from '@nestjs/core';
import { DataGatheringModule } from './data-gathering.module';

async function bootstrap() {
  const app = await NestFactory.create(DataGatheringModule);
  await app.listen(3000);
}
bootstrap();
