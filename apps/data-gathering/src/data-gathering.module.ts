import { FirebaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataGatheringController } from './data-gathering.controller';
import { DataGatheringService } from './data-gathering.service';

const firebaseConfig = {
  apiKey: 'AIzaSyDiPd1PVISLV39PcEBV4HJODy-mfJ8JGFc',
  authDomain: 'autocomplete-raw.firebaseapp.com',
  projectId: 'autocomplete-raw',
  storageBucket: 'autocomplete-raw.appspot.com',
  messagingSenderId: '1049987359239',
  appId: '1:1049987359239:web:2d1bf165ea4f772f3000a2',
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/query/.env',
    }),
    FirebaseModule.register({
      firebaseConfig: firebaseConfig,
    }),
  ],
  controllers: [DataGatheringController],
  providers: [DataGatheringService],
})
export class DataGatheringModule {}
