import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useUserStore } from '@/store/user/user';
import type { UserInfoRes } from '@/service/modules/users/types';
import qs from 'qs';
import _ from 'lodash';
import cookies from 'js-cookie';
import router from '@/router';
import utils from '@/utils';

/**
 * @description Log and display errors
 * @param {Error} error Error object
 */
const handleError = (res: AxiosResponse<any, any>) => {
  // Print to console
  if (import.meta.env.MODE === 'development') {
    utils.log.capsule('DolphinScheduler', 'UI');
    utils.log.error(res);
  }
  window.$message.error(res.data.msg);
};

// 异常处理
const err = (err: AxiosError): Promise<AxiosError> => {
  if (err.response?.status === 401 || err.response?.status === 504) {
    const userStore = useUserStore();
    userStore.setSessionId('');
    userStore.setUserInfo({});
    userStore.setUserAuth([]);
    router.push({ path: '/login' });
  }

  return Promise.reject(err);
};

// 请求体处理
const request = (config: AxiosRequestConfig<any>) => {
  const userStore = useUserStore();
  const userInfo = userStore.userInfo as UserInfoRes;
  config.headers && (config.headers.sessionId = userStore.getSessionId);
  config.headers && (config.headers.miningUserId = userInfo.id);
  const language = cookies.get('language');
  config.headers = config.headers || {};
  if (language) config.headers.language = language;
  return config;
};

// 返回体处理
const response = (res: AxiosResponse) => {
  // No code will be processed
  if (res.data.code === undefined) {
    return res.data;
  }
  switch (res.data.code) {
    case 0:
      return res.data.data;
    case 200:
      return res.data.data;
    default:
      handleError(res);
      throw new Error();
  }
};

// 发送数据前，修改请求数据
const transformRequest = (params: any) => {
  if (_.isPlainObject(params)) {
    return qs.stringify(params, { arrayFormat: 'repeat' });
  } else {
    return params;
  }
};

// 请求参数序列化
const paramsSerializer = (params: any) => {
  return qs.stringify(params, { arrayFormat: 'repeat' });
};

// 统一管理
const apiURL = String(import.meta.env.VITE_APP_DEV_WEB_URL);
const RequestConfig: AxiosRequestConfig = {
  baseURL: process.env.NODE_ENV === 'production' ? apiURL : '/api',
  timeout: 15000,
  transformRequest: transformRequest,
  paramsSerializer: paramsSerializer
};
const Service = axios.create(RequestConfig);
Service.interceptors.request.use(request, err);
Service.interceptors.response.use(response, err);

export { Service };
