import { IsNotEmpty, IsNumberString } from 'class-validator';

export class TopUpDto {
  @IsNumberString()
  @IsNotEmpty()
  amount: string;
}
