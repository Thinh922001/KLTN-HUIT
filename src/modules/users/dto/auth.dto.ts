import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class RequestCodeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[0-9]{9})$/, {
    message: 'Phone number must be a valid Vietnamese phone number (10 digits, starting with 0)',
  })
  phone: string;
}
