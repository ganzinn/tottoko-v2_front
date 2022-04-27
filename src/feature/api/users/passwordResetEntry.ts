import { HTTPError } from 'ky';

import { ApiError, defApi, isErrResBody } from 'feature/api';

type ArgData = {
  email: string;
};

type RtnData = {
  success: boolean;
};

type OkResBody = RtnData;

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return typeof b?.success === 'boolean' && b?.success === true;
};

export const passwordResetEntry = async (
  argData: ArgData,
): Promise<RtnData> => {
  const reqData = {
    user: {
      email: argData.email,
    },
  };
  let success;
  try {
    const response = await defApi.post('users/password_reset_entry', {
      ...{ json: reqData },
    });
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'passwordResetEntry:ResBodyUnexpected',
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
