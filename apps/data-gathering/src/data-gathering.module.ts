import { FirebaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DataGatheringController } from './data-gathering.controller';
import { DataGatheringService } from './data-gathering.service';

const firebaseConfig = {
  apiKey: 'AIzaSyD5wnK6Xew1_cfVshicL__AI_HiPipvy5U',
  authDomain: 'autocomplete-raw-e7a84.firebaseapp.com',
  projectId: 'autocomplete-raw-e7a84',
  storageBucket: 'autocomplete-raw-e7a84.appspot.com',
  messagingSenderId: '997623537080',
  appId: '1:997623537080:web:ac9f8e0bc8e813ed8e834d',
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
    ScheduleModule.forRoot(),
  ],
  controllers: [DataGatheringController],
  providers: [DataGatheringService],
})
export class DataGatheringModule {}
