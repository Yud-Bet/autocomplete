import { FirebaseService, getAllValidChildren, Trie } from '@app/common';
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

  async aggregation() {
    const map = new Map<string, number>();
    const docs = await this.firebaseService.list(FirebaseTable.LOG);
    docs.forEach((value) => {
      if (map.has(value.query)) {
        map.set(value.query, map.get(value.query) + 1);
      } else map.set(value.query, 1);
    });

    for (let record of map) {
      await this.firebaseService.createOrUpdate(
        FirebaseTable.AGGREGATED,
        record[0],
        {
          query: record[0],
          frequency: record[1],
        },
      );
    }
  }

  async refreshTrie() {
    const docs = await this.firebaseService.list(FirebaseTable.AGGREGATED);
    const trie = new Trie();
    docs.forEach((value) => {
      trie.insert(value.query, value.frequency);
    });

    trie.toList().forEach(async ({ prefix, value }) => {
      const data = {};
      value.forEach((item) => {
        data[item.query] = item.score;
      });
      if (prefix) {
        await this.firebaseService.createOrUpdate(
          FirebaseTable.TRIE,
          prefix,
          data,
          true,
        );
      }
    });
  }
}
