import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ProductRepository } from '../../repositories';

@Module({
  providers: [SearchService , ProductRepository],
  controllers: [SearchController]
})
export class SearchModule {}
