export type LoginUser = {
  name: string;
  email: string;
};

export const isLoginUser = (arg: unknown): arg is LoginUser => {
  const u = arg as LoginUser;

  return (
    typeof u?.name === 'string' && typeof u?.email === 'string'
    // // (typeof u?.avatarUrl === 'string' || u?.avatarUrl === null)
  );
};

export type AccessToken = {
  token: string;
  unixtimeExpires: number;
};

export const isTokens = (arg: unknown): arg is AccessToken => {
  const t = arg as AccessToken;

  return (
    typeof t?.token === 'string' &&
    typeof t?.unixtimeExpires === 'number' &&
    new Date(t?.unixtimeExpires * 1000).toString() !== 'Invalid Date'
  );
};

export type UserAuth = {
  accessToken: AccessToken;
  loginUser: LoginUser;
} | null;
