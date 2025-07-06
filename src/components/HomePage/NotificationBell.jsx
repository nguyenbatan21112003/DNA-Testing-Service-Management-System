import React, { useState } from "react";
import { Badge, Popover, List, Button, Typography, Space, Tag } from "antd";
import { BellOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNotification, ROLES } from "../../context/NotificationContext";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const NotificationBell = () => {
  const [visible, setVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const {
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    getNotificationsByRole,
  } = useNotification();
  const navigate = useNavigate();

  // Lọc thông báo theo role hiện tại và loại mong muốn
  let roleId = null;
  if (user?.role_id === ROLES.MANAGER) roleId = ROLES.MANAGER;
  else if (user?.role_id === ROLES.STAFF) roleId = ROLES.STAFF;
  else roleId = ROLES.MANAGER; // fallback, ưu tiên manager
  const allowedTypes = [
    "order_new",
    "order_needs_approval",
    "order_approved",
    "order_rejected",
    "feedback_new",
    "feedback_response"
  ];
  const userNotifications = getNotificationsByRole(roleId).filter(n => allowedTypes.includes(n.type));
  console.log('[DEBUG][NotificationBell] user:', user);
  console.log('[DEBUG][NotificationBell] userNotifications:', userNotifications);
  // Nếu không có thông báo, hiển thị rõ lý do
  let notificationContent;
  if (!user) {
    notificationContent = (
      <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
        <BellOutlined style={{ fontSize: 24, marginBottom: 8 }} />
        <br />
        Không xác định được user (chưa đăng nhập hoặc lỗi AuthContext)
      </div>
    );
  } else if (userNotifications.length === 0) {
    notificationContent = (
      <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
        <BellOutlined style={{ fontSize: 24, marginBottom: 8 }} />
        <br />
        Không có thông báo
      </div>
    );
  } else {
    notificationContent = (
      <div style={{ width: 440, maxHeight: 500, overflow: "auto", background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: 12 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0 12px 0",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: 8,
          background: '#fff',
          borderRadius: 0
        }}>
          <Text strong>Thông báo ({userNotifications.length})</Text>
          <Space>
            {unreadCount > 0 && (
              <Button
                size="small"
                type="link"
                onClick={markAllAsRead}
                icon={<CheckOutlined />}
              >
                Đánh dấu đã đọc
              </Button>
            )}
            <Button
              size="small"
              type="link"
              danger
              onClick={clearNotifications}
              icon={<DeleteOutlined />}
            >
              Xóa tất cả
            </Button>
          </Space>
        </div>
        <List
          dataSource={userNotifications}
          renderItem={(notification) => (
            <List.Item
              style={{
                marginBottom: 14,
                padding: "16px 16px 12px 16px",
                borderRadius: 12,
                boxShadow: notification.read ? 'none' : '0 2px 8px rgba(82,196,26,0.08)',
                background: notification.read ? '#fff' : '#f6ffed',
                border: notification.read ? '1px solid #f0f0f0' : '1.5px solid #b7eb8f',
                cursor: "pointer",
                transition: 'box-shadow 0.2s',
                minHeight: 70,
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => {
                markAsRead(notification.id);
                if (notification.data && notification.data.link) {
                  navigate(notification.data.link);
                }
              }}
            >
              <List.Item.Meta
                avatar={
                  <span style={{ fontSize: 22, marginRight: 8 }}>
                    {getNotificationIcon(notification.type)}
                  </span>
                }
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Text strong style={{ fontSize: 15 }}>
                      {notification.title}
                    </Text>
                    <Tag color={getNotificationColor(notification.type)} size="small">
                      {formatTime(notification.timestamp)}
                    </Tag>
                  </div>
                }
                description={
                  <div style={{ fontSize: 14, color: "#444", padding: '4px 0', wordBreak: 'break-word', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                    {notification.message}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    );
  }

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order_new":
        return "🆕";
      case "order_status_update":
        return "📋";
      case "order_completed":
        return "✅";
      case "order_needs_approval":
        return "⏳";
      case "order_approved":
        return "✅";
      case "order_rejected":
        return "❌";
      case "feedback_new":
        return "💬";
      case "feedback_response":
        return "💬";
      case "pricing_update":
        return "💰";
      case "system_alert":
        return "⚠️";
      default:
        return "📢";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "order_new":
        return "blue";
      case "order_status_update":
        return "green";
      case "order_completed":
        return "green";
      case "order_needs_approval":
        return "orange";
      case "order_approved":
        return "green";
      case "order_rejected":
        return "red";
      case "feedback_new":
        return "purple";
      case "feedback_response":
        return "cyan";
      case "pricing_update":
        return "gold";
      case "system_alert":
        return "red";
      default:
        return "default";
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  return (
    <Popover
      content={notificationContent}
      title={null}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      placement="bottomRight"
      overlayStyle={{ width: 350 }}
    >
      <Badge count={unreadCount} size="small">
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 18 }} />}
          style={{
            color: "#666",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
          }}
        />
      </Badge>
    </Popover>
  );
};

export default NotificationBell; 