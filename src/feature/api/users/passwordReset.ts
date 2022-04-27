import { HTTPError } from 'ky';
import snakecaseKeys from 'snakecase-keys';

import { ApiError, defApi, isErrResBody } from 'feature/api';

type ArgData = {
  password: string;
  passwordConfirmation: string;
  token: string | null;
};

type RtnData = {
  success: boolean;
};

type OkResBody = RtnData;

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return typeof b?.success === 'boolean' && b?.success === true;
};

export const passwordReset = async (argData: ArgData): Promise<RtnData> => {
  if (argData.token === null) {
    throw new ApiError(
      'tokenの指定に不備があります',
      'passwordReset:TokenNull',
    );
  }
  const reqData = {
    user: {
      password: argData.password,
      passwordConfirmation: argData.passwordConfirmation,
    },
  };
  let success;
  try {
    const response = await defApi.put('users/me/password', {
      credentials: 'include',
      json: snakecaseKeys(reqData),
      headers: { Authorization: `Bearer ${argData.token}` },
    });
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'passwordReset:ResBodyUnexpected',
      );
    }
    success = body.success;
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

  return { success };
};
