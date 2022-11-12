export class Log {
  constructor(query: string, time: number) {
    this.query = query;
    this.time = time;
  }

  query: string;
  time: number;
}
