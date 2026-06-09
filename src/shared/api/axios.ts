// import axios from "axios";

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,

//   headers: {
//     "Content-Type": "application/json",
//   },

//   withCredentials: true,
// });

// // Request Interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");

//     const publicRoutes = [
//       "/auth/login",
//       "/auth/register",
//       "/auth/forgot-password",
//       "/auth/reset-password",
//     ];

//     const isPublicRoute = publicRoutes.some((route) => config.url?.includes(route));

//     if (token && !isPublicRoute) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// // Response Interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const currentPath = window.location.pathname;

//     if (error.response?.status === 401 && currentPath !== "/login") {
//       localStorage.removeItem("accessToken");

//       localStorage.removeItem("refreshToken");

//       localStorage.removeItem("user");

//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   },
// );
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    const publicRoutes = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];

    const isPublicRoute = publicRoutes.some((route) => config.url?.includes(route));

    if (token && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const currentPath = window.location.pathname;

    if (error.response?.status === 401 && !["/login", "/register"].includes(currentPath)) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
