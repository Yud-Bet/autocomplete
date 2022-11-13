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

const extraFirebaseConfig = {
  apiKey: 'AIzaSyDQ4P2SrLi25QbnpfSuR0KxtktAUUGRQos',
  authDomain: 'autocomplete-trie.firebaseapp.com',
  projectId: 'autocomplete-trie',
  storageBucket: 'autocomplete-trie.appspot.com',
  messagingSenderId: '557946447390',
  appId: '1:557946447390:web:f26b5b5084451104adf00f',
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/query/.env',
    }),
    FirebaseModule.register({
      firebaseConfig: firebaseConfig,
      extraFirebaseConfig: extraFirebaseConfig,
    }),
  ],
  controllers: [DataGatheringController],
  providers: [DataGatheringService],
})
export class DataGatheringModule {}
