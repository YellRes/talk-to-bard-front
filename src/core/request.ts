import axios, { Axios, AxiosRequestConfig } from "axios";
import { useModel } from "umi";

// 请求拦截器
axios.interceptors.request.use((config) => {
  const { user } = useModel("userModel");
  config.headers.Authorization = user.token ? `Bearer ${user.token}` : "";
  return config;
});

// 响应拦截器
axios.interceptors.response.use((config) => {
  const { status } = config;

  if (status === 200) {
    return config.data;
  } else {
    return config;
  }
});

type RequestParamsType<T> = {
  params: T;
  otherAxiosConfig: AxiosRequestConfig;
};
type RequestMethodType = Axios["get"] | Axios["post"];
function createRequest<T>(requestMethod: RequestMethodType) {
  return function (url: string, config: RequestParamsType<T>) {
    const { params, otherAxiosConfig } = config;
    requestMethod(url, {
      params,
      ...otherAxiosConfig,
    });
  };
}

const getRequest = createRequest(axios.get);
const postRequest = createRequest(axios.post);

export { getRequest, postRequest };
