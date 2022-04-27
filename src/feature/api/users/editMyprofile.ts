import { HTTPError } from 'ky';

import { ApiError, isErrResBody, requireUserAuthApi } from 'feature/api';

type ArgData = {
  name: string;
  avatar?: File;
  regdAvatarDel: boolean;
};

type User = {
  name: string;
  email: string;
  avatarUrl?: string;
};

type RtnData = {
  success: boolean;
  user: User;
};

type OkResBody = {
  success: boolean;
  user: {
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
};

const isUser = (arg: unknown): arg is User => {
  const b = arg as User;

  return (
    typeof b.name === 'string' &&
    typeof b.email === 'string' &&
    (b.avatarUrl === undefined ||
      b.avatarUrl === null ||
      typeof b.avatarUrl === 'string')
  );
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b?.success === 'boolean' && b?.success === true && isUser(b?.user)
  );
};

export const editMyprofile = async (argData: ArgData): Promise<RtnData> => {
  const reqData = new FormData();
  reqData.append('user[name]', argData.name);
  if (argData.avatar) {
    reqData.append('user[avatar]', argData.avatar);
  }
  if (!argData.avatar && argData.regdAvatarDel) {
    reqData.append('regd_avatar_del', argData.regdAvatarDel.toString());
  }

  let success;
  let user;
  try {
    const response = await requireUserAuthApi.put('users/me', {
      body: reqData,
    });
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'ResBodyUnexpected',
      );
    }
    success = body.success;
    const avatarUrl =
      body.user.avatarUrl === null ? undefined : body.user.avatarUrl;
    user = { ...body.user, avatarUrl };
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

  return { success, user };
};
