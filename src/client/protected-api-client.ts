// //////////////////////////////////////////////////////////
// This HTTP client is used for making API requests using
// the access token that the server acquires upon startup.
// //////////////////////////////////////////////////////////

import axios from 'axios';

import { accessTokenInterceptor, resetTokenCacheInterceptor } from './interceptors';
import { httpKeepAliveAgent, httpsKeepAliveAgent } from './keep-alive-agent';

const JSON_MEDIA_TYPE = 'application/json;charset=UTF-8';
const M2M_CLIENT_API_URL = `http://localhost:6001/api/protected`;

const protectedApiClient = axios.create({
  baseURL: M2M_CLIENT_API_URL,
  httpAgent: httpKeepAliveAgent,
  httpsAgent: httpsKeepAliveAgent,
  headers: { 'Content-Type': JSON_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
  maxRedirects: 0,
});

/* WRISTBAND_TOUCHPOINT */
// Interceptors attach a valid M2M access token to each request and clear the cache on 401 responses.
protectedApiClient.interceptors.request.use(accessTokenInterceptor, (error) => Promise.reject(error));
protectedApiClient.interceptors.response.use((response) => Promise.resolve(response), resetTokenCacheInterceptor);

export default protectedApiClient;
