export interface IUserSignUp {
  email: string;
  password: string;
  fullName: string;
  avatarUrl?: string | null;
}

export interface IUserSignIn {
  email: string;
  password: string;
}
