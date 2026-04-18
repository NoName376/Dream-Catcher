export interface IUser {
  id: number;
  email: string;
  username: string;
  is_private: boolean;
}

export interface IAuthResponse {
  access: string;
  refresh: string;
}
