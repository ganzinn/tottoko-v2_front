import { HTTPError } from 'ky';

import { ApiError, defApi, isErrResBody } from 'feature/api';

type RtnData = {
  isSuccess: boolean;
};

type OkResBody = {
  success: boolean;
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return typeof b?.success === 'boolean' && b?.success === true;
};

export const logout = async (): Promise<RtnData> => {
  let isSuccess = false;
  try {
    const response = await defApi.delete('users/sessions/logout', {
      credentials: 'include',
    });
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'refresh:ResBodyUnexpected',
      );
    }
    isSuccess = body.success;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof HTTPError) {
      const errorBody = (await error.response.json()) as unknown;
      if (isErrResBody(errorBody)) {
        // リフレッシュトークン以外のエラーのみスロー
        if (error.response.status !== 401) {
          throw new ApiError(errorBody.messages, errorBody.code);
        }
      } else {
        throw new ApiError(
          `${error.response.status}: ${error.response.statusText}`,
        );
      }
    } else {
      throw new ApiError('サーバーに接続できません', 'other');
    }
  }

  return { isSuccess };
};
