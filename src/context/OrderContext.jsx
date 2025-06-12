import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthContext } from "./AuthContext";

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

  // Khi load lần đầu hoặc user đổi, đọc orders từ localStorage và lọc theo user
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    if (user && user.email && user.role !== "staff") {
      dispatch({
        type: "SET_ORDERS",
        payload: saved.filter((o) => o.email === user.email),
      });
    } else if (user && user.role === "staff") {
      dispatch({ type: "SET_ORDERS", payload: saved });
    } else {
      dispatch({ type: "SET_ORDERS", payload: [] });
    }
    
    // Load pricing data from localStorage or use default
    const savedPricingData = JSON.parse(localStorage.getItem("dna_pricing_data") || "null");
    if (savedPricingData) {
      dispatch({ type: "UPDATE_PRICING_DATA", payload: savedPricingData });
    } else {
      localStorage.setItem("dna_pricing_data", JSON.stringify(defaultPricingData));
    }
  }, [user]);

  const addOrder = (order) => {
    if (!user || !user.email) return;
    // Gắn email user vào đơn, thêm các trường mặc định
    const orderWithEmail = {
      ...order,
      email: user.email,
      status: "Chờ xử lý",
      result: "",
      staffName: "",
      managerConfirm: false,
      feedback: "",
      rating: 0,
      resultFile: "",
      kitStatus: order.sampleMethod === "home" ? "chua_gui" : undefined,
    };
    // Lưu vào localStorage (toàn bộ đơn)
    const allOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    const newOrders = [orderWithEmail, ...allOrders];
    localStorage.setItem("dna_orders", JSON.stringify(newOrders));
    // Sau khi thêm, lọc lại toàn bộ đơn cho user hiện tại
    const filtered =
      user.role === "staff"
        ? newOrders
        : newOrders.filter((o) => o.email === user.email);
    dispatch({ type: "SET_ORDERS", payload: filtered });
  };

  // Hàm cho staff lấy toàn bộ đơn
  const getAllOrders = () => {
    return JSON.parse(localStorage.getItem("dna_orders") || "[]");
  };

  const setOrders = (orders) => {
    dispatch({ type: "SET_ORDERS", payload: orders });
  };

  // Cập nhật đơn (staff/manager cập nhật trạng thái, kết quả, file, xác nhận)
  const updateOrder = (orderId, updates) => {
    const allOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    const idx = allOrders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      allOrders[idx] = { ...allOrders[idx], ...updates };
      localStorage.setItem("dna_orders", JSON.stringify(allOrders));
      setOrders(allOrders);
    }
  };

  // Thêm/Chỉnh sửa feedback và rating
  const addFeedback = (orderId, feedback, rating) => {
    const allOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    const idx = allOrders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      const order = allOrders[idx];
      const now = new Date();
      const date = `${now.getDate()}/${
        now.getMonth() + 1
      }/${now.getFullYear()}`;
      if (!order.feedbacks) order.feedbacks = [];
      order.feedbacks.push({
        rating,
        feedback,
        date,
        user: order.name || order.fullName || order.email || "Người dùng",
        email: order.email || "",
      });
      localStorage.setItem("dna_orders", JSON.stringify(allOrders));
      setOrders(allOrders);
    }
  };

  // Cập nhật dữ liệu giá và thời gian
  const updatePricingData = (category, updatedServices) => {
    dispatch({ 
      type: "UPDATE_PRICING_DATA", 
      payload: { [category]: updatedServices } 
    });
  };

  // Lấy dữ liệu giá và thời gian
  const getPricingData = () => {
    return state.pricingData;
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
        updatePricingData,
        getPricingData,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrderContext = () => useContext(OrderContext);
