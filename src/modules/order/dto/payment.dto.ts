import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class PayMentDto {
  @IsInt()
  @IsNotEmpty()
  orderId;

  @IsEnum(['CASH', 'WEBSITE_WALLET'])
  @IsNotEmpty()
  method;
}
