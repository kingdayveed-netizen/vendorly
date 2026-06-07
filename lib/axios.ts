import axios from "axios";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  storeAuthTokens,
} from "@/lib/authTokens";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((value?: unknown) => void)[] = [];

function onRefreshed() {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
}

function addSubscriber(cb: () => void) {
  refreshSubscribers.push(cb);
}

const isPublicAuthEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;
  
  const authPaths = [
    "/auth/login",
    "/auth/signup",
    "/auth/register",
    "/auth/verify-email",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/refresh",
    "/auth/logout",
  ];
  
  return authPaths.some((path) => url.includes(path));
};

axiosInstance.interceptors.request.use((config) => {
  if (isPublicAuthEndpoint(config.url)) {
    return config;
  }

  const accessToken = getAccessToken();
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for public auth endpoints.
    if (isPublicAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    // Prevent infinite loop on refresh endpoint itself
    if (originalRequest.url?.includes("/auth/refresh")) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Only handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, wait for it to complete
      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        const refreshResponse = await axiosInstance.post(
          "/auth/refresh",
          refreshToken ? { refreshToken } : undefined,
        );
        storeAuthTokens(refreshResponse.data?.token);

        isRefreshing = false;
        onRefreshed();

        const nextAccessToken = getAccessToken();
        if (nextAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;

        clearAuthTokens();
        
        // Redirect to login only if not already there
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
