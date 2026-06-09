const ACCESS_TOKEN = "access_token";

const REFRESH_TOKEN = "refresh_token";

export const tokenStorage = {
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS_TOKEN, accessToken);

    localStorage.setItem(REFRESH_TOKEN, refreshToken);
  },

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  },

  clear() {
    localStorage.removeItem(ACCESS_TOKEN);

    localStorage.removeItem(REFRESH_TOKEN);
  },
};
