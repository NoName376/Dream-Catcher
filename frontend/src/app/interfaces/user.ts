export interface IUser {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export interface IAuthResponse {
  access: string;
  refresh: string;
}
