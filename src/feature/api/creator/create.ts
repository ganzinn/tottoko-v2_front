import ky, { HTTPError } from 'ky';
import snakecaseKeys from 'snakecase-keys';

import { DEFAULT_API_OPTIONS } from 'feature/api/config';

type ArgData = {
  name: string;
  dateOfBirth: string;
  gender: string;
  relation: string;
  accessToken: string;
};

type RtnData = {
  isSuccess?: boolean;
  errorMessages?: string[];
};

type OkResBody = {
  success: boolean;
  creator: {
    id: string;
  };
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === true &&
    typeof b?.creator?.id === 'number'
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

export const createCreator = async (argData: ArgData): Promise<RtnData> => {
  const reqHeaders = {
    Authorization: `Bearer ${argData.accessToken}`,
  };
  const reqBody = {
    creator: {
      name: argData.name,
      // dateOfBirth: argData.dateOfBirth.toISOString().split('T')[0], //Date型で扱う際は変換要
      dateOfBirth: argData.dateOfBirth,
      genderId: argData.gender,
      relationId: argData.relation,
    },
  };
  const mergedOptions = {
    ...DEFAULT_API_OPTIONS,
    ...{ headers: reqHeaders },
    ...{ json: snakecaseKeys(reqBody, { deep: true }) },
  };
  let isSuccess;
  let errorMessages;
  try {
    const response = await ky.post('users/me/creators', mergedOptions);
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw Error('CreatorCreateApiResponseBody unexpected');
    }
    isSuccess = body.success;
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
    } else {
      errorMessages = ['サーバーに接続、または使用できません'];
    }
  }

  return { isSuccess, errorMessages };
};
