import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import userApi from "../api/userApI";
import Cookies from "js-cookie"; // ✅ đúng
import messagesError from "../constants/messagesError";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ưu tiên lấy user từ sessionStorage, nếu không có thì lấy từ localStorage
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Đăng nhập
  const login = async (email, password) => {
    try {
      const response = await userApi.login({ email, password }); // POST login API
      // console.log(response);
      if (response.status !== 200) throw new Error();
      const userData = {
        email: email,
        fullName: response.data.fullName,
        userId: response.data.userId,
        role_id: response.data.roleId,
      };
      setUser(userData);
      localStorage.setItem(
        "accessToken",
        JSON.stringify(response.data.accessToken)
      );
      localStorage.setItem("userData", JSON.stringify(userData));
      return { success: true, role_id: response.data.roleId };
    } catch (error) {
      // Nếu sai tài khoản hoặc có lỗi khác
      if (error.response && error.response.status === 400) {
        return { success: false, message: messagesError.invalidLogin };
      }
      return { success: false, message: messagesError.serverError };
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      setUser({});
      localStorage.clear();
      await axiosInstance.post(`/user/logout`);
      // Điều hướng về trang đăng nhập
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  // Đăng ký
  const register = async ({ fullName, email, phone, password }) => {
    try {
      const res = await userApi.registerAccount({
        FullName: fullName.trim(),
        EmailAddress: email.trim(),
        PhoneNumber: phone.trim(),
        Password: password.trim(),
      });
      // console.log(res);
      // Trường hợp đăng ký thành công (ví dụ: status 200 và có flag success)
      if (res.status == 200 && res.data.success) {
        return {
          success: true,
          message: res.data?.message || "Đăng ký thành công",
        };
      }

      // fallback nếu API trả về 200 nhưng không có success flag
      return {
        success: false,
        message: res.data?.message || messagesError.registerError,
      };
    } catch (err) {
      // Trường hợp lỗi validation (400) từ backend
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const errors = err.response.data.errors;

        // Lấy thông báo lỗi đầu tiên (ưu tiên hiển thị)
        const errorMessages = [];
        if (errors.EmailAddress) errorMessages.push(errors.EmailAddress[0]);
        if (errors.PhoneNumber) errorMessages.push(errors.PhoneNumber[0]);

        return {
          success: false,
          message: errorMessages.join(" và "), // "Email đã được sử dụng và Số điện thoại đã được sử dụng"
        };
      }

      // Trường hợp lỗi khác (500 hoặc network)
      return {
        success: false,
        message: messagesError.serverError,
      };
    }
  };

  // // Cập nhật user
  const updateUser = async (data) => {
    if (!user) return;

    try {
      const updateRes = await userApi.updateUserProfileByID(user.userId, data);
      setUser(updateRes.data);
      sessionStorage.setItem("user", JSON.stringify(updateRes.data));
      localStorage.setItem("dna_user", JSON.stringify(updateRes.data));
    } catch {
      // Có thể xử lý lỗi ở đây
    }
  };

  // Đổi mật khẩu ko có xác thực OTP
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

  // const verifyPasswordChange = async (otpInput) => {
  //   if (!user) return { success: false, message: "Bạn chưa đăng nhập!" };
  //   const otpData = JSON.parse(
  //     sessionStorage.getItem(`otp_${user.email}`) || "null"
  //   );

  //   if (!otpData)
  //     return {
  //       success: false,
  //       message: "Không tìm thấy yêu cầu đổi mật khẩu!",
  //     };
  //   if (Date.now() - otpData.created > 10 * 60 * 1000) {
  //     sessionStorage.removeItem(`otp_${user.email}`);
  //     return { success: false, message: "Mã xác thực đã hết hạn!" };
  //   }
  //   if (otpInput !== otpData.otp) {
  //     return { success: false, message: "Mã xác thực không đúng!" };
  //   }
  //   // Đổi mật khẩu trên mockAPI
  //   try {
  //     const updateRes = await axios.put(`${API_URL}/${user.user_id}`, {
  //       ...user,
  //       password: otpData.newPassword,
  //     });
  //     setUser(updateRes.data);
  //     sessionStorage.setItem("user", JSON.stringify(updateRes.data));
  //     localStorage.setItem("dna_user", JSON.stringify(updateRes.data));
  //     sessionStorage.removeItem(`otp_${user.email}`);
  //     return { success: true };
  //   } catch {
  //     return { success: false, message: "Có lỗi xảy ra!" };
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateUser,
        requestPasswordChange,
        // verifyPasswordChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
