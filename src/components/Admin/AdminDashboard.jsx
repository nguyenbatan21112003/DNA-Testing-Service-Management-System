import React, { useContext } from "react";
import { Layout, Menu, Modal } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  FileProtectOutlined,
  LogoutOutlined,
  StarOutlined,
  ExclamationCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import UserManagement from "./UserManagement";
import StaffManagement from "./StaffManagement";
import AdminDNAStatsDashboard from "./AdminDNAStatsDashboard";

const { Sider, Content } = Layout;

const menuItems = [
  {
    key: "test-types",
    icon: <AppstoreOutlined />,
    label: "DashBoard",
  },
  {
    key: "processing",
    icon: <FileProtectOutlined />,
    label: "Thời gian & Chi phí",
  },
  {
    key: "rating-feedback",
    icon: <StarOutlined />,
    label: "Rating & Feedback",
  },
  {
    key: "policy-violation",
    icon: <ExclamationCircleOutlined />,
    label: "Vi phạm chính sách",
  },
  {
    key: "user-management",
    icon: <UserOutlined />,
    label: "Quản lý tài khoản",
  },
  {
    key: "staff-management",
    icon: <TeamOutlined />,
    label: "Quản lý nhân viên",
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Đăng xuất",
  },
];

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [logoutModal, setLogoutModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("");
  const [collapsed, setCollapsed] = React.useState(false);

  if (!user || user.role_id !== 5) {
    return <Navigate to="/" replace />;
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

  return (
    <Layout style={{ minHeight: "100vh", height: "100vh", overflow: "hidden" }}>
      <Sider
        width={220}
        style={{ background: "#fff", position: "relative" }}
        collapsible
        collapsed={collapsed}
        trigger={null}
      >
        <span
          style={{
            position: "absolute",
            top: 18,
            right: -24,
            background: "#e74c3c",
            borderRadius: 12,
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 100,
            color: "#fff",
            fontSize: 28,
            boxShadow: "0 2px 8px #e74c3c55",
            border: "2px solid #fff",
            transition: "right 0.2s",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed((c) => !c);
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
        <div
          style={{
            height: 64,
            margin: 16,
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
            <span style={{ color: "#00a67e", fontWeight: 800 }}>DNA Lab</span>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          defaultSelectedKeys={[]}
          style={{
            height: "calc(100vh - 112px)",
            borderRight: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: 12,
            paddingBottom: 12,
          }}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout style={{ height: "100vh" }}>
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
              {/* Avatar */}
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
                  {(user.name || user.fullName || user.email || "A")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
              <span>Xin chào, {user.name || user.fullName || user.email}</span>
            </>
          )}
        </div>
        <Content
          style={{
            margin: "24px 16px 0",
            background: "#f5f5f5",
            minHeight: 0,
            borderRadius: 8,
            height: "calc(100vh - 48px)",
            overflow: "auto",
          }}
        >
          <div style={{ padding: 24, minHeight: 360 }}>
            {activeTab === "user-management" && <UserManagement />}
            {activeTab === "staff-management" && <StaffManagement />}
            {activeTab === "processing" && <ProcessingManagement />}
            {(activeTab === "test-types" || !activeTab) && (
              <AdminDNAStatsDashboard />
            )}
          </div>
        </Content>
      </Layout>
      <Modal
        open={logoutModal}
        onOk={confirmLogout}
        onCancel={cancelLogout}
        okText="Đăng xuất"
        cancelText="Hủy"
        okButtonProps={{ className: "custom-logout-btn" }}
        title="Xác nhận đăng xuất"
      >
        <p>Bạn có chắc muốn đăng xuất không?</p>
      </Modal>
    </Layout>
  );
};

export default AdminDashboard;
