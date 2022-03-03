import { Options, NormalizedOptions } from 'ky';
import camelcaseKeys from 'camelcase-keys';

import { config } from 'config';

export const DEFAULT_API_OPTIONS: Options = {
  prefixUrl: config.API_URL,
  timeout: 7000,
  retry: 2,
  hooks: {
    // beforeRequest: [
    //   (request: Request): void => {
    //     request.headers.set('aaa', 'aaa');
    //   },
    // ],
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
};
