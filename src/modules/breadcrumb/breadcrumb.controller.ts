import { Body, Controller, Get } from '@nestjs/common';
import { GetBreadCrumbDto } from './dto/get-breadcrumb.dto';
import { BreadcrumbService } from './breadcrumb.service';
import { BaseController } from '../../vendors/base/base-comtroller';

@Controller('breadcrumb')
export class BreadcrumbController extends BaseController {
  constructor(private readonly breadCrumbService: BreadcrumbService) {
    super();
  }
  @Get()
  async getBreadCrumb(@Body() params: GetBreadCrumbDto) {
    const data = await this.breadCrumbService.getBreadCrumb(params);
    return this.response(data);
  }
}
