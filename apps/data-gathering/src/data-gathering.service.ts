import { FirebaseService, Trie } from '@app/common';
import { FirebaseTable } from '@app/common/firebase/enums';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueryLog } from './type';

var crypto = require('crypto');

const PAGE_SIZE = 10000;

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

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCronV2() {
    this.logger.debug('Called cron job every 10 minutes');

    const prefixes = await this.aggregationV2();
    await this.sync(prefixes);
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

  async aggregationV2() {
    let prefixes = new Set<string>();
    let lastId = '';
    let cont = true;
    do {
      const map = new Map<string, number>();
      const logs = await this.firebaseService.list<QueryLog>(
        FirebaseTable.LOG,
        PAGE_SIZE,
        lastId,
      );
      for (const log of logs) {
        if (map.has(log.query)) {
          map.set(log.query, map.get(log.query) + 1);
        } else map.set(log.query, 1);
      }

      for (let record of map) {
        if (record[0].length > 1) {
          const prefix = record[0].slice(0, 2);
          prefixes.add(prefix);
          await this.firebaseService.createOrUpdate(
            FirebaseTable.AGGREGATED.replace('/', prefix),
            record[0],
            {
              query: record[0],
              frequency: record[1],
            },
          );
        }
      }

      if (logs.length < PAGE_SIZE) {
        cont = false;
        console.log('aggregationV2 done!');
      }
    } while (cont);
    return Array.from<string>(prefixes);
  }

  async refreshTrie(prefix: string = '') {
    let lastId = '';
    let cont = true;
    const trie = new Trie();
    do {
      const current_table = FirebaseTable.AGGREGATED.replace(
        '/',
        prefix.length > 0 ? `_${prefix}/` : '/',
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
    if (count > 0) {
      await this.firebaseService.batchCreateOrUpdate(
        FirebaseTable.TRIE,
        batchData,
        true,
      );
      count = 0;
      batchData = {};
    }
  }

  async sync(prefixes: string[]) {
    for (const prefix of prefixes) {
      await this.refreshTrie(prefix);
    }
  }
}
