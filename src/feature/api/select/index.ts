import ky, { HTTPError } from 'ky';

import { DEFAULT_API_OPTIONS } from 'feature/api/config';
import { CmnSelectProps } from 'components/molecules/CmnSelect';

type ArgData = {
  path: string;
};

type RtnData = {
  options?: CmnSelectProps['options'];
  errorMessages?: string[];
};

type Option = {
  id: string | number;
  value: string;
};

type OkResBody = {
  success: boolean;
  options: {
    id: string | number;
    value: string;
  }[];
};

// // ------------------------------------------
// const slctFdNames = ['creators', 'relations'] as const;
// type SlctFdNames = typeof slctFdNames[number];
// type SlctFds = { [K in SlctFdNames]: Options };
// type Take<T extends SlctFdNames> = { success: boolean } & Pick<SlctFds, T> &
//   Partial<Record<Exclude<SlctFdNames, T>, undefined>>;
// type DistributeTake<T> = T extends SlctFdNames ? Take<T> : never;
// type OkResBody = DistributeTake<SlctFdNames>;
// // -------------------------------------------

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

export const selectOptions = async (argData: ArgData): Promise<RtnData> => {
  const mergedOptions = {
    ...DEFAULT_API_OPTIONS,
  };
  let options;
  let errorMessages;
  try {
    const response = await ky.get(argData.path, mergedOptions);
    const body = (await response.json()) as unknown;
    if (!isOkResBody(body)) {
      throw Error('CreatorCreateApiResponseBody unexpected');
    }
    options = body.options.map((option) => {
      const id =
        typeof option.id === 'number' ? option.id.toString() : option.id;

      return { id, value: option.value };
    });
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorBody = (await error.response.json()) as unknown;
      if (isErrResBody(errorBody)) {
        errorMessages = errorBody.messages;
      } else {
        errorMessages = [
          `選択肢のリスト取得に失敗しました: ${error.response.statusText}`,
        ];
      }
    } else {
      errorMessages = ['選択肢のリスト取得に失敗しました: サーバー接続失敗'];
    }
  }

  return { options, errorMessages };
};
