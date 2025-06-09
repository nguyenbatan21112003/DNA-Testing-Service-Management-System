import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Eye, EyeOff, Star } from "lucide-react";
import { useOrderContext } from "../../context/OrderContext";

const UserProfile = () => {
  const { user, updateUser, requestPasswordChange, verifyPasswordChange } =
    useContext(AuthContext);
  const { orders, addFeedback } = useOrderContext();
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
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [ratingInput, setRatingInput] = useState(0);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  const [kitToast, setKitToast] = useState("");
  const [fileToast, setFileToast] = useState("");

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

  return (
    <div
      className="user-profile-page"
      style={{
        display: "flex",
        minHeight: "100vh",
        minWidth: "97%",
        background: "#f7fafd",
      }}
    >
      {/* Sidebar tabs dọc bên trái */}
      <div
        className="profile-tabs"
        style={{
          minWidth: 270,
          background: "#fff",
          boxShadow: "0 2px 8px #e6e6e6",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          padding: "48px 0",
          borderRadius: 0,
          height: "100vh",
        }}
      >
        <div
          className={`profile-tab${tab === "profile" ? " active" : ""}`}
          onClick={() => setTab("profile")}
          style={{
            cursor: "pointer",
            padding: "18px 32px",
            fontWeight: 600,
            background: tab === "profile" ? "#e6f7f1" : "transparent",
            color: tab === "profile" ? "#009e74" : "#222",
            borderLeft:
              tab === "profile" ? "4px solid #009e74" : "4px solid transparent",
          }}
        >
          Hồ sơ cá nhân
        </div>
        <div
          className={`profile-tab${tab === "orders" ? " active" : ""}`}
          onClick={() => setTab("orders")}
          style={{
            cursor: "pointer",
            padding: "18px 32px",
            fontWeight: 600,
            background: tab === "orders" ? "#e6f7f1" : "transparent",
            color: tab === "orders" ? "#009e74" : "#222",
            borderLeft:
              tab === "orders" ? "4px solid #009e74" : "4px solid transparent",
          }}
        >
          Đơn đăng ký
        </div>
        <div
          className={`profile-tab${tab === "settings" ? " active" : ""}`}
          onClick={() => setTab("settings")}
          style={{
            cursor: "pointer",
            padding: "18px 32px",
            fontWeight: 600,
            background: tab === "settings" ? "#e6f7f1" : "transparent",
            color: tab === "settings" ? "#009e74" : "#222",
            borderLeft:
              tab === "settings"
                ? "4px solid #009e74"
                : "4px solid transparent",
          }}
        >
          Cài đặt
        </div>
      </div>
      {/* Nội dung tab bên phải, full màn hình */}
      <div
        className="user-profile-form"
        style={{
          flex: 1,
          margin: 0,
          background: "#f4f6fb",
          borderRadius: 0,
          boxShadow: "none",
          padding: "32px 8px 0 8px",
          minWidth: 0,
          width: "100%",
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
              marginBottom: 32,
            }}
          >
            <h2
              style={{
                fontWeight: 800,
                fontSize: 32,
                marginBottom: 32,
                letterSpacing: -1,
              }}
            >
              Hồ sơ cá nhân
            </h2>
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
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 2px 12px #e6e6e6",
              padding: 48,
              margin: 0,
              marginBottom: 32,
            }}
          >
            <h2
              style={{
                fontWeight: 800,
                fontSize: 32,
                marginBottom: 32,
                letterSpacing: -1,
              }}
            >
              Đơn đăng ký của bạn
            </h2>
            <div className="orders-section" style={{ gap: 32 }}>
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
                      filterStatus === "Tất cả" ? "2px solid #009e74" : "none",
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
              {orders.filter(
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
              {orders
                .filter(
                  (order) =>
                    filterStatus === "Tất cả" || order.status === filterStatus
                )
                .map((order) => (
                  <div
                    key={order.id}
                    className="order-card"
                    style={{
                      background: "#f6fefd",
                      borderRadius: 12,
                      boxShadow: "0 1px 8px #e6e6e6",
                      padding: 32,
                      marginBottom: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 40,
                    }}
                  >
                    <div className="order-info">
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
                          }}
                        >
                          {order.status}
                        </span>
                        {/* Badge trạng thái nhận kit */}
                        {order.sampleMethod === "home" &&
                          order.kitStatus === "da_gui" && (
                            <span
                              style={{
                                marginLeft: 10,
                                background: "#ffe6b0",
                                color: "#b88900",
                                borderRadius: 8,
                                padding: "2px 10px",
                                fontWeight: 600,
                                fontSize: 13,
                                verticalAlign: "middle",
                              }}
                            >
                              Chờ nhận kit
                            </span>
                          )}
                        {order.sampleMethod === "home" &&
                          order.kitStatus === "da_nhan" && (
                            <span
                              style={{
                                marginLeft: 10,
                                background: "#e0f7ef",
                                color: "#009e74",
                                borderRadius: 8,
                                padding: "2px 10px",
                                fontWeight: 600,
                                fontSize: 13,
                                verticalAlign: "middle",
                              }}
                            >
                              Đã nhận kit
                            </span>
                          )}
                      </div>
                      <div className="order-type" style={{ marginBottom: 8 }}>
                        {order.type}
                      </div>
                      <div
                        className="order-date"
                        style={{ color: "#888", fontSize: 15 }}
                      >
                        Ngày đăng ký: {order.date}
                      </div>
                    </div>
                    <div
                      className="order-actions"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 12,
                      }}
                    >
                      <div
                        className="order-price"
                        style={{
                          color: "#009e74",
                          fontWeight: 700,
                          fontSize: 20,
                        }}
                      >
                        {order.price ? order.price.toLocaleString() + " đ" : ""}
                      </div>
                      <button
                        className="order-btn"
                        style={{
                          border: "1px solid #009e74",
                          color: "#009e74",
                          background: "#fff",
                          borderRadius: 8,
                          padding: "6px 18px",
                          fontWeight: 600,
                          marginBottom: 4,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetail(true);
                        }}
                      >
                        <Eye size={16} /> Xem chi tiết
                      </button>
                      <button
                        className="order-btn"
                        style={{
                          border: "1px solid #009e74",
                          color: "#009e74",
                          background: "#fff",
                          borderRadius: 8,
                          padding: "6px 18px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetail(true);
                          setTimeout(() => {
                            const el = document.getElementById(
                              "order-result-section"
                            );
                            if (el)
                              el.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                              });
                          }, 200);
                        }}
                      >
                        <EyeOff size={16} /> Xem kết quả
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            {/* Modal chi tiết đơn đăng ký */}
            {showDetail && selectedOrder && (
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
                onClick={() => setShowDetail(false)}
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
                    onClick={() => setShowDetail(false)}
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
                  <div
                    style={{ borderTop: "1px solid #e6e6e6", marginBottom: 18 }}
                  />
                  {/* Thông tin cơ bản dạng 1 cột */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
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
                      <span style={{ fontWeight: 600 }}>
                        Hình thức lấy mẫu:
                      </span>{" "}
                      <span>
                        {getSampleMethodLabel(selectedOrder.sampleMethod)}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 600 }}>Ghi chú:</span>{" "}
                      <span>{selectedOrder.note}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>
                        File Đơn Yêu Cầu Xét Nghiệm:
                      </span>
                      {selectedOrder.requestFormFile ? (
                        <a
                          href={
                            selectedOrder.requestFormFile.startsWith("data:")
                              ? selectedOrder.requestFormFile
                              : selectedOrder.requestFormFile
                          }
                          download={
                            selectedOrder.requestFormFileName ||
                            "DonYeuCauXetNghiem"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#0a7cff",
                            textDecoration: "underline",
                            fontWeight: 500,
                            marginLeft: 8,
                          }}
                        >
                          Tải file đã nộp
                        </a>
                      ) : (
                        <>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              // Đọc file thành base64
                              const reader = new FileReader();
                              reader.onload = function (evt) {
                                const base64 = evt.target.result;
                                // Lưu vào localStorage (update order)
                                const allOrders = JSON.parse(
                                  localStorage.getItem("dna_orders") || "[]"
                                );
                                const idx = allOrders.findIndex(
                                  (o) => o.id === selectedOrder.id
                                );
                                if (idx !== -1) {
                                  allOrders[idx] = {
                                    ...allOrders[idx],
                                    requestFormFile: base64,
                                    requestFormFileName: file.name,
                                  };
                                  localStorage.setItem(
                                    "dna_orders",
                                    JSON.stringify(allOrders)
                                  );
                                }
                                setSelectedOrder({
                                  ...selectedOrder,
                                  requestFormFile: base64,
                                  requestFormFileName: file.name,
                                });
                                setFileToast("Đã nộp file thành công!");
                                setTimeout(() => setFileToast(""), 2000);
                              };
                              reader.readAsDataURL(file);
                            }}
                            style={{ marginLeft: 8, fontSize: 13, padding: 2 }}
                          />
                          <span
                            style={{
                              color: "#888",
                              marginLeft: 8,
                              fontSize: 13,
                            }}
                          >
                            (PDF, DOC, DOCX)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid #e6e6e6",
                      margin: "18px 0 18px 0",
                    }}
                  />
                  {/* Thông báo đã nhận kit (nếu có) - chuyển lên trên phần kết quả */}
                  {selectedOrder.sampleMethod === "home" &&
                    selectedOrder.kitStatus === "da_nhan" && (
                      <div
                        style={{
                          margin: "18px 0",
                          padding: 14,
                          background: "#e6f7f1",
                          borderRadius: 8,
                          border: "1px solid #b2e2d6",
                          textAlign: "center",
                          color: "#009e74",
                          fontWeight: 600,
                        }}
                      >
                        Bạn đã xác nhận đã nhận kit. Nhân viên sẽ tiếp tục xử lý
                        đơn của bạn.
                      </div>
                    )}
                  {/* Kết quả xét nghiệm */}
                  {(selectedOrder.status === "Có kết quả" ||
                    selectedOrder.status === "Hoàn thành") && (
                    <div
                      id="order-result-section"
                      style={{ margin: "18px 0 10px 0" }}
                    >
                      <b style={{ color: "#009e74" }}>Kết quả xét nghiệm:</b>
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
                          <span style={{ color: "#888" }}>
                            Chưa có bảng kết quả.
                          </span>
                        )}
                      </div>
                      {/* File kết quả xét nghiệm nếu có */}
                      {selectedOrder.resultFile && (
                        <div
                          style={{
                            margin: "14px 0 10px 0",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontWeight: 600, marginRight: 8 }}>
                            File kết quả xét nghiệm:
                          </span>
                          <a
                            href={
                              selectedOrder.resultFile.startsWith("data:")
                                ? selectedOrder.resultFile
                                : selectedOrder.resultFile
                            }
                            download={
                              selectedOrder.resultFileName || "KetQuaXetNghiem"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#0a7cff",
                              textDecoration: "underline",
                              fontWeight: 500,
                            }}
                          >
                            Tải file kết quả
                          </a>
                        </div>
                      )}
                      <div style={{ marginTop: 10 }}>
                        <b>Nhân viên thực hiện:</b>{" "}
                        {selectedOrder.staffName || (
                          <span style={{ color: "#888" }}>Chưa cập nhật</span>
                        )}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <b>Xác nhận của Manager:</b>{" "}
                        {selectedOrder.managerConfirm ? (
                          <span style={{ color: "#009e74" }}>Đã xác nhận</span>
                        ) : (
                          <span style={{ color: "#888" }}>Chưa xác nhận</span>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Đánh giá dịch vụ */}
                  {selectedOrder.status === "Có kết quả" &&
                    !selectedOrder.feedback && (
                      <div style={{ margin: "18px 0 10px 0" }}>
                        <b>Đánh giá dịch vụ:</b>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            margin: "8px 0",
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={22}
                              color={ratingInput >= star ? "#ffc107" : "#ddd"}
                              style={{ cursor: "pointer" }}
                              onClick={() => setRatingInput(star)}
                            />
                          ))}
                          <span
                            style={{
                              color: "#888",
                              fontSize: 15,
                              marginLeft: 8,
                            }}
                          >
                            {ratingInput > 0 ? `${ratingInput}/5` : ""}
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          placeholder="Nhận xét của bạn về dịch vụ..."
                          value={feedbackInput}
                          onChange={(e) => setFeedbackInput(e.target.value)}
                          style={{
                            width: "100%",
                            borderRadius: 6,
                            margin: "8px 0",
                            padding: 8,
                            border: "1px solid #ccc",
                          }}
                        />
                        <button
                          onClick={() => {
                            if (ratingInput === 0) {
                              setFeedbackSuccess("Vui lòng chọn số sao!");
                              return;
                            }
                            addFeedback(
                              selectedOrder.id,
                              feedbackInput,
                              ratingInput
                            );
                            setFeedbackSuccess("Cảm ơn bạn đã đánh giá!");
                            setTimeout(() => setFeedbackSuccess(""), 2000);
                          }}
                          style={{
                            background: "#009e74",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "8px 24px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Gửi đánh giá
                        </button>
                        {feedbackSuccess && (
                          <div style={{ color: "#009e74", marginTop: 6 }}>
                            {feedbackSuccess}
                          </div>
                        )}
                      </div>
                    )}
                  {/* Hiển thị đánh giá đã gửi */}
                  {selectedOrder.status === "Có kết quả" &&
                    selectedOrder.feedback && (
                      <div style={{ margin: "18px 0 10px 0" }}>
                        <b>Đánh giá của bạn:</b>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            margin: "8px 0",
                          }}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={22}
                              color={
                                selectedOrder.rating >= star
                                  ? "#ffc107"
                                  : "#ddd"
                              }
                            />
                          ))}
                          <span
                            style={{
                              color: "#888",
                              fontSize: 15,
                              marginLeft: 8,
                            }}
                          >
                            {selectedOrder.rating}/5
                          </span>
                        </div>
                        <div
                          style={{
                            background: "#f6f8fa",
                            borderRadius: 6,
                            padding: 10,
                            color: "#333",
                          }}
                        >
                          {selectedOrder.feedback}
                        </div>
                      </div>
                    )}
                  {/* Xác nhận nhận kit tại nhà */}
                  {selectedOrder.sampleMethod === "home" &&
                    selectedOrder.kitStatus === "da_gui" && (
                      <div
                        style={{
                          margin: "18px 0",
                          padding: 14,
                          background: "#f6f8fa",
                          borderRadius: 8,
                          border: "1px solid #cce3d3",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#b88900",
                            marginBottom: 10,
                          }}
                        >
                          Bạn đã nhận được bộ kit xét nghiệm chưa?
                        </div>
                        <button
                          style={{
                            background: "#009e74",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "8px 24px",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            // Cập nhật kitStatus thành 'da_nhan'
                            const allOrders = JSON.parse(
                              localStorage.getItem("dna_orders") || "[]"
                            );
                            const idx = allOrders.findIndex(
                              (o) => o.id === selectedOrder.id
                            );
                            if (idx !== -1) {
                              allOrders[idx] = {
                                ...allOrders[idx],
                                kitStatus: "da_nhan",
                              };
                              localStorage.setItem(
                                "dna_orders",
                                JSON.stringify(allOrders)
                              );
                            }
                            setSelectedOrder({
                              ...selectedOrder,
                              kitStatus: "da_nhan",
                            });
                            setKitToast("Xác nhận nhận kit thành công!");
                            setTimeout(() => setKitToast(""), 2000);
                          }}
                        >
                          Tôi đã nhận kit
                        </button>
                      </div>
                    )}
                </div>
              </div>
            )}
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
              marginBottom: 32,
            }}
          >
            <h2
              style={{
                fontWeight: 800,
                fontSize: 32,
                marginBottom: 32,
                letterSpacing: -1,
              }}
            >
              Cài đặt tài khoản
            </h2>
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
      {/* Toast xác nhận nhận kit */}
      {kitToast && (
        <div
          style={{
            position: "fixed",
            top: 32,
            right: 32,
            background: "#009e74",
            color: "#fff",
            padding: "14px 32px",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 18,
            zIndex: 9999,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          }}
        >
          {kitToast}
        </div>
      )}
      {/* Toast nộp file */}
      {fileToast && (
        <div
          style={{
            position: "fixed",
            top: 80,
            right: 32,
            background: "#009e74",
            color: "#fff",
            padding: "14px 32px",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 18,
            zIndex: 9999,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          }}
        >
          {fileToast}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
