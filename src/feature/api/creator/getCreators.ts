import ky, { HTTPError } from 'ky';

import { DEFAULT_API_OPTIONS } from 'feature/api/config';
import { AccessToken } from 'feature/models/user';
import { Creator } from 'feature/models/creator';

type ArgData = {
  accessToken?: AccessToken;
};

type RtnData = {
  creators?: Creator[];
};

type OkResBody = {
  success: boolean;
  creators: Creator[];
};

const isCreator = (arg: unknown): arg is Creator => {
  const b = arg as Creator;

  return (
    (typeof b.id === 'string' || typeof b.id === 'number') &&
    typeof b.name === 'string' &&
    (b.avatarUrl === undefined ||
      b.avatarUrl === null ||
      typeof b.avatarUrl === 'string') &&
    typeof b.dateOfBirth === 'string' &&
    new Date(b.dateOfBirth).toString() !== 'Invalid Date' &&
    typeof b.age?.years === 'number' &&
    typeof b.age?.years === 'number'
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

type ErrResBody = {
  success: boolean;
  code: string;
  messages: string[];
};

const isErrResBody = (arg: unknown): arg is ErrResBody => {
  const b = arg as ErrResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === false &&
    typeof b?.code === 'string'
  );
};

export const getCreators = async (argData: ArgData): Promise<RtnData> => {
  let creators;
  let errorMessages;
  try {
    if (!argData.accessToken) {
      throw Error('NoAccessToken');
    }
    const reqHeaders = {
      Authorization: `Bearer ${argData.accessToken.token}`,
    };
    const mergedOptions = {
      ...DEFAULT_API_OPTIONS,
      ...{ headers: reqHeaders },
    };
    const response = await ky.get('users/me/creators', mergedOptions);
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw Error('ResBodyUnexpected');
    }
    creators = body.creators;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorBody = (await error.response.json()) as unknown;
      if (isErrResBody(errorBody)) {
        errorMessages = errorBody.messages;
      } else {
        errorMessages = [
          `${error.response.status}: ${error.response.statusText}`,
        ];
      }
    } else if (error instanceof Error && error.message === 'NoAccessToken') {
      errorMessages = ['認証情報が設定されていません'];
    } else if (
      error instanceof Error &&
      error.message === 'ResBodyUnexpected'
    ) {
      errorMessages = ['システムエラー'];
    } else {
      errorMessages = ['サーバーに接続できません'];
    }
    throw errorMessages;
  }

  return { creators };
};
