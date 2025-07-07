"use client";

import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Layout, Menu, Modal, message, Button } from "antd";
import {
  DashboardOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  MessageOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import NotificationBell from "../HomePage/NotificationBell";

// Import các component con
import ManagerOverview from "./ManagerOverview";
import ManagerReports from "./ManagerReports";
import TestResultVerification from "./TestResultVerification";
import BlogManagement from "./BlogManagement";

const { Sider, Content } = Layout;

const menuItems = [
  {
    key: "overview",
    icon: <DashboardOutlined />,
    label: "Tổng quan",
  },
  {
    key: "verification",
    icon: <SafetyCertificateOutlined />,
    label: "Xác thực kết quả",
  },
  {
    key: "reports",
    icon: <BarChartOutlined />,
    label: "Báo cáo",
  },
  {
    key: "blog",
    icon: <FileTextOutlined />,
    label: "Quản lý Blog",
  },
];

const ManagerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [logoutModal, setLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const navigate = useNavigate();

  // Tạo tài khoản Manager và dữ liệu mẫu tự động
  useEffect(() => {
    if (!user || user.role_id !== 3) {
      const tempManagerAccount = {
        user_id: 3,
        name: "Nguyễn Văn Quản",
        email: "manager@dnalab.com",
        phone: "0987654321",
        password: "manager123",
        role_id: 3,
        avatar: null,
      };

      localStorage.setItem("dna_user", JSON.stringify(tempManagerAccount));
      window.location.reload();
      return;
    }
  }, [user]);

  // Kiểm tra quyền truy cập
  useEffect(() => {
    if (!user) {
      message.error("Vui lòng đăng nhập để truy cập trang này!");
      setUnauthorized(true);
      navigate("/", { replace: true });
      return;
    }
    if (user.role_id !== 3) {
      message.error("Bạn không có quyền truy cập trang này!");
      setUnauthorized(true);
      navigate("/", { replace: true });
      return;
    }
  }, [user, navigate]);

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
      case "overview":
        return <ManagerOverview />;
      case "verification":
        return <TestResultVerification />;
      case "reports":
        return <ManagerReports />;
      case "blog":
        return <BlogManagement />;
      default:
        return <ManagerOverview />;
    }
  };

  if (unauthorized) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh", height: "100vh", overflow: "hidden" }}>
      <Sider
        width={220}
        style={{
          background: "#fff",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          paddingBottom: 0,
        }}
        collapsible
        collapsed={collapsed}
        trigger={null}
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
              color: "#722ed1",
            }}
            onClick={() => navigate("/")}
          >
            <span style={{ fontSize: 28 }}>🧬</span>
            {!collapsed && (
              <span style={{ color: "#722ed1", fontWeight: 800 }}>DNA LAB</span>
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
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                background: "#722ed1",
                borderColor: "#722ed1",
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
      <Layout>
        {/* Header with NotificationBell */}
        <div style={{
          height: 64,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 32px',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <NotificationBell />
        </div>
        <Content style={{ margin: 0, padding: 0, background: "#f5f5f5", minHeight: "100vh" }}>
          {renderContent()}
        </Content>
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
    </Layout>
  );
};

export default ManagerDashboard;
