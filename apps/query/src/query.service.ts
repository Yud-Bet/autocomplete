import { FirebaseService, Trie } from '@app/common';
import { FirebaseTable } from '@app/common/firebase/enums';
import { Injectable } from '@nestjs/common';
import { TrieCacheItem } from './types/trie.type';

@Injectable()
export class QueryService {
  constructor(private readonly firebaseService: FirebaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async search(query: string) {
    const trieCacheDoc = await this.firebaseService.get(
      FirebaseTable.TRIE,
      query,
    );
    if (!trieCacheDoc) return [];

    const trieCache = Object.entries(trieCacheDoc.value).map(
      ([prefix, score]) => new TrieCacheItem(prefix, score as number),
    );
    return trieCache
      .sort((a, b) => b.score - a.score)
      .map((value) => value.prefix);
  }
}
