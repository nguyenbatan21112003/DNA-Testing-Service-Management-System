"use client"

import { useState, useEffect } from "react"
import { Card, Table, Tag, Button, Modal, Rate, Select, Input } from "antd"
import { EyeOutlined, StarOutlined } from "@ant-design/icons"

const { Option } = Select
const { Search } = Input

const CustomerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([])
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [filterRating, setFilterRating] = useState("all")
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    // Tạo dữ liệu mẫu cho phản hồi khách hàng
    const sampleFeedbacks = [
      {
        id: 1,
        customerName: "Nguyễn Văn Minh",
        email: "nguyenvanminh@gmail.com",
        orderId: 1001,
        serviceType: "Xét nghiệm ADN cha con",
        rating: 5,
        comment:
          "Dịch vụ rất tốt, nhân viên tư vấn nhiệt tình. Kết quả chính xác và nhanh chóng. Tôi rất hài lòng với dịch vụ của DNA Lab.",
        createdAt: "15/06/2024 14:30",
        status: "Đã xem",
        category: "Chất lượng dịch vụ",
      },
      {
        id: 2,
        customerName: "Trần Thị Hương",
        email: "tranthihuong@gmail.com",
        orderId: 1002,
        serviceType: "Xét nghiệm ADN huyết thống",
        rating: 4,
        comment:
          "Quy trình lấy mẫu chuyên nghiệp, thời gian chờ kết quả hợp lý. Tuy nhiên giá cả hơi cao so với mặt bằng chung.",
        createdAt: "14/06/2024 16:45",
        status: "Chưa xem",
        category: "Giá cả",
      },
      {
        id: 3,
        customerName: "Lê Văn Đức",
        email: "levanduc@gmail.com",
        orderId: 1003,
        serviceType: "Xét nghiệm ADN cha con",
        rating: 5,
        comment: "Excellent service! Kết quả rất chính xác, nhân viên hỗ trợ tận tình. Sẽ giới thiệu cho bạn bè.",
        createdAt: "13/06/2024 09:20",
        status: "Đã xem",
        category: "Chất lượng dịch vụ",
      },
      {
        id: 4,
        customerName: "Phạm Thị Mai",
        email: "phamthimai@gmail.com",
        orderId: 1004,
        serviceType: "Xét nghiệm ADN anh em",
        rating: 3,
        comment: "Dịch vụ ổn nhưng thời gian chờ hơi lâu. Hy vọng có thể cải thiện tốc độ xử lý.",
        createdAt: "12/06/2024 11:15",
        status: "Chưa xem",
        category: "Thời gian xử lý",
      },
      {
        id: 5,
        customerName: "Hoàng Văn Nam",
        email: "hoangvannam@gmail.com",
        orderId: 1005,
        serviceType: "Xét nghiệm ADN huyết thống",
        rating: 4,
        comment: "Nhân viên lấy mẫu tại nhà rất chuyên nghiệp và lịch sự. Kết quả chính xác. Cảm ơn DNA Lab!",
        createdAt: "11/06/2024 15:30",
        status: "Đã xem",
        category: "Nhân viên",
      },
      {
        id: 6,
        customerName: "Vũ Thị Lan",
        email: "vuthilan@gmail.com",
        orderId: 1006,
        serviceType: "Xét nghiệm ADN cha con",
        rating: 5,
        comment: "Tôi rất hài lòng với dịch vụ. Từ tư vấn đến có kết quả đều rất chuyên nghiệp. Giá cả hợp lý.",
        createdAt: "10/06/2024 13:45",
        status: "Đã xem",
        category: "Tổng thể",
      },
      {
        id: 7,
        customerName: "Đặng Văn Hải",
        email: "dangvanhai@gmail.com",
        orderId: 1007,
        serviceType: "Xét nghiệm ADN mẹ con",
        rating: 2,
        comment: "Thời gian chờ quá lâu, nhân viên tư vấn chưa nhiệt tình. Cần cải thiện chất lượng dịch vụ.",
        createdAt: "09/06/2024 10:20",
        status: "Chưa xem",
        category: "Chất lượng dịch vụ",
      },
      {
        id: 8,
        customerName: "Bùi Thị Nga",
        email: "buithinga@gmail.com",
        orderId: 1008,
        serviceType: "Xét nghiệm ADN huyết thống",
        rating: 4,
        comment: "Dịch vụ tốt, kết quả chính xác. Tuy nhiên website cần cải thiện để dễ sử dụng hơn.",
        createdAt: "08/06/2024 14:10",
        status: "Đã xem",
        category: "Website",
      },
    ]

    setFeedbacks(sampleFeedbacks)
    setFilteredFeedbacks(sampleFeedbacks)
  }, [])

  useEffect(() => {
    let filtered = feedbacks

    // Lọc theo rating
    if (filterRating !== "all") {
      filtered = filtered.filter((feedback) => feedback.rating === Number.parseInt(filterRating))
    }

    // Tìm kiếm theo tên khách hàng hoặc comment
    if (searchText) {
      filtered = filtered.filter(
        (feedback) =>
          feedback.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
          feedback.comment.toLowerCase().includes(searchText.toLowerCase()),
      )
    }

    setFilteredFeedbacks(filtered)
  }, [filterRating, searchText, feedbacks])

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback)
    setModalVisible(true)

    // Đánh dấu là đã xem
    if (feedback.status === "Chưa xem") {
      const updatedFeedbacks = feedbacks.map((f) => (f.id === feedback.id ? { ...f, status: "Đã xem" } : f))
      setFeedbacks(updatedFeedbacks)
    }
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (id) => `#${id}`,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
    },
    {
      title: "Đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      width: 100,
      render: (orderId) => `#${orderId}`,
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceType",
      key: "serviceType",
      width: 180,
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: 120,
      render: (rating) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
          <span>({rating})</span>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => <Tag color={status === "Đã xem" ? "green" : "orange"}>{status}</Tag>,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewFeedback(record)}>
          Xem
        </Button>
      ),
    },
  ]

  const averageRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length).toFixed(1)
      : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: feedbacks.filter((f) => f.rating === rating).length,
    percentage:
      feedbacks.length > 0
        ? ((feedbacks.filter((f) => f.rating === rating).length / feedbacks.length) * 100).toFixed(1)
        : 0,
  }))

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}>Phản hồi khách hàng</h1>
        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>Quản lý và theo dõi phản hồi từ khách hàng</p>
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
            <div style={{ fontSize: 32, fontWeight: 700, color: "#00a67e", marginBottom: 8 }}>{averageRating}</div>
            <Rate disabled defaultValue={Number.parseFloat(averageRating)} allowHalf style={{ marginBottom: 8 }} />
            <div style={{ color: "#666" }}>Đánh giá trung bình</div>
            <div style={{ color: "#999", fontSize: 12 }}>({feedbacks.length} đánh giá)</div>
          </div>
        </Card>

        <Card title="Phân bố đánh giá">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <span style={{ width: 20 }}>{rating}</span>
              <StarOutlined style={{ color: "#faad14", margin: "0 8px" }} />
              <div style={{ flex: 1, background: "#f0f0f0", height: 8, borderRadius: 4, marginRight: 8 }}>
                <div
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    background: "#00a67e",
                    borderRadius: 4,
                  }}
                />
              </div>
              <span style={{ width: 40, textAlign: "right" }}>{count}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <div style={{ marginBottom: 16, display: "flex", gap: 16, alignItems: "center" }}>
          <Search
            placeholder="Tìm kiếm theo tên khách hàng hoặc nội dung"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Select value={filterRating} onChange={setFilterRating} style={{ width: 150 }} placeholder="Lọc theo sao">
            <Option value="all">Tất cả</Option>
            <Option value="5">5 sao</Option>
            <Option value="4">4 sao</Option>
            <Option value="3">3 sao</Option>
            <Option value="2">2 sao</Option>
            <Option value="1">1 sao</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredFeedbacks}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phản hồi`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal xem chi tiết phản hồi */}
      <Modal
        title={`Chi tiết phản hồi #${selectedFeedback?.id}`}
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
                <strong>Danh mục:</strong> <Tag color="blue">{selectedFeedback.category}</Tag>
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>Đánh giá:</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Rate disabled defaultValue={selectedFeedback.rating} />
                <span style={{ fontSize: 18, fontWeight: 600 }}>{selectedFeedback.rating}/5 sao</span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>Nội dung phản hồi:</h3>
              <div
                style={{
                  background: "#f6f6f6",
                  padding: 16,
                  borderRadius: 6,
                  borderLeft: `4px solid ${selectedFeedback.rating >= 4 ? "#52c41a" : selectedFeedback.rating >= 3 ? "#faad14" : "#ff4d4f"}`,
                }}
              >
                {selectedFeedback.comment}
              </div>
            </div>

            <div style={{ color: "#666", fontSize: 12 }}>Phản hồi lúc: {selectedFeedback.createdAt}</div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CustomerFeedback
