import { Module } from '@nestjs/common';
import { BreadcrumbService } from './breadcrumb.service';
import { BreadcrumbController } from './breadcrumb.controller';
import { CateRepository, ProductRepository } from '../../repositories';

@Module({
  providers: [BreadcrumbService, ProductRepository, CateRepository],
  controllers: [BreadcrumbController],
})
export class BreadcrumbModule {}
