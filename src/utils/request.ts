/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { showLoading, hideLoading } from "@/utils/loading";
import storage from "@/utils/storage";
import { Result } from "@/types/api";
import mockdata from "@/mock";
import { message } from "@/utils/AntdComp";

interface TipsConfig {
  showLoading?: boolean;
  showError?: boolean;
}

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  timeoutErrorMessage: "Request Timeout, Please try again later.",
  withCredentials: true,
  headers: {
    icode: "A7EEA094EAA44AF4",
  },
});

instance.interceptors.request.use(
  (config) => {
    showLoading();
    const token = storage.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return { ...config };
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    hideLoading();

    const data: Result = res.data;

    // check if response data type is blob
    if (res.config.responseType === "blob") {
      return data.data;
    }

    if (data.code === 500001) {
      // use lock mock data
      const index = res.request.responseURL.indexOf("/api");
      if (index !== -1) {
        const key = res.request.responseURL.substring(index + 4);
        return getMockData(key);
      } else {
        message.error(data.msg);
        storage.remove("token");
        location.href = "/login?callback=" + encodeURIComponent(location.href);
      }
    } else if (data.code !== 0) {
      if (res.config.showError) {
        message.success(data.msg);
        return Promise.reject(data);
      } else {
        return Promise.resolve(data);
      }
    }

    return data.data;
  },
  (error) => {
    hideLoading();
    return getMockData(error.config.url);
  }
);

const getMockData = (url: string): any => {
  const index = url.indexOf("?");
  if (index !== -1) {
    url = url.substring(0, index);
  }
  return mockdata(url).data;
};

export default {
  get<T>(
    url: string,
    params?: object,
    options: TipsConfig = { showLoading: true, showError: true }
  ): Promise<T> {
    return instance.get(url, { params, ...options });
  },

  post<T>(
    url: string,
    data?: object,
    options: TipsConfig = { showLoading: true, showError: true }
  ): Promise<T> {
    return instance.post(url, data, options);
  },
};
