import { IsEnum, IsOptional } from 'class-validator';
import { OrderReturnStatus } from '../../../types';
import { PagerDto } from '../../../vendors/dto/pager.dto';

export class GetReturnOrder extends PagerDto {
  @IsOptional()
  @IsEnum(OrderReturnStatus)
  status: OrderReturnStatus;
}
