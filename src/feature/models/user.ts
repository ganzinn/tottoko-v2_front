export type AccessToken = {
  token: string;
  expires: string;
};

export type LoginUser = {
  name: string;
  email: string;
  resizeAvatarUrl?: string | null;
};

export type UserAuth = {
  accessToken: AccessToken;
  loginUser: LoginUser;
} | null;
