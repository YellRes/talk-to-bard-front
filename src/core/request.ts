import { Toast } from "antd-mobile";
import axios, { Axios, AxiosRequestConfig } from "axios";
import { useModel } from "umi";

// axios.defaults.baseURL = process.env.SERVER_URL;

// 请求拦截器
axios.interceptors.request.use((config) => {
  // const { user } = useModel("userModel");
  // config.headers.Authorization = user.token ? `Bearer ${user.token}` : "";
  return config;
});

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    const { status } = response;

    if (status === 200) {
      return response.data;
    } else {
      Toast.show({
        icon: "fail",
        content: "发生错误",
      });
      return response;
    }
  },
  (error) => {
    const { config } = error;
    const {
      response: { data },
    } = error;
    if (!config.customNotify) {
      Toast.show({
        position: "bottom",
        content: "发生错误",
      });
    } else {
      Toast.show({
        position: "bottom",
        content: data?.message || "请求错误",
      });
    }

    return Promise.reject(error);
  },
);

type RequestParamsType<T> = {
  params: T;
  otherAxiosConfig?: AxiosRequestConfig & Record<string, any>;
};
type RequestMethodType = Axios["get"] | Axios["post"];
function createRequest(requestMethod: RequestMethodType) {
  return function <T>(url: string, config: RequestParamsType<T>) {
    const { params, otherAxiosConfig } = config;
    return requestMethod(url, {
      params,
      ...otherAxiosConfig,
    });
  };
}

const getRequest = createRequest(axios.get);
const postRequest = createRequest(axios.post);

export { getRequest, postRequest };
