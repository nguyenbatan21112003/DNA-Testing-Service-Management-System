import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useOrderContext } from "../../context/OrderContext";
import { Tag } from "antd";
import { Eye, FileText, Star } from "lucide-react";
import TimelineProgress from "./TimelineProgress";
import NewOrderButton from "./NewOrderButton";
import customerApi from "../../api/customerApi";
import TestDetailModal from "./TestDetailModal";
// dayjs import removed because not used

const TestAppManagement = ({
  // onViewDetail = () => {},
  onViewResult = () => {},
  onDownloadResult = () => {},
  onGiveFeedback = () => {},
  onViewFeedback = () => {},
  // onConfirmKit = () => {},
}) => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const { user } = useContext(AuthContext);
  const { getAllOrders } = useOrderContext();

  const [userOrders, setUserOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [searchOrder, setSearchOrder] = useState("");

  // const [showTimeline, setShowTimeline] = useState({}); // {orderId: boolean}

  const fetchUserOrders = async () => {
    try {
      const res = await customerApi.getTestRequest(); // Gọi danh sách đơn
      const requestList = res?.data || [];

      const mapped = await Promise.all(
        requestList
          .filter((item) => item.status != "unpaid")
          .map(async (request) => {
            // console.log("request: ", request);
            const requestId = request.requestId;

            // Default values
            let testProcess = null;
            let declarant = {};
            let samples = [];

            try {
              // console.log('request nè:', request)
              // Chỉ fetch testProcess nếu không phải PENDING
              if (request.status !== "pending") {
                const resProcess = await customerApi.getTestProcessByRequestId(
                  requestId
                );
                testProcess = resProcess?.data || null;
              }
              const [resDeclarant, resSamples] = await Promise.all([
                // customerApi.getTestProcessByRequestId(requestId),
                customerApi.getDeclarantByRequestId(requestId),
                customerApi.getSamplesByRequestId(requestId),
              ]);

              // testProcess = resProcess?.data || null;
              declarant = resDeclarant?.data || {};
              // console.log("resSample nè", resSamples);
              samples = Array.isArray(resSamples?.data) ? resSamples.data : [];
              // console.log(samples);
            } catch (err) {
              console.warn(
                `Lỗi khi load dữ liệu phụ cho đơn ${requestId}`,
                err
              );
            }
            // console.log("declarant:", declarant);
            return {
              ...request,
              testProcess,
              declarant,
              feedbacks: request.feedbacks || [],
              samples,
              numPeople: samples?.length || 0,
              name: declarant.fullName || "",
              phone: declarant.phone || "",
              email: declarant.email || "",
              address: declarant.address || "",
              service: request.serviceName || "", // Nếu có
            };
          })
      );

      setUserOrders(mapped);
      // console.log(mapped);
    } catch (error) {
      console.error("Lỗi khi load danh sách đơn:", error.status);
    }
  };

  // Load đơn đăng ký của user
  useEffect(() => {
    if (!user) return;
    fetchUserOrders();
    // const loadUserOrders = () => {
    //   const allOrders = getAllOrders();
    //   const filtered = allOrders.filter(
    //     (o) => o.userId === user.id || o.email === user.email
    //   );
    //   setUserOrders(filtered);
    // };
    // loadUserOrders();

    // Theo dõi storage thay đổi
    // const onStorage = (e) => {
    //   if (e.key === "dna_orders") loadUserOrders();
    // };
    // window.addEventListener("storage", onStorage);
    // return () => window.removeEventListener("storage", onStorage);
  }, [user, getAllOrders]);

  // No feedback modal handled locally; any feedback actions are delegated to parent via callbacks

  const getSampleMethodLabel = (val) => {
    if (val === "At Home") return "Tại nhà";
    if (val === "At Center") return "Tại trung tâm";
    if (val === "self") return "Tự thu và gửi mẫu";
    return val;
  };

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
    // console.log('order nè',order)
    return order.testProcess?.currentStatus || order.status || "PENDING";
  };

  // Kit confirmation is handled by parent via onConfirmKit callback

  const handleDownloadResult = (order) => {
    onDownloadResult(order);
  };

  if (!user) return null;

  return (
    <>
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
          {/* Search & new */}
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
          {/* Filter status */}
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
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Hoàn thành">Hoàn thành</option>
            </select>
          </div>
          {/* Render orders */}
          {(() => {
            const filteredOrders = userOrders
              .filter((o) => {
                // const statusText = getStatusText(getDisplayStatus(o));
                if (filterStatus === "Tất cả") return true;
                if (filterStatus === "Chờ xác nhận")
                  return getDisplayStatus(o)?.toUpperCase() === "PENDING";
                if (filterStatus === "Đang xử lý")
                  return getDisplayStatus(o)?.toUpperCase() !== "COMPLETED";
                if (filterStatus === "Hoàn thành")
                  return getDisplayStatus(o)?.toUpperCase() === "COMPLETED";
                return true;
              })

              .filter((o) => {
                const keyword = searchOrder.trim().toLowerCase();
                return (
                  keyword === "" ||
                  `dna#${o.requestId}`.toLowerCase().includes(keyword) ||
                  o.service?.toLowerCase().includes(keyword)
                );
              });

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
                key={order.requestId}
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
                {/* ---- Order Info ---- */}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 20,
                  }}
                >
                  {/* Left info */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#009e74",
                          fontSize: 17,
                        }}
                      >
                        Mã đơn đăng ký: #{order.requestId}
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
                                return "#1890ff";
                              case "Chưa gửi kit":
                                return "#a259ec";
                              case "Đã gửi kit":
                                return "#00b894";
                              case "Đã gửi mẫu":
                                return "#13c2c2";
                              case "Đang xử lý":
                                return "#faad14";
                              case "Đã hẹn":
                                return "#40a9ff";
                              case "Đã nhận mẫu":
                                return "#006d75";
                              case "Đã nhân":
                                return "#52c41a";
                              case "Hoàn thành":
                                return "#52c41a";
                              case "Từ chối":
                                return "#ff4d4f";
                              default:
                                return "#bfbfbf";
                            }
                          })(),
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          marginLeft: 12,
                          minWidth: 90,
                          padding: "3px 12px",
                          textAlign: "center",
                        }}
                      >
                        {getStatusText(getDisplayStatus(order))}
                      </Tag>
                    </div>
                    <div style={{ marginBottom: 8 }}>{order.type}</div>
                    <div
                      style={{ color: "#888", fontSize: 15, marginBottom: 2 }}
                    >
                      <b>Thể loại:</b>{" "}
                      {order.category === "Voluntary"
                        ? "Dân sự"
                        : order.category === "Administrative"
                        ? "Hành chính"
                        : order.category}
                    </div>
                    <div
                      style={{ color: "#888", fontSize: 15, marginBottom: 8 }}
                    >
                      <b>Hình thức thu mẫu:</b>{" "}
                      {order.collectType
                        ? getSampleMethodLabel(order.collectType)
                        : "-"}
                    </div>

                    <div
                      style={{ color: "#888", fontSize: 15, marginBottom: 8 }}
                    >
                      <b>Ngày hẹn lấy mẫu:</b>{" "}
                      {order.scheduleDate
                        ? new Date(order.scheduleDate).toLocaleDateString(
                            "vi-VN"
                          )
                        : "-"}
                    </div>
                    <div
                      style={{ color: "#888", fontSize: 15, marginBottom: 8 }}
                    >
                      <b>Số người xét nghiệm:</b>{" "}
                      {typeof order.numPeople === "number"
                        ? order.numPeople
                        : "-"}
                    </div>
                    <div style={{ color: "#888", fontSize: 15 }}>
                      Ngày đăng ký:{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                        : "-"}
                    </div>
                    {order.appointmentDate &&
                      order.sampleMethod === "At Center" && (
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
                  {/* Right actions */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      alignItems: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => handleViewDetail(order)}
                      style={buttonStyle("#16a34a")}
                    >
                      <Eye size={20} style={{ marginRight: 6 }} /> Xem chi tiết
                    </button>

                    {(getStatusText(getDisplayStatus(order)) ===
                      "Đã có kết quả" ||
                      getStatusText(getDisplayStatus(order)) ===
                        "Hoàn thành") && (
                      <button
                        onClick={() => onViewResult(order)}
                        style={buttonStyle("#1677ff")}
                      >
                        <FileText size={20} style={{ marginRight: 6 }} /> Xem
                        kết quả
                      </button>
                    )}

                    {(getStatusText(getDisplayStatus(order)) ===
                      "Đã có kết quả" ||
                      getStatusText(getDisplayStatus(order)) ===
                        "Hoàn thành") &&
                      order.type &&
                      order.type.toLowerCase().includes("hành chính") && (
                        <button
                          onClick={() => handleDownloadResult(order)}
                          style={buttonStyle("#00bfae")}
                        >
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            style={{ marginRight: 6 }}
                          >
                            <path
                              d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                              stroke="#fff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Tải kết quả
                        </button>
                      )}

                    {(getStatusText(getDisplayStatus(order)) ===
                      "Đã có kết quả" ||
                      getStatusText(getDisplayStatus(order)) ===
                        "Hoàn thành") && (
                      <>
                        {order.feedbacks && order.feedbacks.length > 0 ? (
                          <button
                            onClick={() => onViewFeedback(order)}
                            style={outlineButtonStyle("#ffc53d")}
                          >
                            <Star size={20} style={{ marginRight: 6 }} /> Xem
                            đánh giá
                          </button>
                        ) : (
                          <button
                            onClick={() => onGiveFeedback(order)}
                            style={buttonStyle("#ffc53d")}
                          >
                            <Star size={20} style={{ marginRight: 6 }} /> Đánh
                            giá
                          </button>
                        )}
                      </>
                    )}

                    {/* {getStatusText(getDisplayStatus(order)) ===
                      "Đã gửi kit" && (
                      <button
                        onClick={() => onConfirmKit(order)}
                        style={buttonStyle("#00bfae")}
                      >
                        Xác nhận đã nhận kit
                      </button>
                    )} */}
                  </div>
                </div>

                {/* Timeline toggle */}
                {/* <button
                  style={{
                    background: showTimeline[order.requestId]
                      ? "#e6f7f1"
                      : "#fff",
                    color: "#009e74",
                    border: "1px solid #009e74",
                    borderRadius: 6,
                    padding: "6px 12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 14,
                    alignSelf: "center",
                    maxWidth: 220,
                    lineHeight: 1.3,
                    textAlign: "center",
                    whiteSpace: "normal",
                  }}
                  onClick={() =>
                    setShowTimeline((prev) => ({
                      ...prev,
                      [order.requestId]: !prev[order.requestId],
                    }))
                  }
                >
                  {showTimeline[order.requestId]
                    ? "Ẩn timeline"
                    : "Xem tiến độ & timeline xử lý"}
                </button>
                {showTimeline[order.requestId] && (
                  <TimelineProgress order={order} />
                )} */}
              </div>
            ));
          })()}
        </div>
      </div>
      <TestDetailModal
        isOpen={detailModalVisible}
        order={selectedOrder}
        onClose={() => setDetailModalVisible(false)}
      />
    </>
  );

  function buttonStyle(color) {
    return {
      border: `1.5px solid ${color}`,
      color: "#fff",
      background: color,
      borderRadius: 6,
      padding: "6px 14px",
      fontWeight: 600,
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      transition: "background 0.2s, color 0.2s, border 0.2s",
      outline: "none",
      cursor: "pointer",
      boxShadow: `0 2px 8px ${color}22`,
      minWidth: 160,
      width: "100%",
    };
  }

  function outlineButtonStyle(color) {
    return {
      border: `1.5px solid ${color}`,
      color: color,
      background: "#fff",
      borderRadius: 6,
      padding: "6px 14px",
      fontWeight: 600,
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      transition: "background 0.2s, color 0.2s, border 0.2s",
      outline: "none",
      cursor: "pointer",
      boxShadow: `0 2px 8px ${color}22`,
      minWidth: 160,
      width: "100%",
    };
  }
};

export default TestAppManagement;
