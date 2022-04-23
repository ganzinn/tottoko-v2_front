import { HTTPError } from 'ky';

import { ApiError, requireUserAuthApi, isErrResBody } from 'feature/api';

type ArgData = {
  workId: string;
  message: string;
};

type RtnData = {
  success: boolean;
  comment: {
    id: string;
  };
};

// type OkResBody = Omit<RtnData, 'comment'> & { comment: ApiComment };
type OkResBody = {
  success: boolean;
  comment: {
    id: string | number;
  };
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b.success === 'boolean' &&
    b.success === true &&
    (typeof b.comment.id === 'number' || b.comment.id === 'string')
  );
};

export const create = async ({
  workId,
  message,
}: ArgData): Promise<RtnData> => {
  const reqData = {
    comment: { message },
  };
  let success;
  let commentId;
  try {
    const response = await requireUserAuthApi.post(`works/${workId}/comments`, {
      json: reqData,
    });
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'postComment:ResBodyUnexpected',
      );
    }
    success = body.success;
    commentId =
      typeof body.comment.id === 'number'
        ? body.comment.id.toString()
        : body.comment.id;
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

  return { success, comment: { id: commentId } };
};
