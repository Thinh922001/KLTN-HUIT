import { DoctorsEntity } from '../../../entities/doctor.entity';
import { AUTH_TYPE } from '../../../common/constaints';

export class DoctorDto {
  id: number;
  email: string;
  accountType: AUTH_TYPE;
  constructor(doctor: DoctorsEntity) {
    this.id = doctor.id;
    this.email = doctor.email;
    this.accountType = doctor.accountType;
  }
}
