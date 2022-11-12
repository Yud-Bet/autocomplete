import { FirebaseService } from '@app/common';
import { FirebaseTable } from '@app/common/firebase/enums';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataGatheringService {
  constructor(private readonly firebaseService: FirebaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async log(query: string) {
    this.firebaseService.create(FirebaseTable.LOG, {
      query: query,
      time: Date.now(),
    });
    return true;
  }
}
