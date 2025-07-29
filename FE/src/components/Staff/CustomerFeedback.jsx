"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Rate,
  Select,
  Input,
  Tooltip,
} from "antd";
import { EyeOutlined, StarOutlined } from "@ant-design/icons";
// import { useOrderContext } from "../../context/OrderContext";
import staffApi from "../../api/staffApi";

const { Option } = Select;
const { Search } = Input;

const CustomerFeedback = () => {
  // const { getAllOrders } = useOrderContext();
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterRating, setFilterRating] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Lấy dữ liệu phản hồi từ localStorage
    loadFeedbacksFromServer();

    // // Thêm event listener để cập nhật feedbacks khi localStorage thay đổi
    // window.addEventListener("storage", handleStorageChange);

    // // Cleanup khi component unmount
    // return () => {
    //   window.removeEventListener("storage", handleStorageChange);
    // };
  }, []);

  // Hàm xử lý khi localStorage thay đổi
  // const handleStorageChange = (event) => {
  //   if (event.key === "dna_orders") {
  //     loadFeedbacks();
  //   }
  // };
  const loadFeedbacksFromServer = async () => {
    try {
      const res = await staffApi.getTestProccesses();
      const testProcesses = Array.isArray(res.data) ? res.data : [];

      const completedProcesses = testProcesses.filter(
        (item) => item.testProcess?.currentStatus === "completed"
      );

      const feedbackList = [];

      for (const item of completedProcesses) {
        try {
          const requestId = item.request.requestId;

          const resResult = await staffApi.getTestResultByRequestId(requestId);
          const testResult = Array.isArray(resResult.data)
            ? resResult.data
            : [];

          const resultId = testResult[0]?.resultId;
          if (!resultId) continue;

          const feedbackRes = await staffApi.getFeedbackByResultId(resultId);

          if (
            feedbackRes.status === 200 &&
            feedbackRes.data != null &&
            feedbackRes.data.resultId !== null
          ) {
            const feedback = feedbackRes.data;
            feedbackList.push({
              id: feedback.feedbackId,
              orderId: requestId,
              resultId: resultId,
              phone: item.declarant?.phone,
              gender: item.declarant?.gender,
              customerName: item.declarant?.fullName,
              email: item.declarant?.email,
              method: item.request?.collectType,
              rating: feedback.rating,
              comment: feedback.comment,
              createdAt: new Date(feedback.createdAt).toLocaleDateString(
                "vi-VN"
              ),
              status: "Chưa xem",
              category: item.request.category,
              serviceType: item.request.serviceName,
            });
          }
        } catch (innerError) {
          console.warn(
            "Bỏ qua đơn lỗi:",
            innerError?.response?.status || innerError.message
          );
          continue;
        }
      }

      setFeedbacks(feedbackList);
      applyFilters(feedbackList, filterRating, searchText);
    } catch (error) {
      console.error("Lỗi khi load phản hồi", error.status);
    }
  };

  // Hàm load phản hồi từ các đơn đăng ký
  // const loadFeedbacks = () => {
  //   const allOrders = getAllOrders();
  //   const allFeedbacks = [];

  //   // Tìm tất cả phản hồi trong các đơn đăng ký
  //   allOrders.forEach((order) => {
  //     if (order.feedbacks && order.feedbacks.length > 0) {
  //       order.feedbacks.forEach((feedback, index) => {
  //         allFeedbacks.push({
  //           id: `${order.id}-${index}`,
  //           orderId: order.id,
  //           customerName: feedback.user,
  //           email: feedback.email,
  //           serviceType: order.type,
  //           rating: feedback.rating,
  //           comment: feedback.feedback,
  //           createdAt: feedback.date,
  //           status: "Chưa xem",
  //           category: getCategoryFromRatings(feedback.categoryRatings),
  //           categoryRatings: feedback.categoryRatings,
  //         });
  //       });
  //     }
  //   });

  //   // Sắp xếp theo thời gian mới nhất
  //   allFeedbacks.sort((a, b) => {
  //     const dateA = parseVietnameseDate(a.createdAt);
  //     const dateB = parseVietnameseDate(b.createdAt);
  //     return dateB - dateA;
  //   });

  //   setFeedbacks(allFeedbacks);
  //   applyFilters(allFeedbacks, filterRating, searchText);
  // };

  // Hàm chuyển đổi ngày dạng Việt Nam sang Date object
  const parseVietnameseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Hàm chuyển đổi tên danh mục từ key
  const getCategoryName = (key) => {
    const categoryMap = {
      quality: "Chất lượng dịch vụ",
      price: "Giá cả",
      time: "Thời gian xử lý",
      staff: "Nhân viên",
      website: "Website",
      overall: "Tổng thể",
    };
    return categoryMap[key] || key;
  };
  const normalizeText = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // Hàm xác định danh mục chính từ đánh giá
  // const getCategoryFromRatings = (ratings) => {
  //   if (!ratings || Object.keys(ratings).length === 0) {
  //     return "Tổng thể";
  //   }

  //   // Tìm danh mục có điểm cao nhất
  //   const entries = Object.entries(ratings).filter(([, value]) => value > 0);
  //   if (entries.length === 0) return "Tổng thể";

  //   // Sắp xếp theo điểm giảm dần và lấy danh mục đầu tiên
  //   const highestCategory = entries.sort((a, b) => b[1] - a[1])[0][0];
  //   return getCategoryName(highestCategory);
  // };

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setModalVisible(true);

    // Cập nhật trạng thái đã xem
    const updatedFeedbacks = feedbacks.map((f) => {
      if (f.id === feedback.id) {
        return { ...f, status: "Đã xem" };
      }
      return f;
    });

    setFeedbacks(updatedFeedbacks);
    applyFilters(updatedFeedbacks, filterRating, searchText);
  };

  const handleRatingFilterChange = (value) => {
    setFilterRating(value);
    applyFilters(feedbacks, value, searchText);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    applyFilters(feedbacks, filterRating, value);
  };

  const applyFilters = (data, rating, search) => {
    let filtered = [...data];

    if (rating !== "all") {
      filtered = filtered.filter((item) => item.rating === parseInt(rating));
    }

    if (search) {
      const searchLower = normalizeText(search);
      filtered = filtered.filter(
        (item) =>
          normalizeText(item.customerName).includes(searchLower) ||
          item.orderId.toString().includes(searchLower) ||
          normalizeText(item.serviceType || "").includes(searchLower) ||
          normalizeText(item.comment || "").includes(searchLower)
      );
    }

    setFilteredFeedbacks(filtered);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <a>#{text}</a>,
      width: 120,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: 180,
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceType",
      key: "serviceType",
      width: 200,
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: 140,
      render: (rating) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
          <span>({rating})</span>
        </div>
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      sorter: (a, b) => {
        const dateA = parseVietnameseDate(a.createdAt);
        const dateB = parseVietnameseDate(b.createdAt);
        return dateA - dateB;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined style={{ fontSize: 14 }} />}
          style={{
            background: "#1890ff",
            borderColor: "#1890ff",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            height: 28,
            padding: "0 10px",
            transition: "background 0.2s, color 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#1765ad";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#1765ad";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#1890ff";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#1890ff";
          }}
          onClick={() => handleViewFeedback(record)}
        >
          <span style={{ marginLeft: 4 }}>Xem</span>
        </Button>
      ),
    },
  ];

  // Tính toán tổng số đánh giá và trung bình cộng
  const totalFeedbacks = feedbacks.length;
  const totalRating = feedbacks.reduce(
    (sum, feedback) => sum + feedback.rating,
    0
  );
  const averageRating =
    totalFeedbacks > 0 ? (totalRating / totalFeedbacks).toFixed(1) : "0.0";

  // Tính toán phân bổ đánh giá (5 sao, 4 sao, ...)
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: feedbacks.filter((f) => f.rating === rating).length,
    percentage:
      feedbacks.length > 0
        ? (
            (feedbacks.filter((f) => f.rating === rating).length /
              feedbacks.length) *
            100
          ).toFixed(1)
        : 0,
  }));

  // Số phản hồi chưa xem
  const unreadCount = feedbacks.filter((f) => f.status === "Chưa xem").length;

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}
        >
          Phản hồi khách hàng
          {unreadCount > 0 && (
            <Tag color="orange" style={{ marginLeft: 12, fontSize: 14 }}>
              {unreadCount} mới
            </Tag>
          )}
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
          Quản lý và theo dõi phản hồi từ khách hàng
        </p>
      </div>

      {/* Thống kê tổng quan */}
      <div
        style={{
          marginBottom: 24,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        <Card>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#00a67e",
                marginBottom: 8,
              }}
            >
              {averageRating}
            </div>
            <Rate
              disabled
              defaultValue={Number.parseFloat(averageRating)}
              allowHalf
              style={{ marginBottom: 8 }}
            />
            <div style={{ color: "#666" }}>Đánh giá trung bình</div>
            <div style={{ color: "#999", fontSize: 12 }}>
              ({totalFeedbacks} đánh giá)
            </div>
          </div>
        </Card>

        <Card>
          <div>
            <h4 style={{ margin: "0 0 12px 0", fontWeight: 600 }}>
              Phân bố đánh giá
            </h4>
            {ratingDistribution.map((item) => (
              <div
                key={item.rating}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 60,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <span>{item.rating}</span>
                  <StarOutlined style={{ color: "#fadb14", fontSize: 14 }} />
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    background: "#f0f0f0",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${item.percentage}%`,
                      background:
                        item.rating >= 4
                          ? "#52c41a"
                          : item.rating === 3
                          ? "#faad14"
                          : item.rating <= 2
                          ? "#ff4d4f"
                          : "#00a67e",
                      borderRadius: 4,
                    }}
                  />
                </div>
                <div style={{ width: 80, textAlign: "right" }}>
                  {item.count} ({item.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <Select
              defaultValue="all"
              style={{ width: 150, marginRight: 16 }}
              onChange={handleRatingFilterChange}
            >
              <Option value="all">Tất cả đánh giá</Option>
              <Option value="5">5 sao</Option>
              <Option value="4">4 sao</Option>
              <Option value="3">3 sao</Option>
              <Option value="2">2 sao</Option>
              <Option value="1">1 sao</Option>
            </Select>
          </div>
          <div>
            <Search
              placeholder="Tìm theo khách hàng, mã đơn, dịch vụ..."
              onChange={(e) => handleSearch(e.target.value)}
              value={searchText}
              allowClear
              style={{ width: 300 }}
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredFeedbacks}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} phản hồi`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal xem chi tiết phản hồi */}
      <Modal
        title={`Chi tiết phản hồi - Đơn #${selectedFeedback?.orderId}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedFeedback && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>Thông tin khách hàng:</h3>
              <p>
                <strong>Họ tên:</strong> {selectedFeedback.customerName}
              </p>
              <p>
                <strong>Email:</strong> {selectedFeedback.email}
              </p>
              <p>
                <strong>Đơn hàng:</strong> #{selectedFeedback.orderId}
              </p>
              <p>
                <strong>Dịch vụ:</strong> {selectedFeedback.serviceType}
              </p>
              <p>
                <strong>Danh mục chính:</strong>{" "}
                <Tag color="blue">
                  {selectedFeedback.category == "Voluntary"
                    ? "Dân sự"
                    : "Hành chính"}
                </Tag>
              </p>
            </div>

            {selectedFeedback.categoryRatings &&
              Object.keys(selectedFeedback.categoryRatings).length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h3>Đánh giá chi tiết:</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                    {Object.entries(selectedFeedback.categoryRatings).map(
                      ([category, rating]) =>
                        rating > 0 ? (
                          <div key={category} style={{ minWidth: 180 }}>
                            <p style={{ margin: "0 0 4px 0" }}>
                              <strong>{getCategoryName(category)}:</strong>
                            </p>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Rate
                                disabled
                                value={rating}
                                style={{ fontSize: 14 }}
                              />
                              <span style={{ marginLeft: 8 }}>
                                ({rating}/5)
                              </span>
                            </div>
                          </div>
                        ) : null
                    )}
                  </div>
                </div>
              )}
            <div style={{ marginBottom: 16 }}>
              <h3>Nội dung phản hồi:</h3>
              <div
                style={{
                  background: "#f6f6f6",
                  padding: 16,
                  borderRadius: 6,
                  borderLeft: `4px solid ${
                    selectedFeedback.rating >= 4
                      ? "#52c41a"
                      : selectedFeedback.rating >= 3
                      ? "#faad14"
                      : "#ff4d4f"
                  }`,
                }}
              >
                {selectedFeedback.comment}
              </div>
            </div>

            <div style={{ color: "#666", fontSize: 12 }}>
              Phản hồi lúc: {selectedFeedback.createdAt}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerFeedback;
