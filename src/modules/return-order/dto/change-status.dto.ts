import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { OrderReturnStatus } from '../../../types';

export class ChangeStatusReturnOrder {
  @IsInt({ message: 'ID phải là một số nguyên' })
  @IsNotEmpty()
  id: number;

  @IsEnum(OrderReturnStatus)
  @IsNotEmpty()
  status: OrderReturnStatus;
}
