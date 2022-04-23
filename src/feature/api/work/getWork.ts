import { HTTPError } from 'ky';

import { ApiError, requireUserAuthApi, isErrResBody } from 'feature/api';
import { ApiWorkDetail, WorkDetail } from 'feature/models/work';

type ArgData = {
  workId?: string;
};

export type RtnData = {
  work: WorkDetail;
};

type OkResBody = {
  success: boolean;
  work: ApiWorkDetail;
};

const isWork = (arg: unknown): arg is ApiWorkDetail => {
  const b = arg as ApiWorkDetail;

  return (
    (typeof b.id === 'string' || typeof b.id === 'number') &&
    typeof b.date === 'string' &&
    new Date(b.date).toString() !== 'Invalid Date' &&
    (b.title === null || typeof b.title === 'string') &&
    (b.description === null || typeof b.description === 'string') &&
    (typeof b.scope.id === 'string' || typeof b.scope.id === 'number') &&
    typeof b.scope.value === 'string' &&
    (typeof b.creator.id === 'string' || typeof b.creator.id === 'number') &&
    typeof b.creator.name === 'string' &&
    typeof b.creator.dateOfBirth === 'string' &&
    new Date(b.creator.dateOfBirth).toString() !== 'Invalid Date' &&
    Array.isArray(b.detailImageUrls) &&
    b.detailImageUrls.every((imageUrl) => typeof imageUrl === 'string') &&
    typeof b.editPermission === 'boolean' &&
    Array.isArray(b.tags) &&
    (b.tags.length === 0 || b.tags.every((tag) => typeof tag === 'string'))
  );
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b?.success === 'boolean' && b?.success === true && isWork(b?.work)
  );
};

export const getWork = async ({ workId }: ArgData): Promise<RtnData> => {
  if (!workId) {
    throw new ApiError(
      'URLパラメーターの指定に不備があります',
      'getWork:WorkIdUndefined',
    );
  }
  let work;
  try {
    const response = await requireUserAuthApi.get(`works/${workId}`);
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'getWork:ResBodyUnexpected',
      );
    }
    work = (() => {
      const id =
        typeof body.work.id === 'number'
          ? body.work.id.toString()
          : body.work.id;

      const creatorId =
        typeof body.work.creator.id === 'number'
          ? body.work.creator.id.toString()
          : body.work.creator.id;

      const scopeId =
        typeof body.work.scope.id === 'number'
          ? body.work.scope.id.toString()
          : body.work.scope.id;

      return {
        ...body.work,
        id,
        creator: { ...body.work.creator, id: creatorId },
        scope: { ...body.work.scope, id: scopeId },
      };
    })();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof HTTPError) {
      const errorBody = (await error.response.json()) as unknown;
      if (isErrResBody(errorBody)) {
        // if (
        //   error.response.status === 401 &&
        //   errorBody.code === 'unauthorized'
        // ) {
        //   throw new ApiError(
        //     '閲覧権限がございません。ログインしなおしてください',
        //     `getWork:${errorBody.code}`,
        //     'logoutToLogin',
        //   );
        // } else {
        throw new ApiError(errorBody.messages, errorBody.code);
        // }
      } else {
        throw new ApiError(
          `${error.response.status}: ${error.response.statusText}`,
        );
      }
    } else {
      throw new ApiError('サーバーに接続できません', 'other');
    }
  }

  return { work };
};
