"use client";

import { useContext, useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Layout, Menu, Modal, message, Button } from "antd";
import {
  DashboardOutlined,
  ExperimentOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  HomeOutlined,
  BankOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FormOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";

// Import các component con
import StaffOverview from "./StaffOverview";
import TestingResults from "./TestingResults";
import ConsultationRequests from "./ConsultationRequests";
import CustomerFeedback from "./CustomerFeedback";
import HomeSampling from "./HomeSampling";
import CenterSampling from "./CenterSampling";
import OrderManagement from "./OrderManagement";
import SampleCollection from "./SampleCollection";
import CivilSampleCollectionForm from "./CivilSampleCollectionForm";

const { Sider, Content } = Layout;

const menuItems = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Tổng quan",
  },
  {
    key: "order-management",
    icon: <FileTextOutlined />,
    label: "Quản lý đơn hàng",
  },
  {
    key: "home-sampling",
    icon: <HomeOutlined />,
    label: "Thu mẫu tại nhà",
  },
  {
    key: "center-sampling",
    icon: <BankOutlined />,
    label: "Thu mẫu tại cơ sở",
  },
  {
    key: "sample-collection",
    icon: <FormOutlined />,
    label: "Lấy mẫu hành chính",
  },
  {
    key: "civil-sample-collection",
    icon: <FormOutlined />,
    label: "Lấy mẫu dân sự",
  },
  {
    key: "testing-results",
    icon: <ExperimentOutlined />,
    label: "Xét nghiệm & Kết quả",
  },
  {
    key: "consultation",
    icon: <CustomerServiceOutlined />,
    label: "Yêu cầu tư vấn",
  },
  {
    key: "feedback",
    icon: <MessageOutlined />,
    label: "Phản hồi khách hàng",
  },
  // Đăng xuất sẽ được render riêng ở dưới cùng
];

export const StaffDashboardContext = createContext();

const StaffDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [logoutModal, setLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const navigate = useNavigate();

  // Xoá toàn bộ đoạn code tạo dữ liệu mẫu (sampleOrders, tempStaffAccount) trong useEffect
  useEffect(() => {
    // Không seed dữ liệu mẫu nữa
  }, []);

  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (!user) {
      message.error("Vui lòng đăng nhập để truy cập trang này!");
      setUnauthorized(true);
      navigate("/", { replace: true });
      return;
    }

    if (user.role_id !== 2) {
      message.error("Bạn không có quyền truy cập trang này!");
      setUnauthorized(true);
      navigate("/", { replace: true });
      return;
    }
  }, [user, navigate]);

  if (unauthorized) {
    return null;
  }

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      setLogoutModal(true);
    } else {
      setActiveTab(e.key);
    }
  };

  const confirmLogout = () => {
    logout();
    setLogoutModal(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setLogoutModal(false);
  };

  const handleLogout = () => {
    setLogoutModal(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <StaffOverview />;
      case "testing-results":
        return <TestingResults />;
      case "consultation":
        return <ConsultationRequests />;
      case "feedback":
        return <CustomerFeedback />;
      case "home-sampling":
        return <HomeSampling />;
      case "center-sampling":
        return <CenterSampling />;
      case "sample-collection":
        return <SampleCollection />;
      case "order-management":
        return <OrderManagement />;
      case "civil-sample-collection":
        return <CivilSampleCollectionForm />;
      default:
        return <StaffOverview />;
    }
  };

  return (
    <StaffDashboardContext.Provider value={{ setActiveTab }}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          width={240}
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            background: "#fff",
            boxShadow: "2px 0 8px #e6e6e6",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            height: "100vh",
            zIndex: 100,
          }}
        >
          <div>
            <div
              style={{
                height: 56,
                margin: "16px 16px 8px 16px",
                fontWeight: 700,
                fontSize: 22,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: 8,
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => navigate("/")}
            >
              <span style={{ fontSize: 28 }}>🧬</span>
              {!collapsed && (
                <span style={{ color: "#00a67e", fontWeight: 800 }}>
                  DNA LAB
                </span>
              )}
            </div>
            {/* Nút thu gọn sidebar */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <Button
                type="primary"
                onClick={() => setCollapsed(!collapsed)}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                style={{
                  background: "#00a67e",
                  borderColor: "#00a67e",
                  width: collapsed ? "80%" : "90%",
                  minHeight: 40,
                }}
              >
                {!collapsed && "Menu"}
              </Button>
            </div>
          </div>

          {/* Menu chiếm phần co giãn, có scroll nếu dài */}
          <div
            style={{ flex: 1, overflowY: "auto", minHeight: 0, paddingTop: 0 }}
          >
            <Menu
              mode="inline"
              selectedKeys={[activeTab]}
              style={{ borderRight: 0, background: "#fff", paddingTop: 0 }}
              items={menuItems}
              onClick={handleMenuClick}
            />
          </div>

          {/* Nút Đăng xuất luôn ở dưới cùng */}
          <div
            style={{
              borderTop: "1px solid #f0f0f0",
              padding: "12px 16px 12px 16px",
              background: "#fff",
              marginTop: "auto",
              minHeight: 56,
              boxSizing: "border-box",
            }}
          >
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                width: "100%",
                textAlign: "left",
                color: "#ff4d4f",
                fontWeight: 500,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              {!collapsed && "Đăng xuất"}
            </Button>
          </div>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 240 }}>
          <div
            style={{
              width: "100%",
              height: 48,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0 32px",
              borderBottom: "1px solid #f0f0f0",
              fontWeight: 600,
              fontSize: 16,
              color: "#009e74",
              position: "sticky",
              top: 0,
              zIndex: 10,
              gap: 16,
            }}
          >
            {user && (
              <>
                {user.avatar || user.image ? (
                  <img
                    src={user.avatar || user.image}
                    alt="avatar"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: 10,
                      border: "2px solid #00a67e",
                      background: "#e6f7f1",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#e6f7f1",
                      color: "#00a67e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 18,
                      marginRight: 10,
                      border: "2px solid #00a67e",
                    }}
                  >
                    {(user.name || user.fullName || user.email || "S")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
                <span>
                  Xin chào, {user.name || user.fullName || user.email}
                </span>
              </>
            )}
          </div>

          <Content
            style={{
              margin: 0,
              padding: 0,
              minHeight: "100vh",
              background: "#f5f5f5",
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>

      <Modal
        open={logoutModal}
        onOk={confirmLogout}
        onCancel={cancelLogout}
        okText="Đăng xuất"
        cancelText="Hủy"
        okButtonProps={{
          style: {
            backgroundColor: "#ff4d4f",
            borderColor: "#ff4d4f",
            color: "white",
          },
        }}
        title="Xác nhận đăng xuất"
      >
        <p>Bạn có chắc muốn đăng xuất không?</p>
      </Modal>
    </StaffDashboardContext.Provider>
  );
};

export default StaffDashboard;
