export interface Permission {
  id: number;
  module: string;
  action: string;
  code: string;
  description?: string | null;
}

export interface Role {
  id: number;
  name: string;
  description?: string | null;
  is_system_role?: boolean;
  permissions: Permission[];
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  roles: Role[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
