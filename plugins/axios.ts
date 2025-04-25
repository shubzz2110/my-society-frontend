import axios, { AxiosError, type AxiosInstance } from "axios";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
  const api: AxiosInstance = axios.create({
    baseURL: useRuntimeConfig().public.apiBaseUrl,
  });
  api.interceptors.request.use(
    async (config) => {
      const auth = getAuth();
      config.headers.Authorization = `Bearer ${await auth?.currentUser?.getIdToken()}`;
      return config;
    },
    (error: AxiosError) => Promise.reject(error.response?.data)
  );

  api.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => Promise.reject(error.response?.data)
  );
  nuxtApp.provide("api", api);
});
