import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNotification } from "./NotificationContext";

const OrderContext = createContext();

// Dữ liệu mặc định cho bảng giá dịch vụ
const defaultPricingData = {
  civil: [
    { id: "civil-1", name: "Xét nghiệm cha con", price: 4500000, additionalPrice: 1800000, time: "3-5 ngày" },
    { id: "civil-2", name: "Xét nghiệm mẹ con", price: 4500000, additionalPrice: 1800000, time: "3-5 ngày" },
    { id: "civil-3", name: "Xét nghiệm anh chị em ruột", price: 6000000, additionalPrice: 2000000, time: "5-7 ngày" },
    { id: "civil-4", name: "Xét nghiệm họ hàng", price: 7500000, additionalPrice: 2000000, time: "7-10 ngày" },
    { id: "civil-5", name: "Xét nghiệm nguồn gốc", price: 4500000, additionalPrice: 2000000, time: "3-5 ngày" },
    { id: "civil-6", name: "Xét nghiệm sức khỏe di truyền", price: 6000000, additionalPrice: 2000000, time: "4-6 ngày" },
    { id: "civil-7", name: "Xét nghiệm nhanh", price: 6500000, additionalPrice: 3000000, time: "24-48 giờ" },
  ],
  admin: [
    { id: "admin-1", name: "Xét nghiệm ADN khai sinh", price: 6500000, additionalPrice: 2000000, time: "5-7 ngày" },
    { id: "admin-2", name: "Xét nghiệm ADN di trú", price: 8500000, additionalPrice: 2000000, time: "7-10 ngày" },
    { id: "admin-3", name: "Xét nghiệm ADN thừa kế", price: 7500000, additionalPrice: 2000000, time: "5-7 ngày" },
    { id: "admin-4", name: "Xét nghiệm ADN tranh chấp", price: 8000000, additionalPrice: 2000000, time: "5-7 ngày" },
    { id: "admin-5", name: "Xét nghiệm hành chính nhanh", price: 10000000, additionalPrice: 3000000, time: "48-72 giờ" },
  ]
};

const initialState = {
  orders: [],
  pricingData: defaultPricingData,
};

function orderReducer(state, action) {
  switch (action.type) {
    case "ADD_ORDER": {
      const newOrders = [action.payload, ...state.orders];
      localStorage.setItem("dna_orders", JSON.stringify(newOrders));
      return { ...state, orders: newOrders };
    }
    case "UPDATE_ORDER": {
      const updatedOrders = state.orders.map((o) =>
        o.id === action.payload.id ? { ...o, ...action.payload } : o
      );
      localStorage.setItem("dna_orders", JSON.stringify(updatedOrders));
      return { ...state, orders: updatedOrders };
    }
    case "SET_ORDERS":
      return { ...state, orders: action.payload };
    case "UPDATE_PRICING_DATA": {
      const updatedPricingData = { ...state.pricingData, ...action.payload };
      localStorage.setItem("dna_pricing_data", JSON.stringify(updatedPricingData));
      return { ...state, pricingData: updatedPricingData };
    }

    default:
      return state;
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const { user } = useContext(AuthContext);
  const {
    notifyNewOrder,
    notifyOrderStatusUpdate,
    notifyNewFeedback,
    notifyFeedbackResponse,
    notifyPricingUpdate
  } = useNotification();
  // Khi load lần đầu hoặc user đổi, đọc orders từ localStorage và lọc theo user
  useEffect(() => {
    const loadOrders = () => {
      const saved = JSON.parse(localStorage.getItem("dna_orders") || "[]");
      if (user && user.email && user.role_id !== 2) {
        dispatch({
          type: "SET_ORDERS",
          payload: saved.filter((o) => o.email === user.email),
        });
      } else if (user && user.role_id === 2) {
        dispatch({ type: "SET_ORDERS", payload: saved });
      } else {
        dispatch({ type: "SET_ORDERS", payload: [] });
      }
    };

    // Load pricing data from localStorage or use default
    const savedPricingData = JSON.parse(localStorage.getItem("dna_pricing_data") || "null");
    if (savedPricingData) {
      dispatch({ type: "UPDATE_PRICING_DATA", payload: savedPricingData });
    } else {
      localStorage.setItem("dna_pricing_data", JSON.stringify(defaultPricingData));
    }

    // Load orders khi component mount và khi user thay đổi
    loadOrders();

    // Thêm event listener để cập nhật orders khi localStorage thay đổi từ tab khác
    const handleStorageChange = (event) => {
      if (event.key === 'dna_orders') {
        loadOrders();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  const addOrder = (order) => {
    if (!user || !user.email) return;
    // Gắn email user vào đơn, thêm các trường mặc định
    const orderWithEmail = {
      ...order,
      email: user.email,
      status: order.sampleMethod === "home" ? "PENDING_CONFIRM" : "Chờ xử lý",
      result: "",
      staffName: "",
      managerConfirm: false,
      feedback: "",
      rating: 0,
      resultFile: "",
      kitStatus: order.sampleMethod === "home" ? "PENDING_CONFIRM" : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Lưu vào localStorage (toàn bộ đơn)
    const allOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    const newOrders = [orderWithEmail, ...allOrders];
    localStorage.setItem("dna_orders", JSON.stringify(newOrders));

    // Sau khi thêm, lọc lại toàn bộ đơn cho user hiện tại
    const filtered =
      user.role_id === 2
        ? newOrders
        : newOrders.filter((o) => o.email === user.email);
    dispatch({ type: "SET_ORDERS", payload: filtered });

    // Tạo thông báo cho Staff và Manager
    notifyNewOrder(orderWithEmail);
  };

  // Hàm cho staff lấy toàn bộ đơn
  const getAllOrders = () => {
    return JSON.parse(localStorage.getItem("dna_orders") || "[]");
  };

  const setOrders = (orders) => {
    dispatch({ type: "SET_ORDERS", payload: orders });
  };

  // Cập nhật đơn (staff/manager cập nhật trạng thái, kết quả, file, xác thực)
  const updateOrder = async (orderId, updates) => {
    let currentUser = user;
    if (!currentUser) {
      currentUser = JSON.parse(localStorage.getItem('dna_user') || 'null');
      console.log('[DEBUG][updateOrder] fallback user from localStorage:', currentUser);
    }
    console.log('[DEBUG][updateOrder] user:', currentUser);
    const allOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    const idx = allOrders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      const oldOrder = allOrders[idx];
      const updatedOrder = {
        ...oldOrder,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      allOrders[idx] = updatedOrder;
      localStorage.setItem("dna_orders", JSON.stringify(allOrders));
      setOrders(allOrders);
      console.log('[DEBUG][updateOrder] notify condition:', {
        updatesStatus: updates.status,
        oldStatus: oldOrder.status,
        userRole: currentUser?.role_id
      });
      if (
        updates.status &&
        (updates.status === "Chờ xác thực" || updates.status === "WAITING_APPROVAL") &&
        currentUser?.role_id !== 2 // Không phải manager
      ) {
        const updatedBy = currentUser?.name || currentUser?.email || "Hệ thống";
        console.log('[DEBUG][updateOrder] CALL notifyOrderStatusUpdate');
        notifyOrderStatusUpdate(updatedOrder, oldOrder.status, updates.status, updatedBy);
      }

      // Không gửi notifyOrderApproval cho manager khi manager tự thao tác
      // (Nếu cần gửi cho staff hoặc khách hàng thì giữ lại logic ở đây)
      if (
        updates.managerConfirm !== undefined &&
        updates.managerConfirm !== oldOrder.managerConfirm
      ) {
        if (updates.managerConfirm) {
          // Nếu được phê duyệt, cập nhật trạng thái thành "Hoàn thành"
          const finalOrder = { ...updatedOrder, status: "Hoàn thành" };
          allOrders[idx] = finalOrder;
          localStorage.setItem("dna_orders", JSON.stringify(allOrders));
          // Cập nhật state cho tất cả users
          if (user && user.role_id === 2) {
            // Nếu là staff, cập nhật toàn bộ orders
            setOrders(allOrders);
          } else {
            // Nếu là customer, chỉ cập nhật orders của họ
            setOrders(allOrders.filter((o) => o.email === user.email));
          }
        } else {
          // Nếu bị từ chối, cập nhật trạng thái thành "Từ chối"
          const rejectedOrder = { ...updatedOrder, status: "Từ chối" };
          allOrders[idx] = rejectedOrder;
          localStorage.setItem("dna_orders", JSON.stringify(allOrders));
          // Cập nhật state cho tất cả users
          if (user && user.role_id === 2) {
            // Nếu là staff, cập nhật toàn bộ orders
            setOrders(allOrders);
          } else {
            // Nếu là customer, chỉ cập nhật orders của họ
            setOrders(allOrders.filter((o) => o.email === user.email));
          }
        }
      }
    }
    return Promise.resolve();
  };

  // Thêm/Chỉnh sửa feedback và rating
  const addFeedback = (orderId, feedback, rating, categoryRatings = {}) => {
    const allOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    const idx = allOrders.findIndex((o) => o.id === orderId);

    if (idx !== -1) {
      const order = allOrders[idx];
      const now = new Date();
      const date = `${now.getDate()}/${now.getMonth() + 1
        }/${now.getFullYear()}`;

      if (!order.feedbacks) order.feedbacks = [];

      // Chỉ cho phép đánh giá 1 lần cho mỗi đơn
      if (order.feedbacks.length > 0) {
        // Đã có feedback, không thêm mới
        return;
      }

      const newFeedback = {
        rating,
        feedback,
        date,
        categoryRatings,
        user: order.name || order.fullName || order.email || "Người dùng",
        email: order.email || "",
      };

      order.feedbacks.push(newFeedback);
      order.updatedAt = new Date().toISOString();

      localStorage.setItem("dna_orders", JSON.stringify(allOrders));
      setOrders(allOrders);

      // Tạo thông báo cho Staff và Manager
      notifyNewFeedback(newFeedback, order);
    }
  };

  // Phản hồi feedback (cho Staff)
  const respondToFeedback = (orderId, response, respondedBy) => {
    const allOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    const idx = allOrders.findIndex((o) => o.id === orderId);

    if (idx !== -1) {
      const order = allOrders[idx];
      if (!order.feedbackResponses) order.feedbackResponses = [];

      const feedbackResponse = {
        response,
        respondedBy,
        date: new Date().toISOString(),
      };

      order.feedbackResponses.push(feedbackResponse);
      order.updatedAt = new Date().toISOString();

      localStorage.setItem("dna_orders", JSON.stringify(allOrders));
      setOrders(allOrders);

      // Tạo thông báo cho User
      notifyFeedbackResponse(feedbackResponse, order, respondedBy);
    }
  };

  // Cập nhật dữ liệu giá và thời gian
  const updatePricingData = (category, updatedServices) => {
    dispatch({
      type: "UPDATE_PRICING_DATA",
      payload: { [category]: updatedServices }
    });

    // Tạo thông báo cho Staff và Manager
    const updatedBy = user?.name || user?.email || "Admin";
    notifyPricingUpdate({ [category]: updatedServices }, updatedBy);
  };

  // Lấy dữ liệu giá và thời gian
  const getPricingData = () => {
    return state.pricingData;
  };

  // Lấy đơn hàng theo trạng thái
  const getOrdersByStatus = (status) => {
    return state.orders.filter(order => order.status === status);
  };

  // Lấy đơn hàng cần xác thực (cho Manager)
  const getOrdersNeedingApproval = () => {
    const allOrders = getAllOrders();
    return allOrders.filter(order => order.status === "Chờ xác thực");
  };

  // Lấy đơn hàng có feedback (cho Staff)
  const getOrdersWithFeedback = () => {
    const allOrders = getAllOrders();
    return allOrders.filter(order => order.feedbacks && order.feedbacks.length > 0);
  };

  // Xoá đơn hàng theo id, trả về order vừa xoá để hoàn tác
  const deleteOrder = (orderId) => {
    const allOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    const idx = allOrders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      const deletedOrder = allOrders[idx];
      allOrders.splice(idx, 1);
      localStorage.setItem("dna_orders", JSON.stringify(allOrders));
      setOrders(allOrders);
      return deletedOrder;
    }
    return null;
  };

  return (
    <OrderContext.Provider
      value={{
        orders: state.orders,
        pricingData: state.pricingData,
        addOrder,
        setOrders,
        getAllOrders,
        updateOrder,
        addFeedback,
        respondToFeedback,
        updatePricingData,
        getPricingData,
        getOrdersByStatus,
        getOrdersNeedingApproval,
        getOrdersWithFeedback,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
export const useOrderContext = () => useContext(OrderContext);
