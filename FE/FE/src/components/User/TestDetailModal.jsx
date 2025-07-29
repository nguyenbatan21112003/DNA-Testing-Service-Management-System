import React from "react";
import { Modal, Tag } from "antd";

const TestDetailModal = ({ isOpen, order, onClose }) => {
  if (!isOpen || !order) return null;

  const getSampleMethodLabel = (val) => {
    if (val === "At Home") return "Tại nhà";
    if (val === "At Center") return "Tại trung tâm";
    if (val === "self") return "Tự thu và gửi mẫu";
    return val;
  };

  // Helper: chuẩn hóa status hiển thị
  // console.log(order)
  const getStatusText = (statusRaw) => {
    const status = statusRaw?.toUpperCase() || "";

    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đang xử lý";
      case "KIT NOT SENT":
        return "Chưa gửi kit";
      case "KIT SENT":
        return "Đã gửi kit";
      // case "SAMPLE_COLLECTING":
      case "SAMPLE_RECEIVED":
        return "Đã nhận mẫu";
      // case "PROCESSING":
      // case "WAITING_APPROVAL":
      case "WAITING_FOR_APPOINTMENT":
        return "Chờ đến ngày hẹn";
      case "REJECTED":
        return "Đang xử lý";
      case "COMPLETED":
        return "Hoàn thành";
      default:
        return "Không xác định";
    }
  };

  const getDisplayStatus = (order) => {
    return order.testProcess?.currentStatus || order.status || "PENDING";
  };

  /**
   * Trả về màu cho Tag dựa trên statusText.
   */
  const getStatusColor = (statusText) => {
    switch (statusText) {
      case "Chờ xác nhận":
        return "#1890ff";
      case "Chưa gửi kit":
        return "#a259ec";
      case "Đã gửi kit":
        return "#00b894";
      case "Đã nhận mẫu":
        return "#13c2c2";
      case "Đang xử lý":
        return "#faad14";
      case "Đã hẹn":
        return "#40a9ff";
      case "Đã đến":
        return "#006d75";
      case "Đã có kết quả":
      case "Hoàn thành":
        return "#52c41a";
      case "Từ chối":
        return "#ff4d4f";
      default:
        return "#bfbfbf";
    }
  };

  const statusText = getStatusText(getDisplayStatus(order));

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
      closeIcon={<span style={{ fontSize: 26, color: "#888" }}>&times;</span>}
      bodyStyle={{ padding: 32, borderRadius: 18 }}
    >
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
          <span style={{ fontWeight: 700, color: "#009e74" }}>Mã đơn:</span>{" "}
          <span style={{ color: "#009e74", fontWeight: 700 }}>
            #{order.requestId}
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
          <span style={{ fontWeight: 600, color: "#888", marginRight: 2 }}>
            Trạng thái:
          </span>
          <Tag
            style={{
              fontWeight: 600,
              fontSize: 15,
              background: getStatusColor(statusText),
              color: "#fff",
              border: "none",
              borderRadius: 8,
              marginLeft: 12,
              minWidth: 90,
              padding: "3px 12px",
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {statusText}
          </Tag>
          <span style={{ fontWeight: 600, color: "#888", marginLeft: 8 }}>
            Thể loại:
          </span>
          <Tag
            color={order.category === "Voluntary" ? "#722ed1" : "#36cfc9"}
            style={{ fontWeight: 600, fontSize: 15 }}
          >
            {order.category === "Voluntary"
              ? "Dân sự"
              : order.category === "Administrative"
              ? "Hành chính"
              : order.category}
          </Tag>
        </div>
        <div>
          <span style={{ fontWeight: 600 }}>Họ tên:</span>{" "}
          <span>{order.name}</span>
        </div>
        <div>
          <span style={{ fontWeight: 600 }}>Số điện thoại:</span>{" "}
          <span>{order.phone}</span>
        </div>
        <div>
          <span style={{ fontWeight: 600 }}>Email:</span>{" "}
          <span>{order.email}</span>
        </div>
        <div>
          <span style={{ fontWeight: 600 }}>Địa chỉ:</span>{" "}
          <span>{order.address}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 2,
            flexWrap: "nowrap",
          }}
        >
          <span style={{ fontWeight: 600, minWidth: 120, flexShrink: 0 }}>
            Loại xét nghiệm:
          </span>
          <span>{order.serviceName ? order.serviceName : ""}</span>
        </div>

        {order.samples?.length > 0 &&
          order.samples.some(
            (s) => s.ownerName || s.relationship || s.sampleType || s.yob
          ) && (
            <>
              <div
                style={{ borderTop: "1px solid #e6e6e6", margin: "12px 0" }}
              />
              <div style={{ fontWeight: 700, marginTop: 16 }}>
                Danh sách người cung cấp mẫu:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {order.samples.map((s, idx) => (
                  <div
                    key={s.sampleId || idx}
                    style={{
                      background: "#f9f9f9",
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      padding: 10,
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    <div>
                      <strong>Họ tên:</strong> {s.ownerName || "-"}
                    </div>
                    <div>
                      <strong>Quan hệ:</strong> {s.relationship || "-"}
                    </div>
                    <div>
                      <strong>Năm sinh:</strong> {s.yob || "-"}
                    </div>
                    <div>
                      <strong>Loại mẫu:</strong> {s.sampleType || "-"}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        <div style={{ borderTop: "1px solid #e6e6e6", margin: "12px 0" }} />
        <div>
          <span style={{ fontWeight: 600 }}>Hình thức thu mẫu:</span>{" "}
          <span>
            {order.collectType ? getSampleMethodLabel(order.collectType) : "-"}
          </span>
        </div>
        {order.collectType === "At Home" ? (
          <div>
            <span style={{ fontWeight: 600 }}>Mã kit:</span>{" "}
            <span>{order.testProcess?.kitCode || "-"}</span>
          </div>
        ) : order.collectType === "At Center" ? (
          <>
            <div>
              <span style={{ fontWeight: 600 }}>Địa điểm thu mẫu:</span>{" "}
              <span>
                2A Phan Chu Trinh, Hiệp Phú, Thủ Đức, Hồ Chí Minh 71300, Vietnam
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 600 }}>Ngày hẹn lấy mẫu:</span>{" "}
              <span>
                {order.scheduleDate
                  ? new Date(order.scheduleDate).toLocaleDateString("vi-VN")
                  : "-"}
              </span>
            </div>
          </>
        ) : null}

        <div>
          <span style={{ fontWeight: 600 }}>Ngày đăng ký:</span>{" "}
          <span>
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("vi-VN")
              : "-"}
          </span>
        </div>
        {order.appointmentDate && order.sampleMethod === "At Center" && (
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
            Ngày lấy mẫu: {order.appointmentDate}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TestDetailModal;
