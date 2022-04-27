import { HTTPError } from 'ky';

import { UserAuth } from 'feature/models/user';
import { ApiError, defApi, isErrResBody } from 'feature/api';

type ArgData = {
  password: string;
  token: string | null;
};

type RtnData = {
  success: boolean;
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

export const emailChange = async (argData: ArgData): Promise<RtnData> => {
  if (argData.token === null) {
    throw new ApiError('tokenの指定に不備があります', 'emailChange:TokenNull');
  }
  const reqData = {
    user: {
      password: argData.password,
    },
  };
  let success;
  let userAuth;
  try {
    const response = await defApi.put('users/me/email', {
      credentials: 'include',
      json: reqData,
      headers: { Authorization: `Bearer ${argData.token}` },
    });
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'emailChange:ResBodyUnexpected',
      );
    }
    success = body.success;
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

  return { success, userAuth };
};
