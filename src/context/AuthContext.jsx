import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy user từ sessionStorage (nếu muốn giữ đăng nhập khi reload)
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Đổi baseURL thành mockAPI của bạn
  const API_URL = "https://682d53164fae188947559003.mockapi.io/usersSWP";

  // Đăng nhập
  const login = async (email, password) => {
    try {
      const res = await axios.get(API_URL);
      const found = res.data.find(
        (u) => u.email === email && u.password === password
      );
      if (found) {
        setUser(found);
        sessionStorage.setItem("user", JSON.stringify(found));
        return { success: true, role_id: found.role_id };
      }
      return { success: false, message: "Email hoặc mật khẩu không đúng!" };
    } catch {
      return { success: false, message: "Lỗi kết nối đến server!" };
    }
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  // Đăng ký
  const register = async ({ fullName, email, phone, password }) => {
    try {
      const res = await axios.post("https://localhost:7037/user/register", {
        fullName,
        email,
        phone,
        password,
      });
      if (res.data && res.data.success) {
        return {
          success: true,
          message: res.data?.message || "Đăng ký thành công",
        };
      } else {
        return {
          success: false,
          message: res.data?.message || "Đăng ký thất bại!",
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Lỗi kết nối đến server!",
      };
    }
  };

  // Cập nhật user
  const updateUser = async (data) => {
    if (!user) return;
    try {
      const updateRes = await axios.put(`${API_URL}/${user.user_id}`, {
        ...user,
        ...data,
      });
      setUser(updateRes.data);
      sessionStorage.setItem("user", JSON.stringify(updateRes.data));
    } catch {
      // Có thể xử lý lỗi ở đây
    }
  };

  // Đổi mật khẩu có xác thực OTP (giả lập, không lưu trên mockAPI)
  const requestPasswordChange = (currentPassword, newPassword) => {
    if (!user) return { success: false, message: "Bạn chưa đăng nhập!" };
    if (user.password !== currentPassword) {
      return { success: false, message: "Mật khẩu hiện tại không đúng!" };
    }
    // Sinh OTP 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(
      `otp_${user.email}`,
      JSON.stringify({ otp, newPassword, created: Date.now() })
    );
    return { success: true, otp };
  };

  const verifyPasswordChange = async (otpInput) => {
    if (!user) return { success: false, message: "Bạn chưa đăng nhập!" };
    const otpData = JSON.parse(
      sessionStorage.getItem(`otp_${user.email}`) || "null"
    );
    if (!otpData)
      return {
        success: false,
        message: "Không tìm thấy yêu cầu đổi mật khẩu!",
      };
    if (Date.now() - otpData.created > 10 * 60 * 1000) {
      sessionStorage.removeItem(`otp_${user.email}`);
      return { success: false, message: "Mã xác thực đã hết hạn!" };
    }
    if (otpInput !== otpData.otp) {
      return { success: false, message: "Mã xác thực không đúng!" };
    }
    // Đổi mật khẩu trên mockAPI
    try {
      const updateRes = await axios.put(`${API_URL}/${user.user_id}`, {
        ...user,
        password: otpData.newPassword,
      });
      setUser(updateRes.data);
      sessionStorage.setItem("user", JSON.stringify(updateRes.data));
      sessionStorage.removeItem(`otp_${user.email}`);
      return { success: true };
    } catch {
      return { success: false, message: "Có lỗi xảy ra!" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateUser,
        requestPasswordChange,
        verifyPasswordChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
