import React, { useState, useRef } from "react";
import { Badge, Popover, List, Button, Typography, Space, Tag } from "antd";
import { BellOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNotification, ROLES } from "../../context/NotificationContext";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const NotificationBell = () => {
  const [visible, setVisible] = useState(false);
  const bellRef = useRef(null);
  const { user } = useContext(AuthContext);
  const {
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    getNotificationsByRole,
  } = useNotification();
  const navigate = useNavigate();

  // Ẩn chuông nếu là staff
  if (user?.role_id === ROLES.STAFF) return null;

  // Lọc thông báo theo vai trò
  let userNotifications = [];
  if (user?.role_id === ROLES.MANAGER) {
    // Manager chỉ nhận thông báo xác thực
    userNotifications = getNotificationsByRole(ROLES.MANAGER).filter(n => n.type === "order_needs_approval");
  } else if (user?.role_id === ROLES.CUSTOMER) {
    // Khách hàng chỉ nhận các thông báo liên quan đến đơn của mình, không nhận order_needs_approval
  const allowedTypes = [
    "order_new",
      "order_status_update",
      "order_completed",
    "order_rejected",
      "feedback_response",
      "pricing_update"
  ];
    userNotifications = getNotificationsByRole(ROLES.CUSTOMER).filter(n => allowedTypes.includes(n.type));
  }
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
      <div style={{ width: '100%', maxWidth: '100%', padding: 0, fontSize: 14 }}>
        <div style={{
          width: '100%',
          padding: '4px 0 8px 0',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: 8,
          background: '#fff',
          borderRadius: 0
        }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>
            Thông báo ({userNotifications.length})
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
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
          </div>
        </div>
        <List
          dataSource={userNotifications}
          renderItem={(notification) => (
            <List.Item
              style={{
                marginBottom: 10,
                padding: "8px 8px 6px 8px",
                borderRadius: 10,
                boxShadow: notification.read ? 'none' : '0 2px 8px rgba(82,196,26,0.08)',
                background: notification.read ? '#fff' : '#f6ffed',
                border: notification.read ? '1px solid #f0f0f0' : '1.5px solid #b7eb8f',
                cursor: "pointer",
                transition: 'box-shadow 0.2s',
                minHeight: 44,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
              }}
              onClick={() => {
                markAsRead(notification.id);
                if (notification.data && notification.data.link) {
                  navigate(notification.data.link);
                }
              }}
            >
              <span style={{ fontSize: 20, marginRight: 4, flexShrink: 0, marginTop: 2 }}>
                    {getNotificationIcon(notification.type)}
                  </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <Text strong style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>
                      {notification.title}
                    </Text>
                  <Tag color={getNotificationColor(notification.type)} size="small" style={{ fontSize: 11, height: 20, marginLeft: 4 }}>
                      {formatTime(notification.timestamp)}
                    </Tag>
                  </div>
                <div style={{ fontSize: 12, color: "#444", padding: '2px 0 0 0', wordBreak: 'break-word', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                    {notification.message}
                  </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }

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
    <div style={{ position: 'relative', display: 'inline-block' }} ref={bellRef}>
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
          position: 'relative',
        }}
        onClick={() => setVisible(v => !v)}
      />
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: 6,
          right: 8,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#ff4d4f',
          border: '2px solid #fff',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
      )}
      {visible && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            minWidth: 200,
            maxWidth: 260,
            borderRadius: 12,
            boxShadow: '0 2px 8px #0002',
            background: '#fff',
            padding: 0,
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{padding: 6, fontSize: 13}}>
            {notificationContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 