import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { roles } from 'src/constants/common.enum';
const validateRequest = async (request): Promise<boolean> => {
  if (request?.headers?.role !== roles.admin) {
    return false;
  }
  return true;
};

@Injectable()
export class adminAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
