import { AxiosError } from 'axios';

import { wristbandM2MAuth } from '../../wristband';

/*
 * This will clear the access token and related fields from local memory cache in the event of a downstream
 * API response that results in an HTTP 401 Unauthorized response.
 */
const resetTokenCacheInterceptor = (error: AxiosError): Promise<never> =>
  new Promise((resolve, reject) => {
    if (error.response && error.response.status === 401) {
      console.warn('(RESET TOKEN CACHE INTERCEPTOR) Resetting access token cache...');
      wristbandM2MAuth.clearToken();
    }

    reject(error);
  });

export default resetTokenCacheInterceptor;
