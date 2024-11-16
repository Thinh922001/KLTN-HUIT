import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AdminService } from '../../../modules/admin/admin.service';
import { UnauthorizedException } from '../../../vendors/exceptions/errors.exception';
import { ErrorMessage } from '../../../common/message';

@Injectable()
export class SupperAdminGuard implements CanActivate {
  constructor(private readonly adminService: AdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { id } = request.user;
    if (!id) {
      return false;
    }

    const isSupperAd = await this.adminService.checkSupperAdmin(id);

    if (!isSupperAd) {
      throw new UnauthorizedException(ErrorMessage.INVALID_ADMIN_ROLE);
    }

    return isSupperAd;
  }
}
