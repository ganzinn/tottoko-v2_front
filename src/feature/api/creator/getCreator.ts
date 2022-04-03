import { HTTPError } from 'ky';

import { ApiError, requireUserAuthApi, isErrResBody } from 'feature/api';
import {
  ApiCreatorDetail,
  ApiCreatorFamily,
  CreatorDetail,
  CreatorFamily,
} from 'feature/models/creator';

type ArgData = {
  creatorId?: string;
};

export type RtnData = {
  creator: CreatorDetail;
  creatorFamilies: CreatorFamily[];
};

type OkResBody = {
  success: boolean;
  creator: ApiCreatorDetail;
  creatorFamilies: ApiCreatorFamily[];
};

const isCreator = (arg: unknown): arg is ApiCreatorDetail => {
  const b = arg as ApiCreatorDetail;

  return (
    (typeof b.id === 'string' || typeof b.id === 'number') &&
    typeof b.name === 'string' &&
    (b.originalAvatarUrl === undefined ||
      b.originalAvatarUrl === null ||
      typeof b.originalAvatarUrl === 'string') &&
    typeof b.dateOfBirth === 'string' &&
    new Date(b.dateOfBirth).toString() !== 'Invalid Date' &&
    typeof b.age.years === 'number' &&
    typeof b.age.months === 'number' &&
    (b.gender === undefined ||
      b.gender === null ||
      ((typeof b.gender?.id === 'string' || typeof b.gender?.id === 'number') &&
        typeof b.gender?.value === 'string')) &&
    typeof b.editPermission === 'boolean'
  );
};

const isCreatorFamily = (arg: unknown): arg is ApiCreatorFamily => {
  const b = arg as ApiCreatorFamily;

  return (
    (typeof b.id === 'string' || typeof b.id === 'number') &&
    (typeof b.user.id === 'string' || typeof b.user.id === 'number') &&
    typeof b.user.name === 'string' &&
    (typeof b.relation.id === 'string' || typeof b.relation.id === 'number') &&
    typeof b.relation.value === 'string' &&
    typeof b.familyRemovePermission === 'boolean'
  );
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === true &&
    isCreator(b?.creator) &&
    Array.isArray(b?.creatorFamilies) &&
    b?.creatorFamilies.every(isCreatorFamily)
  );
};

export const getCreator = async ({ creatorId }: ArgData): Promise<RtnData> => {
  if (!creatorId) {
    throw new ApiError(
      'URLパラメーターの指定に不備があります',
      'getCreator:CreatorIdUndefined',
    );
  }
  let creator;
  let creatorFamilies;
  try {
    const response = await requireUserAuthApi.get(`creators/${creatorId}`);
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'getCreator:ResBodyUnexpected',
      );
    }
    creator =
      typeof body.creator.id === 'number'
        ? { ...body.creator, id: body.creator.id.toString() }
        : { ...body.creator, id: body.creator.id };

    creatorFamilies = body.creatorFamilies.map((creatorFamily) =>
      typeof creatorFamily.id === 'number'
        ? { ...creatorFamily, id: creatorFamily.id.toString() }
        : { ...creatorFamily, id: creatorFamily.id },
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

  return { creator, creatorFamilies };
};
