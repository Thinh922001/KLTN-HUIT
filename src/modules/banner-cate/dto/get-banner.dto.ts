import { IsNotEmpty, IsNumberString } from 'class-validator';

export class GetBannerDto {
  @IsNumberString()
  @IsNotEmpty()
  cateId: number;
}
