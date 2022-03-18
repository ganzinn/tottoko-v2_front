import { HTTPError } from 'ky';

import { ApiError, defApi, isErrResBody } from 'feature/api';
import { CmnSelectProps } from 'components/molecules/CmnSelect';

type ArgData = {
  path: string;
};

type RtnData = {
  options?: CmnSelectProps['options'];
};

type Option = {
  id: string | number;
  value: string;
};

type OkResBody = {
  success: boolean;
  options: Option[];
};

const isOption = (arg: unknown): arg is Option => {
  const o = arg as Option;

  return (
    (typeof o.id === 'string' || typeof o.id === 'number') &&
    typeof o.value === 'string'
  );
};

const isOkResBody = (arg: unknown): arg is OkResBody => {
  const b = arg as OkResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === true &&
    Array.isArray(b?.options) &&
    b?.options.every(isOption)
  );
};

export const selectOptions = async (argData: ArgData): Promise<RtnData> => {
  let options;
  try {
    const response = await defApi.get(argData.path);
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw new ApiError(
        '選択肢の取得に失敗しました：システムエラー',
        'refresh:ResBodyUnexpected',
      );
    }
    options = body.options.map((option) => {
      const id =
        typeof option.id === 'number' ? option.id.toString() : option.id;

      return { id, value: option.value };
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else if (error instanceof HTTPError) {
      const errorBody = (await error.response.json()) as unknown;
      if (isErrResBody(errorBody)) {
        throw new ApiError('選択肢の取得に失敗しました', errorBody.code);
      } else {
        throw new ApiError(
          '選択肢の取得に失敗しました',
          `${error.response.status}: ${error.response.statusText}`,
        );
      }
    } else {
      throw new ApiError(
        '選択肢の取得に失敗しました：サーバー接続エラー',
        'other',
      );
    }
  }

  return { options };
};

export type SeletcOptions = RtnData;
