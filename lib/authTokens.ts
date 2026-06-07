export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const isBrowser = () => typeof window !== "undefined";

export const getAccessToken = () => {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const storeAuthTokens = (tokens?: AuthTokens | null) => {
  if (!isBrowser() || !tokens) return;

  if (tokens.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  }

  if (tokens.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
};

export const clearAuthTokens = () => {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
