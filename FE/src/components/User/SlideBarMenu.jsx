import React, { useState } from "react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const sidebarTabs = [
  { key: "profile", label: "Hồ sơ cá nhân", icon: <UserOutlined /> },
  { key: "orders", label: "Đơn đăng ký", icon: <FileTextOutlined /> },
  { key: "settings", label: "Cài đặt", icon: <SettingOutlined /> },
];

const SlideBarMenu = ({ tab, setTab, setShowLogoutModal }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="profile-sidebar"
      style={{
        minWidth: collapsed ? 80 : 240,
        width: collapsed ? 80 : 240,
        background: "linear-gradient(135deg, #00a67e 60%, #2196f3 100%)",
        boxShadow: "2px 0 12px #e6e6e6",
        display: "flex",
        flexDirection: "column",
        alignItems: collapsed ? "center" : "flex-start",
        padding: 0,
        borderRadius: 0,
        height: "100%",
        position: "relative",
        transition: "width 0.2s",
        gap: 0,
      }}
    >
      {/* Logo DNA Lab */}
      <div
        style={{
          height: 64,
          margin: 0,
          fontWeight: 700,
          fontSize: 22,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 8,
          cursor: "pointer",
          userSelect: "none",
          width: "100%",
          background: "rgba(255,255,255,0.08)",
          borderBottom: "1px solid #fff2",
        }}
        onClick={() => navigate("/")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate("/");
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Về trang chủ"
      >
        <span style={{ fontSize: 28, color: "#fff" }}>🧬</span>
        {!collapsed && (
          <span style={{ color: "#fff", fontWeight: 800, letterSpacing: 1 }}>
            DNA Lab
          </span>
        )}
      </div>

      {/* Collapse button below logo */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 0 8px 0",
        }}
      >
        <span
          style={{
            width: "100%",
            background: "#00a67e",
            borderRadius: 8,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            cursor: "pointer",
            color: "#fff",
            fontSize: 28,
            boxShadow: "0 2px 8px #00a67e55",
            border: "2px solid #fff",
            paddingLeft: collapsed ? 0 : 32,
            paddingRight: collapsed ? 0 : 0,
            transition: "all 0.2s",
            fontWeight: 600,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed((c) => !c);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setCollapsed((c) => !c);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          {!collapsed && (
            <span style={{ marginLeft: 16, fontSize: 17 }}>Menu</span>
          )}
        </span>
      </div>

      {/* Tabs + Logout */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          paddingTop: 12,
          flex: 1,
          alignItems: "stretch",
        }}
      >
        {sidebarTabs.map((tabItem, idx) => (
          <React.Fragment key={tabItem.key}>
            <div
              className={`profile-tab${tab === tabItem.key ? " active" : ""}`}
              onClick={() => setTab(tabItem.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setTab(tabItem.key);
                }
              }}
              tabIndex={0}
              role="tab"
              aria-selected={tab === tabItem.key}
              aria-label={tabItem.label}
              style={{
                cursor: "pointer",
                padding: collapsed ? "18px 0" : "18px 32px",
                fontWeight: 600,
                background:
                  tab === tabItem.key
                    ? "rgba(255,255,255,0.18)"
                    : "transparent",
                color: tab === tabItem.key ? "#fff" : "#fff9",
                borderLeft:
                  tab === tabItem.key
                    ? "4px solid #fff"
                    : "4px solid transparent",
                textAlign: collapsed ? "center" : "left",
                fontSize: 17,
                transition: "all 0.2s",
                borderRadius: 0,
                margin: 0,
                minHeight: 48,
                display: "flex",
                alignItems: "center",
              }}
            >
              {tabItem.icon && (
                <span
                  style={{
                    marginRight: collapsed ? 0 : 12,
                    fontSize: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {tabItem.icon}
                </span>
              )}
              {collapsed ? "" : tabItem.label}
            </div>
            {idx === sidebarTabs.length - 1 && (
              <div
                className="profile-tab"
                onClick={() => setShowLogoutModal(true)}
                style={{
                  cursor: "pointer",
                  padding: collapsed ? "18px 0" : "18px 32px",
                  fontWeight: 700,
                  color: "#fff",
                  borderLeft: "4px solid transparent",
                  textAlign: collapsed ? "center" : "left",
                  fontSize: 17,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(255,255,255,0.08)",
                  borderTop: "1px solid #fff2",
                  minHeight: 48,
                  margin: 0,
                }}
              >
                <LogoutOutlined
                  style={{ fontSize: 20, marginRight: collapsed ? 0 : 12 }}
                />
                {collapsed ? "" : "Đăng xuất"}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SlideBarMenu;
