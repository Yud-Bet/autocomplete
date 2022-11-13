import { DynamicModule, Global, Module } from '@nestjs/common';

import { FirebaseConnectionService } from './connection.service';
import { FirebaseService } from './firebase.service';
import { FirebaseConfig } from './types';

interface FirebaseModuleOptions {
  firebaseConfig: FirebaseConfig;
  extraFirebaseConfig?: FirebaseConfig;
}

@Global()
@Module({})
export class FirebaseModule {
  static register(options: FirebaseModuleOptions): DynamicModule {
    return {
      module: FirebaseModule,
      providers: [
        {
          provide: 'FIREBASE_OPTIONS',
          useValue: options,
        },
        FirebaseConnectionService,
        FirebaseService,
      ],
      exports: [FirebaseConnectionService, FirebaseService],
    };
  }
}
