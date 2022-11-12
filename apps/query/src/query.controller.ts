import { FirebaseService } from '@app/common';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryService } from './query.service';

@Controller()
export class QueryController {
  constructor(
    private readonly queryService: QueryService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get()
  async getHello() {
    return this.queryService.getHello();
  }

  @Get('search?')
  async search(@Query('q') query: string) {
    return this.queryService.search(query);
  }
}
