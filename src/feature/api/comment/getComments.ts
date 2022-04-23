import { HTTPError } from 'ky';

import { ApiError, requireUserAuthApi, isErrResBody } from 'feature/api';
import { ApiComment, Comment } from 'feature/models/comment';
import { isPagination, Pagination } from 'feature/models/common';
// import { QueryFunctionContext } from 'react-query';

type ArgData = {
  path: string;
  pageParam?: number;
};

export type CommentsData = {
  comments: Comment[];
  pagination: Pagination;
};

type OkResBody = {
  success: boolean;
  comments: ApiComment[];
  pagination: Pagination;
};

type ApiUser = {
  id: string | number;
  name: string;
  avatarUrl?: string | null;
};

const isUser = (arg: unknown): arg is ApiUser => {
  const b = arg as ApiUser;

  return (
    (typeof b.id === 'string' || typeof b.id === 'number') &&
    typeof b.name === 'string' &&
    (typeof b.avatarUrl === 'string' || [null, undefined].includes(b.avatarUrl))
  );
};

const isComment = (arg: unknown): arg is ApiComment => {
  const b = arg as ApiComment;

  return (
    (typeof b.id === 'string' || typeof b.id === 'number') &&
    typeof b.message === 'string' &&
    typeof b.editPermission === 'boolean' &&
    typeof b.createdAt === 'string' &&
    new Date(b.createdAt).toString() !== 'Invalid Date' &&
    isUser(b.user)
  );
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === true &&
    Array.isArray(b?.comments) &&
    b?.comments.every(isComment) &&
    isPagination(b?.pagination)
  );
};

export const getComments = async ({
  path,
  pageParam = 1,
}: ArgData): Promise<CommentsData> => {
  let comments;
  let pagination;
  try {
    const response = await requireUserAuthApi.get(path, {
      searchParams: { page: pageParam },
    });
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'getComments:ResBodyUnexpected',
      );
    }
    // idをnumber型からstring型へ変換 / urlをnullからundefinedへ変換
    comments = body.comments.map((comment) => {
      const id =
        typeof comment.id === 'number' ? comment.id.toString() : comment.id;
      const userId =
        typeof comment.user.id === 'number'
          ? comment.user.id.toString()
          : comment.user.id;
      const avatarUrl =
        comment.user.avatarUrl === null ? undefined : comment.user.avatarUrl;
      const createdAt = new Date(comment.createdAt);

      return {
        ...comment,
        id,
        createdAt,
        user: { ...comment.user, id: userId, avatarUrl },
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

  return { comments, pagination };
};
