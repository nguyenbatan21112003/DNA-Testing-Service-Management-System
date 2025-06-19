"use client"

import { useState, useEffect } from "react"
import { Card, Table, Tag, Button, Modal, Form, Input, Select, message, Space, Tabs, Statistic, Row, Col } from "antd"
import { FileTextOutlined, EyeOutlined, EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons"
import { useOrderContext } from "../../context/OrderContext"

const { Option } = Select
const { Search } = Input
const { TextArea } = Input
const { TabPane } = Tabs

const OrderManagement = () => {
  const { getAllOrders } = useOrderContext()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState("all")
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    setOrders(getAllOrders())
    setFilteredOrders(getAllOrders())
  }, [])

  useEffect(() => {
    let filtered = orders

    // Lọc theo tab
    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.status === activeTab)
    }

    // Tìm kiếm
    if (searchText) {
      filtered = filtered.filter(
        (order) =>
          order.name.toLowerCase().includes(searchText.toLowerCase()) ||
          order.email.toLowerCase().includes(searchText.toLowerCase()) ||
          order.id.toString().includes(searchText),
      )
    }

    setFilteredOrders(filtered)
  }, [activeTab, searchText, orders])

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setModalVisible(true)
  }

  const handleEditOrder = (order) => {
    setSelectedOrder(order)
    form.setFieldsValue({
      status: order.status,
      priority: order.priority,
      notes: order.notes || "",
    })
    setEditModalVisible(true)
  }

  const handleSaveOrder = async (values) => {
    try {
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: values.status,
              priority: values.priority,
              notes: values.notes,
              updatedAt: new Date().toLocaleString("vi-VN"),
            }
          : order,
      )
      setOrders(updatedOrders)
      localStorage.setItem("dna_orders", JSON.stringify(updatedOrders))
      setEditModalVisible(false)
      message.success("Cập nhật đơn hàng thành công!")
    } catch {
      message.error("Có lỗi xảy ra khi cập nhật đơn hàng!")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xử lý":
        return "orange"
      case "Đang xử lý":
        return "blue"
      case "Hoàn thành":
        return "green"
      default:
        return "default"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Cao":
        return "red"
      case "Trung bình":
        return "orange"
      case "Thấp":
        return "green"
      default:
        return "default"
    }
  }

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => `#${id}`,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Loại xét nghiệm",
      dataIndex: "type",
      key: "type",
      width: 180,
    },
    {
      title: "Phương thức lấy mẫu",
      dataIndex: "sampleMethod",
      key: "sampleMethod",
      width: 140,
      render: (method) => (
        <Tag color={method === "home" ? "blue" : "green"}>{method === "home" ? "Tại nhà" : "Tại trung tâm"}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (priority) => <Tag color={getPriorityColor(priority)}>{priority}</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
      width: 120,
      sorter: (a, b) =>
        new Date(a.date.split("/").reverse().join("-")) - new Date(b.date.split("/").reverse().join("-")),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewOrder(record)}>
            Xem
          </Button>
          <Button type="default" size="small" icon={<EditOutlined />} onClick={() => handleEditOrder(record)}>
            Sửa
          </Button>
        </Space>
      ),
    },
  ]

  const stats = {
    total: orders.length,
    pending: orders.filter((order) => order.status === "Chờ xử lý").length,
    processing: orders.filter((order) => order.status === "Đang xử lý").length,
    completed: orders.filter((order) => order.status === "Hoàn thành").length,
  }

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}>Quản lý đơn hàng</h1>
        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>Quản lý tất cả đơn hàng xét nghiệm ADN</p>
      </div>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: "#00a67e" }} />}
              valueStyle={{ color: "#00a67e" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Chờ xử lý" value={stats.pending} valueStyle={{ color: "#fa8c16" }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Đang xử lý" value={stats.processing} valueStyle={{ color: "#1890ff" }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic title="Hoàn thành" value={stats.completed} valueStyle={{ color: "#52c41a" }} />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Search
              placeholder="Tìm kiếm theo tên, email hoặc mã đơn"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
          </div>
          <Space>
            <Button icon={<ExportOutlined />}>Xuất Excel</Button>
            <Button type="primary" icon={<PlusOutlined />}>
              Tạo đơn mới
            </Button>
          </Space>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`Tất cả (${stats.total})`} key="all" />
          <TabPane tab={`Chờ xử lý (${stats.pending})`} key="Chờ xử lý" />
          <TabPane tab={`Đang xử lý (${stats.processing})`} key="Đang xử lý" />
          <TabPane tab={`Hoàn thành (${stats.completed})`} key="Hoàn thành" />
        </Tabs>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Modal xem chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setModalVisible(false)
              handleEditOrder(selectedOrder)
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>Thông tin khách hàng:</h3>
              <p>
                <strong>Họ tên:</strong> {selectedOrder.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedOrder.phone}
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>Thông tin đơn hàng:</h3>
              <p>
                <strong>Loại xét nghiệm:</strong> {selectedOrder.type}
              </p>
              <p>
                <strong>Phương thức lấy mẫu:</strong>
                <Tag color={selectedOrder.sampleMethod === "home" ? "blue" : "green"} style={{ marginLeft: 8 }}>
                  {selectedOrder.sampleMethod === "home" ? "Tại nhà" : "Tại trung tâm"}
                </Tag>
              </p>
              <p>
                <strong>Trạng thái:</strong>
                <Tag color={getStatusColor(selectedOrder.status)} style={{ marginLeft: 8 }}>
                  {selectedOrder.status}
                </Tag>
              </p>
              <p>
                <strong>Độ ưu tiên:</strong>
                <Tag color={getPriorityColor(selectedOrder.priority)} style={{ marginLeft: 8 }}>
                  {selectedOrder.priority}
                </Tag>
              </p>
              <p>
                <strong>Ngày tạo:</strong> {selectedOrder.date}
              </p>
            </div>

            {selectedOrder.sampleMethod === "home" && selectedOrder.address && (
              <div style={{ marginBottom: 16 }}>
                <h3>Địa chỉ lấy mẫu:</h3>
                <p>{selectedOrder.address}</p>
                {selectedOrder.kitId && (
                  <p>
                    <strong>Mã kit:</strong> {selectedOrder.kitId}
                  </p>
                )}
              </div>
            )}

            {selectedOrder.sampleMethod === "center" && selectedOrder.appointmentDate && (
              <div style={{ marginBottom: 16 }}>
                <h3>Thông tin lịch hẹn:</h3>
                <p>
                  <strong>Ngày hẹn:</strong> {selectedOrder.appointmentDate}
                </p>
                {selectedOrder.timeSlot && (
                  <p>
                    <strong>Giờ hẹn:</strong> {selectedOrder.timeSlot}
                  </p>
                )}
              </div>
            )}

            {selectedOrder.result && (
              <div style={{ marginBottom: 16 }}>
                <h3>Kết quả xét nghiệm:</h3>
                <div style={{ background: "#f6ffed", border: "1px solid #b7eb8f", padding: 16, borderRadius: 6 }}>
                  {selectedOrder.result}
                </div>
              </div>
            )}

            {selectedOrder.notes && (
              <div>
                <h3>Ghi chú:</h3>
                <div style={{ background: "#f6f6f6", padding: 12, borderRadius: 4 }}>{selectedOrder.notes}</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal chỉnh sửa đơn hàng */}
      <Modal
        title={`Chỉnh sửa đơn hàng #${selectedOrder?.id}`}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveOrder}>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="Chờ xử lý">Chờ xử lý</Option>
              <Option value="Đang xử lý">Đang xử lý</Option>
              <Option value="Hoàn thành">Hoàn thành</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label="Độ ưu tiên"
            rules={[{ required: true, message: "Vui lòng chọn độ ưu tiên!" }]}
          >
            <Select placeholder="Chọn độ ưu tiên">
              <Option value="Cao">Cao</Option>
              <Option value="Trung bình">Trung bình</Option>
              <Option value="Thấp">Thấp</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={4} placeholder="Nhập ghi chú về đơn hàng..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default OrderManagement
