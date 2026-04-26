export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
