export type AccessToken = {
  token: string;
  expires: number;
};

export type LoginUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type UserAuth = {
  accessToken: AccessToken;
  loginUser: LoginUser;
} | null;

export type User = {
  name: string;
  email: string;
  originalAvatarUrl: string;
};
