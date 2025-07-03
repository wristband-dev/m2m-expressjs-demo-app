// //////////////////////////////////////////////////////////
// This HTTP client is used for making API requests using
// the access token that the server acquires upon startup.
// //////////////////////////////////////////////////////////

import axios from 'axios';

import { accessTokenInterceptor, resetTokenCacheInterceptor } from './interceptors';
import { JSON_MEDIA_TYPE, M2M_CLIENT_API_URL } from '../utils/constants';
import { httpKeepAliveAgent, httpsKeepAliveAgent } from './keep-alive-agent';

const protectedApiClient = axios.create({
  baseURL: `${M2M_CLIENT_API_URL}/protected`,
  httpAgent: httpKeepAliveAgent,
  httpsAgent: httpsKeepAliveAgent,
  headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
  maxRedirects: 0,
});

// Interceptors
protectedApiClient.interceptors.request.use(accessTokenInterceptor, (error) => Promise.reject(error));
protectedApiClient.interceptors.response.use((response) => Promise.resolve(response), resetTokenCacheInterceptor);

export default protectedApiClient;
