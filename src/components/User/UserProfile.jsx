import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const DEMO_ORDERS = [
  {
    id: "DNA12345",
    type: "Xét nghiệm huyết thống (Gói Tiêu chuẩn)",
    date: "15/05/2025",
    price: 3500000,
    status: "Hoàn thành",
  },
  {
    id: "DNA12346",
    type: "Xét nghiệm nguồn gốc (Gói Cơ bản)",
    date: "10/05/2025",
    price: 2900000,
    status: "Chờ xử lý",
  },
];

const UserProfile = () => {
  const { user, updateUser, requestPasswordChange, verifyPasswordChange } =
    useContext(AuthContext);
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

  return (
    <div className="user-profile-page">
      <div className="user-profile-card">
        <div className="user-avatar">
          {user.fullName
            ?.split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()}
        </div>
        <div className="user-name">{user.fullName}</div>
        <div className="user-email">{user.email}</div>
        <button
          className={`profile-menu-btn${tab === "profile" ? " active" : ""}`}
          onClick={() => setTab("profile")}
        >
          👤 Tài khoản của tôi
        </button>
        <button
          className={`profile-menu-btn${tab === "orders" ? " active" : ""}`}
          onClick={() => setTab("orders")}
        >
          📦 Đơn hàng
        </button>
        <button
          className={`profile-menu-btn${tab === "settings" ? " active" : ""}`}
          onClick={() => setTab("settings")}
        >
          ⚙️ Cài đặt
        </button>
        <button
          className="profile-logout-btn"
          onClick={() => (window.location.href = "/")}
        >
          Đăng xuất
        </button>
      </div>
      <div className="user-profile-form">
        <div className="profile-tabs">
          <div
            className={`profile-tab${tab === "profile" ? " active" : ""}`}
            onClick={() => setTab("profile")}
          >
            Hồ sơ cá nhân
          </div>
          <div
            className={`profile-tab${tab === "orders" ? " active" : ""}`}
            onClick={() => setTab("orders")}
          >
            Đơn hàng
          </div>
          <div
            className={`profile-tab${tab === "settings" ? " active" : ""}`}
            onClick={() => setTab("settings")}
          >
            Cài đặt
          </div>
        </div>
        {tab === "profile" && (
          <form className="profile-form" onSubmit={handleSubmit}>
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
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="submit-button" type="submit">
                Cập nhật thông tin
              </button>
              {success && <span className="form-success">{success}</span>}
            </div>
          </form>
        )}
        {tab === "orders" && (
          <div className="orders-section">
            <div className="orders-title">Đơn hàng của tôi</div>
            <div className="orders-desc">
              Xem lịch sử đơn hàng và trạng thái xét nghiệm ADN của bạn.
            </div>
            <div className="orders-filter">
              <span className="active">Tất cả</span>
              <span>Chờ xử lý</span>
              <span>Đang xử lý</span>
              <span>Hoàn thành</span>
            </div>
            {DEMO_ORDERS.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-info">
                  <div className="order-id">
                    Mã đơn hàng:{" "}
                    <span className="order-id-highlight">#{order.id}</span>{" "}
                    <span
                      className={`order-status ${
                        order.status === "Hoàn thành"
                          ? "done"
                          : order.status === "Chờ xử lý"
                          ? "pending"
                          : "processing"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="order-type">{order.type}</div>
                  <div className="order-date">Ngày đặt hàng: {order.date}</div>
                </div>
                <div className="order-actions">
                  <div className="order-price">
                    {order.price.toLocaleString()} đ
                  </div>
                  <button className="order-btn">
                    <Eye size={16} /> Xem chi tiết
                  </button>
                  <button className="order-btn">
                    <EyeOff size={16} /> Xem kết quả
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "settings" && (
          <div className="settings-section">
            <div className="settings-title">Cài đặt tài khoản</div>
            <div className="settings-desc">
              Quản lý cài đặt tài khoản và bảo mật.
            </div>
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
                    />
                    <span
                      className="pw-eye"
                      onClick={() =>
                        setShowPw((p) => ({ ...p, current: !p.current }))
                      }
                    >
                      {showPw.current ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </span>
                  </div>
                  <div className="form-group password-group">
                    <label>Mật khẩu mới</label>
                    <input
                      type={showPw.new ? "text" : "password"}
                      name="new"
                      value={pwForm.new}
                      onChange={handlePwChange}
                      required
                    />
                    <span
                      className="pw-eye"
                      onClick={() => setShowPw((p) => ({ ...p, new: !p.new }))}
                    >
                      {showPw.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>
                  <div className="form-group password-group">
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                      type={showPw.confirm ? "text" : "password"}
                      name="confirm"
                      value={pwForm.confirm}
                      onChange={handlePwChange}
                      required
                    />
                    <span
                      className="pw-eye"
                      onClick={() =>
                        setShowPw((p) => ({ ...p, confirm: !p.confirm }))
                      }
                    >
                      {showPw.confirm ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </span>
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
  );
};

export default UserProfile;
