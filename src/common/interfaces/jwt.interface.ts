import type { Request } from 'express';
import type { UserRole } from '@/common/constants/role.constant';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
