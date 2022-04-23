import ky, { NormalizedOptions } from 'ky';
import camelcaseKeys from 'camelcase-keys';

import { config } from 'config';
import { setUserAuth, StoreType } from 'store';
import { refresh } from 'feature/api/users/refresh';

type ApiErrorAction = 'none' | 'logout';

export class ApiError extends Error {
  displayMessages: string[];
  action: ApiErrorAction;
  constructor(
    displayMessages: string | string[],
    message = typeof displayMessages === 'string'
      ? displayMessages
      : `${displayMessages[0]}_etc`,
    action: ApiErrorAction = 'none',
  ) {
    super(message);
    this.name = 'ApiError';
    this.displayMessages =
      typeof displayMessages === 'string' ? [displayMessages] : displayMessages;
    this.action = action;
  }
}

let store: StoreType;

export const injectStore = (_store: StoreType) => {
  store = _store;
};

export const defApi = ky.create({
  prefixUrl: config.API_URL + config.API_VERSION,
  timeout: 8000,
  retry: 1,
  hooks: {
    afterResponse: [
      async (
        _request: Request,
        _options: NormalizedOptions,
        response: Response,
      ): Promise<Response> => {
        const body = new Blob(
          [
            JSON.stringify(
              camelcaseKeys(await response.json(), { deep: true }),
              null,
              2,
            ),
          ],
          { type: 'application/json' },
        );
        const { headers, status, statusText } = response;
        const init = { headers, status, statusText };

        return new Response(body, init);
      },
    ],
  },
});

type ErrResBody = {
  success: boolean;
  code: string;
  messages: string[];
};

export const isErrResBody = (arg: unknown): arg is ErrResBody => {
  const b = arg as ErrResBody;

  return (
    typeof b?.success === 'boolean' &&
    b?.success === false &&
    typeof b?.code === 'string' &&
    Array.isArray(b?.messages) &&
    b?.messages.every((i) => typeof i === 'string')
  );
};

export const requireUserAuthApi = defApi.extend({
  hooks: {
    beforeRequest: [
      async (request) => {
        const { userAuth } = store.getState();
        if (userAuth) {
          const { expires } = userAuth.accessToken;
          const now = new Date().getTime();
          if (now > expires) {
            // 短い間隔でrefreshが連続送信されると、タイミングにより（refresh_jti書き換え後の場合）エラー（Invalid refresh_jti）となる
            // isRefreshing 等の実装要（true → 送信しない＆ falseになったタイミングでrefreshはせず本リクエストのみ送信 などの実装検討要）
            const { userAuth: newUserAuth } = await refresh();
            if (newUserAuth) {
              store.dispatch(setUserAuth(newUserAuth));
              request.headers.set(
                'Authorization',
                `Bearer ${newUserAuth.accessToken.token}`,
              );
            }
          } else {
            request.headers.set(
              'Authorization',
              `Bearer ${userAuth.accessToken.token}`,
            );
          }
        }
      },
    ],
    afterResponse: [
      async (request, _error, response) => {
        const { userAuth } = store.getState();
        if (userAuth) {
          const responseClone = response.clone();
          const body = (await responseClone.json()) as unknown;
          if (isErrResBody(body) && body.code === 'access_token_expired') {
            const { userAuth: newUserAuth } = await refresh();
            if (newUserAuth) {
              store.dispatch(setUserAuth(newUserAuth));
              request.headers.set(
                'Authorization',
                `Bearer ${newUserAuth.accessToken.token}`,
              );

              return defApi(request);
            }
          }
        }

        return response;
      },
    ],
  },
});

export const noRefreshApi = defApi.extend({
  hooks: {
    beforeRequest: [
      (request) => {
        const { userAuth } = store.getState();
        if (userAuth) {
          request.headers.set(
            'Authorization',
            `Bearer ${userAuth.accessToken.token}`,
          );
        }
      },
    ],
  },
});
