import { AdminEntity } from '../../../entities/admin.entity';

export class AdminDto {
  id: number;
  email: string;
  constructor(admin: AdminEntity) {
    this.id = admin.id;
    this.email = admin.email;
  }
}
