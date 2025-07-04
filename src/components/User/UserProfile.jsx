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
import { Modal, message, Tag } from "antd";
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
  const { getAllOrders, addFeedback, updateOrder } = useOrderContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",
    birthDate: user?.birthDate || "",
    gender: user?.gender || "Nam",
    fingerIdFile: user?.fingerIdFile || null,
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

  // State cho đánh giá tổng thể
  const [overallRating, setOverallRating] = useState(0);

  const [_showFormModal] = useState(false); // placeholder, feature disabled
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
    window.addEventListener("storage", (event) => {
      if (event.key === "dna_orders") {
        loadUserOrders();
      }
    });

    // Cleanup function
    return () => {
      window.removeEventListener("storage", () => { });
    };
  }, [user, getAllOrders]);

  if (!user)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Bạn cần đăng nhập để xem trang này.
      </div>
    );

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
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
    if (!kitInfo) return;
    // Cập nhật kitStatus và trạng thái đơn
    updateOrder(kitInfo.id, {
      kitStatus: "da_nhan",
      status: "Đã nhận mẫu",
    });

    setShowConfirmKitModal(false);
    message.success("Bạn đã xác nhận nhận kit thành công!");
  };

  // Thêm hàm chuyển đổi trạng thái sang tiếng Việt cho user
  const getStatusText = (status, sampleMethod) => {
    // Luồng lấy mẫu tại nhà
    if (sampleMethod === "home") {
      if (status === "PENDING_CONFIRM") return "Chờ xác nhận";
      if (status === "CONFIRMED") return "Đã xác nhận";
      if (status === "KIT_SENT") return "Đã gửi kit";
      if (status === "SAMPLE_RECEIVED" || status === "PROCESSING" || status === "WAITING_APPROVAL") return "Đang xử lý";
      if (status === "COMPLETED") return "Đã có kết quả";
      if (status === "REJECTED") return "Đang xử lý";
    }
    // ... fallback cho các trường hợp khác ...
    switch (status) {
      case "PENDING":
      case "PENDING_CONFIRM":
        return "Chờ xử lý";
      case "PROCESSING":
        return "Đang xử lý";
      case "WAITING_APPROVAL":
        return "Chờ xác thực";
      case "COMPLETED":
        return "Hoàn thành";
      case "REJECTED":
        return "Từ chối";
      default:
        return status;
    }
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
              <div className="form-row">
                <div className="form-group">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={form.birthDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Giới tính</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tải file FingerID</label>
                  <input
                    type="file"
                    name="fingerIdFile"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleChange}
                  />
                  {form.fingerIdFile &&
                    (typeof form.fingerIdFile === "string" ? (
                      <div style={{ marginTop: 6 }}>
                        <a
                          href={form.fingerIdFile}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem file đã tải lên
                        </a>
                      </div>
                    ) : (
                      <div style={{ marginTop: 6 }}>
                        {form.fingerIdFile.name}
                      </div>
                    ))}
                </div>
              </div>
              <button type="submit" className="profile-save-btn">
                Lưu thay đổi
              </button>
              {success && <span className="form-success">{success}</span>}
            </form>
          )}
          {tab === "orders" && userOrders.length === 0 ? (
            <div
              style={{
                width: "100%",
                padding: 64,
                textAlign: "center",
                color: "#888",
                fontSize: 22,
              }}
            >
              Chưa có thông tin đơn.
            </div>
          ) : (
            tab === "orders" && (
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
                  <div
                    style={{
                      marginBottom: 24,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo mã đơn hoặc loại xét nghiệm..."
                      value={searchOrder}
                      onChange={(e) => setSearchOrder(e.target.value)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 8,
                        border: "1px solid #cce3d3",
                        fontSize: 16,
                        width: 340,
                        background: "#fff",
                        outline: "none",
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
                        color:
                          filterStatus === "Chờ xử lý" ? "#009e74" : "#888",
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
                      className={filterStatus === "Đã xác nhận" ? "active" : ""}
                      style={{
                        color:
                          filterStatus === "Đã xác nhận" ? "#009e74" : "#888",
                        fontWeight: filterStatus === "Đã xác nhận" ? 600 : 500,
                        borderBottom:
                          filterStatus === "Đã xác nhận"
                            ? "2px solid #009e74"
                            : "none",
                        paddingBottom: 4,
                        cursor: "pointer",
                      }}
                      onClick={() => setFilterStatus("Đã xác nhận")}
                    >
                      Đã xác nhận
                    </span>
                    <span
                      className={filterStatus === "Đang xử lý" ? "active" : ""}
                      style={{
                        color:
                          filterStatus === "Đang xử lý" ? "#009e74" : "#888",
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
                      className={filterStatus === "Có kết quả" ? "active" : ""}
                      style={{
                        color:
                          filterStatus === "Có kết quả" ? "#009e74" : "#888",
                        fontWeight: filterStatus === "Có kết quả" ? 600 : 500,
                        borderBottom:
                          filterStatus === "Có kết quả"
                            ? "2px solid #009e74"
                            : "none",
                        paddingBottom: 4,
                        cursor: "pointer",
                      }}
                      onClick={() => setFilterStatus("Có kết quả")}
                    >
                      Có kết quả
                    </span>
                  </div>
                  {userOrders.filter(
                    (order) =>
                      filterStatus === "Tất cả" ||
                      (filterStatus === "Đã xác nhận" &&
                        (order.status === "Xác nhận" ||
                          order.appointmentStatus === "Xác nhận" ||
                          ((order.status === "CONFIRMED" ||
                            order.appointmentStatus === "CONFIRMED") &&
                            order.appointmentDate) ||
                          (order.sampleMethod === "home" &&
                            order.kitStatus === "da_nhan"))) ||
                      (filterStatus === "Có kết quả" &&
                        (order.result || order.status === "COMPLETED")) ||
                      order.status === filterStatus
                  ).length === 0 && (
                      <div
                        style={{
                          color: "#888",
                          fontSize: 18,
                          textAlign: "center",
                          margin: "32px 0",
                        }}
                      >
                        Chưa có thông tin đơn.
                      </div>
                    )}
                  {userOrders
                    .filter(
                      (order) =>
                        (filterStatus === "Tất cả" ||
                          (filterStatus === "Đã xác nhận" &&
                            (order.status === "Xác nhận" ||
                              order.appointmentStatus === "Xác nhận" ||
                              ((order.status === "CONFIRMED" ||
                                order.appointmentStatus === "CONFIRMED") &&
                                order.appointmentDate) ||
                              (order.sampleMethod === "home" &&
                                order.kitStatus === "da_nhan"))) ||
                          (filterStatus === "Có kết quả" &&
                            (order.result || order.status === "COMPLETED")) ||
                          order.status === filterStatus) &&
                        (searchOrder.trim() === "" ||
                          order.id
                            .toLowerCase()
                            .includes(searchOrder.trim().toLowerCase()) ||
                          (order.type &&
                            order.type
                              .toLowerCase()
                              .includes(searchOrder.trim().toLowerCase())))
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
                          gap: 16,
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 20,
                          }}
                        >
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
                                    order.status === "Hoàn thành" ||
                                      order.appointmentStatus === "Xác nhận" ||
                                      order.status === "Xác nhận"
                                      ? "#c6f6d5"
                                      : order.status === "Chờ xử lý"
                                        ? "#ffe6b0"
                                        : "#e6f7f1",
                                  color:
                                    order.status === "Hoàn thành" ||
                                      order.appointmentStatus === "Xác nhận" ||
                                      order.status === "Xác nhận"
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
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {getStatusText(
                                  order.status,
                                  order.sampleMethod
                                )}
                              </span>
                            </div>
                            <div
                              className="order-type"
                              style={{ marginBottom: 8 }}
                            >
                              {order.type}
                            </div>
                            <div
                              style={{
                                color: "#888",
                                fontSize: 15,
                                marginBottom: 2,
                              }}
                            >
                              <b>Thể loại:</b>{" "}
                              {order.category === "civil"
                                ? "Dân sự"
                                : order.category === "admin"
                                  ? "Hành chính"
                                  : order.category}
                            </div>
                            <div
                              style={{
                                color: "#888",
                                fontSize: 15,
                                marginBottom: 8,
                              }}
                            >
                              <b>Hình thức thu mẫu:</b>{" "}
                              {getSampleMethodLabel(order.sampleMethod)}
                            </div>
                            <div
                              className="order-date"
                              style={{ color: "#888", fontSize: 15 }}
                            >
                              Ngày đăng ký: {order.date}
                            </div>
                            {order.appointmentDate &&
                              order.sampleMethod === "center" && (
                                <div
                                  style={{
                                    background: "#e0edff",
                                    color: "#2563eb",
                                    fontWeight: 700,
                                    border: "1.5px solid #1d4ed8",
                                    borderRadius: 8,
                                    padding: "8px 18px",
                                    margin: "10px 0 0 0",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    fontSize: 17,
                                    gap: 8,
                                    boxShadow: "0 2px 8px #2563eb22",
                                  }}
                                >
                                  <span
                                    style={{ fontSize: 20, marginRight: 6 }}
                                  >
                                    <svg
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M7 2v2m10-2v2M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                                        stroke="#1d4ed8"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </span>
                                  Ngày lấy mẫu: {order.appointmentDate}
                                </div>
                              )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 10,
                              alignItems: "stretch",
                              minWidth: 200,
                            }}
                          >
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
                                width: "100%",
                                height: 48,
                                transition:
                                  "border 0.2s, color 0.2s, background 0.2s",
                                outline: "none",
                                cursor: "pointer",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = "#e6f7ef";
                                e.currentTarget.style.color = "#15803d";
                                e.currentTarget.style.border =
                                  "1px solid #15803d";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = "#fff";
                                e.currentTarget.style.color = "#16a34a";
                                e.currentTarget.style.border =
                                  "1px solid #16a34a";
                              }}
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowDetailModal(true);
                              }}
                            >
                              <Eye size={20} style={{ marginRight: 6 }} /> Xem
                              chi tiết
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
                                width: "100%",
                                height: 48,
                                transition:
                                  "border 0.2s, color 0.2s, background 0.2s",
                                outline: "none",
                                cursor: "pointer",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = "#e0edff";
                                e.currentTarget.style.color = "#1d4ed8";
                                e.currentTarget.style.border =
                                  "1px solid #1d4ed8";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = "#fff";
                                e.currentTarget.style.color = "#2563eb";
                                e.currentTarget.style.border =
                                  "1px solid #2563eb";
                              }}
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowResultModal(true);
                              }}
                            >
                              <FileText size={20} style={{ marginRight: 6 }} />{" "}
                              Xem kết quả
                            </button>
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
                                width: "100%",
                                height: 48,
                                transition: "background 0.2s, color 0.2s",
                                outline: "none",
                                cursor:
                                  order.status === "Có kết quả" ||
                                    order.status === "Hoàn thành"
                                    ? "pointer"
                                    : "not-allowed",
                                opacity:
                                  order.status === "Có kết quả" ||
                                    order.status === "Hoàn thành"
                                    ? 1
                                    : 0.6,
                              }}
                              disabled={
                                !(
                                  order.status === "Có kết quả" ||
                                  order.status === "Hoàn thành"
                                )
                              }
                              onMouseOver={(e) => {
                                if (
                                  order.status === "Có kết quả" ||
                                  order.status === "Hoàn thành"
                                )
                                  e.currentTarget.style.background = "#f59e1b";
                              }}
                              onMouseOut={(e) => {
                                if (
                                  order.status === "Có kết quả" ||
                                  order.status === "Hoàn thành"
                                )
                                  e.currentTarget.style.background = "#fbbf24";
                              }}
                              onClick={() => {
                                if (
                                  order.status === "Có kết quả" ||
                                  order.status === "Hoàn thành"
                                ) {
                                  setFeedbackOrder(order);

                                  // Kiểm tra nếu đã đánh giá trước đó
                                  if (
                                    order.feedbacks &&
                                    order.feedbacks.length > 0
                                  ) {
                                    // Lấy đánh giá mới nhất
                                    const latestFeedback =
                                      order.feedbacks[
                                      order.feedbacks.length - 1
                                      ];
                                    setOverallRating(
                                      latestFeedback.rating || 0
                                    );
                                    setFeedbackInput(
                                      latestFeedback.feedback || ""
                                    );
                                  } else {
                                    // Chưa đánh giá, reset form
                                    setOverallRating(0);
                                    setFeedbackInput("");
                                  }

                                  setFeedbackSuccess("");
                                  setShowFeedbackModal(true);
                                }
                              }}
                            >
                              <Star size={20} style={{ marginRight: 6 }} /> Đánh
                              giá
                            </button>
                            {order.sampleMethod === "home" &&
                              (order.kitStatus === "da_gui" ||
                                order.kitStatus === "KIT_SENT") && (
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
                                    width: "100%",
                                    height: 48,
                                    transition: "background 0.2s, color 0.2s",
                                    outline: "none",
                                    cursor: "pointer",
                                    justifyContent: "center",
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
                            background: showTimeline[order.id]
                              ? "#e6f7f1"
                              : "#fff",
                            color: "#009e74",
                            border: "1px solid #009e74",
                            borderRadius: 8,
                            padding: "6px 18px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: 15,
                            alignSelf: "center",
                            width: "auto",
                          }}
                          onClick={() =>
                            setShowTimeline((prev) => ({
                              ...prev,
                              [order.id]: !prev[order.id],
                            }))
                          }
                        >
                          {showTimeline[order.id]
                            ? "Ẩn timeline"
                            : "Xem tiến độ & timeline xử lý"}
                        </button>
                        {showTimeline[order.id] && (
                          <TimelineProgress order={order} />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )
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
                        className={`form-msg${pwMsg.includes("thành công") ? " success" : " error"
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
                        className={`form-msg${pwMsg.includes("thành công") ? " success" : " error"
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
                {feedbackOrder.feedbacks && feedbackOrder.feedbacks.length > 0
                  ? "Đánh giá của bạn"
                  : "Đánh giá dịch vụ"}
              </h3>
              <p style={{ textAlign: "center" }}>
                {feedbackOrder.feedbacks && feedbackOrder.feedbacks.length > 0
                  ? "Bạn đã đánh giá dịch vụ này trước đó"
                  : "Bạn hãy đánh giá dịch vụ của chúng tôi"}
              </p>
              {/* Star rating tổng thể */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "25px 0",
                  gap: 10,
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={36}
                    color={overallRating >= star ? "#ffc107" : "#ddd"}
                    style={{
                      cursor:
                        feedbackOrder.feedbacks &&
                          feedbackOrder.feedbacks.length > 0
                          ? "default"
                          : "pointer",
                    }}
                    onClick={() => {
                      if (
                        !(
                          feedbackOrder.feedbacks &&
                          feedbackOrder.feedbacks.length > 0
                        )
                      ) {
                        setOverallRating(star);
                      }
                    }}
                  />
                ))}
                <span
                  style={{
                    color: "#888",
                    fontSize: 16,
                    marginLeft: 8,
                    minWidth: 35,
                  }}
                >
                  {overallRating > 0 ? `${overallRating}/5` : ""}
                </span>
              </div>
              <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 17 }}>
                Nhận xét của bạn
              </div>
              <textarea
                rows={4}
                placeholder="Nhận xét của bạn về dịch vụ..."
                value={feedbackInput}
                onChange={(e) => {
                  if (
                    !(
                      feedbackOrder.feedbacks &&
                      feedbackOrder.feedbacks.length > 0
                    )
                  ) {
                    setFeedbackInput(e.target.value);
                  }
                }}
                readOnly={
                  feedbackOrder.feedbacks && feedbackOrder.feedbacks.length > 0
                }
                style={{
                  width: "100%",
                  borderRadius: 8,
                  margin: "8px 0 16px",
                  padding: 12,
                  border: "1px solid #ccc",
                  fontSize: 16,
                  background:
                    feedbackOrder.feedbacks &&
                      feedbackOrder.feedbacks.length > 0
                      ? "#f6f8fa"
                      : "#fff",
                }}
              />
              {/* Nút đánh giá hoặc đóng tùy theo đã đánh giá hay chưa */}
              {feedbackOrder.feedbacks && feedbackOrder.feedbacks.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 16,
                  }}
                >
                  <div
                    style={{
                      background: "#f6f8fa",
                      border: "1px solid #e1e4e8",
                      borderRadius: 8,
                      padding: 12,
                      fontSize: 15,
                      color: "#666",
                      marginBottom: 16,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      Đánh giá vào ngày:{" "}
                      {
                        feedbackOrder.feedbacks[
                          feedbackOrder.feedbacks.length - 1
                        ].date
                      }
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (overallRating === 0) {
                      setFeedbackSuccess("Vui lòng chọn số sao!");
                      return;
                    }
                    addFeedback(
                      feedbackOrder.id,
                      feedbackInput,
                      overallRating,
                      { overall: overallRating }
                    );
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
              )}
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
              <button
                onClick={() => setShowFeedbackModal(false)}
                style={{
                  background:
                    feedbackOrder.feedbacks &&
                      feedbackOrder.feedbacks.length > 0
                      ? "#009e74"
                      : "#eee",
                  color:
                    feedbackOrder.feedbacks &&
                      feedbackOrder.feedbacks.length > 0
                      ? "#fff"
                      : "#666",
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
                {feedbackOrder.feedbacks && feedbackOrder.feedbacks.length > 0
                  ? "Đóng"
                  : "Hủy"}
              </button>
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
              {/* Mã đơn, Trạng thái, Thể loại lên đầu */}
              <div>
                <span style={{ fontWeight: 700, color: "#009e74" }}>
                  Mã đơn:
                </span>{" "}
                <span style={{ color: "#009e74", fontWeight: 700 }}>
                  #{selectedOrder.id}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{ fontWeight: 600, color: "#888", marginRight: 2 }}
                >
                  Trạng thái:
                </span>
                <Tag
                  color={(() => {
                    switch (
                    getStatusText(
                      selectedOrder.status,
                      selectedOrder.sampleMethod
                    )
                    ) {
                      case "Xác nhận":
                        return "#1890ff";
                      case "Hoàn thành":
                        return "#52c41a";
                      case "Chờ xử lý":
                        return "#fa8c16";
                      case "Từ chối":
                        return "#ff4d4f";
                      case "Đã nhận mẫu":
                        return "#52c41a";
                      default:
                        return "#bfbfbf";
                    }
                  })()}
                  style={{ fontWeight: 600, fontSize: 15 }}
                >
                  {getStatusText(
                    selectedOrder.status,
                    selectedOrder.sampleMethod
                  )}
                </Tag>
                <span style={{ fontWeight: 600, color: "#888", marginLeft: 8 }}>
                  Thể loại:
                </span>
                <Tag
                  color={
                    selectedOrder.category === "civil" ? "#722ed1" : "#36cfc9"
                  }
                  style={{ fontWeight: 600, fontSize: 15 }}
                >
                  {selectedOrder.category === "civil"
                    ? "Dân sự"
                    : selectedOrder.category === "admin"
                      ? "Hành chính"
                      : selectedOrder.category}
                </Tag>
              </div>
              {/* Thông tin người dùng */}
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
              {/* Divider giữa thông tin người dùng và đơn hàng */}
              <div
                style={{ borderTop: "1px solid #e6e6e6", margin: "12px 0" }}
              />
              {/* Thông tin đơn hàng còn lại */}
              <div>
                <span style={{ fontWeight: 600 }}>Hình thức thu mẫu:</span>{" "}
                <span>{getSampleMethodLabel(selectedOrder.sampleMethod)}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Ngày đăng ký:</span>{" "}
                <span>{selectedOrder.date}</span>
              </div>
              {selectedOrder.appointmentDate &&
                selectedOrder.sampleMethod === "center" && (
                  <div
                    style={{
                      background: "#e0edff",
                      color: "#2563eb",
                      fontWeight: 700,
                      border: "1.5px solid #1d4ed8",
                      borderRadius: 8,
                      padding: "8px 18px",
                      margin: "10px 0 0 0",
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: 17,
                      gap: 8,
                      boxShadow: "0 2px 8px #2563eb22",
                    }}
                  >
                    <span style={{ fontSize: 20, marginRight: 6 }}>
                      <svg
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 2v2m10-2v2M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                          stroke="#1d4ed8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Ngày lấy mẫu: {selectedOrder.appointmentDate}
                  </div>
                )}
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
              maxWidth: 800,
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
              {(() => {
                // Try to get the table data from either resultTableData or by parsing result
                let tableData = null;
                console.log("selectedOrder", selectedOrder);

                // First, try directly from resultTableData if it exists
                if (
                  selectedOrder.resultTableData &&
                  Array.isArray(selectedOrder.resultTableData)
                ) {
                  tableData = selectedOrder.resultTableData;
                }
                // If not found, try parsing from result string
                else if (
                  typeof selectedOrder.result === "string" &&
                  selectedOrder.result
                ) {
                  try {
                    const parsedData = JSON.parse(selectedOrder.result);
                    if (Array.isArray(parsedData)) {
                      tableData = parsedData;
                    }
                  } catch (err) {
                    // Not a JSON string or not an array, so we'll show as regular result later
                    console.error("Failed to parse result as JSON array:", err);
                  }
                }

                // Show table data if we have it
                if (tableData && tableData.length > 0) {
                  return (
                    <div>
                      <div
                        style={{
                          background: "#f6f8fa",
                          border: "1px solid #cce3d3",
                          borderRadius: 8,
                          padding: 12,
                          marginBottom: 16,
                          overflowX: "auto", // Add horizontal scroll if needed
                        }}
                      >
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                          }}
                        >
                          <thead>
                            <tr>
                              <th
                                style={{
                                  border: "1px solid #cce3d3",
                                  padding: "8px 12px",
                                  background: "#f0f9f6",
                                }}
                              >
                                STT
                              </th>
                              <th
                                style={{
                                  border: "1px solid #cce3d3",
                                  padding: "8px 12px",
                                  background: "#f0f9f6",
                                }}
                              >
                                Họ và tên
                              </th>
                              <th
                                style={{
                                  border: "1px solid #cce3d3",
                                  padding: "8px 12px",
                                  background: "#f0f9f6",
                                }}
                              >
                                Năm sinh
                              </th>
                              <th
                                style={{
                                  border: "1px solid #cce3d3",
                                  padding: "8px 12px",
                                  background: "#f0f9f6",
                                }}
                              >
                                Giới tính
                              </th>
                              <th
                                style={{
                                  border: "1px solid #cce3d3",
                                  padding: "8px 12px",
                                  background: "#f0f9f6",
                                }}
                              >
                                Mối quan hệ
                              </th>
                              <th
                                style={{
                                  border: "1px solid #cce3d3",
                                  padding: "8px 12px",
                                  background: "#f0f9f6",
                                }}
                              >
                                Loại mẫu
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(Array.isArray(tableData) ? tableData : []).map(
                              (row, index) => (
                                <tr key={row.key || `row-${index}`}>
                                  <td
                                    style={{
                                      border: "1px solid #cce3d3",
                                      padding: "8px 12px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {index + 1}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #cce3d3",
                                      padding: "8px 12px",
                                    }}
                                  >
                                    {row.name || ""}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #cce3d3",
                                      padding: "8px 12px",
                                    }}
                                  >
                                    {row.birthYear || ""}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #cce3d3",
                                      padding: "8px 12px",
                                    }}
                                  >
                                    {row.gender || ""}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #cce3d3",
                                      padding: "8px 12px",
                                    }}
                                  >
                                    {row.relationship || ""}
                                  </td>
                                  <td
                                    style={{
                                      border: "1px solid #cce3d3",
                                      padding: "8px 12px",
                                    }}
                                  >
                                    {row.sampleType || ""}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>

                      {selectedOrder.conclusion && (
                        <div
                          style={{
                            background: "#f6ffed",
                            border: "1px solid #b7eb8f",
                            padding: 16,
                            borderRadius: 6,
                          }}
                        >
                          <div style={{ fontWeight: 600, marginBottom: 8 }}>
                            Kết luận:
                          </div>
                          <div>{selectedOrder.conclusion}</div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Standard text result display
                if (
                  selectedOrder.result &&
                  typeof selectedOrder.result === "string"
                ) {
                  return (
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
                  );
                }

                // No results available
                return (
                  <div
                    style={{
                      background: "#fff7e6",
                      border: "1px solid #ffd591",
                      padding: 16,
                      borderRadius: 6,
                      textAlign: "center",
                      color: "#d48806",
                    }}
                  >
                    Chưa có kết quả xét nghiệm
                  </div>
                );
              })()}
            </div>

            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setShowResultModal(false)}
                style={{
                  background: "#009e74",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 24px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal xác nhận nhận kit */}
      <Modal
        title={
          <span
            style={{
              fontWeight: 800,
              fontSize: 20,
              color: "#009e74",
              letterSpacing: 0.5,
            }}
          >
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
          background: "#f8fefd",
          boxShadow: "0 4px 32px #00a67e22",
          border: "1px solid #e0f7ef",
          fontFamily: "Segoe UI, Arial, sans-serif",
          fontSize: 17,
          color: "#222",
          minWidth: 340,
          maxWidth: 420,
          margin: "0 auto",
        }}
        okButtonProps={{
          style: {
            background: "#009e74",
            borderColor: "#009e74",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 8,
            minWidth: 120,
            outline: "none",
          },
          className: "kit-confirm-btn",
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
          <div
            style={{
              lineHeight: 2,
              padding: 8,
              borderRadius: 12,
              background: "#fff",
              boxShadow: "0 1px 8px #e0f7ef",
              border: "1px solid #e0f7ef",
              maxWidth: 420,
              margin: "0 auto",
            }}
          >
            <div style={{ fontWeight: 600, color: "#009e74", fontSize: 17 }}>
              <b>Mã kit:</b>{" "}
              <span style={{ color: "#222" }}>{kitInfo.kitId}</span>
            </div>
            <div>
              <b>Ngày giờ hẹn:</b>{" "}
              <span style={{ color: "#222" }}>
                {kitInfo.scheduledDate || "-"}
              </span>
            </div>
            <div>
              <b>Nhân viên phụ trách:</b>{" "}
              <span style={{ color: "#222" }}>
                {kitInfo.samplerName || "-"}
              </span>
            </div>
            <div>
              <b>Ghi chú:</b>{" "}
              <span style={{ color: "#222" }}>{kitInfo.notes || "-"}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default UserProfile;
