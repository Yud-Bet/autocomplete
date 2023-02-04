import { getAllValidChildren, Trie } from '@app/common';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { DataGatheringService } from './data-gathering.service';

@Controller()
export class DataGatheringController {
  constructor(private readonly dataGatheringService: DataGatheringService) {}

  @Get()
  getHello(): string {
    this.dataGatheringService.refreshTrie();
    return this.dataGatheringService.getHello();
  }

  @Post('log?')
  async log(@Query('query') query: string) {
    return await this.dataGatheringService.log(query);
  }

  @Post('aggregation')
  async aggregation() {
    return await this.dataGatheringService.aggregation();
  }

  @Post('aggregation-v2')
  async aggregationV2() {
    return await this.dataGatheringService.aggregationV2();
  }

  @Post('refresh-trie')
  async refreshTrie() {
    return await this.dataGatheringService.refreshTrie();
    // return await this.dataGatheringService.sync();
  }

  @Post('distributed-sync-trie')
  async distributedSyncTrie(@Body('prefixs') prefixs: string[]) {
    if (!prefixs || prefixs.length == 0) {
      throw new BadRequestException('List of prefixs is required!');
    }
    return await this.dataGatheringService.sync(prefixs);
  }
}
