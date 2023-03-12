import axios from 'axios';
import { POST_DOCUMENT_URL } from 'helpers/constants/url';
import { getCookie } from 'helpers/Cookie';

export default (formData, options) => {
  const ssid = getCookie('ssid');
  return new Promise((resolve, reject) => {
    axios
      .post(process.env.REACT_APP_BFF + `${POST_DOCUMENT_URL}`, formData, {
        ...options,
        headers: {
          'Content-Type': 'multipart/form-data',
          ssid,
          'x-traceability-id': '123e4567-e89b-12d3-a456-426655440000',
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
