import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BaseController } from '../../vendors/base/base-controller';
import { StatisticService } from './statistic.service';
import { GetLowSelling, Stats } from './dto/invoice-statistic.dto';
import { ApiKeyGuard } from '../../vendors/guards/Api-key/api-key.guard';
import { AdminAuthGuard } from '../../vendors/guards/admin/jwt-admin.guard';

@Controller('stats')
export class StatisticController extends BaseController {
  constructor(private readonly statsService: StatisticService) {
    super();
  }

  @Get('/top_selling')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getTopSellingProducts(@Query() params: Stats) {
    const data = await this.statsService.getTopSelling(params);
    return this.response(data);
  }

  @Get('/low_selling')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getLowSelling(@Query() params: GetLowSelling) {
    const data = await this.statsService.getLowSelling(params);
    return this.response(data);
  }

  @Get('revenue')
  @UseGuards(ApiKeyGuard)
  @UseGuards(AdminAuthGuard)
  async getRevenue(@Query() params: Stats) {
    const data = await this.statsService.getRevenue(params);
    return this.response(data);
  }
}
