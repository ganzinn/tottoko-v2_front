import { HTTPError } from 'ky';

import { ApiError, requireUserAuthApi, isErrResBody } from 'feature/api';
import { Creator } from 'feature/models/creator';

type RtnData = {
  creators: Creator[];
};

type OkResBody = {
  success: boolean;
  creators: Creator[];
};

const isCreator = (arg: unknown): arg is Creator => {
  const b = arg as Creator;

  return (
    (typeof b.id === 'string' || typeof b.id === 'number') &&
    typeof b.name === 'string' &&
    (b.avatarUrl === undefined ||
      b.avatarUrl === null ||
      typeof b.avatarUrl === 'string') &&
    typeof b.dateOfBirth === 'string' &&
    new Date(b.dateOfBirth).toString() !== 'Invalid Date' &&
    typeof b.age?.years === 'number' &&
    typeof b.age?.months === 'number'
  );
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === true &&
    Array.isArray(b?.creators) &&
    b?.creators.every(isCreator)
  );
};

export const getCreators = async (): Promise<RtnData> => {
  let creators;
  try {
    const response = await requireUserAuthApi.get('users/me/creators');
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'getCreators:ResBodyUnexpected',
      );
    }
    creators = body.creators;
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

  return { creators };
};
