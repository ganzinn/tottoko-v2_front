export type AccessToken = {
  token: string;
  expires: string;
};

export type LoginUser = {
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export type UserAuth = {
  accessToken: AccessToken;
  loginUser: LoginUser;
} | null;
