import { HTTPError } from 'ky';

import { ApiError, requireUserAuthApi, isErrResBody } from 'feature/api';

type ArgData = {
  creatorId?: string;
  familyId?: string;
};

export type RtnData = {
  isSuccess: boolean;
};

type OkResBody = {
  success: boolean;
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return typeof b?.success === 'boolean' && b?.success === true;
};

export const remove = async ({
  creatorId,
  familyId,
}: ArgData): Promise<RtnData> => {
  if (!creatorId || !familyId) {
    throw new ApiError(
      'URLパラメーターの指定に不備があります',
      'getCreator:CreatorIdUndefined',
    );
  }
  let isSuccess = false;
  try {
    const response = await requireUserAuthApi.delete(
      `creators/${creatorId}/families/${familyId}`,
    );
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'getCreator:ResBodyUnexpected',
      );
    }
    isSuccess = body.success;
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

  return { isSuccess };
};
