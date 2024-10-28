import { IsNotEmpty, IsNumberString } from 'class-validator';

export class StatisticComment {
  @IsNumberString()
  @IsNotEmpty()
  productId: number;
}
