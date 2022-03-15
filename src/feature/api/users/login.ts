import ky, { HTTPError } from 'ky';

import { DEFAULT_API_OPTIONS } from 'feature/api/config';
import { UserAuth } from 'feature/models/user';

export type LoginParams = {
  auth: {
    email: string;
    password: string;
  };
};

type LoginOkResBody = {
  success: boolean;
  token: string;
  expires: number;
  user: {
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
};

type LoginErrResBody = {
  success: boolean;
  code: string;
  messages: string[];
};

type LoginResult = {
  userAuth: UserAuth;
  errorMessages?: string[];
};

const isLoginOkResBody = (arg: unknown): arg is LoginOkResBody => {
  const b = arg as LoginOkResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === true &&
    typeof b?.token === 'string' &&
    typeof b?.expires === 'number' &&
    new Date(b?.expires * 1000).toString() !== 'Invalid Date' &&
    typeof b?.user?.name === 'string' &&
    typeof b?.user?.email === 'string' &&
    (typeof b?.user?.avatarUrl === 'string' ||
      [null, undefined].includes(b?.user?.avatarUrl))
  );
};

const isLoginErrResBody = (arg: unknown): arg is LoginErrResBody => {
  const b = arg as LoginErrResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === false &&
    typeof b?.code === 'string'
    // typeof b?.messages?.base
  );
};

export const login = async (requestData: LoginParams): Promise<LoginResult> => {
  const credentials: RequestCredentials = 'include';
  const mergedOptions = {
    ...DEFAULT_API_OPTIONS,
    ...{ credentials }, // Cookie保存
    ...{ json: requestData },
  };
  let userAuth: UserAuth = null;
  let errorMessages;
  try {
    const response = await ky.post('users/sessions/login', mergedOptions);
    const body = (await response.json()) as unknown;
    if (!isLoginOkResBody(body)) {
      throw Error('LoginApiResponseBody unexpected');
    }
    const loginUser = body.user;
    const accessToken = {
      token: body.token,
      expires: new Date(body.expires * 1000).toISOString(),
    };
    userAuth = { accessToken, loginUser };
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorBody = (await error.response.json()) as unknown;
      if (isLoginErrResBody(errorBody)) {
        errorMessages = errorBody.messages;
      } else {
        errorMessages = [
          `${error.response.status}: ${error.response.statusText}`,
        ];
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(error);
      errorMessages = ['サーバーに接続、または使用できません'];
    }
  }

  return { userAuth, errorMessages };
};
