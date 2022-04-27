import { HTTPError } from 'ky';

import { UserAuth } from 'feature/models/user';
import { ApiError, defApi, isErrResBody } from 'feature/api';
import { FormData } from 'containers/pages/Login';

type ArgData = FormData;

type RtnData = {
  userAuth: UserAuth;
};

type OkResBody = {
  success: boolean;
  token: string;
  expires: number;
  user: {
    id: string | number;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b.success === 'boolean' &&
    b.success === true &&
    typeof b.token === 'string' &&
    typeof b.expires === 'number' &&
    new Date(b.expires * 1000).toString() !== 'Invalid Date' &&
    (typeof b.user.id === 'string' || typeof b.user.id === 'number') &&
    typeof b.user.name === 'string' &&
    typeof b.user.email === 'string' &&
    (typeof b.user.avatarUrl === 'string' ||
      [null, undefined].includes(b.user.avatarUrl))
  );
};

export const login = async (argData: ArgData): Promise<RtnData> => {
  const reqData = {
    auth: argData,
  };
  let userAuth = null;
  try {
    const response = await defApi.post('users/sessions/login', {
      credentials: 'include',
      ...{ json: reqData },
    });
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'login:ResBodyUnexpected',
      );
    }
    const loginUser = (() => {
      const id =
        typeof body.user.id === 'number'
          ? body.user.id.toString()
          : body.user.id;
      const avatarUrl =
        body.user.avatarUrl === null ? undefined : body.user.avatarUrl;

      return { ...body.user, id, avatarUrl };
    })();
    const accessToken = {
      token: body.token,
      // expires: new Date(body.expires * 1000).toISOString(),
      expires: body.expires * 1000,
    };
    userAuth = { accessToken, loginUser };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof HTTPError) {
      const errorBody = (await error.response.json()) as unknown;
      if (isErrResBody(errorBody)) {
        throw new ApiError(errorBody.messages, errorBody.code);
      } else {
        throw new ApiError(
          `${error.response.status}: ${error.response.statusText}`,
        );
      }
    } else {
      throw new ApiError('サーバーに接続できません', 'other');
    }
  }

  return { userAuth };
};
