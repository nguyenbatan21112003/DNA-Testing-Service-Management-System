import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Eye, EyeOff, Star, FileText } from "lucide-react";
import { useOrderContext } from "../../context/OrderContext";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Modal, message } from "antd";
import React from "react";
import TimelineProgress from "./TimelineProgress";
import NewOrderButton from "./NewOrderButton";
import RequestFormModal from "./RequestFormModal";

const sidebarTabs = [
  { key: "profile", label: "Hồ sơ cá nhân", icon: <UserOutlined /> },
  { key: "orders", label: "Đơn đăng ký", icon: <FileTextOutlined /> },
  { key: "settings", label: "Cài đặt", icon: <SettingOutlined /> },
];

const UserProfile = () => {
  const {
    user,
    updateUser,
    requestPasswordChange,
    verifyPasswordChange,
    logout,
  } = useContext(AuthContext);
  const { getAllOrders, addFeedback } = useOrderContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState("profile");

  // Đổi mật khẩu
  const [pwForm, setPwForm] = useState({ current: "", new: "", confirm: "" });
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [pwStep, setPwStep] = useState(1); // 1: nhập, 2: nhập OTP
  const [otpSent, setOtpSent] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [otpInput, setOtpInput] = useState("");

  const [filterStatus, setFilterStatus] = useState("Tất cả");
  // const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [feedbackInput, setFeedbackInput] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  // const [kitToast, setKitToast] = useState("");
  // const [fileToast, setFileToast] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Thêm state cho modal feedback
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackOrder, setFeedbackOrder] = useState(null);

  // State cho 2 modal riêng biệt
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const [searchOrder, setSearchOrder] = useState("");

  const [showTimeline, setShowTimeline] = useState({});
  
  // State cho đánh giá theo danh mục
  const [selectedCategory, setSelectedCategory] = useState('quality');
  const [categoryRatings, setCategoryRatings] = useState({
    quality: 0,
    price: 0,
    time: 0,
    staff: 0,
    website: 0,
    overall: 0
  });

  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedOrderForForm, setSelectedOrderForForm] = useState(null);

  const [showConfirmKitModal, setShowConfirmKitModal] = useState(false);
  const [kitInfo, setKitInfo] = useState(null);
  
  // State để lưu đơn hàng của user
  const [userOrders, setUserOrders] = useState([]);

  // Lấy đơn đăng ký của user hiện tại
  useEffect(() => {
    const loadUserOrders = () => {
      if (user) {
        const allOrders = getAllOrders();
        const filteredOrders = allOrders.filter(
          (order) => order.userId === user.id || order.email === user.email
        );
        setUserOrders(filteredOrders);
      }
    };
    
    // Load orders khi component mount hoặc user thay đổi
    loadUserOrders();
    
    // Thêm event listener để cập nhật orders khi localStorage thay đổi
    window.addEventListener('storage', (event) => {
      if (event.key === 'dna_orders') {
        loadUserOrders();
      }
    });

    // Cleanup function
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, [user, getAllOrders]);

  if (!user)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Bạn cần đăng nhập để xem trang này.
      </div>
    );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(form);
    setSuccess("Cập nhật thông tin thành công!");
    setTimeout(() => setSuccess(""), 2000);
  };

  // Đổi mật khẩu
  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  };
  const handleSendOtp = (e) => {
    e.preventDefault();
    setPwMsg("");
    if (!pwForm.current || !pwForm.new || !pwForm.confirm) {
      setPwMsg("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (pwForm.new !== pwForm.confirm) {
      setPwMsg("Mật khẩu mới và xác nhận không khớp!");
      return;
    }
    if (pwForm.new.length < 6) {
      setPwMsg("Mật khẩu mới phải từ 6 ký tự!");
      return;
    }
    const res = requestPasswordChange(pwForm.current, pwForm.new);
    if (res.success) {
      setOtpSent(res.otp); // giả lập gửi email, hiển thị luôn
      setPwStep(2);
      setPwMsg("");
    } else {
      setPwMsg(res.message);
    }
  };
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setPwMsg("");
    if (!otpInput) {
      setPwMsg("Vui lòng nhập mã xác thực!");
      return;
    }
    const res = verifyPasswordChange(otpInput);
    if (res.success) {
      setPwMsg("Đổi mật khẩu thành công!");
      setPwStep(1);
      setPwForm({ current: "", new: "", confirm: "" });
      setOtpInput("");
      setOtpSent("");
    } else {
      setPwMsg(res.message);
    }
  };

  // Thêm hàm chuyển đổi nhãn
  const getSampleMethodLabel = (val) => {
    if (val === "home") return "Tại nhà";
    if (val === "center") return "Tại trung tâm";
    if (val === "self") return "Tự thu và gửi mẫu";
    return val;
  };

  // Thêm hàm xác nhận nhận kit
  const handleUserConfirmKit = (order) => {
    setKitInfo(order);
    setShowConfirmKitModal(true);
  };
  const handleUserConfirmKitOk = () => {
    // Cập nhật trạng thái kitStatus thành 'da_nhan' cho đơn này trong localStorage
    const allOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    const updatedOrders = allOrders.map((o) =>
      o.id === kitInfo.id ? { ...o, kitStatus: "da_nhan" } : o
    );
    localStorage.setItem("dna_orders", JSON.stringify(updatedOrders));
    setShowConfirmKitModal(false);
    message.success("Bạn đã xác nhận nhận kit thành công!");
    window.location.reload();
  };

  return (
    <div
      className="user-profile-page"
      style={{
        display: "flex",
        height: "calc(100vh - 56px)",
        minHeight: 0,
        width: "100vw",
        maxWidth: "100vw",
        background: "#f5f6fa",
        margin: 0,
        padding: 0,

      }}
    >
      {/* Sidebar giống admin */}
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
      {/* Nội dung bên phải */}
      <div
        className="user-profile-form"
        style={{
          flex: 1,
          margin: 0,
          background: "#fff",
          borderRadius: 0,
          boxShadow: "0 2px 12px #e6e6e6",
          padding: "0 0 0 0",
          minWidth: 0,
          width: "100%",
          height: "100%",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          overflow: "auto",
        }}
      >
        {/* Header nhỏ cho nội dung */}
        <div
          style={{
            width: "100%",
            padding: "28px 36px 0 36px",
            fontWeight: 800,
            fontSize: 28,
            color: "#222",
            letterSpacing: -1,
            marginBottom: 0,
          }}
        >
          {tab === "profile" && "Hồ sơ cá nhân"}
          {tab === "orders" && "Đơn đăng ký"}
          {tab === "settings" && "Cài đặt tài khoản"}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "12px 36px 36px 36px",
          }}
        >
          {tab === "profile" && (
            <form
              className="profile-form"
              onSubmit={handleSubmit}
              style={{
                width: "100%",
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 2px 12px #e6e6e6",
                padding: 48,
                margin: 0,
                marginBottom: 0,
              }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input value={user.email} disabled />
                  <div className="form-note">Email không thể thay đổi</div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button type="submit" className="profile-save-btn">
                Lưu thay đổi
              </button>
              {success && <span className="form-success">{success}</span>}
            </form>
          )}
          {tab === "orders" && (
            <div
              style={{
                width: "100%",
                background: "#f8fefd",
                borderRadius: 16,
                boxShadow: "0 2px 12px #e6e6e6",
                padding: 32,
                margin: 0,
                marginBottom: 0,
              }}
            >
              <div className="orders-section" style={{ gap: 32 }}>
                {/* Ô tìm kiếm đơn đăng ký */}
                <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo mã đơn hoặc loại xét nghiệm..."
                    value={searchOrder}
                    onChange={e => setSearchOrder(e.target.value)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "1px solid #cce3d3",
                      fontSize: 16,
                      width: 340,
                      background: "#fff",
                      outline: "none"
                    }}
                  />
                  <NewOrderButton />
                </div>
                <div
                  className="orders-filter"
                  style={{ display: "flex", gap: 40, marginBottom: 32 }}
                >
                  <span
                    className={filterStatus === "Tất cả" ? "active" : ""}
                    style={{
                      color: filterStatus === "Tất cả" ? "#009e74" : "#888",
                      fontWeight: filterStatus === "Tất cả" ? 600 : 500,
                      borderBottom:
                        filterStatus === "Tất cả"
                          ? "2px solid #009e74"
                          : "none",
                      paddingBottom: 4,
                      cursor: "pointer",
                    }}
                    onClick={() => setFilterStatus("Tất cả")}
                  >
                    Tất cả
                  </span>
                  <span
                    className={filterStatus === "Chờ xử lý" ? "active" : ""}
                    style={{
                      color: filterStatus === "Chờ xử lý" ? "#009e74" : "#888",
                      fontWeight: filterStatus === "Chờ xử lý" ? 600 : 500,
                      borderBottom:
                        filterStatus === "Chờ xử lý"
                          ? "2px solid #009e74"
                          : "none",
                      paddingBottom: 4,
                      cursor: "pointer",
                    }}
                    onClick={() => setFilterStatus("Chờ xử lý")}
                  >
                    Chờ xử lý
                  </span>
                  <span
                    className={filterStatus === "Đang xử lý" ? "active" : ""}
                    style={{
                      color: filterStatus === "Đang xử lý" ? "#009e74" : "#888",
                      fontWeight: filterStatus === "Đang xử lý" ? 600 : 500,
                      borderBottom:
                        filterStatus === "Đang xử lý"
                          ? "2px solid #009e74"
                          : "none",
                      paddingBottom: 4,
                      cursor: "pointer",
                    }}
                    onClick={() => setFilterStatus("Đang xử lý")}
                  >
                    Đang xử lý
                  </span>
                  <span
                    className={filterStatus === "Hoàn thành" ? "active" : ""}
                    style={{
                      color: filterStatus === "Hoàn thành" ? "#009e74" : "#888",
                      fontWeight: filterStatus === "Hoàn thành" ? 600 : 500,
                      borderBottom:
                        filterStatus === "Hoàn thành"
                          ? "2px solid #009e74"
                          : "none",
                      paddingBottom: 4,
                      cursor: "pointer",
                    }}
                    onClick={() => setFilterStatus("Hoàn thành")}
                  >
                    Hoàn thành
                  </span>
                </div>
                {userOrders.filter(
                  (order) =>
                    filterStatus === "Tất cả" || order.status === filterStatus
                ).length === 0 && (
                  <div
                    style={{
                      color: "#888",
                      fontSize: 18,
                      textAlign: "center",
                      margin: "32px 0",
                    }}
                  >
                    Chưa có đơn đăng ký nào.
                  </div>
                )}
                {userOrders
                  .filter(
                    (order) =>
                      (filterStatus === "Tất cả" || order.status === filterStatus) &&
                      (searchOrder.trim() === "" ||
                        order.id.toLowerCase().includes(searchOrder.trim().toLowerCase()) ||
                        (order.type && order.type.toLowerCase().includes(searchOrder.trim().toLowerCase()))
                      )
                  )
                  .map((order) => (
                    <div
                      key={order.id}
                      className="order-card"
                      style={{
                        background: "#f6fefd",
                        borderRadius: 12,
                        boxShadow: "0 1px 8px #e6e6e6",
                        padding: 24,
                        marginBottom: 32,
                        display: "flex",
                        flexDirection: "column",
                        gap: 16
                      }}
                    >
                      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                        <div className="order-info" style={{ flex: 1 }}>
                          <div
                            className="order-id"
                            style={{
                              fontWeight: 600,
                              fontSize: 18,
                              marginBottom: 8,
                            }}
                          >
                            Mã đơn đăng ký:{" "}
                            <span
                              className="order-id-highlight"
                              style={{ color: "#009e74", fontWeight: 700 }}
                            >
                              #{order.id}
                            </span>
                            <span
                              style={{
                                marginLeft: 16,
                                padding: "2px 12px",
                                borderRadius: 8,
                                background:
                                  order.status === "Hoàn thành"
                                    ? "#c6f6d5"
                                    : order.status === "Chờ xử lý"
                                    ? "#ffe6b0"
                                    : "#e6f7f1",
                                color:
                                  order.status === "Hoàn thành"
                                    ? "#009e74"
                                    : order.status === "Chờ xử lý"
                                    ? "#b88900"
                                    : "#009e74",
                                fontWeight: 600,
                                fontSize: 14,
                                display: "inline-flex",
                                alignItems: "center",
                                whiteSpace: "nowrap",
                                minWidth: 80,
                                maxWidth: 120,
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                              }}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="order-type" style={{ marginBottom: 8 }}>
                            {order.type}
                          </div>
                          <div style={{ color: '#888', fontSize: 15, marginBottom: 2 }}>
                            <b>Thể loại:</b> {order.category === 'civil' ? 'Dân sự' : order.category === 'admin' ? 'Hành chính' : order.category}
                          </div>
                          <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>
                            <b>Hình thức thu mẫu:</b> {getSampleMethodLabel(order.sampleMethod)}
                          </div>
                          <div
                            className="order-date"
                            style={{ color: "#888", fontSize: 15 }}
                          >
                            Ngày đăng ký: {order.date}
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 10,
                          alignItems: 'stretch',
                          minWidth: 200,
                        }}>
                          <button
                            className="order-btn"
                            style={{
                              border: "1px solid #16a34a",
                              color: "#16a34a",
                              background: "#fff",
                              borderRadius: 10,
                              padding: "10px 24px",
                              fontWeight: 600,
                              fontSize: 16,
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              width: '100%',
                              height: 48,
                              transition: "border 0.2s, color 0.2s, background 0.2s",
                              outline: "none",
                              cursor: "pointer",
                            }}
                            onMouseOver={e => {
                              e.currentTarget.style.background = "#e6f7ef";
                              e.currentTarget.style.color = "#15803d";
                              e.currentTarget.style.border = "1px solid #15803d";
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.background = "#fff";
                              e.currentTarget.style.color = "#16a34a";
                              e.currentTarget.style.border = "1px solid #16a34a";
                            }}
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDetailModal(true);
                            }}
                          >
                            <Eye size={20} style={{ marginRight: 6 }} /> Xem chi tiết
                          </button>
                          <button
                            className="order-btn"
                            style={{
                              border: "1px solid #2563eb",
                              color: "#2563eb",
                              background: "#fff",
                              borderRadius: 10,
                              padding: "10px 24px",
                              fontWeight: 600,
                              fontSize: 16,
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              width: '100%',
                              height: 48,
                              transition: "border 0.2s, color 0.2s, background 0.2s",
                              outline: "none",
                              cursor: "pointer"
                            }}
                            onMouseOver={e => {
                              e.currentTarget.style.background = "#e0edff";
                              e.currentTarget.style.color = "#1d4ed8";
                              e.currentTarget.style.border = "1px solid #1d4ed8";
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.background = "#fff";
                              e.currentTarget.style.color = "#2563eb";
                              e.currentTarget.style.border = "1px solid #2563eb";
                            }}
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowResultModal(true);
                            }}
                          >
                            <FileText size={20} style={{ marginRight: 6 }} /> Xem kết quả
                          </button>
                          {order.category === 'civil' && (
                            <button
                              style={{
                                border: "1px solid #bbb",
                                color: "#444",
                                background: "#fff",
                                borderRadius: 10,
                                padding: "10px 24px",
                                fontWeight: 600,
                                fontSize: 16,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                width: '100%',
                                height: 48,
                                transition: "border 0.2s, color 0.2s, background 0.2s",
                                outline: "none",
                                cursor: "pointer"
                              }}
                              onClick={() => {
                                setSelectedOrderForForm(order);
                                setShowFormModal(true);
                              }}
                            >
                              <FileText size={20} style={{ marginRight: 6 }} /> Nhập form
                            </button>
                          )}
                          <button
                            className="order-btn"
                            style={{
                              border: "none",
                              color: "#fff",
                              background: "#fbbf24",
                              borderRadius: 10,
                              padding: "10px 24px",
                              fontWeight: 600,
                              fontSize: 16,
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              width: '100%',
                              height: 48,
                              transition: "background 0.2s, color 0.2s",
                              outline: "none",
                              cursor:
                                order.status === "Có kết quả" || order.status === "Hoàn thành"
                                  ? "pointer"
                                  : "not-allowed",
                              opacity:
                                order.status === "Có kết quả" || order.status === "Hoàn thành"
                                  ? 1
                                  : 0.6,
                            }}
                            disabled={
                              !(
                                order.status === "Có kết quả" ||
                                order.status === "Hoàn thành"
                              )
                            }
                            onMouseOver={e => {
                              if (order.status === "Có kết quả" || order.status === "Hoàn thành")
                                e.currentTarget.style.background = "#f59e1b";
                            }}
                            onMouseOut={e => {
                              if (order.status === "Có kết quả" || order.status === "Hoàn thành")
                                e.currentTarget.style.background = "#fbbf24";
                            }}
                            onClick={() => {
                              if (order.status === "Có kết quả" || order.status === "Hoàn thành") {
                                setFeedbackOrder(order);
                                setCategoryRatings({
                                  quality: 0,
                                  price: 0,
                                  time: 0,
                                  staff: 0,
                                  website: 0,
                                  overall: 0
                                });
                                setFeedbackInput("");
                                setFeedbackSuccess("");
                                setShowFeedbackModal(true);
                              }
                            }}
                          >
                            <Star size={20} style={{ marginRight: 6 }} /> Đánh giá
                          </button>
                          {order.sampleMethod === "home" && order.kitStatus === "da_gui" && (
                            <button
                              style={{
                                marginTop: 4,
                                border: "1px solid #009e74",
                                color: "#fff",
                                background: "#009e74",
                                borderRadius: 10,
                                padding: "10px 24px",
                                fontWeight: 600,
                                fontSize: 16,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                width: '100%',
                                height: 48,
                                transition: "background 0.2s, color 0.2s",
                                outline: "none",
                                cursor: "pointer",
                                justifyContent: 'center',
                              }}
                              onClick={() => handleUserConfirmKit(order)}
                            >
                              Xác nhận đã nhận kit
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Nút ẩn/hiện timeline */}
                      <button
                        style={{
                          background: showTimeline[order.id] ? "#e6f7f1" : "#fff",
                          color: "#009e74",
                          border: "1px solid #009e74",
                          borderRadius: 8,
                          padding: "6px 18px",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: 15,
                          alignSelf: "center",
                          width: "auto"
                        }}
                        onClick={() => setShowTimeline(prev => ({ ...prev, [order.id]: !prev[order.id] }))}
                      >
                        {showTimeline[order.id] ? "Ẩn timeline" : "Xem tiến độ & timeline xử lý"}
                      </button>
                      {showTimeline[order.id] && (
                        <TimelineProgress order={order} />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
          {tab === "settings" && (
            <div
              style={{
                width: "100%",
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 2px 12px #e6e6e6",
                padding: 48,
                margin: 0,
                marginBottom: 0,
              }}
            >
              <form
                className="change-password-form"
                onSubmit={pwStep === 1 ? handleSendOtp : handleVerifyOtp}
              >
                <div className="form-title">Thay đổi mật khẩu</div>
                {pwStep === 1 ? (
                  <>
                    <div className="form-group password-group">
                      <label>Mật khẩu hiện tại</label>
                      <input
                        type={showPw.current ? "text" : "password"}
                        name="current"
                        value={pwForm.current}
                        onChange={handlePwChange}
                        required
                        style={{ paddingRight: 40 }}
                      />
                      <button
                        className="absolute top-10 inset-y-0 right-0 pr-3 flex items-center  transition-colors"
                        onClick={() =>
                          setShowPw((p) => ({ ...p, current: !p.current }))
                        }
                        tabIndex={0}
                        aria-label={
                          showPw.current ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                      >
                        {showPw.current ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <div className="form-group password-group">
                      <label>Mật khẩu mới</label>
                      <input
                        type={showPw.new ? "text" : "password"}
                        name="new"
                        value={pwForm.new}
                        onChange={handlePwChange}
                        required
                        style={{ paddingRight: 40 }}
                      />
                      <button
                        className="absolute top-10 inset-y-0 right-0 pr-3 flex items-center  transition-colors"
                        onClick={() =>
                          setShowPw((p) => ({ ...p, new: !p.new }))
                        }
                        tabIndex={0}
                        aria-label={
                          showPw.new ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                      >
                        {showPw.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="form-group password-group">
                      <label>Xác nhận mật khẩu mới</label>
                      <input
                        type={showPw.confirm ? "text" : "password"}
                        name="confirm"
                        value={pwForm.confirm}
                        onChange={handlePwChange}
                        required
                        style={{ paddingRight: 40 }}
                      />
                      <button
                        className="absolute top-10 inset-y-0 right-0 pr-3 flex items-center  transition-colors"
                        onClick={() =>
                          setShowPw((p) => ({ ...p, confirm: !p.confirm }))
                        }
                        tabIndex={0}
                        aria-label={
                          showPw.confirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                      >
                        {showPw.confirm ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <button className="submit-button" type="submit">
                      Gửi mã xác thực
                    </button>
                    {pwMsg && (
                      <div
                        className={`form-msg${
                          pwMsg.includes("thành công") ? " success" : " error"
                        }`}
                      >
                        {pwMsg}
                      </div>
                    )}
                    {otpSent && (
                      <div className="otp-demo">
                        Mã xác thực (giả lập gửi email): <b>{otpSent}</b>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Nhập mã xác thực đã gửi về email</label>
                      <input
                        type="text"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        required
                      />
                    </div>
                    <button className="submit-button" type="submit">
                      Xác nhận đổi mật khẩu
                    </button>
                    {pwMsg && (
                      <div
                        className={`form-msg${
                          pwMsg.includes("thành công") ? " success" : " error"
                        }`}
                      >
                        {pwMsg}
                      </div>
                    )}
                  </>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
      {/* Modal xác nhận đăng xuất */}
      <Modal
        open={showLogoutModal}
        onOk={() => {
          logout();
          setShowLogoutModal(false);
          navigate("/");
        }}
        onCancel={() => setShowLogoutModal(false)}
        okText="Đăng xuất"
        cancelText="Hủy"
        title="Xác nhận đăng xuất"
        okButtonProps={{
          style: {
            background: "#e74c3c",
            borderColor: "#e74c3c",
            color: "#fff",
          },
          className: "custom-logout-btn",
        }}
      >
        <p>Bạn có chắc muốn đăng xuất không?</p>
      </Modal>
      {/* Modal feedback */}
      {showFeedbackModal &&
        feedbackOrder &&
        (feedbackOrder.status === "Hoàn thành" ||
          feedbackOrder.status === "Có kết quả") && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.18)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowFeedbackModal(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                width: "90%",
                maxWidth: 650,
                padding: 40,
                boxShadow: "0 8px 32px #0002",
                position: "relative",
                fontSize: 17,
                maxHeight: "85vh", 
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <style>{`
                /* Custom scrollbar styling */
                .feedback-modal-content::-webkit-scrollbar {
                  width: 10px;
                  background-color: #f5f5f5;
                  border-radius: 5px;
                }
                
                .feedback-modal-content::-webkit-scrollbar-thumb {
                  background-color: #00a67e;
                  border-radius: 5px;
                  border: 2px solid #f5f5f5;
                }
                
                .feedback-modal-content::-webkit-scrollbar-track {
                  background-color: #f5f5f5;
                  border-radius: 5px;
                }

                .category-selector {
                  display: flex;
                  justify-content: center;
                  margin-bottom: 25px;
                  flex-wrap: wrap;
                  gap: 10px;
                }
                
                .category-btn {
                  padding: 8px 16px;
                  border-radius: 20px;
                  font-size: 15px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.2s;
                  border: 2px solid transparent;
                }
                
                .category-btn.active {
                  background: #f0f9f6;
                  color: #009e74;
                  border-color: #009e74;
                  box-shadow: 0 2px 8px rgba(0, 158, 116, 0.15);
                }
                
                .category-btn:not(.active) {
                  background: #f5f5f5;
                  color: #555;
                  border-color: transparent;
                }
                
                .category-btn:hover:not(.active) {
                  background: #e9e9e9;
                }
                
                .star-rating-container {
                  display: flex;
                  justify-content: center;
                  margin: 25px 0;
                  gap: 10px;
                }
              `}</style>
              <div className="feedback-modal-content" style={{ maxHeight: "calc(85vh - 80px)", overflowY: "auto", paddingRight: 15 }}>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 18,
                    background: "none",
                    border: "none",
                    fontSize: 26,
                    color: "#888",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
                <h3
                  style={{
                    fontWeight: 800,
                    fontSize: 26,
                    marginBottom: 24,
                    color: "#b88900",
                    letterSpacing: -1,
                    textAlign: "center",
                  }}
                >
                  Đánh giá dịch vụ
                </h3>
                
                {/* Category selector */}
                <div className="category-selector">
                  <button 
                    className={`category-btn ${selectedCategory === 'quality' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('quality')}
                  >
                    Chất lượng dịch vụ
                  </button>
                  <button 
                    className={`category-btn ${selectedCategory === 'price' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('price')}
                  >
                    Giá cả
                  </button>
                  <button 
                    className={`category-btn ${selectedCategory === 'time' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('time')}
                  >
                    Thời gian xử lý
                  </button>
                  <button 
                    className={`category-btn ${selectedCategory === 'staff' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('staff')}
                  >
                    Nhân viên
                  </button>
                  <button 
                    className={`category-btn ${selectedCategory === 'website' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('website')}
                  >
                    Website
                  </button>
                  <button 
                    className={`category-btn ${selectedCategory === 'overall' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('overall')}
                  >
                    Tổng thể
                  </button>
                </div>
                
                {/* Star rating for selected category */}
                <div className="star-rating-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={36}
                      color={categoryRatings[selectedCategory] >= star ? "#ffc107" : "#ddd"}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setCategoryRatings({
                          ...categoryRatings,
                          [selectedCategory]: star
                        });
                      }}
                    />
                  ))}
                  <span style={{ color: "#888", fontSize: 16, marginLeft: 8, minWidth: 35 }}>
                    {categoryRatings[selectedCategory] > 0 ? `${categoryRatings[selectedCategory]}/5` : ""}
                  </span>
                </div>
                
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 17 }}>Nhận xét của bạn</div>
                <textarea
                  rows={4}
                  placeholder="Nhận xét của bạn về dịch vụ..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    margin: "8px 0 16px",
                    padding: 12,
                    border: "1px solid #ccc",
                    fontSize: 16,
                  }}
                />
                <button
                  onClick={() => {
                    if (Object.values(categoryRatings).every(rating => rating === 0)) {
                      setFeedbackSuccess("Vui lòng đánh giá ít nhất một danh mục!");
                      return;
                    }
                    // Calculate average rating or use overall rating
                    const finalRating = categoryRatings.overall || 
                      Math.round(Object.values(categoryRatings).reduce((sum, val) => sum + val, 0) / 
                      Object.values(categoryRatings).filter(val => val > 0).length);
                    
                    addFeedback(feedbackOrder.id, feedbackInput, finalRating, categoryRatings);
                    setShowFeedbackModal(false);
                    setFeedbackSuccess("Cảm ơn bạn đã đánh giá!");
                    setTimeout(() => setFeedbackSuccess(""), 2000);
                  }}
                  style={{
                    background: "#009e74",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 24px",
                    fontWeight: 700,
                    cursor: "pointer",
                    width: "100%",
                    marginTop: 8,
                    fontSize: 16,
                  }}
                >
                  Gửi đánh giá
                </button>
                {feedbackSuccess && (
                  <div
                    style={{
                      color: "#009e74",
                      marginTop: 6,
                      textAlign: "center",
                    }}
                  >
                    {feedbackSuccess}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      {showDetailModal && selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.18)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowDetailModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              minWidth: 340,
              maxWidth: 480,
              maxHeight: "90vh",
              padding: 32,
              boxShadow: "0 8px 32px #0002",
              position: "relative",
              fontSize: 17,
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDetailModal(false)}
              style={{
                position: "absolute",
                top: 14,
                right: 18,
                background: "none",
                border: "none",
                fontSize: 26,
                color: "#888",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <h3
              style={{
                fontWeight: 800,
                fontSize: 26,
                marginBottom: 18,
                color: "#009e74",
                letterSpacing: -1,
                textAlign: "center",
              }}
            >
              Chi tiết đơn đăng ký
            </h3>
            <div style={{ borderTop: "1px solid #e6e6e6", marginBottom: 18 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <span style={{ fontWeight: 700, color: "#009e74" }}>
                  Mã đơn:
                </span>{" "}
                <span style={{ color: "#009e74", fontWeight: 700 }}>
                  #{selectedOrder.id}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Trạng thái:</span>{" "}
                <span>{selectedOrder.status}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Loại dịch vụ:</span>{" "}
                <span>{selectedOrder.type}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Thể loại:</span>{" "}
                <span>{selectedOrder.category === 'civil' ? 'Dân sự' : selectedOrder.category === 'admin' ? 'Hành chính' : selectedOrder.category}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Hình thức thu mẫu:</span>{" "}
                <span>{getSampleMethodLabel(selectedOrder.sampleMethod)}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Ngày đăng ký:</span>{" "}
                <span>{selectedOrder.date}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Họ tên:</span>{" "}
                <span>{selectedOrder.name}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Số điện thoại:</span>{" "}
                <span>{selectedOrder.phone}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Email:</span>{" "}
                <span>{selectedOrder.email}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Địa chỉ:</span>{" "}
                <span>{selectedOrder.address}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Ngày xét nghiệm:</span>{" "}
                <span>{selectedOrder.appointmentDate}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Ghi chú:</span>{" "}
                <span>{selectedOrder.note}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal xem kết quả (chỉ kết quả và file kết quả) */}
      {showResultModal && selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.18)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowResultModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              minWidth: 340,
              maxWidth: 480,
              maxHeight: "90vh",
              padding: 32,
              boxShadow: "0 8px 32px #0002",
              position: "relative",
              fontSize: 17,
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowResultModal(false)}
              style={{
                position: "absolute",
                top: 14,
                right: 18,
                background: "none",
                border: "none",
                fontSize: 26,
                color: "#888",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <h3
              style={{
                fontWeight: 800,
                fontSize: 26,
                marginBottom: 18,
                color: "#009e74",
                letterSpacing: -1,
                textAlign: "center",
              }}
            >
              Kết quả xét nghiệm
            </h3>
            <div style={{ borderTop: "1px solid #e6e6e6", marginBottom: 18 }} />
            <div style={{ margin: "10px 0" }}>
              {selectedOrder.result ? (
                <div
                  style={{
                    background: "#f6f8fa",
                    border: "1px solid #cce3d3",
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedOrder.result,
                    }}
                  />
                </div>
              ) : (
                <span style={{ color: "#888" }}>Chưa có bảng kết quả.</span>
              )}
            </div>
          </div>
        </div>
      )}
      {showFormModal && selectedOrderForForm && selectedOrderForForm.category === 'civil' && (
        <RequestFormModal open={showFormModal} onClose={() => setShowFormModal(false)} order={selectedOrderForForm} category={selectedOrderForForm.category} />
      )}
      {/* Modal xác nhận nhận kit */}
      <Modal
        title={
          <span style={{ fontWeight: 800, fontSize: 20, color: '#009e74', letterSpacing: 0.5 }}>
            Xác nhận đã nhận kit cho đơn #{kitInfo?.id}
          </span>
        }
        open={showConfirmKitModal}
        onOk={handleUserConfirmKitOk}
        onCancel={() => setShowConfirmKitModal(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        bodyStyle={{
          padding: 32,
          borderRadius: 16,
          background: '#f8fefd',
          boxShadow: '0 4px 32px #00a67e22',
          border: '1px solid #e0f7ef',
          fontFamily: 'Segoe UI, Arial, sans-serif',
          fontSize: 17,
          color: '#222',
          minWidth: 340,
          maxWidth: 420,
          margin: '0 auto',
        }}
        okButtonProps={{
          style: {
            background: '#009e74',
            borderColor: '#009e74',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 8,
            minWidth: 120,
            outline: 'none',
          },
          className: 'kit-confirm-btn',
        }}
      >
        <style>{`
          .kit-confirm-btn {
            background: #009e74 !important;
            border-color: #009e74 !important;
            color: #fff !important;
            font-weight: 700;
            font-size: 16px;
            border-radius: 8px;
            min-width: 120px;
            transition: background 0.2s;
            outline: none;
            box-shadow: none !important;
          }
          .kit-confirm-btn:hover {
            background: #00c896 !important;
            border-color: #00c896 !important;
            box-shadow: none !important;
            filter: brightness(1.08);
          }
        `}</style>
        {kitInfo && (
          <div style={{ lineHeight: 2, padding: 8, borderRadius: 12, background: '#fff', boxShadow: '0 1px 8px #e0f7ef', border: '1px solid #e0f7ef', maxWidth: 420, margin: '0 auto' }}>
            <div style={{ fontWeight: 600, color: '#009e74', fontSize: 17 }}><b>Mã kit:</b> <span style={{ color: '#222' }}>{kitInfo.kitId}</span></div>
            <div><b>Ngày giờ hẹn:</b> <span style={{ color: '#222' }}>{kitInfo.scheduledDate || "-"}</span></div>
            <div><b>Nhân viên phụ trách:</b> <span style={{ color: '#222' }}>{kitInfo.samplerName || "-"}</span></div>
            <div><b>Ghi chú:</b> <span style={{ color: '#222' }}>{kitInfo.notes || "-"}</span></div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default UserProfile;
