import { http } from "./http";
import { attachAuthHeader } from "./requestInterceptor";
import { createRefreshInterceptor } from "./responseInterceptor";

http.interceptors.request.use(attachAuthHeader);
http.interceptors.response.use((response) => response, createRefreshInterceptor());

export const api = http;
