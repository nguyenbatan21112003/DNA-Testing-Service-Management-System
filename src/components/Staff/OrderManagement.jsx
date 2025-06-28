"use client"

import { useState, useEffect } from "react"
import { Card, Table, Tag, Button, Modal, Form, Input, Select, message, Space, Tabs, Statistic, Row, Col } from "antd"
import { FileTextOutlined, EyeOutlined, EditOutlined, ExportOutlined, PlusOutlined, DeleteOutlined, UndoOutlined } from "@ant-design/icons"
import { useOrderContext } from "../../context/OrderContext"

const { Option } = Select
const { Search } = Input
const { TextArea } = Input
const { TabPane } = Tabs

const OrderManagement = () => {
  const { getAllOrders, updateOrder, deleteOrder, addOrder } = useOrderContext()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState("all")
  const [searchText, setSearchText] = useState("")
  const [undoOrder, setUndoOrder] = useState(null)
  const [undoTimer, setUndoTimer] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ visible: false, order: null })

  // Lấy dữ liệu đơn hàng từ context
  const loadOrders = () => {
    const allOrders = getAllOrders()
    setOrders(allOrders)
    setFilteredOrders(allOrders)
  }

  useEffect(() => {
    // Load orders khi component mount
    loadOrders()

    // Lắng nghe sự thay đổi của localStorage để reload orders khi có cập nhật từ manager
    const handleStorageChange = (event) => {
      if (event.key === 'dna_orders') {
        loadOrders();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
          order.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          order.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          order.id?.toString().includes(searchText),
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
      // Sử dụng updateOrder từ context để cập nhật đơn hàng
      updateOrder(selectedOrder.id, {
        status: values.status,
        priority: values.priority,
        notes: values.notes,
        updatedAt: new Date().toLocaleString("vi-VN"),
      })

      // Cập nhật lại danh sách đơn hàng
      loadOrders()

      setEditModalVisible(false)
      message.success("Cập nhật đơn hàng thành công!")
    } catch {
      message.error("Có lỗi xảy ra khi cập nhật đơn hàng!")
    }
  }

  const handleDeleteOrder = (order) => {
    setDeleteModal({ visible: true, order })
  }

  const confirmDeleteOrder = () => {
    if (deleteModal.order) {
      const deleted = deleteOrder(deleteModal.order.id)
      setUndoOrder(deleted)
      setDeleteModal({ visible: false, order: null })
      // Hiện nút hoàn tác trong 8 giây
      if (undoTimer) clearTimeout(undoTimer)
      const timer = setTimeout(() => setUndoOrder(null), 8000)
      setUndoTimer(timer)
    }
  }

  const handleUndoDelete = () => {
    if (undoOrder) {
      addOrder(undoOrder)
      setUndoOrder(null)
      if (undoTimer) clearTimeout(undoTimer)
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
      case "PENDING_CONFIRM":
        return "Chờ xử lý"
      case "PROCESSING":
        return "Đang xử lý"
      case "WAITING_APPROVAL":
        return "Chờ xác thực"
      case "COMPLETED":
        return "Hoàn thành"
      case "REJECTED":
        return "Từ chối"
      case "KIT_SENT":
        return "Đã gửi kit"
      case "SAMPLE_RECEIVED":
        return "Đã nhận mẫu"
      case "CANCELLED":
        return "Đã hủy"
      default:
        if (status === "Chờ xử lý") return "Chờ xử lý"
        if (status === "Đang xử lý") return "Đang xử lý"
        if (status === "Hoàn thành") return "Hoàn thành"
        if (status === "Chờ xác thực") return "Chờ xác thực"
        if (status === "Từ chối") return "Từ chối"
        if (status === "Đã gửi kit") return "Đã gửi kit"
        if (status === "Đã nhận mẫu") return "Đã nhận mẫu"
        if (status === "Đã hủy") return "Đã hủy"
        return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
      case "PENDING_CONFIRM":
      case "Chờ xử lý":
        return "orange"
      case "PROCESSING":
      case "Đang xử lý":
        return "blue"
      case "WAITING_APPROVAL":
      case "Chờ xác thực":
        return "purple"
      case "COMPLETED":
      case "Hoàn thành":
        return "green"
      case "REJECTED":
      case "Từ chối":
        return "red"
      case "KIT_SENT":
        return "#2563EB"
      case "SAMPLE_RECEIVED":
        return "#22C55E"
      case "CANCELLED":
        return "#EF4444"
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
      render: (status) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
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
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record)}
            style={{ background: "#1890ff", color: "#fff" }}
          >
            Xem
          </Button>
          <Button type="default" size="small" icon={<EditOutlined />} onClick={() => handleEditOrder(record)}>
            Sửa
          </Button>
          <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteOrder(record)}>
            Xoá
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
    waitingApproval: orders.filter((order) => order.status === "Chờ xác thực").length,
    rejected: orders.filter((order) => order.status === "Từ chối").length,
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{
                background: "#1890ff",
                color: "#fff",
                borderRadius: 6,
                border: "none",
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(24,144,255,0.08)",
                transition: "background 0.2s"
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#1765ad')}
              onMouseOut={e => (e.currentTarget.style.background = '#1890ff')}
            >
              Tạo đơn mới
            </Button>
          </Space>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`Tất cả (${stats.total})`} key="all" />
          <TabPane tab={`Chờ xử lý (${stats.pending})`} key="PENDING" />
          <TabPane tab={`Đang xử lý (${stats.processing})`} key="PROCESSING" />
          <TabPane tab={`Chờ xác thực (${stats.waitingApproval || 0})`} key="WAITING_APPROVAL" />
          <TabPane tab={`Hoàn thành (${stats.completed})`} key="COMPLETED" />
          <TabPane tab={`Từ chối (${stats.rejected || 0})`} key="REJECTED" />
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
            style={{
              background: "#1890ff",
              color: "#fff",
              borderRadius: 6,
              border: "none",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(24,144,255,0.08)",
              transition: "background 0.2s"
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#1765ad')}
            onMouseOut={e => (e.currentTarget.style.background = '#1890ff')}
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
                  {getStatusText(selectedOrder.status)}
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
        okButtonProps={{
          style: {
            background: "#1890ff",
            color: "#fff",
            borderRadius: 6,
            border: "none",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(24,144,255,0.08)",
            transition: "background 0.2s"
          },
          onMouseOver: e => (e.target.style.background = '#1765ad'),
          onMouseOut: e => (e.target.style.background = '#1890ff')
        }}
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

      {/* Undo notification */}
      {undoOrder && (
        <div style={{
          position: "fixed", bottom: 32, right: 32, zIndex: 9999, background: "#fff", border: "1px solid #ccc", borderRadius: 8, boxShadow: "0 2px 8px #0002", padding: 20, display: "flex", alignItems: "center", gap: 16
        }}>
          <span>Đã xoá đơn <b>#{undoOrder.id}</b>. </span>
          <Button icon={<UndoOutlined />} onClick={handleUndoDelete} type="primary">Hoàn tác</Button>
        </div>
      )}

      {/* Modal xác nhận xoá */}
      <Modal
        title={`Xác nhận xoá đơn hàng #${deleteModal.order?.id}`}
        open={deleteModal.visible}
        onOk={confirmDeleteOrder}
        onCancel={() => setDeleteModal({ visible: false, order: null })}
        okText="Xoá"
        okButtonProps={{ danger: true }}
        cancelText="Huỷ"
      >
        <p>Bạn có chắc chắn muốn xoá đơn hàng này không? Hành động này có thể hoàn tác trong vài giây.</p>
      </Modal>
    </div>
  )
}

export default OrderManagement
