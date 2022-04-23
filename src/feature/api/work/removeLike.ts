import { HTTPError } from 'ky';

import { ApiError, requireUserAuthApi, isErrResBody } from 'feature/api';
import { Like } from 'feature/models/work';

type ArgData = {
  workId?: string;
};

type RtnData = {
  success: boolean;
  like: Omit<Like, 'alreadyLike'>;
};

type OkResBody = RtnData;

const isLike = (arg: unknown): arg is Like => {
  const b = arg as Like;

  return typeof b.count === 'number';
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b?.success === 'boolean' && b?.success === true && isLike(b?.like)
  );
};

export const removeLike = async ({ workId }: ArgData): Promise<RtnData> => {
  if (!workId) {
    throw new ApiError(
      'URLパラメーターの指定に不備があります',
      'getWork:WorkIdUndefined',
    );
  }
  let success;
  let like;
  try {
    const response = await requireUserAuthApi.delete(`works/${workId}/like`);
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'getLikeCounts:ResBodyUnexpected',
      );
    }
    success = body.success;
    like = body.like;
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

  return { success, like };
};
