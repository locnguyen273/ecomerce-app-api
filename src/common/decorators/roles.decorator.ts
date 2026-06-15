import { SetMetadata } from '@nestjs/common';
import type { CustomDecorator } from '@nestjs/common';
import type { UserRole } from '@/common/constants/role.constant';

export const ROLES_KEY = 'roles';

export const Roles = (
  ...roles: UserRole[]
): CustomDecorator<string> => SetMetadata(ROLES_KEY, roles);
