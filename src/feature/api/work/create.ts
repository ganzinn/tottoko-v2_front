import { HTTPError } from 'ky';
// import snakecaseKeys from 'snakecase-keys';

import { ApiError, isErrResBody, requireUserAuthApi } from 'feature/api';
import { ApiInputData } from 'containers/pages/WorkEntry';

type ArgData = ApiInputData;

type RtnData = {
  isSuccess: boolean;
  workId: string;
};

type OkResBody = {
  success: boolean;
  work: {
    id: string | number;
  };
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === true &&
    (typeof b?.work?.id === 'number' || typeof b?.work?.id === 'string')
  );
};

export const create = async (argData: ArgData): Promise<RtnData> => {
  const reqData = new FormData();
  argData.images.forEach((image) => {
    reqData.append('work[images][]', image);
  });
  reqData.append('work[creator_id]', argData.creatorId);
  reqData.append('work[date]', argData.createdDate);
  reqData.append('work[scope_id]', argData.scopeId);
  if (argData.title) {
    reqData.append('work[title]', argData.title);
  }
  if (argData.description) {
    reqData.append('work[description]', argData.description);
  }

  let isSuccess = false;
  let workId;
  try {
    const response = await requireUserAuthApi.post('users/me/works', {
      body: reqData,
    });
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'ResBodyUnexpected',
      );
    }
    isSuccess = body.success;
    workId =
      typeof body.work.id === 'number' ? body.work.id.toString() : body.work.id;
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

  return { isSuccess, workId };
};
