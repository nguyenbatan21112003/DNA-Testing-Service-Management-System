import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import userApi from "../api/userApI";
import messagesError from "../constants/messagesError";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await userApi.login({ email, password });
      if (response.status !== 200) throw new Error();

      const userData = {
        email: email,
        fullName: response.data.fullName,
        userId: response.data.userId,
        role_id: response.data.roleId,
      };

      setUser(userData);
      localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
      localStorage.setItem("userData", JSON.stringify(userData));

      return { success: true, role_id: response.data.roleId };
    } catch (error) {
      if (error.response?.status === 400) {
        return { success: false, message: messagesError.invalidLogin };
      }
      return { success: false, message: messagesError.serverError };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post(`/user/logout`);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const register = async ({ fullName, email, phone, password }) => {
    try {
      const res = await userApi.registerAccount({
        FullName: fullName.trim(),
        EmailAddress: email.trim(),
        PhoneNumber: phone.trim(),
        Password: password.trim(),
      });

      if (res.status === 200 && res.data.success) {
        return {
          success: true,
          message: res.data?.message || "Đăng ký thành công",
        };
      }

      return {
        success: false,
        message: res.data?.message || messagesError.registerError,
      };
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = [];
        if (errors.EmailAddress) errorMessages.push(errors.EmailAddress[0]);
        if (errors.PhoneNumber) errorMessages.push(errors.PhoneNumber[0]);
        return {
          success: false,
          message: errorMessages.join(" và "),
        };
      }

      return { success: false, message: messagesError.serverError };
    }
  };

  const updateUser = async (data) => {
    if (!user) return;
    try {
      const updateRes = await userApi.updateUserProfileByUserId(data);
      if (updateRes?.status !== 200) throw new Error();

      const updatedUserData = {
        email: user.email || "",
        fullName: data.fullName || "",
        userId: user.userId,
        role_id: user.role_id,
      };

      setUser(updatedUserData);
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      return true
    } catch (error) {
      console.error("Update user failed:", error);
      alert(messagesError.updateUserFailed);
      return false
    }
  };

  const requestPasswordChange = async (currentPassword, newPassword) => {
    if (!user) {
      return {
        success: false,
        message: "Bạn chưa đăng nhập!",
      };
    }

    try {
      const response = await userApi.changePassword({
        email: user.email,
        currentPassword,
        newPassword,
      });

      const responseText =
        typeof response.data === "string" ? response.data.toLowerCase() : "";

      if (
        response.status === 200 &&
        responseText.includes("password changed successfully")
      ) {
        return {
          success: true,
          message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
        };
      }

      return {
        success: false,
        message: "Phản hồi không hợp lệ từ hệ thống. Vui lòng thử lại.",
      };
    } catch (err) {
      const errorMessage =
        typeof err.response?.data === "string"
          ? err.response.data.toLowerCase()
          : "";

      if (
        err.response?.status === 400 &&
        errorMessage.includes("current password is incorrect")
      ) {
        return {
          success: false,
          message: "Mật khẩu hiện tại không đúng!",
        };
      }

      return {
        success: false,
        message: "Đã xảy ra lỗi khi kết nối đến server.",
      };
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
