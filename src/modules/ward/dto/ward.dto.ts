import { IsNumberString } from 'class-validator';

export class FindOneParams {
  @IsNumberString({ message: 'id is number an number string' })
  id: number;
}
