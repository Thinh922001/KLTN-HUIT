import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../../../types';
import { PagerDto } from '../../../vendors/dto/pager.dto';

export class GetOrderAd extends PagerDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
