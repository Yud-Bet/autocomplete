import { FirebaseService } from '@app/common';
import { FirebaseTable } from '@app/common/firebase/enums';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TrieCacheItem } from './types/trie.type';

var crypto = require('crypto');

@Injectable()
export class QueryService {
  constructor(
    private readonly firebaseService: FirebaseService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getHello() {
    await this.cacheManager.set('cached_item', { value: 2 });
    const cachedItem = await this.cacheManager.get('cached_item');
    console.log('cached item: ', cachedItem);
    return 'Hello World!';
  }

  async search(query: string) {
    const hashedQuery = crypto
      .createHash('sha256')
      .update(query.toLowerCase())
      .digest('hex');
    const trieCacheDoc = await this.firebaseService.get(
      FirebaseTable.TRIE,
      hashedQuery,
    );
    if (!trieCacheDoc) return [];

    const trieCache = Object.entries(trieCacheDoc).map(
      ([prefix, score]) => new TrieCacheItem(prefix, score as number),
    );
    return trieCache
      .sort((a, b) => b.score - a.score)
      .map((value) => value.prefix)
      .slice(0, 5);
  }
}
