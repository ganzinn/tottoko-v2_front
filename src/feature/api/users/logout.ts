import ky, { HTTPError } from 'ky';

import { DEFAULT_API_OPTIONS } from 'feature/api/config';

type OkResBody = {
  success: boolean;
};

type Result = {
  isSuccess?: boolean;
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return typeof b?.success === 'boolean' && b?.success === true;
};

export const logout = async (): Promise<Result> => {
  const credentials: RequestCredentials = 'include';
  const mergedOptions = {
    ...DEFAULT_API_OPTIONS,
    ...{ credentials }, // Cookie送信
  };
  let isSuccess;
  let errorMessages;
  try {
    const response = await ky.delete('users/sessions/logout', mergedOptions);
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw Error('ApiResBodyUnexpected');
    }
    isSuccess = body.success;
  } catch (error) {
    if (error instanceof HTTPError) {
      if (error.response.status !== 401) {
        errorMessages = [
          `${error.response.status}: ${error.response.statusText}`,
        ];
      }
    } else {
      errorMessages = ['サーバーに接続できません'];
    }
    throw errorMessages;
  }

  return { isSuccess };
};
