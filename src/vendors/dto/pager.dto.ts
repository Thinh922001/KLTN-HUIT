import { ApiProperty } from '@nestjs/swagger';
import { Min, IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PagerDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  take: number = 1;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip: number = 0;

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isTakeAll?: boolean;
}

export class PagingDto {
  take: number;
  skip: number;
  total: number;
  isNext: boolean;
  isPrev: boolean;
  filters: any;
  orders: any;
  constructor(total: number, pager: PagerDto, filters?: any, orders?: any) {
    this.skip = +pager.skip;
    this.take = +pager.take;
    this.total = total;
    this.isNext = this.skip + this.take < this.total;
    this.isPrev = pager.skip > 0;
    this.filters = filters || null;
    this.orders = orders || null;
  }
}

export class PageDto<T> {
  readonly data: T[];

  readonly paging: PagingDto;

  constructor(data: T[], paging: PagingDto) {
    this.data = data;
    this.paging = paging;
  }
}
