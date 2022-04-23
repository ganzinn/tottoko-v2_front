import { HTTPError } from 'ky';

import { UserAuth } from 'feature/models/user';
import { ApiError, defApi, isErrResBody } from 'feature/api';

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

export const refresh = async (): Promise<RtnData> => {
  let userAuth = null;
  try {
    const response = await defApi.post('users/sessions/refresh', {
      credentials: 'include',
    });
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'refresh:ResBodyUnexpected',
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
      expires: body.expires * 1000,
    };
    userAuth = { accessToken, loginUser };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof HTTPError) {
      const errorBody = (await error.response.json()) as unknown;
      if (isErrResBody(errorBody)) {
        if (
          error.response.status === 401 &&
          errorBody.code === 'refresh_token_expired'
        ) {
          throw new ApiError(
            'セッションの有効期限切れです。ログインしなおしてください',
            `refresh:${errorBody.code}`,
            'logout',
          );
        } else if (
          error.response.status === 401 &&
          errorBody.code === 'refresh_token_not_set'
        ) {
          throw new ApiError(
            '有効なセッションがございません。ログインしなおしてください',
            `refresh:${errorBody.code}`,
            'logout',
          );
        } else if (
          error.response.status === 401 &&
          errorBody.code === 'refresh_jti_not_include'
        ) {
          throw new ApiError(
            '有効なセッションではありません。ログインしなおしてください',
            `refresh:${errorBody.code}`,
            'logout',
          );
        } else if (
          error.response.status === 401 &&
          errorBody.code === 'refresh_token_invalid'
        ) {
          throw new ApiError(
            '不正なトークンを検知しました',
            `refresh:${errorBody.code}`,
            'logout',
          );
        } else {
          throw new ApiError(errorBody.messages, `refresh:${errorBody.code}`);
        }
      } else {
        const serverMessage = `${error.response.status}: ${error.response.statusText}`;
        throw new ApiError(serverMessage, `refresh:${serverMessage}`);
      }
    } else {
      throw new ApiError('サーバーに接続できません', 'refresh:other');
    }
  }

  return { userAuth };
};
