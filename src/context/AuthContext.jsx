import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy user từ localStorage nếu có
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    // Thêm tài khoản mẫu nếu chưa có user nào
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.length === 0) {
      const demoUsers = [
        {
          fullName: "Nguyễn Văn A",
          email: "user1@email.com",
          phone: "098765432187654321",
          password: "123456",
        },
        {
          fullName: "Nguyễn Văn B",
          email: "user2@email.com",
          phone: "0123456789",
          password: "123456",
        },
      ];
      localStorage.setItem("users", JSON.stringify(demoUsers));
    }
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      localStorage.setItem("user", JSON.stringify(found));
      return { success: true };
    }
    return { success: false, message: "Email hoặc mật khẩu không đúng!" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const register = ({ fullName, email, phone, password }) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((u) => u.email === email)) {
      return { success: false, message: "Email đã tồn tại!" };
    }
    const newUser = { fullName, email, phone, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return { success: true };
  };

  const updateUser = (data) => {
    if (!user) return;
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      localStorage.setItem("users", JSON.stringify(users));
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    }
  };

  // Đổi mật khẩu có xác thực OTP (giả lập)
  const requestPasswordChange = (currentPassword, newPassword) => {
    if (!user) return { success: false, message: "Bạn chưa đăng nhập!" };
    if (user.password !== currentPassword) {
      return { success: false, message: "Mật khẩu hiện tại không đúng!" };
    }
    // Sinh OTP 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(
      `otp_${user.email}`,
      JSON.stringify({ otp, newPassword, created: Date.now() })
    );
    return { success: true, otp };
  };

  const verifyPasswordChange = (otpInput) => {
    if (!user) return { success: false, message: "Bạn chưa đăng nhập!" };
    const otpData = JSON.parse(
      localStorage.getItem(`otp_${user.email}`) || "null"
    );
    if (!otpData)
      return {
        success: false,
        message: "Không tìm thấy yêu cầu đổi mật khẩu!",
      };
    if (Date.now() - otpData.created > 10 * 60 * 1000) {
      localStorage.removeItem(`otp_${user.email}`);
      return { success: false, message: "Mã xác thực đã hết hạn!" };
    }
    if (otpInput !== otpData.otp) {
      return { success: false, message: "Mã xác thực không đúng!" };
    }
    // Đổi mật khẩu
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const idx = users.findIndex((u) => u.email === user.email);
    if (idx !== -1) {
      users[idx].password = otpData.newPassword;
      localStorage.setItem("users", JSON.stringify(users));
      const updated = { ...user, password: otpData.newPassword };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      localStorage.removeItem(`otp_${user.email}`);
      return { success: true };
    }
    return { success: false, message: "Có lỗi xảy ra!" };
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
