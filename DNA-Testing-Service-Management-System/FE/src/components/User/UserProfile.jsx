import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useOrderContext } from "../../context/OrderContext";
import { useNavigate } from "react-router-dom";
import { Modal, message } from "antd";
import React from "react";
import SlideBarMenu from "./SlideBarMenu";
import UserSetting from "./UserSetting";
import TestDetailModal from "./TestDetailModal";
import TestAppManagement from "./TestAppManagement";
import Feedback from "./Feedback";
import CivilTestResult from "./CivilTestResult";
import AdminTestResult from "./AdminTestResult";
import userApi from "../../api/userApI";

const UserProfile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
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

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [, setFeedbackInput] = useState("");

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const [, setOverallRating] = useState(0);

  const [_showFormModal] = useState(false); // placeholder, feature disabled
  const [showConfirmKitModal, setShowConfirmKitModal] = useState(false);
  const [kitInfo, setKitInfo] = useState(null);
  const [, setUserOrders] = useState([]); // only setter needed for feedback updates

  //fetch userProfile data:
  //fetch userProfile data:
  const fetchUserProfile = async () => {
    try {
      const response = await userApi.getUserProfileByGmail(user.email);
      if (response?.data?.data) {
        const userPro = response.data.data;
        const dobRaw = userPro?.dateOfBirth || "";
        const dobFormatted = dobRaw ? dobRaw.split("T")[0] : "";

        setForm({
          fullName: user?.fullName || "",
          email: user?.email || "",
          phone: userPro.phoneNumber || "",
          address: userPro.address || "",
          birthDate: dobFormatted,
          gender: userPro.gender || "Nam",
          identityID: userPro.identityID || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        message.error("Không thể tải thông tin người dùng.");
      }
    }
  };

  useEffect(() => {
    if (!user) return; // Thêm dòng này
    fetchUserProfile();
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

  useEffect(() => {
    if (
      showFeedbackModal &&
      selectedOrder &&
      selectedOrder.feedbacks &&
      selectedOrder.feedbacks.length > 0
    ) {
      const lastFb =
        selectedOrder.feedbacks[selectedOrder.feedbacks.length - 1];
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formUpdate = {
      fullName: form.fullName,
      phone: form.phone,
      gender: form.gender,
      address: form.address,
      dateOfBirth: form.birthDate,
      identityID: "",
      fingerfile: "",
    };
    const check = await updateUser(formUpdate);
    fetchUserProfile()
    if (check) {
      setSuccess("Cập nhật thông tin thành công!");
      setTimeout(() => setSuccess(""), 2000);
    }
  };

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
  // Hàm chuyển đổi mã địa điểm thu mẫu sang nhãn thân thiện
  // const _getSampleMethodLabel = (val) => {
  //   if (val === "home") return "Tại nhà";
  //   if (val === "center") return "Tại trung tâm";
  //   if (val === "self") return "Tự thu và gửi mẫu";
  //   return val;
  // };

  // const _getStatusText = (status) => {
  //   if (status === "Đang lấy mẫu" || status === "SAMPLE_COLLECTING")
  //     return "Đang xử lý";
  //   switch (status) {
  //     case "PENDING_CONFIRM":
  //       return "Chờ xác nhận";
  //     case "KIT_NOT_SENT":
  //       return "Chưa gửi kit";
  //     case "KIT_SENT":
  //       return "Đã gửi kit";
  //     case "SAMPLE_RECEIVED":
  //       return "Đã gửi mẫu";
  //     case "PROCESSING":
  //       return "Đang xử lý";
  //     case "COMPLETED":
  //       return "Đã có kết quả";
  //     case "WAITING_APPROVAL":
  //     case "CHO_XAC_THUC":
  //     case "Chờ xác thực":
  //     case "REJECTED":
  //     case "Từ chối":
  //       return "Đang xử lý";
  //     default:
  //       return status;
  //   }
  // };

  // const _getDisplayStatus = (order) => {
  //   return (
  //     order.status ||
  //     order.samplingStatus ||
  //     order.kitStatus ||
  //     "PENDING_CONFIRM"
  //   );
  // };

  const handleDownloadResult = (order) => {
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
      <SlideBarMenu
        tab={tab}
        setTab={setTab}
        setShowLogoutModal={setShowLogoutModal}
      />
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 32,
                }}
              >
                <button
                  type="submit"
                  className="profile-save-btn"
                  style={{
                    background: "#009e74",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 48px",
                    fontWeight: 700,
                    fontSize: 20,
                    boxShadow: "0 2px 12px #009e7422",
                    cursor: "pointer",
                    transition: "background 0.2s, box-shadow 0.2s",
                    margin: "0 auto",
                    display: "block",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#00c896";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#009e74";
                  }}
                >
                  Lưu thay đổi
                </button>
              </div>
              {success && <span className="form-success">{success}</span>}
            </form>
          )}
          {tab === "orders" && (
            <TestAppManagement
              onViewDetail={(order) => {
                setSelectedOrder(order);
                setShowDetailModal(true);
              }}
              onViewResult={(order) => {
                setSelectedOrder(order);
                setShowResultModal(true);
              }}
              onDownloadResult={(order) => handleDownloadResult(order)}
              onGiveFeedback={(order) => {
                setSelectedOrder(order);
                setOverallRating(0);
                setFeedbackInput("");
                setShowFeedbackModal(true);
              }}
              onViewFeedback={(order) => {
                setSelectedOrder(order);
                const lastFb = order.feedbacks[order.feedbacks.length - 1];
                setOverallRating(lastFb.rating);
                setFeedbackInput(lastFb.feedback);
                setShowFeedbackModal(true);
              }}
              onConfirmKit={(order) => handleUserConfirmKit(order)}
            />
          )}
          {tab === "settings" && <UserSetting />}
        </div>
      </div>
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
      <Feedback
        isOpen={showFeedbackModal}
        order={selectedOrder}
        onClose={() => setShowFeedbackModal(false)}
        addFeedback={addFeedback}
        setUserOrders={setUserOrders}
      />
      <TestDetailModal
        isOpen={showDetailModal}
        order={selectedOrder}
        onClose={() => setShowDetailModal(false)}
      />
      <CivilTestResult
        isOpen={showResultModal}
        order={selectedOrder}
        onClose={() => setShowResultModal(false)}
      />
      <AdminTestResult
        isOpen={showResultModal}
        order={selectedOrder}
        onClose={() => setShowResultModal(false)}
      />
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
