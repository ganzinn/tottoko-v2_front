import ky, { HTTPError } from 'ky';

import { DEFAULT_API_OPTIONS } from 'feature/api/config';
import { CmnSelectProps } from 'components/molecules/CmnSelect';

type ArgData = {
  path: string;
};

export type SeletcOptions = {
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

export const selectOptions = async (
  argData: ArgData,
): Promise<SeletcOptions> => {
  const mergedOptions = {
    ...DEFAULT_API_OPTIONS,
  };
  let options;
  let errorMessages;
  try {
    const response = await ky.get(argData.path, mergedOptions);
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw Error('ResBodyUnexpected');
    }
    options = body.options.map((option) => {
      const id =
        typeof option.id === 'number' ? option.id.toString() : option.id;

      return { id, value: option.value };
    });
  } catch (error) {
    if (error instanceof HTTPError) {
      errorMessages = ['選択肢の取得に失敗しました'];
    } else if (
      error instanceof Error &&
      error.message === 'ResBodyUnexpected'
    ) {
      errorMessages = ['選択肢の取得に失敗しました：システムエラー'];
    } else {
      errorMessages = ['選択肢の取得に失敗しました：サーバー接続エラー'];

      throw errorMessages;
    }
  }

  return { options };
};
