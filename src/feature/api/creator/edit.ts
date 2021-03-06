import { HTTPError } from 'ky';
// import snakecaseKeys from 'snakecase-keys';

import { ApiError, isErrResBody, requireUserAuthApi } from 'feature/api';
import { ApiInputData } from 'containers/pages/CreatorEdit';

type ArgData = ApiInputData;

type RtnData = {
  isSuccess: boolean;
};

type OkResBody = {
  success: boolean;
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return typeof b?.success === 'boolean' && b?.success === true;
};

export const edit = async (argData: ArgData): Promise<RtnData> => {
  const reqData = new FormData();
  reqData.append('creator[name]', argData.name);
  reqData.append('creator[date_of_birth]', argData.dateOfBirth);
  reqData.append(
    'creator[gender_id]',
    argData.genderId ? argData.genderId : '',
  );
  if (argData.avatar) {
    reqData.append('creator[avatar]', argData.avatar);
  }
  if (!argData.avatar && argData.regdAvatarDel) {
    reqData.append('regd_avatar_del', argData.regdAvatarDel.toString());
  }

  let isSuccess = false;
  try {
    const response = await requireUserAuthApi.put(
      `creators/${argData.creatorId}`,
      { body: reqData },
    );
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'ResBodyUnexpected',
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
