import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DataGatheringService } from './data-gathering.service';

@Controller()
export class DataGatheringController {
  constructor(private readonly dataGatheringService: DataGatheringService) {}

  @Get()
  getHello(): string {
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
}
