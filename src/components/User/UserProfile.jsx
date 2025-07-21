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
// Import dayjs nếu chưa có
import dayjs from 'dayjs';

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
      window.removeEventListener("storage", () => {});
    };
  }, [user, getAllOrders]);

  // Khi mở modal feedback ở chế độ xem lại, nạp dữ liệu feedback gần nhất
  useEffect(() => {
    if (showFeedbackModal && selectedOrder && selectedOrder.feedbacks && selectedOrder.feedbacks.length > 0) {
      const lastFb = selectedOrder.feedbacks[selectedOrder.feedbacks.length - 1];
      setOverallRating(lastFb.rating || 0);
      setFeedbackInput(lastFb.feedback || "");
    }
  }, [showFeedbackModal, selectedOrder]);

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
    updateOrder(kitInfo.id, {
      status: "SAMPLE_RECEIVED",
      samplingStatus: "SAMPLE_RECEIVED",
      kitStatus: "SAMPLE_RECEIVED",
      updatedAt: new Date().toISOString(),
    });
    setShowConfirmKitModal(false);
    message.success("Bạn đã xác nhận đã nhận kit thành công!");
  };

  // Thêm hàm chuyển đổi trạng thái sang tiếng Việt cho user
  const getStatusText = (status) => {
    if (status === "Đang lấy mẫu" || status === "SAMPLE_COLLECTING") return "Đang xử lý";
    switch (status) {
      case "PENDING_CONFIRM":
        return "Chờ xác nhận";
      case "KIT_NOT_SENT":
        return "Chưa gửi kit";
      case "KIT_SENT":
        return "Đã gửi kit";
      case "SAMPLE_RECEIVED":
        return "Đã gửi mẫu";
      case "PROCESSING":
        return "Đang xử lý";
      case "COMPLETED":
        return "Đã có kết quả";
      case "WAITING_APPROVAL":
      case "CHO_XAC_THUC":
      case "Chờ xác thực":
      case "REJECTED":
      case "Từ chối":
        return "Đang xử lý";
      default:
        return status;
    }
  };

  const getDisplayStatus = (order) => {
    return (
      order.status ||
      order.samplingStatus ||
      order.kitStatus ||
      "PENDING_CONFIRM"
    );
  };

  // Hàm tải kết quả cho đơn hành chính
  const handleDownloadResult = (order) => {
    // Nếu đã có file PDF kết quả, có thể lấy link và window.open(link)
    // Ở đây tạm thời sẽ in modal kết quả dưới dạng PDF
    setSelectedOrder(order);
    setShowResultModal(true);
    setTimeout(() => {
      window.print();
    }, 500); // Đợi modal mở xong mới in
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
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                <button type="submit" className="profile-save-btn" style={{
                  background: '#009e74',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px 48px',
                  fontWeight: 700,
                  fontSize: 20,
                  boxShadow: '0 2px 12px #009e7422',
                  cursor: 'pointer',
                  transition: 'background 0.2s, box-shadow 0.2s',
                  margin: '0 auto',
                  display: 'block',
                }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#00c896';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = '#009e74';
                  }}
                >
                  Lưu thay đổi
                </button>
              </div>
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
                  {/* Thanh lọc trạng thái: cải thiện giao diện */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      margin: "24px 0 36px 0",
                      justifyContent: "flex-start",
                    }}
                  >
                    <label
                      htmlFor="statusFilter"
                      style={{
                        fontWeight: 700,
                        fontSize: 17,
                        color: "#009e74",
                        letterSpacing: 0.2,
                        marginRight: 8,
                      }}
                    >
                      Lọc theo trạng thái:
                    </label>
                    <select
                      id="statusFilter"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      style={{
                        padding: "10px 24px",
                        borderRadius: 12,
                        fontSize: 16,
                        border: "2px solid #009e74",
                        minWidth: 200,
                        background: "#f8fffc",
                        color: "#222",
                        fontWeight: 600,
                        boxShadow: "0 2px 8px #009e7422",
                        outline: "none",
                        transition: "border 0.2s, box-shadow 0.2s",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <option value="Tất cả">Tất cả</option>
                      <option value="Chờ xác nhận">Chờ xác nhận</option>
                      <option value="Chưa gửi kit">Chưa gửi kit</option>
                      <option value="Đã gửi kit">Đã gửi kit</option>
                      <option value="Đã gửi mẫu">Đã gửi mẫu</option>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đã hẹn">Đã hẹn</option>
                      <option value="Đã đến">Đã đến</option>
                      <option value="Đã có kết quả">Đã có kết quả</option>
                      <option value="Từ chối">Từ chối</option>
                    </select>
                  </div>
                  {(() => {
                    const filteredOrders = userOrders
                      .filter((order) => {
                        if (filterStatus === "Tất cả") return true;
                        if (filterStatus === "Có kết quả") {
                          return (
                            getStatusText(getDisplayStatus(order)) ===
                            "Đã có kết quả"
                          );
                        }
                        return (
                          getStatusText(getDisplayStatus(order)) ===
                          filterStatus
                        );
                      })
                      .filter(
                        (order) =>
                          searchOrder.trim() === "" ||
                          order.id
                            .toLowerCase()
                            .includes(searchOrder.trim().toLowerCase()) ||
                          (order.type &&
                            order.type
                              .toLowerCase()
                              .includes(searchOrder.trim().toLowerCase()))
                      );
                    if (filteredOrders.length === 0) {
                      return (
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
                      );
                    }
                    return filteredOrders.map((order) => (
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
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: 700,
                                  color: "#009e74",
                                  fontSize: 17,
                                }}
                              >
                                Mã đơn đăng ký: #{order.id}
                              </span>
                              <Tag
                                style={{
                                  fontWeight: 600,
                                  fontSize: 15,
                                  background: (() => {
                                    const statusText = getStatusText(
                                      getDisplayStatus(order)
                                    );
                                    switch (statusText) {
                                      case "Chờ xác nhận":
                                        return "#1890ff"; // blue
                                      case "Chưa gửi kit":
                                        return "#a259ec"; // light purple
                                      case "Đã gửi kit":
                                        return "#00b894"; // teal
                                      case "Đã gửi mẫu":
                                        return "#13c2c2"; // cyan
                                      case "Đang xử lý":
                                        return "#faad14"; // gold/orange
                                      case "Đã hẹn":
                                        return "#40a9ff"; // light blue
                                      case "Đã đến":
                                        return "#006d75"; // dark green
                                      case "Đã có kết quả":
                                        return "#52c41a"; // green
                                      case "Hoàn thành":
                                        return "#52c41a"; // green (same as Đã có kết quả)
                                      case "Từ chối":
                                        return "#ff4d4f"; // red
                                      default:
                                        return "#bfbfbf"; // gray (fallback)
                                    }
                                  })(),
                                  color: "#fff",
                                  border: "none",
                                  boxShadow: "none",
                                  borderRadius: 8,
                                  marginLeft: 12,
                                  minWidth: 90,
                                  padding: "3px 12px",
                                  textAlign: "center",
                                  display: "inline-block",
                                }}
                              >
                                {getStatusText(getDisplayStatus(order))}
                              </Tag>
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
                              <b>Địa điểm thu mẫu:</b>{" "}
                              {getSampleMethodLabel(order.sampleMethod)}
                            </div>
                            <div
                              style={{
                                color: "#888",
                                fontSize: 15,
                                marginBottom: 8,
                              }}
                            >
                              <b>Số người xét nghiệm:</b>{" "}
                              {
                                order.numPeople ||
                                (Array.isArray(order.members)
                                  ? order.members.length
                                  : "-")
                              }
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
                              gap: 12,
                              alignItems: "stretch",
                              minWidth: 200,
                              marginTop: 8,
                              marginBottom: 8,
                            }}
                          >
                            {/* Nút Xem chi tiết */}
                            <button
                              className="order-btn"
                              style={{
                                border: "1.5px solid #16a34a",
                                color: "#fff",
                                background: "#16a34a",
                                borderRadius: 12,
                                padding: "10px 22px",
                                fontWeight: 600,
                                fontSize: 16,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                transition:
                                  "background 0.2s, color 0.2s, border 0.2s",
                                outline: "none",
                                cursor: "pointer",
                                boxShadow: "0 2px 8px #16a34a22",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = "#fff";
                                e.currentTarget.style.color = "#16a34a";
                                e.currentTarget.style.border =
                                  "1.5px solid #16a34a";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = "#16a34a";
                                e.currentTarget.style.color = "#fff";
                                e.currentTarget.style.border =
                                  "1.5px solid #16a34a";
                              }}
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowDetailModal(true);
                              }}
                            >
                              <Eye size={20} style={{ marginRight: 6 }} /> Xem
                              chi tiết
                            </button>
                            {/* Nút Xem kết quả cho trạng thái Hoàn thành */}
                            {(getStatusText(getDisplayStatus(order)) ===
                              "Đã có kết quả" ||
                              getStatusText(getDisplayStatus(order)) ===
                                "Hoàn thành") && (
                              <button
                                style={{
                                  border: "1.5px solid #1677ff",
                                  color: "#fff",
                                  background: "#1677ff",
                                  borderRadius: 12,
                                  padding: "10px 22px",
                                  fontWeight: 600,
                                  fontSize: 16,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  transition:
                                    "background 0.2s, color 0.2s, border 0.2s",
                                  outline: "none",
                                  cursor: "pointer",
                                  boxShadow: "0 2px 8px #1677ff22",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = "#fff";
                                  e.currentTarget.style.color = "#1677ff";
                                  e.currentTarget.style.border =
                                    "1.5px solid #1677ff";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = "#1677ff";
                                  e.currentTarget.style.color = "#fff";
                                  e.currentTarget.style.border =
                                    "1.5px solid #1677ff";
                                }}
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowResultModal(true);
                                }}
                              >
                                <FileText
                                  size={20}
                                  style={{ marginRight: 6 }}
                                />{" "}
                                Xem kết quả
                              </button>
                            )}
                            {/* Nút Tải kết quả cho đơn hành chính */}
                            {(getStatusText(getDisplayStatus(order)) === "Đã có kết quả" || getStatusText(getDisplayStatus(order)) === "Hoàn thành") && order.type && order.type.toLowerCase().includes("hành chính") && (
                              <button
                                style={{
                                  border: "1.5px solid #00bfae",
                                  color: "#fff",
                                  background: "#00bfae",
                                  borderRadius: 12,
                                  padding: "10px 22px",
                                  fontWeight: 600,
                                  fontSize: 16,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  transition: "background 0.2s, color 0.2s, border 0.2s",
                                  outline: "none",
                                  cursor: "pointer",
                                  boxShadow: "0 2px 8px #00bfae22",
                                }}
                                onMouseOver={e => {
                                  e.currentTarget.style.background = "#fff";
                                  e.currentTarget.style.color = "#00bfae";
                                  e.currentTarget.style.border = "1.5px solid #00bfae";
                                }}
                                onMouseOut={e => {
                                  e.currentTarget.style.background = "#00bfae";
                                  e.currentTarget.style.color = "#fff";
                                  e.currentTarget.style.border = "1.5px solid #00bfae";
                                }}
                                onClick={() => handleDownloadResult(order)}
                              >
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ marginRight: 6 }}><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                Tải kết quả
                              </button>
                            )}
                            {/* Nút Đánh giá cho trạng thái Hoàn thành */}
                            {(getStatusText(getDisplayStatus(order)) ===
                              "Đã có kết quả" ||
                              getStatusText(getDisplayStatus(order)) ===
                                "Hoàn thành") && (
                              <button
                                className="order-btn"
                                style={{
                                  border: "1.5px solid #ffc53d",
                                  color: "#fff",
                                  background: "#ffc53d",
                                  borderRadius: 12,
                                  padding: "10px 22px",
                                  fontWeight: 600,
                                  fontSize: 16,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  transition:
                                    "background 0.2s, color 0.2s, border 0.2s",
                                  outline: "none",
                                  cursor: "pointer",
                                  boxShadow: "0 2px 8px #ffc53d22",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = "#fff";
                                  e.currentTarget.style.color = "#ffc53d";
                                  e.currentTarget.style.border =
                                    "1.5px solid #ffc53d";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = "#ffc53d";
                                  e.currentTarget.style.color = "#fff";
                                  e.currentTarget.style.border =
                                    "1.5px solid #ffc53d";
                                }}
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setOverallRating(0);
                                  setFeedbackInput("");
                                  setShowFeedbackModal(true);
                                }}
                              >
                                <Star size={20} style={{ marginRight: 6 }} />{" "}
                                Đánh giá
                              </button>
                            )}
                            {/* Nút Xem đánh giá */}
                            {getStatusText(order.status, order.sampleMethod) ===
                              "Đã có kết quả" &&
                              order.feedbacks &&
                              order.feedbacks.length > 0 && (
                                <button
                                  style={{
                                    border: "1.5px solid #ffc53d",
                                    color: "#ffc53d",
                                    background: "#fff",
                                    borderRadius: 12,
                                    padding: "10px 22px",
                                    fontWeight: 600,
                                    fontSize: 16,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    transition:
                                      "background 0.2s, color 0.2s, border 0.2s",
                                    outline: "none",
                                    cursor: "pointer",
                                    boxShadow: "0 2px 8px #ffc53d22",
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.background =
                                      "#fff7e6";
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.background = "#fff";
                                  }}
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    const lastFb =
                                      order.feedbacks[
                                        order.feedbacks.length - 1
                                      ];
                                    setOverallRating(lastFb.rating);
                                    setFeedbackInput(lastFb.feedback);
                                    setShowFeedbackModal(true);
                                  }}
                                >
                                  <Star size={20} style={{ marginRight: 6 }} />{" "}
                                  Xem đánh giá
                                </button>
                              )}
                            {/* Nút Xác nhận đã nhận kit */}
                            {getStatusText(getDisplayStatus(order)) ===
                              "Đã gửi kit" && (
                              <button
                                style={{
                                  border: "1.5px solid #00bfae",
                                  color: "#fff",
                                  background: "#00bfae",
                                  borderRadius: 12,
                                  padding: "10px 22px",
                                  fontWeight: 600,
                                  fontSize: 16,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  transition:
                                    "background 0.2s, color 0.2s, border 0.2s",
                                  outline: "none",
                                  cursor: "pointer",
                                  boxShadow: "0 2px 8px #00bfae22",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = "#fff";
                                  e.currentTarget.style.color = "#00bfae";
                                  e.currentTarget.style.border =
                                    "1.5px solid #00bfae";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = "#00bfae";
                                  e.currentTarget.style.color = "#fff";
                                  e.currentTarget.style.border =
                                    "1.5px solid #00bfae";
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
                    ));
                  })()}
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
                      <div style={{ position: "relative", width: "100%" }}>
                        <input
                          type={showPw.current ? "text" : "password"}
                          name="current"
                          value={pwForm.current}
                          onChange={handlePwChange}
                          required
                          style={{
                            height: 44,
                            padding: "0 44px 0 12px",
                            width: "100%",
                            background: "#fff",
                            borderRadius: 10,
                            border: "1.5px solid #e0e7ef",
                            fontSize: 16,
                            fontWeight: 500,
                            outline: "none",
                            boxShadow: "none",
                            transition: "border 0.2s",
                          }}
                        />
                        <button
                          type="button"
                          style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            right: 12,
                            height: "100%",
                            background: "none",
                            border: "none",
                            padding: 0,
                            margin: 0,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            color: "#888",
                          }}
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
                    </div>
                    <div className="form-group password-group">
                      <label>Mật khẩu mới</label>
                      <div style={{ position: "relative", width: "100%" }}>
                        <input
                          type={showPw.new ? "text" : "password"}
                          name="new"
                          value={pwForm.new}
                          onChange={handlePwChange}
                          required
                          style={{
                            height: 44,
                            padding: "0 44px 0 12px",
                            width: "100%",
                            background: "#fff",
                            borderRadius: 10,
                            border: "1.5px solid #e0e7ef",
                            fontSize: 16,
                            fontWeight: 500,
                            outline: "none",
                            boxShadow: "none",
                            transition: "border 0.2s",
                          }}
                        />
                        <button
                          type="button"
                          style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            right: 12,
                            height: "100%",
                            background: "none",
                            border: "none",
                            padding: 0,
                            margin: 0,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            color: "#888",
                          }}
                          onClick={() =>
                            setShowPw((p) => ({ ...p, new: !p.new }))
                          }
                          tabIndex={0}
                          aria-label={
                            showPw.new ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                          }
                        >
                          {showPw.new ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="form-group password-group">
                      <label>Xác nhận mật khẩu mới</label>
                      <div style={{ position: "relative", width: "100%" }}>
                        <input
                          type={showPw.confirm ? "text" : "password"}
                          name="confirm"
                          value={pwForm.confirm}
                          onChange={handlePwChange}
                          required
                          style={{
                            height: 44,
                            padding: "0 44px 0 12px",
                            width: "100%",
                            background: "#fff",
                            borderRadius: 10,
                            border: "1.5px solid #e0e7ef",
                            fontSize: 16,
                            fontWeight: 500,
                            outline: "none",
                            boxShadow: "none",
                            transition: "border 0.2s",
                          }}
                        />
                        <button
                          type="button"
                          style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            right: 12,
                            height: "100%",
                            background: "none",
                            border: "none",
                            padding: 0,
                            margin: 0,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            color: "#888",
                          }}
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
        selectedOrder &&
        (getStatusText(getDisplayStatus(selectedOrder)) ===
          "Đã có kết quả" ||
          getStatusText(getDisplayStatus(selectedOrder)) ===
            "Hoàn thành") && (
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
                Đánh giá của bạn
              </h3>
              <p style={{ textAlign: "center" }}>
                Bạn hãy đánh giá dịch vụ của chúng tôi
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
                        selectedOrder.feedbacks &&
                        selectedOrder.feedbacks.length > 0
                          ? "default"
                          : "pointer",
                    }}
                    onClick={() => {
                      if (
                        !(
                          selectedOrder.feedbacks &&
                          selectedOrder.feedbacks.length > 0
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
                      selectedOrder.feedbacks &&
                      selectedOrder.feedbacks.length > 0
                    )
                  ) {
                    setFeedbackInput(e.target.value);
                  }
                }}
                readOnly={
                  selectedOrder.feedbacks && selectedOrder.feedbacks.length > 0
                }
                style={{
                  width: "100%",
                  borderRadius: 8,
                  margin: "8px 0 16px",
                  padding: 12,
                  border: "1px solid #ccc",
                  fontSize: 16,
                  background:
                    selectedOrder.feedbacks &&
                    selectedOrder.feedbacks.length > 0
                      ? "#f6f8fa"
                      : "#fff",
                }}
              />
              {/* Nút đánh giá hoặc đóng tùy theo đã đánh giá hay chưa */}
              {selectedOrder.feedbacks && selectedOrder.feedbacks.length > 0 ? (
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
                        selectedOrder.feedbacks[
                          selectedOrder.feedbacks.length - 1
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
                      selectedOrder.id,
                      feedbackInput,
                      overallRating,
                      { overall: overallRating }
                    );
                    // Cập nhật state userOrders ngay lập tức để ẩn nút Đánh giá
                    setUserOrders((prev) =>
                      prev.map((o) =>
                        o.id === selectedOrder.id
                          ? {
                              ...o,
                              feedbacks: [
                                {
                                  rating: overallRating,
                                  feedback: feedbackInput,
                                  date: `${new Date().getDate()}/${
                                    new Date().getMonth() + 1
                                  }/${new Date().getFullYear()}`,
                                },
                              ],
                            }
                          : o
                      )
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
                    selectedOrder.feedbacks &&
                    selectedOrder.feedbacks.length > 0
                      ? "#009e74"
                      : "#eee",
                  color:
                    selectedOrder.feedbacks &&
                    selectedOrder.feedbacks.length > 0
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
                {selectedOrder.feedbacks && selectedOrder.feedbacks.length > 0
                  ? "Đóng"
                  : "Hủy"}
              </button>
            </div>
          </div>
        )
      }
      {
        showDetailModal && selectedOrder && (
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
                    style={{
                      fontWeight: 600,
                      fontSize: 15,
                      background: (() => {
                        const statusText = getStatusText(getDisplayStatus(selectedOrder));
                        switch (statusText) {
                          case "Chờ xác nhận": return "#1890ff";      // blue
                          case "Chưa gửi kit": return "#a259ec";     // light purple
                          case "Đã gửi kit":   return "#00b894";     // teal
                          case "Đã gửi mẫu":   return "#13c2c2";     // cyan
                          case "Đang xử lý":   return "#faad14";     // gold/orange
                          case "Đã hẹn":       return "#40a9ff";     // light blue
                          case "Đã đến":       return "#006d75";     // dark green
                          case "Đã có kết quả":return "#52c41a";     // green
                          case "Hoàn thành":   return "#52c41a";     // green (same as Đã có kết quả)
                          case "Từ chối":      return "#ff4d4f";     // red
                          default:              return "#bfbfbf";     // gray (fallback)
                        }
                      })(),
                      color: "#fff",
                      border: "none",
                      boxShadow: "none",
                      borderRadius: 8,
                      marginLeft: 12,
                      minWidth: 90,
                      padding: '3px 12px',
                      textAlign: 'center',
                      display: 'inline-block',
                    }}
                  >
                    {getStatusText(getDisplayStatus(selectedOrder))}
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
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 2, flexWrap: 'nowrap' }}>
                  <span style={{ fontWeight: 600, minWidth: 120, flexShrink: 0 }}>Loại xét nghiệm:</span>
                  <span style={{ whiteSpace: 'nowrap', overflowWrap: 'anywhere', width: '100%', display: 'inline-block', marginLeft: 8 }}>{selectedOrder.type || ''}</span>
                </div>
                {/* Divider giữa thông tin người dùng và đơn hàng */}
                <div
                  style={{ borderTop: "1px solid #e6e6e6", margin: "12px 0" }}
                />
                {/* Thông tin đơn hàng còn lại */}
                <div>
                  <span style={{ fontWeight: 600 }}>Địa điểm thu mẫu:</span>{" "}
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
        )
      }
      {/* Modal xem kết quả (chỉ kết quả và file kết quả) */}
      {
        showResultModal && selectedOrder && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.18)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowResultModal(false)}>
            <div style={{ background: "#fff", borderRadius: 18, minWidth: 340, maxWidth: 800, maxHeight: "90vh", padding: 32, boxShadow: "0 8px 32px #0002", position: "relative", fontSize: 17, overflowY: "auto" }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowResultModal(false)} style={{ position: "absolute", top: 14, right: 18, background: "none", border: "none", fontSize: 26, color: "#888", cursor: "pointer" }}>&times;</button>
              {/* Nếu là đơn Dân sự: chỉ hiển thị bảng mẫu và kết luận */}
              {selectedOrder.type && selectedOrder.type.toLowerCase().includes('dân sự') ? (
                <>
                  <h2 style={{ textAlign: 'center', color: '#00c853', fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Kết Quả Xét Nghiệm</h2>
                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontWeight: 800, fontSize: 20, margin: '0 0 12px 0' }}>Thông tin người cho mẫu</h3>
                    <div style={{ background: '#f8fff3', border: '2px solid #b6e4b6', borderRadius: 14, padding: 20, overflowX: 'auto' }}>
                      {Array.isArray(selectedOrder.resultTableData) && selectedOrder.resultTableData.length > 0 ? (
                        <table className="result-table" style={{ minWidth: 600, tableLayout: 'auto', borderCollapse: 'collapse', width: '100%' }}>
                            <thead>
                            <tr style={{ background: '#e6f7ff' }}>
                              <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>STT</th>
                              <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Họ và tên</th>
                              <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Ngày sinh</th>
                              <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Giới tính</th>
                              <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Mối quan hệ</th>
                              <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Loại mẫu</th>
                              </tr>
                            </thead>
                            <tbody>
                            {selectedOrder.resultTableData.map((data, index) => (
                              <tr key={data.key} style={{ background: index % 2 === 0 ? '#fff' : '#f4f8ff' }}>
                                <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{index + 1}</td>
                                <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.name}</td>
                                <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.birth || data.birthYear || data.namSinh || data.namsinh || ''}</td>
                                <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.gender}</td>
                                <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.relationship}</td>
                                <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.sampleType}</td>
                                  </tr>
                            ))}
                            </tbody>
                          </table>
                      ) : (
                        <div style={{ color: '#faad14', fontWeight: 600 }}>Chưa có thông tin mẫu</div>
                      )}
                        </div>
                  </div>
                  {/* Kết luận */}
                        {selectedOrder.conclusion && (
                    <div style={{ margin: '0 0 12px 0', padding: 20, background: '#e6f7ff', border: '1.5px solid #91d5ff', borderRadius: 14, fontWeight: 700, fontSize: 18, color: '#005c3c' }}>
                      <div style={{ marginBottom: 6, fontWeight: 800, fontSize: 20 }}>Kết luận</div>
                      <div style={{ fontSize: 18 }}>{selectedOrder.conclusion}</div>
                            </div>
                  )}
                </>
              ) : (
                // Đơn khác giữ nguyên logic cũ
                <>
                  {/* ... giữ nguyên phần render cũ ... */}
                  {selectedOrder.category === 'admin' ? (
                    // ... logic cũ cho admin ...
                    <>
                      <h2 style={{ textAlign: 'center', color: '#00c853', fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Kết Quả Xét Nghiệm</h2>
                      <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div>Ngày xét nghiệm: <b>{selectedOrder.appointmentDate || ''}</b></div>
                          <div>Nhân viên lấy mẫu: <b>{selectedOrder.sampleInfo?.collector || selectedOrder.staffAssigned || ''}</b></div>
                          <div>Người yêu cầu xét nghiệm: <b>{selectedOrder.name || ''}</b></div>
                          <div>Địa chỉ hiện tại: <b>{selectedOrder.address || ''}</b></div>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: 2, flexWrap: 'nowrap' }}>
                            <span style={{ fontWeight: 600, minWidth: 120, flexShrink: 0 }}>Loại xét nghiệm:</span>
                            <span style={{ whiteSpace: 'nowrap', overflowWrap: 'anywhere', width: '100%', display: 'inline-block', marginLeft: 8 }}>{selectedOrder.type || ''}</span>
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div>Địa điểm lấy mẫu: <b>{getSampleMethodLabel(selectedOrder.sampleMethod)}</b></div>
                          <div>Mã đơn hàng: <b>#{selectedOrder.id}</b></div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 22, textAlign: 'center', margin: '18px 0 8px 0' }}>Thông tin người cho mẫu</div>
                      {Array.isArray(selectedOrder.sampleInfo?.donors) && selectedOrder.sampleInfo.donors.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                          {/* <h3 style={{ fontWeight: 600, fontSize: 20, margin: '16px 0 12px' }}>Thông tin chi tiết người cho mẫu</h3> */}
                          {selectedOrder.sampleInfo.donors.map((donor, idx) => (
                            <div key={idx} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 12, background: '#fafbfc' }}>
                              <div style={{ display: 'flex', gap: 0, marginBottom: 4 }}>
                                <div style={{ flex: 1, minWidth: 0 }}><b>Họ và tên:</b> <span style={{ fontWeight: 400 }}>{donor.name || ''}</span></div>
                                <div style={{ flex: 1, minWidth: 0 }}><b>Giới tính:</b> <span style={{ fontWeight: 400 }}>{donor.gender || ''}</span></div>
                              </div>
                              <div style={{ display: 'flex', gap: 0, marginBottom: 4 }}>
                                <div style={{ flex: 1, minWidth: 0 }}><b>Ngày sinh:</b> <span style={{ fontWeight: 400 }}>{donor.birth || ''}</span></div>
                                <div style={{ flex: 1, minWidth: 0 }}><b>Quốc tịch:</b> <span style={{ fontWeight: 400 }}>{donor.nationality || ''}</span></div>
                              </div>
                              <div style={{ display: 'flex', gap: 0, marginBottom: 4 }}>
                                <div style={{ flex: 1, minWidth: 0 }}><b>Loại giấy tờ:</b> <span style={{ fontWeight: 400 }}>{donor.idType || ''}</span></div>
                                <div style={{ flex: 1, minWidth: 0 }}><b>Số giấy tờ:</b> <span style={{ fontWeight: 400 }}>{donor.idNumber || ''}</span></div>
                              </div>
                              <div style={{ display: 'flex', gap: 0, marginBottom: 4 }}>
                                <div style={{ flex: 1, minWidth: 0 }}><b>Ngày cấp:</b> <span style={{ fontWeight: 400 }}>{donor.idIssueDate ? dayjs(donor.idIssueDate).isValid() ? dayjs(donor.idIssueDate).format('DD/MM/YYYY') : donor.idIssueDate : ''}</span></div>
                                <div style={{ flex: 1, minWidth: 0 }}><b>Nơi cấp:</b> <span style={{ fontWeight: 400 }}>{donor.idIssuePlace || ''}</span></div>
                              </div>
                            </div>
                          ))}
                          </div>
                        )}
                      {/* Sau đó mới render bảng mẫu xét nghiệm và kết luận như cũ */}
                      {Array.isArray(selectedOrder.resultTableData) && selectedOrder.resultTableData.length > 0 ? (
                        <div style={{ marginBottom: 24 }}>
                          <h3 style={{ fontWeight: 600, fontSize: 20, margin: '16px 0 12px' }}>Kết quả xét nghiệm</h3>
                          <div style={{ background: '#f8fff3', border: '2px solid #b6e4b6', borderRadius: 14, padding: 20, overflowX: 'auto' }}>
                            <table className="result-table" style={{ minWidth: 600, tableLayout: 'auto', borderCollapse: 'collapse', width: '100%' }}>
                              <thead>
                                <tr style={{ background: '#e6f7ff' }}>
                                  <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>STT</th>
                                  <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Họ và tên</th>
                                  <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Ngày sinh</th>
                                  <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Giới tính</th>
                                  <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Mối quan hệ</th>
                                  <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Loại mẫu</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedOrder.resultTableData.map((data, index) => (
                                  <tr key={data.key} style={{ background: index % 2 === 0 ? '#fff' : '#f4f8ff' }}>
                                    <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{index + 1}</td>
                                    <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.name}</td>
                                    <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.birth || data.birthYear || data.namSinh || data.namsinh || ''}</td>
                                    <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.gender}</td>
                                    <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.relationship}</td>
                                    <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.sampleType}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                      </div>
                          <div style={{ fontWeight: 600, fontSize: 18, margin: '12px 0 4px 0' }}>Kết luận</div>
                          <div style={{ border: '1px solid #eee', borderRadius: 8, minHeight: 40, padding: 8, marginBottom: 18 }}>{selectedOrder.conclusion || ''}</div>
                      </div>
                      ) : (
                        <div style={{ color: '#faad14', fontWeight: 600 }}>Chưa có thông tin kết quả xét nghiệm</div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>HỘI ĐỒNG KHOA HỌC</div>
                          <img src="/Stamp/da_xac_nhan.png" alt="Đã xác nhận" style={{ height: 48, margin: '0 auto' }} />
                    </div>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>TRUNG TÂM XÉT NGHIỆM</div>
                          <img src="/Stamp/dau_moc.png" alt="Dấu mộc" style={{ height: 90, margin: '0 auto' }} />
              </div>
              </div>
                    </>
                  ) : (
                    <div style={{ background: "#fff", borderRadius: 12, padding: 24, fontFamily: 'Arial, sans-serif', color: '#222', maxWidth: 700, margin: '0 auto' }}>
                      <h2 style={{ textAlign: 'center', color: '#00c853', fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Kết Quả Xét Nghiệm</h2>
                      <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div>Ngày xét nghiệm: <b>{selectedOrder.appointmentDate || ''}</b></div>
                          <div>Nhân viên lấy mẫu: <b>{selectedOrder.sampleInfo?.collector || selectedOrder.staffAssigned || ''}</b></div>
                          <div>Người yêu cầu xét nghiệm: <b>{selectedOrder.name || ''}</b></div>
                          <div>Địa chỉ hiện tại: <b>{selectedOrder.address || ''}</b></div>
                          <div style={{ display: 'flex', alignItems: 'center', marginTop: 2, flexWrap: 'nowrap' }}>
                            <span style={{ fontWeight: 600, minWidth: 120, flexShrink: 0 }}>Loại xét nghiệm:</span>
                            <span style={{ whiteSpace: 'nowrap', overflowWrap: 'anywhere', width: '100%', display: 'inline-block', marginLeft: 8 }}>{selectedOrder.type || ''}</span>
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div>Địa điểm lấy mẫu: <b>{getSampleMethodLabel(selectedOrder.sampleMethod)}</b></div>
                          <div>Mã đơn hàng: <b>#{selectedOrder.id}</b></div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 22, textAlign: 'center', margin: '18px 0 8px 0' }}>Thông tin người cho mẫu</div>
                      <div style={{ border: '1px solid #eee', borderRadius: 8, minHeight: 80, marginBottom: 12 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
                          <thead>
                            <tr style={{ background: '#f0f9f6' }}>
                              <th style={{ padding: 8 }}>STT</th>
                              <th style={{ padding: 8 }}>Họ và tên</th>
                              <th style={{ padding: 8 }}>Ngày sinh</th>
                              <th style={{ padding: 8 }}>Giới tính</th>
                              <th style={{ padding: 8 }}>Mối quan hệ</th>
                              <th style={{ padding: 8 }}>Loại mẫu</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(Array.isArray(selectedOrder.resultTableData) ? selectedOrder.resultTableData : []).map((row, idx) => (
                              <tr key={row.key || idx}>
                                <td style={{ padding: 8, textAlign: 'center' }}>{idx + 1}</td>
                                <td style={{ padding: 8 }}>{row.name}</td>
                                <td style={{ padding: 8 }}>{row.birth || row.birthYear || row.namSinh || row.namsinh || ''}</td>
                                <td style={{ padding: 8 }}>{row.gender}</td>
                                <td style={{ padding: 8 }}>{row.relationship}</td>
                                <td style={{ padding: 8 }}>{row.sampleType}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 18, margin: '12px 0 4px 0' }}>Kết luận</div>
                      <div style={{ border: '1px solid #eee', borderRadius: 8, minHeight: 40, padding: 8, marginBottom: 18 }}>{selectedOrder.conclusion || ''}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )
      }
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
