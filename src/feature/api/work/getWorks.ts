import { HTTPError } from 'ky';

import { ApiError, requireUserAuthApi, isErrResBody } from 'feature/api';
import { ApiWork, Work } from 'feature/models/work';
import { isPagination, Pagination } from 'feature/models/common';

type ArgData = {
  path: string;
};

export type WorksData = {
  works: Work[];
  pagination: Pagination;
};

type OkResBody = {
  success: boolean;
  works: ApiWork[];
  pagination: Pagination;
};

const isWork = (arg: unknown): arg is ApiWork => {
  const b = arg as ApiWork;

  return (
    (typeof b.id === 'string' || typeof b.id === 'number') &&
    (b.title === undefined ||
      b.title === null ||
      typeof b.title === 'string') &&
    typeof b.date === 'string' &&
    new Date(b.date).toString() !== 'Invalid Date' &&
    (typeof b.creator.id === 'string' || typeof b.creator.id === 'number') &&
    typeof b.creator.name === 'string' &&
    typeof b.creator.dateOfBirth === 'string' &&
    new Date(b.creator.dateOfBirth).toString() !== 'Invalid Date' &&
    typeof b.indexImageUrl === 'string' &&
    Array.isArray(b.tags) &&
    b.tags.every((tag) => typeof tag === 'string')
  );
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === true &&
    Array.isArray(b?.works) &&
    b?.works.every(isWork) &&
    isPagination(b?.pagination)
  );
};

export const getWorks = async (argData: ArgData): Promise<WorksData> => {
  // const params = new URLSearchParams();
  // argData.creatorIds?.map((creatorId) =>
  //   params.append('creator_ids[]', creatorId),
  // );

  // const path = argData.creatorIds?.length
  //   ? `users/me/works?${params.toString()}`
  //   : 'users/me/works';

  // // console.log(path);

  let works;
  let pagination;
  try {
    const response = await requireUserAuthApi.get(argData.path);
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'getWorks:ResBodyUnexpected',
      );
    }
    // idをnumber型からstring型へ変換
    works = body.works.map((work) => {
      const id = typeof work.id === 'number' ? work.id.toString() : work.id;
      const creatorId =
        typeof work.creator.id === 'number'
          ? work.creator.id.toString()
          : work.creator.id;

      return {
        ...work,
        id,
        creator: { ...work.creator, id: creatorId },
      };
    });

    pagination = body.pagination;
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

  return { works, pagination };
};
