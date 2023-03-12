import axios from 'axios';
import { getCookie } from 'helpers/Cookie';

export async function callApi(url, data = {}, reqConfig = {}) {
  const ssid = getCookie('ssid');
  const instance = axios.create({
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'x-traceability-id': '123e4567-e89b-12d3-a456-426655440000',
      Accept: 'application/json',
      ssid,
    },
    baseURL: process.env.REACT_APP_BFF,
  });

  instance.interceptors.request.use(
    (request) => request,
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      if (response.status === 200 || response.status === 201 || response.data === 202) {
        return response.data;
      } else {
        return null;
      }
    },
    (error) => {
      if (error.message === 'Network Error') {
        error = {
          status: 'NETWORK_ERR',
          data: {
            message: error.message,
          },
        };
        return error;
      }
      return Promise.reject(error);
    }
  );

  let response = null;
  try {
    response = await instance.post(url, data, {
      ...reqConfig,
    });
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}
