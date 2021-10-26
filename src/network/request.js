import axios from "axios";
// import { Message } from "element-ui";
import { startLoading, endLoading } from "../common/Loading";

export function request(config) {
  const instance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 30000,
    withCredentials: true,
  });

  // 请求拦截
  instance.interceptors.request.use(
    (config) => {
      startLoading();
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  // 响应拦截
  instance.interceptors.response.use(
    (res) => {
      endLoading();
      return res;
    },
    (err) => {
      endLoading();
      return Promise.reject(err);
    }
  );
  // 允许跨域携带cookie
  instance.defaults.withCredentials = true;
  return instance(config);
}