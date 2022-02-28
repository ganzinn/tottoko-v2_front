const isString = (arg: unknown): arg is string => typeof arg === 'string';

type configType = {
  readonly API_VERSION: 'api/v1';
  readonly API_URL: string;
};

const configFactory = (): configType => {
  // 環境変数取得＆型チェック
  const apiUrl = process.env.REACT_APP_API_URL;
  if (!isString(apiUrl)) throw Error('"REACT_APP_API_URL" is not string');

  // ------------------- 固定値を設定 -------------------
  const data: configType = {
    API_URL: apiUrl,
    API_VERSION: 'api/v1',
  } as const;
  // ----------------------------------------------------

  return data;
};

export const config = configFactory();
