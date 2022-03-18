/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HTTPError } from 'ky';
import snakecaseKeys from 'snakecase-keys';

import { ApiError, isErrResBody, requireUserAuthApi } from 'feature/api';
import { InputData } from 'containers/pages/CreatorEntry';

type ArgData = InputData;

type RtnData = {
  isSuccess: boolean;
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

export const createCreator = async (argData: ArgData): Promise<RtnData> => {
  const snkcsArgData = snakecaseKeys(argData);
  const reqData = new FormData();
  Object.keys(snkcsArgData).forEach((key) => {
    reqData.append(
      `creator[${key}]`,
      snkcsArgData[key as keyof typeof snkcsArgData],
    );
  });

  let isSuccess = false;
  try {
    const response = await requireUserAuthApi.post('users/me/creators', {
      body: reqData,
    });
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        'システムエラー：サーバー・クライアント間矛盾',
        'refresh:ResBodyUnexpected',
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
