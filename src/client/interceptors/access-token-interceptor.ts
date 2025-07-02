import { InternalAxiosRequestConfig } from 'axios';

import { wristbandM2MAuth } from '../../wristband';

/*
 * This will set the Authorization header for any outgoing request.  The value is this M2M OAuth2 client's access token.
 * Before the token is set into the HTTP header, it will check if the access token is expired and refresh it as needed.
 */
const accessTokenInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
  const copiedConfig = { ...config };
  const accessToken = await wristbandM2MAuth.getToken();
  copiedConfig.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
  return copiedConfig;
};

export default accessTokenInterceptor;
