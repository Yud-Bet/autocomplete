import { FirebaseService, getAllValidChildren, Trie } from '@app/common';
import { FirebaseTable } from '@app/common/firebase/enums';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

var crypto = require('crypto');

@Injectable()
export class DataGatheringService {
  private readonly logger = new Logger(DataGatheringService.name);

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

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async handleCron() {
    this.logger.debug('Called cron job everyday at 5AM');

    await this.aggregation();
    await this.refreshTrie();
  }

  async aggregation() {
    const map = new Map<string, number>();
    const docs = await this.firebaseService.list(FirebaseTable.LOG);
    docs.forEach((value: any) => {
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

  async refreshTrie(postfix: string = '') {
    const PAGE_SIZE = 10000;
    let lastId = '';
    let cont = true;
    const trie = new Trie();
    do {
      const current_table = FirebaseTable.AGGREGATED.replace(
        '/',
        postfix.length > 0 ? `_${postfix}/` : '/',
      );
      console.log('Current table ', current_table);
      const docs = await this.firebaseService.list(
        current_table,
        PAGE_SIZE,
        lastId,
      );
      console.log('Success ', docs.length);

      docs.forEach((value: any) => {
        trie.insert(value.query, value.frequency);
      });
      lastId = docs[docs.length - 1]?.id ?? '';

      if (docs.length < PAGE_SIZE) {
        cont = false;
        console.log('Stopped!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      }
    } while (cont);

    let count = 0;
    let batchData = {};

    const listialized_trie = trie.toList();
    for (const { prefix, value } of listialized_trie) {
      const data = {};
      value.forEach((item) => {
        data[item.query] = item.score;
      });

      if (prefix) {
        const hashedPrefix = crypto
          .createHash('sha256')
          .update(prefix)
          .digest('hex');

        batchData[hashedPrefix] = data;
        count++;

        if (count == 500) {
          await this.firebaseService.batchCreateOrUpdate(
            FirebaseTable.TRIE,
            batchData,
            true,
          );
          count = 0;
          batchData = {};
        }
      }
    }
  }

  async sync() {
    const postfixs = [];
    for (const postfix of postfixs) {
      await this.refreshTrie(postfix);
    }
  }
}
