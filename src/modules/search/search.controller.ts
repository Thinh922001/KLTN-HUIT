import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchProductDto } from './dto/search-product.dto';
import { BaseController } from '../../vendors/base/base-controller';

@Controller('search')
export class SearchController extends BaseController {
  constructor(private readonly searchService: SearchService) {
    super();
  }

  @Get()
  async getSearchProduct(@Query() params: SearchProductDto) {
    const data = await this.searchService.searchProduct(params);
    return this.response(data);
  }
}
