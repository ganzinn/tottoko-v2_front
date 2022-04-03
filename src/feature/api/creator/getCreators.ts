import { HTTPError } from 'ky';

import { ApiError, requireUserAuthApi, isErrResBody } from 'feature/api';
import { ApiCreator, Creator } from 'feature/models/creator';

type ArgData = {
  querys: string[];
};

type RtnData = {
  creators: Creator[];
};

type OkResBody = {
  success: boolean;
  creators: ApiCreator[];
};

const isCreator = (arg: unknown): arg is ApiCreator => {
  const b = arg as ApiCreator;

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

export const getCreators = async (argData?: ArgData): Promise<RtnData> => {
  const path = argData?.querys
    ? `users/me/creators?${argData.querys.join('&')}`
    : 'users/me/creators';
  let creators;
  try {
    const response = await requireUserAuthApi.get(path);
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'getCreators:ResBodyUnexpected',
      );
    }
    // idをnumber型からstring型へ変換
    creators = body.creators.map(
      (creator) =>
        typeof creator.id === 'number'
          ? { ...creator, id: creator.id.toString() }
          : { ...creator, id: creator.id }, // typescriptがidの型を認識してくれないため展開
    );
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
