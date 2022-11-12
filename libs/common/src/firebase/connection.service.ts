import { Inject, Injectable } from '@nestjs/common';

import * as admin from 'firebase-admin';
import { credential } from 'firebase-admin';
import { FirebaseApp, initializeApp } from 'firebase/app';

import { FirebaseCredential } from './types';

@Injectable()
export class FirebaseConnectionService {
  private firebaseCredential: FirebaseCredential;
  public adminApp: admin.app.App;
  public app: FirebaseApp;

  constructor(@Inject('FIREBASE_OPTIONS') private options) {
    this.firebaseCredential = {
      type: process.env.TYPE,
      projectId: process.env.PROJECT_ID,
      privateKeyId: process.env.PRIVATE_KEY_ID,
      privateKey: JSON.parse(process.env.PRIVATE_KEY),
      clientEmail: process.env.CLIENT_EMAIL,
      clientId: process.env.CLIENT_ID,
      authUri: process.env.AUTH_URI,
      tokenUri: process.env.TOKEN_URI,
      authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL,
      clientX509CertUrl: process.env.CLIENT_X509_CERT_URL,
    };

    this.adminApp = admin.initializeApp({
      credential: credential.cert(this.firebaseCredential),
    });
    this.app = initializeApp(options.firebaseConfig);
  }
}
