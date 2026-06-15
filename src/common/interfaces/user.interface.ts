import type { UserRole } from "@/common/constants/role.constant";

export interface JwtUser {
  id: number;
  email: string;
  role: string;
}

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};
