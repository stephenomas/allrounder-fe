import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios"
import Cookies from 'js-cookie'
import Router from "next/router";


const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = Cookies.get("AUTH_TOKEN");
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token || ""}`,
  };
  return config;
});


// Change response data/error here
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      (error.response && error.response.status === 403) ||
      (error.response &&
        error.response.data.message === 'unauthorized')
    ) {
      Cookies.remove("AUTH_TOKEN");
      Router.reload();
    }
    return Promise.reject(error);
  }
);


export class HttpClient {
  static async get(url: string, params?: unknown) {
    const response = await Axios.get(url, { params });
    return response.data;
  }

  static async post(url: string, data: unknown, options?: any) {
    const response = await Axios.post(url, data, options);
    return response.data;
  }

  static async put(url: string, data: unknown) {
    const response = await Axios.put(url, data);
    return response.data;
  }

  static async delete(url: string) {
    const response = await Axios.delete(url);
    return response.data;
  }


}

export default Axios



