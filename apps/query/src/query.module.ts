import { FirebaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { QueryController } from './query.controller';
import { ConfigModule } from '@nestjs/config';
import { QueryService } from './query.service';

const firebaseConfig = {
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
    }),
  ],
  controllers: [QueryController],
  providers: [QueryService],
})
export class QueryModule {}
