import axios from 'axios';

import { FORM_URLENCODED_MEDIA_TYPE, JSON_MEDIA_TYPE, WRISTBAND_API_URL } from '../utils/constants';
import { httpKeepAliveAgent, httpsKeepAliveAgent } from './keep-alive-agent';

const wristbandApiClient = axios.create({
  auth: { username: process.env.CLIENT_ID!, password: process.env.CLIENT_SECRET! },
  baseURL: WRISTBAND_API_URL,
  httpAgent: httpKeepAliveAgent,
  httpsAgent: httpsKeepAliveAgent,
  headers: { 'Content-Type': FORM_URLENCODED_MEDIA_TYPE, Accept: JSON_MEDIA_TYPE },
  maxRedirects: 0,
});

export default wristbandApiClient;
