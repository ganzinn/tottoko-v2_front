import ky, { HTTPError } from 'ky';

import { DEFAULT_API_OPTIONS } from 'feature/api/config';
import { UserAuth } from 'feature/models/user';

type OkResBody = {
  success: boolean;
  token: string;
  expires: number;
  user: {
    name: string;
    email: string;
    resizeAvatarUrl?: string | null;
  };
};

type ErrResBody = {
  success: boolean;
  code: string;
  messages: string[];
};

type Result = {
  userAuth: UserAuth;
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === true &&
    typeof b?.token === 'string' &&
    typeof b?.expires === 'number' &&
    new Date(b?.expires * 1000).toString() !== 'Invalid Date' &&
    typeof b?.user?.name === 'string' &&
    typeof b?.user?.email === 'string' &&
    (typeof b?.user?.resizeAvatarUrl === 'string' ||
      [null, undefined].includes(b?.user?.resizeAvatarUrl))
  );
};

const isErrResBody = (arg: unknown): arg is ErrResBody => {
  const b = arg as ErrResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === false &&
    typeof b?.code === 'string' &&
    Array.isArray(b?.messages) &&
    b?.messages.every((i) => typeof i === 'string')
  );
};

export const refresh = async (): Promise<Result> => {
  const credentials: RequestCredentials = 'include';
  const mergedOptions = {
    ...DEFAULT_API_OPTIONS,
    ...{ credentials }, // Cookie保存
  };
  let userAuth: UserAuth = null;
  let errorMessages;
  try {
    const response = await ky.post('users/sessions/refresh', mergedOptions);
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw Error('ApiResBodyUnexpected');
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
      if (isErrResBody(errorBody)) {
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
    throw errorMessages;
  }

  return { userAuth };
};
