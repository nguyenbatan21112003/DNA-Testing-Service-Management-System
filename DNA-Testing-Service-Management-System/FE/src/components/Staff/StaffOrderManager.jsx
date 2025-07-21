"use client";

import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { message } from "antd";
import StaffDashboard from "./StaffDashboard";

const StaffOrderManager = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Kiểm tra quyền truy cập
  useEffect(() => {
    // Kiểm tra nếu user không phải là staff (role_id = 2)
    if (user && user.role_id !== 2) {
      message.error("Bạn không có quyền truy cập trang này!");
      navigate("/", { replace: true });
      return;
    }
  }, [user, navigate]);

  // Trả về trực tiếp StaffDashboard thay vì lồng nó vào một layout khác
  return <StaffDashboard />;
};

export default StaffOrderManager;
