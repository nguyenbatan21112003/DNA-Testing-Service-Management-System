import React, { createContext, useContext, useReducer, useEffect } from "react";
import { message } from "antd";

const NotificationContext = createContext();

// Các loại thông báo
export const NOTIFICATION_TYPES = {
  ORDER_NEW: "order_new",
  ORDER_STATUS_UPDATE: "order_status_update",
  ORDER_COMPLETED: "order_completed",
  ORDER_NEEDS_APPROVAL: "order_needs_approval",
  ORDER_APPROVED: "order_approved",
  ORDER_REJECTED: "order_rejected",
  FEEDBACK_NEW: "feedback_new",
  FEEDBACK_RESPONSE: "feedback_response",
  PRICING_UPDATE: "pricing_update",
  SYSTEM_ALERT: "system_alert",
  PERFORMANCE_ALERT: "performance_alert",
  APPOINTMENT_REMINDER: "appointment_reminder",
};

// Các role
export const ROLES = {
  USER: 1,
  STAFF: 2,
  MANAGER: 3,
  ADMIN: 4,
};

const initialState = {
  notifications: [],
  unreadCount: 0,
  activities: [], // Timeline hoạt động
};

function notificationReducer(state, action) {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      const newNotification = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload,
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }

    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notif) =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case "MARK_ALL_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
        unreadCount: 0,
      };

    case "ADD_ACTIVITY": {
      const newActivity = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      return {
        ...state,
        activities: [newActivity, ...state.activities.slice(0, 99)], // Giữ 100 hoạt động gần nhất
      };
    }

    case "CLEAR_NOTIFICATIONS":
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };

    case "LOAD_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload.notifications || [],
        activities: action.payload.activities || [],
        unreadCount: (action.payload.notifications || []).filter((n) => !n.read).length,
      };

    default:
      return state;
  }
}

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Load notifications từ localStorage khi component mount
  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem("dna_notifications") || "[]");
    const savedActivities = JSON.parse(localStorage.getItem("dna_activities") || "[]");

    dispatch({
      type: "LOAD_NOTIFICATIONS",
      payload: {
        notifications: savedNotifications,
        activities: savedActivities,
      },
    });
  }, []);

  // Lưu notifications vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem("dna_notifications", JSON.stringify(state.notifications));
    localStorage.setItem("dna_activities", JSON.stringify(state.activities));
  }, [state.notifications, state.activities]);

  // Tạo thông báo mới
  const createNotification = (type, title, messageText, data = {}, targetRoles = []) => {
    const notification = {
      type,
      title,
      message: messageText,
      data,
      targetRoles,
    };
    console.log('[DEBUG][createNotification]', notification);
    dispatch({ type: "ADD_NOTIFICATION", payload: notification });

    // Hiển thị thông báo popup cho role hiện tại
    const currentUser = JSON.parse(localStorage.getItem("dna_user") || "null");
    if (currentUser && targetRoles.includes(currentUser.role_id)) {
      message.info(title);
    }

    return notification;
  };

  // Thêm hoạt động vào timeline
  const addActivity = (action, description, userId, userRole, data = {}) => {
    const activity = {
      action,
      description,
      userId,
      userRole,
      data,
    };

    dispatch({ type: "ADD_ACTIVITY", payload: activity });
    return activity;
  };

  // Đánh dấu thông báo đã đọc
  const markAsRead = (notificationId) => {
    dispatch({ type: "MARK_AS_READ", payload: notificationId });
  };

  // Đánh dấu tất cả thông báo đã đọc
  const markAllAsRead = () => {
    dispatch({ type: "MARK_ALL_AS_READ" });
  };

  // Xóa tất cả thông báo
  const clearNotifications = () => {
    dispatch({ type: "CLEAR_NOTIFICATIONS" });
  };

  // Lọc thông báo theo role
  const getNotificationsByRole = (roleId) => {
    const filtered = state.notifications.filter((notif) =>
      notif.targetRoles.includes(roleId)
    );
    console.log('DEBUG: getNotificationsByRole', { roleId, filtered });
    return filtered;
  };

  // Lọc hoạt động theo role
  const getActivitiesByRole = (roleId) => {
    return state.activities.filter((activity) =>
      activity.userRole === roleId || activity.data.targetRoles?.includes(roleId)
    );
  };

  // Tạo thông báo cho đơn hàng mới
  const notifyNewOrder = (order) => {
    createNotification(
      NOTIFICATION_TYPES.ORDER_NEW,
      "Đơn hàng mới",
      `Đơn hàng #${order.id} - ${order.name} vừa được tạo`,
      { orderId: order.id, order },
      [ROLES.STAFF, ROLES.MANAGER]
    );

    addActivity(
      "Tạo đơn hàng",
      `User ${order.name} đã tạo đơn hàng #${order.id}`,
      order.email,
      ROLES.USER,
      { orderId: order.id, order }
    );
  };

  // Tạo thông báo cập nhật trạng thái đơn hàng
  const notifyOrderStatusUpdate = (order, oldStatus, newStatus, updatedBy) => {
    const statusMessages = {
      "Chờ xử lý": "đã được nhận",
      "Đang xử lý": "đang được xử lý",
      "Chờ xác thực": "đã hoàn thành, chờ xác thực",
      "Hoàn thành": "đã được xác thực và hoàn thành",
      "Từ chối": "bị từ chối, cần sửa lại",
    };

    const messageText = `Đơn hàng #${order.id} ${statusMessages[newStatus] || "đã được cập nhật"}`;

    // Thông báo cho User
    createNotification(
      NOTIFICATION_TYPES.ORDER_STATUS_UPDATE,
      "Cập nhật đơn hàng",
      messageText,
      { orderId: order.id, order, oldStatus, newStatus, link: `/nhanvien?orderId=${order.id}` },
      [ROLES.USER]
    );

    // Thông báo cho Manager nếu cần xác thực
    if (newStatus === "Chờ xác thực" || newStatus === "WAITING_APPROVAL") {
      createNotification(
        NOTIFICATION_TYPES.ORDER_NEEDS_APPROVAL,
        "Cần xác thực kết quả",
        `Đơn hàng #${order.id} cần được xác thực. Click để xem chi tiết!`,
        { orderId: order.id, order, link: `/manager?orderId=${order.id}` },
        [ROLES.MANAGER]
      );
    }

    addActivity(
      "Cập nhật trạng thái",
      `${updatedBy} đã cập nhật đơn hàng #${order.id} từ "${oldStatus}" thành "${newStatus}"`,
      updatedBy,
      ROLES.STAFF,
      { orderId: order.id, order, oldStatus, newStatus }
    );
  };

  // Tạo thông báo phê duyệt/từ chối
  const notifyOrderApproval = (order, approved, approvedBy) => {
    if (approved) {
      createNotification(
        NOTIFICATION_TYPES.ORDER_APPROVED,
        "Kết quả đã được phê duyệt",
        `Đơn hàng #${order.id} đã được phê duyệt và hoàn thành. Click để xem chi tiết!`,
        { orderId: order.id, order, link: `/nhanvien?orderId=${order.id}` },
        [ROLES.USER, ROLES.STAFF]
      );
    } else {
      createNotification(
        NOTIFICATION_TYPES.ORDER_REJECTED,
        "Kết quả cần sửa lại",
        `Đơn hàng #${order.id} bị từ chối, cần sửa lại. Click để xem chi tiết!`,
        { orderId: order.id, order, link: `/nhanvien?orderId=${order.id}` },
        [ROLES.STAFF]
      );
    }

    addActivity(
      approved ? "Phê duyệt kết quả" : "Từ chối kết quả",
      `${approvedBy} đã ${approved ? "phê duyệt" : "từ chối"} đơn hàng #${order.id}`,
      approvedBy,
      ROLES.MANAGER,
      { orderId: order.id, order, approved }
    );
  };

  // Tạo thông báo feedback mới
  const notifyNewFeedback = (feedback, order) => {
    createNotification(
      NOTIFICATION_TYPES.FEEDBACK_NEW,
      "Feedback mới",
      `Có feedback mới cho đơn hàng #${order.id}`,
      { orderId: order.id, feedback, order },
      [ROLES.STAFF, ROLES.MANAGER]
    );

    addActivity(
      "Gửi feedback",
      `User ${order.name} đã gửi feedback cho đơn hàng #${order.id}`,
      order.email,
      ROLES.USER,
      { orderId: order.id, feedback, order }
    );
  };

  // Tạo thông báo phản hồi feedback
  const notifyFeedbackResponse = (feedback, order, respondedBy) => {
    createNotification(
      NOTIFICATION_TYPES.FEEDBACK_RESPONSE,
      "Có phản hồi feedback",
      `Staff đã phản hồi feedback cho đơn hàng #${order.id}`,
      { orderId: order.id, feedback, order },
      [ROLES.USER]
    );

    addActivity(
      "Phản hồi feedback",
      `${respondedBy} đã phản hồi feedback cho đơn hàng #${order.id}`,
      respondedBy,
      ROLES.STAFF,
      { orderId: order.id, feedback, order }
    );
  };

  // Tạo thông báo thay đổi giá
  const notifyPricingUpdate = (pricingData, updatedBy) => {
    createNotification(
      NOTIFICATION_TYPES.PRICING_UPDATE,
      "Cập nhật giá dịch vụ",
      "Giá dịch vụ đã được cập nhật",
      { pricingData },
      [ROLES.STAFF, ROLES.MANAGER]
    );

    addActivity(
      "Cập nhật giá",
      `${updatedBy} đã cập nhật giá dịch vụ`,
      updatedBy,
      ROLES.ADMIN,
      { pricingData }
    );
  };

  // Tạo thông báo hệ thống
  const notifySystemAlert = (title, messageText, targetRoles = []) => {
    createNotification(
      NOTIFICATION_TYPES.SYSTEM_ALERT,
      title,
      messageText,
      {},
      targetRoles
    );
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'dna_notifications') {
        const savedNotifications = JSON.parse(localStorage.getItem("dna_notifications") || "[]");
        dispatch({
          type: "LOAD_NOTIFICATIONS",
          payload: {
            notifications: savedNotifications,
            activities: state.activities,
          },
        });
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [state.activities]);

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        activities: state.activities,
        unreadCount: state.unreadCount,
        createNotification,
        addActivity,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        getNotificationsByRole,
        getActivitiesByRole,
        notifyNewOrder,
        notifyOrderStatusUpdate,
        notifyOrderApproval,
        notifyNewFeedback,
        notifyFeedbackResponse,
        notifyPricingUpdate,
        notifySystemAlert,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext); 