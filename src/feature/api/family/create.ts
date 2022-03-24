import { HTTPError } from 'ky';
import snakecaseKeys from 'snakecase-keys';

import { ApiError, isErrResBody, requireUserAuthApi } from 'feature/api';

type ArgData = {
  email: string;
  relationId: string;
  creatorId: string;
};

export type RtnData = {
  isSuccess: boolean;
  userName: string;
};

type OkResBody = {
  success: boolean;
  userName: string;
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === true &&
    typeof b?.userName === 'string'
  );
};

export const create = async (argData: ArgData): Promise<RtnData> => {
  const reqData = {
    family: {
      email: argData.email,
      relationId: argData.relationId,
    },
  };
  let isSuccess = false;
  let userName;
  try {
    const response = await requireUserAuthApi.post(
      `creators/${argData.creatorId}/families`,
      {
        json: snakecaseKeys(reqData, { deep: true }),
      },
    );
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'ResBodyUnexpected',
      );
    }
    isSuccess = body.success;
    userName = body.userName;
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

  return { isSuccess, userName };
};
