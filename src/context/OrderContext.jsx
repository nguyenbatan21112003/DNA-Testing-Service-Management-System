import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const OrderContext = createContext();

const initialState = {
  orders: [],
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
    updateOrder(orderId, { feedback, rating });
  };

  return (
    <OrderContext.Provider
      value={{
        orders: state.orders,
        addOrder,
        setOrders,
        getAllOrders,
        updateOrder,
        addFeedback,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrderContext = () => useContext(OrderContext);
