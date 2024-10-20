import { IsNotEmpty, IsNumber, IsString, Length, Matches } from 'class-validator';

export class VerifyCodeDto {
  @IsNotEmpty()
  @Length(6, 6)
  @Matches(/^\d+$/, { message: 'Code must be a 6-digit number.' })
  code: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(0[0-9]{9})$/, {
    message: 'Phone number must be a valid Vietnamese phone number (10 digits, starting with 0)',
  })
  phone: string;
}
