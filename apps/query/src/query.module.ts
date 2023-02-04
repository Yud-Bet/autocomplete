import { FirebaseModule } from '@app/common';
import { CacheModule, Module } from '@nestjs/common';
import { QueryController } from './query.controller';
import { ConfigModule } from '@nestjs/config';
import { QueryService } from './query.service';
import * as redisStore from 'cache-manager-redis-store';

const firebaseConfig = {
  apiKey: 'AIzaSyDQ4P2SrLi25QbnpfSuR0KxtktAUUGRQos',
  authDomain: 'autocomplete-trie.firebaseapp.com',
  projectId: 'autocomplete-trie',
  storageBucket: 'autocomplete-trie.appspot.com',
  messagingSenderId: '557946447390',
  appId: '1:557946447390:web:f26b5b5084451104adf00f',
};
const day = 86400;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/query/.env',
    }),
    FirebaseModule.register({
      firebaseConfig: firebaseConfig,
    }),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      isGlobal: true,
      ttl: 7 * day,
    }),
  ],
  controllers: [QueryController],
  providers: [QueryService],
})
export class QueryModule {}
