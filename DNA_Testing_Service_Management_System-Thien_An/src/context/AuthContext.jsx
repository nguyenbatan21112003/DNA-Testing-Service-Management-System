import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const API_URL = "https://682d53164fae188947559003.mockapi.io/usersSWP";

  // ✅ Đăng nhập
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "https://localhost:7200/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      const accessToken = res.data;
      sessionStorage.setItem("accessToken", accessToken);

      // TODO: gọi API get user info từ token nếu cần
      return { success: true, token: accessToken };
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      return {
        success: false,
        message: err.response?.data || "Email hoặc mật khẩu không đúng!",
      };
    }
  };

  // ✅ Đăng ký + đăng nhập
  const register = async ({ fullName, email, phone, password }) => {
    try {
      const payload = {
        emailAddress: email,
        password: password,
        fullName: fullName,
        phoneNumber: phone,
      };

      console.log("Payload gửi BE:", payload);

      const res = await axios.post("https://localhost:7200/user/register", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data?.message === "Đăng ký thành công") {
        const loginResult = await login(email, password);
        return loginResult.success
          ? { success: true, message: "Đăng ký và đăng nhập thành công!" }
          : { success: false, message: "Đăng ký thành công nhưng đăng nhập thất bại!" };
      }

      return { success: false, message: res.data?.message || "Đăng ký thất bại!" };
    } catch (err) {
      console.error("Đăng ký lỗi:", err.response?.data);
      return {
        success: false,
        message: err.response?.data?.message || "Lỗi kết nối đến server!",
      };
    }
  };

  // ✅ Đăng xuất
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  // ✅ Cập nhật user
  const updateUser = async (data) => {
    if (!user) return;
    try {
      const updateRes = await axios.put(`${API_URL}/${user.user_id}`, {
        ...user,
        ...data,
      });
      setUser(updateRes.data);
      sessionStorage.setItem("user", JSON.stringify(updateRes.data));
    } catch (err) {
      console.error("Lỗi cập nhật user:", err);
    }
  };

  // ✅ Đổi mật khẩu (giả lập OTP)
  const requestPasswordChange = (currentPassword, newPassword) => {
    if (!user) return { success: false, message: "Bạn chưa đăng nhập!" };
    if (user.password !== currentPassword) {
      return { success: false, message: "Mật khẩu hiện tại không đúng!" };
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(
      `otp_${user.email}`,
      JSON.stringify({ otp, newPassword, created: Date.now() })
    );
    return { success: true, otp };
  };

  const verifyPasswordChange = async (otpInput) => {
    if (!user) return { success: false, message: "Bạn chưa đăng nhập!" };
    const otpData = JSON.parse(sessionStorage.getItem(`otp_${user.email}`) || "null");
    if (!otpData)
      return { success: false, message: "Không tìm thấy yêu cầu đổi mật khẩu!" };
    if (Date.now() - otpData.created > 10 * 60 * 1000) {
      sessionStorage.removeItem(`otp_${user.email}`);
      return { success: false, message: "Mã xác thực đã hết hạn!" };
    }
    if (otpInput !== otpData.otp) {
      return { success: false, message: "Mã xác thực không đúng!" };
    }
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
