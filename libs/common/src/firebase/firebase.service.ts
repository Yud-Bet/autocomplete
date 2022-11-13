import { Injectable } from '@nestjs/common';

import { Auth } from 'firebase-admin/lib/auth/auth';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore';

import { FirebaseConnectionService } from './connection.service';
import { FirebaseTable } from './enums';

@Injectable()
export class FirebaseService {
  private firestore: Firestore;
  private extraFirestore?: Firestore;
  public adminAuth: Auth;

  constructor(private connection: FirebaseConnectionService) {
    this.firestore = getFirestore(connection.app);
    if (connection.extraApp) {
      this.extraFirestore = getFirestore(connection.extraApp);
    }
    this.adminAuth = connection.adminApp.auth();
  }

  async list(table: FirebaseTable) {
    const collectionRef = collection(this.firestore, table);
    const docs = await getDocs(collectionRef);
    return docs.docs.map((value) => value.data());
  }

  async get(table: FirebaseTable, key: string) {
    const docRef = doc(this.firestore, table, key);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;
    return docSnap.data();
  }

  async create(table: FirebaseTable, data: any) {
    const collectionRef = collection(this.firestore, table);
    const docRef = await addDoc(collectionRef, data);
    data.id = docRef.id;
    return data;
  }

  async createOrUpdate(
    table: FirebaseTable,
    key: string,
    data: any,
    useExtraDb = false,
  ) {
    let fs = this.firestore;
    if (useExtraDb && this.extraFirestore) {
      fs = this.extraFirestore;
    }
    const docRef = doc(fs, table, key);
    await setDoc(docRef, data);
  }

  async verify(token: string) {
    try {
      const decodedToken = await this.adminAuth.verifyIdToken(token);
      return decodedToken.uid;
    } catch {
      return null;
    }
  }
}
