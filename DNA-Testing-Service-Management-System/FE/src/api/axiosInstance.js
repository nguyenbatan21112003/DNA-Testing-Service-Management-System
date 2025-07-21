import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_URL_BE;


const axiosInstance = axios.create({
  baseURL: API_BASE_URL, //đây chính là url gốc của api BE là phải xử lý cors
  timeout: 100000, //thời gian chờ phản hồi từ server
  headers: {
    "Content-Type": "application/json", //nghĩa là bạn gửi dữ liệu dạng Json
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
  withCredentials: true, // ✅ Gửi cookie cross-origin (refreshToken)
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/user/refresh-token`,
          {},
          { withCredentials: true } // 👈 THÊM DÒNG NÀY
        );
        // console.log('token: ', response)
        const accessToken = response.data;
        if (!accessToken) {
          throw new Error("No accessToken received");
        }
        localStorage.setItem("accessToken", accessToken);
        // console.log(localStorage.getItem("accessToken")); // 👉 "new_token"

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return await axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        // localStorage.removeItem("accessToken");
        // localStorage.clear()
        // Cookies.remove("refreshToken");
        // window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
