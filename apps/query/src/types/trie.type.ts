export class TrieCacheItem {
  constructor(prefix: string, score: number) {
    this.prefix = prefix;
    this.score = score;
  }
  prefix: string;
  score: number;
}
