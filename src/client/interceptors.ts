import { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { wristbandM2MAuth } from '../wristband';

/* WRISTBAND_TOUCHPOINT */
// Sets the Authorization header with a valid M2M access token before each outgoing request.
export const accessTokenInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  const copiedConfig = { ...config };
  const accessToken = await wristbandM2MAuth.getToken();
  copiedConfig.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
  return copiedConfig;
};

/* WRISTBAND_TOUCHPOINT */
// Clears the cached M2M access token on 401 responses so a fresh token is fetched on the very next request.
export const resetTokenCacheInterceptor = (error: AxiosError): Promise<never> =>
  new Promise((resolve, reject) => {
    if (error.response && error.response.status === 401) {
      console.warn('(RESET TOKEN CACHE INTERCEPTOR) Resetting access token cache...');
      wristbandM2MAuth.clearToken();
    }

    reject(error);
  });
