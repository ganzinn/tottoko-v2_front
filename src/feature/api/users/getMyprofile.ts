import { HTTPError } from 'ky';

import { ApiError, requireUserAuthApi, isErrResBody } from 'feature/api';
import { User } from 'feature/models/user';

export type RtnData = {
  user: User;
};

type OkResBody = {
  success: boolean;
  user: User;
};

const isUser = (arg: unknown): arg is User => {
  const b = arg as User;

  return (
    typeof b.name === 'string' &&
    typeof b.email === 'string' &&
    (b.originalAvatarUrl === undefined ||
      b.originalAvatarUrl === null ||
      typeof b.originalAvatarUrl === 'string')
  );
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b?.success === 'boolean' && b?.success === true && isUser(b?.user)
  );
};

export const getMyprofile = async (): Promise<RtnData> => {
  let user;
  try {
    const response = await requireUserAuthApi.get('users/me');
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'getCreator:ResBodyUnexpected',
      );
    }
    user = body.user;
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

  return { user };
};
