import { useState, useEffect } from "react"
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Upload,
  Tabs,
  Row,
  Col,
  Statistic,
  Divider,
  Typography,
} from "antd"
import {
  EyeOutlined,
  EditOutlined,
  UploadOutlined,
  DownloadOutlined,
  PrinterOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
  DeleteOutlined,
  UndoOutlined,
} from "@ant-design/icons"
import { useOrderContext } from "../../context/OrderContext"

const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs
const { Title, Text, Paragraph } = Typography

const TestingResults = () => {
  const { orders, updateOrder, getAllOrders, deleteOrder, addOrder } = useOrderContext()
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [reportModalVisible, setReportModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [filterStatus, setFilterStatus] = useState("all")
  const [tempFormData, setTempFormData] = useState({})
  const [currentEditOrderId, setCurrentEditOrderId] = useState(null)
  const [showCustomConclusion, setShowCustomConclusion] = useState(false)
  const [undoOrder, setUndoOrder] = useState(null)
  const [undoTimer, setUndoTimer] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ visible: false, order: null })

  useEffect(() => {
    setFilteredOrders(orders)
  }, [orders])

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter((order) => order.status === filterStatus))
    }
  }, [filterStatus, orders])

  useEffect(() => {
    if (editModalVisible) {
      const currentData = form.getFieldValue('resultTableData');
      if (currentData) {
        // Handle table data if needed
      }
    }
  }, [editModalVisible, form]);

  useEffect(() => {
    // Lắng nghe sự thay đổi của localStorage để reload orders khi có cập nhật từ manager
    const handleStorageChange = (event) => {
      if (event.key === 'dna_orders') {
        getAllOrders();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [getAllOrders]);

  const handleViewResult = (order) => {
    setSelectedOrder(order)
    setModalVisible(true)
  }

  const handleEditResult = (order) => {
    setSelectedOrder(order)

    // If returning to the same order being edited, use the saved temp data
    if (currentEditOrderId === order.id && tempFormData && Object.keys(tempFormData).length > 0) {
      form.setFieldsValue(tempFormData)
    } else {
      // Initialize with default empty row if no data exists
      let initialTableData = [];

      // Try to use existing result data in proper array format
      if (order.resultTableData && Array.isArray(order.resultTableData)) {
        initialTableData = [...order.resultTableData];
      }
      // If no result table data but we have string result, try parsing it
      else if (!order.resultTableData && order.result && typeof order.result === 'string') {
        try {
          const parsedData = JSON.parse(order.result);
          if (Array.isArray(parsedData)) {
            initialTableData = parsedData;
          }
        } catch (err) {
          // Failed to parse, use empty array with one row
          console.error("Failed to parse result data:", err);
        }
      }

      // Ensure we have at least one row
      if (initialTableData.length === 0) {
        initialTableData = [{ key: Date.now().toString() }];
      }

      const formValues = {
        status: order.status,
        result: order.result || "",
        testingMethod: order.testingMethod || "STR",
        testingNotes: order.testingNotes || "",
        resultTableData: initialTableData,
        conclusion: order.conclusion || ""
      };

      form.setFieldsValue(formValues)

      // Store the initial form state for this order
      setTempFormData(formValues)
    }

    setCurrentEditOrderId(order.id)
    setEditModalVisible(true)
  }

  const handleViewReport = (order) => {
    setSelectedOrder(order)
    setReportModalVisible(true)
  }

  const handleSaveResult = async (values) => {
    console.log("Giá trị lưu:", values.resultTableData);
    try {
      // Make a deep copy of the resultTableData to ensure it's properly serialized
      let resultTableDataCopy = null;
      if (values.resultTableData && Array.isArray(values.resultTableData)) {
        resultTableDataCopy = JSON.parse(JSON.stringify(values.resultTableData));
      }

      // Xác định trạng thái mới dựa trên việc có kết quả hay không
      let newStatus = values.status;
      if (resultTableDataCopy && resultTableDataCopy.length > 0 && resultTableDataCopy[0].marker) {
        // Nếu có kết quả chi tiết, chuyển sang "Chờ xác thực"
        newStatus = "Chờ xác thực";
      }

      const updates = {
        status: newStatus,
        // Store as string representation for backward compatibility
        result: resultTableDataCopy ? JSON.stringify(resultTableDataCopy) : values.result,
        testingMethod: values.testingMethod,
        testingNotes: values.testingNotes,
        conclusion: values.conclusion,
        // Store the actual array for direct use
        resultTableData: resultTableDataCopy,
        completedDate: newStatus === "Hoàn thành" ? new Date().toLocaleDateString("vi-VN") : selectedOrder.completedDate,
        updatedAt: new Date().toLocaleString("vi-VN"),
      };

      updateOrder(selectedOrder.id, updates);

      // Clear the temp form data since we've saved
      setTempFormData({})
      setCurrentEditOrderId(null)

      setEditModalVisible(false)
      message.success("Cập nhật kết quả thành công!")
    } catch (error) {
      console.error("Error updating result:", error)
      message.error("Có lỗi xảy ra khi cập nhật kết quả!")
    }
  }

  const handleFormValuesChange = (changedValues, allValues) => {
    setTempFormData(allValues)
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
      case "PENDING": return "Chờ xử lý"
      case "PROCESSING": return "Đang xử lý"
      case "WAITING_APPROVAL": return "Chờ xác thực"
      case "COMPLETED": return "Hoàn thành"
      case "REJECTED": return "Từ chối"
      default:
        if (status === "Chờ xử lý") return "Chờ xử lý"
        if (status === "Đang xử lý") return "Đang xử lý"
        if (status === "Chờ xác thực") return "Chờ xác thực"
        if (status === "Hoàn thành") return "Hoàn thành"
        if (status === "Từ chối") return "Từ chối"
        return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
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
      default:
        return "default"
    }
  }

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (id) => `#${id}`,
      width: 100,
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Loại xét nghiệm",
      dataIndex: "type",
      key: "type",
      width: 200,
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
    },
    {
      title: "Thao tác",
      key: "action",
      width: 240,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewResult(record)}
            style={{ background: "#1890ff", color: "#fff" }}
          >
            Xem
          </Button>
          <Button type="default" size="small" icon={<EditOutlined />} onClick={() => handleEditResult(record)}>
            Cập nhật
          </Button>
          {record.result && (
            <Button type="default" size="small" icon={<FileTextOutlined />} onClick={() => handleViewReport(record)}>
              Báo cáo
            </Button>
          )}
          <Button danger size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteOrder(record)}>
            Xoá
          </Button>
        </Space>
      ),
    },
  ]

  // Thống kê
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Chờ xử lý").length,
    processing: orders.filter((o) => o.status === "Đang xử lý").length,
    waitingApproval: orders.filter((o) => o.status === "Chờ xác thực").length,
    completed: orders.filter((o) => o.status === "Hoàn thành").length,
    rejected: orders.filter((o) => o.status === "Từ chối").length,
    withResults: orders.filter((o) => o.result).length,
  }

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}>Xét nghiệm & Kết quả</h1>
        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
          Quản lý kết quả xét nghiệm và cập nhật trạng thái
        </p>
      </div>

      {/* Thống kê */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.total}
              valueStyle={{ color: "#00a67e" }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={stats.pending}
              valueStyle={{ color: "#fa8c16" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={stats.processing}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Chờ xác thực"
              value={stats.waitingApproval}
              valueStyle={{ color: "#722ed1" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Từ chối"
              value={stats.rejected}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 200 }}
            placeholder="Lọc theo trạng thái"
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="Chờ xử lý">Chờ xử lý</Option>
            <Option value="Đang xử lý">Đang xử lý</Option>
            <Option value="Chờ xác thực">Chờ xác thực</Option>
            <Option value="Hoàn thành">Hoàn thành</Option>
            <Option value="Từ chối">Từ chối</Option>
          </Select>
          <Space>
            <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            <Button icon={<PrinterOutlined />}>In báo cáo</Button>
          </Space>
        </div>

        <Tabs
          defaultActiveKey="all"
          items={[
            {
              key: "all",
              label: "Tất cả đơn hàng",
              children: (
                <Table
                  columns={columns}
                  dataSource={Array.isArray(filteredOrders) ? filteredOrders : []}
                  rowKey={record => record.id || String(Math.random())}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
                  }}
                  scroll={{ x: 1000 }}
                />
              ),
            },
            {
              key: "urgent",
              label: "Cần xử lý gấp",
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredOrders.filter(order => order.priority === "Cao" && order.status !== "Hoàn thành")}
                  rowKey={record => record.id || String(Math.random())}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
                  }}
                  scroll={{ x: 1000 }}
                />
              ),
            },
            {
              key: "waitingApproval",
              label: "Chờ xác thực",
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredOrders.filter(order => order.status === "Chờ xác thực")}
                  rowKey={record => record.id || String(Math.random())}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
                  }}
                  scroll={{ x: 1000 }}
                />
              ),
            },
          ]}
        />
      </Card>

      {/* Modal xem kết quả */}
      <Modal
        title="Xem kết quả xét nghiệm"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Mã đơn: </Text>
              <Text>#{selectedOrder.id}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Khách hàng: </Text>
              <Text>{selectedOrder.name}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Loại xét nghiệm: </Text>
              <Text>{selectedOrder.type}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Trạng thái: </Text>
              <Tag color={getStatusColor(selectedOrder.status)}>
                {getStatusText(selectedOrder.status)}
              </Tag>
            </div>
            {selectedOrder.result && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>Kết quả: </Text>
                <div style={{ marginTop: 8, padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
                  <Text>{selectedOrder.result}</Text>
                </div>
              </div>
            )}
            {selectedOrder.resultTableData && Array.isArray(selectedOrder.resultTableData) && selectedOrder.resultTableData.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>Dữ liệu chi tiết: </Text>
                <div style={{ marginTop: 8 }}>
                  <Table
                    dataSource={selectedOrder.resultTableData}
                    columns={[
                      { title: "Marker", dataIndex: "marker", key: "marker" },
                      { title: "Allele 1", dataIndex: "allele1", key: "allele1" },
                      { title: "Allele 2", dataIndex: "allele2", key: "allele2" },
                    ]}
                    pagination={false}
                    size="small"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal nhập kết quả */}
      <Modal
        title="Nhập kết quả xét nghiệm"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={1000}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveResult}
          onValuesChange={handleFormValuesChange}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="status">
                <Select>
                  <Option value="Chờ xử lý">Chờ xử lý</Option>
                  <Option value="Đang xử lý">Đang xử lý</Option>
                  <Option value="Chờ xác thực">Chờ xác thực</Option>
                  <Option value="Hoàn thành">Hoàn thành</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phương pháp xét nghiệm" name="testingMethod">
                <Select>
                  <Option value="STR">STR (Short Tandem Repeat)</Option>
                  <Option value="SNP">SNP (Single Nucleotide Polymorphism)</Option>
                  <Option value="Y-STR">Y-STR (Y-chromosome STR)</Option>
                  <Option value="mtDNA">mtDNA (Mitochondrial DNA)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Kết quả tổng quan" name="result">
            <TextArea rows={4} placeholder="Nhập kết quả xét nghiệm..." />
          </Form.Item>

          <Form.Item label="Ghi chú xét nghiệm" name="testingNotes">
            <TextArea rows={3} placeholder="Ghi chú về quá trình xét nghiệm..." />
          </Form.Item>

          <Form.Item label="Kết luận" name="conclusion">
            <Select
              placeholder="Chọn kết luận"
              onChange={value => setShowCustomConclusion(value === 'custom')}
            >
              <Option value="Xác nhận có huyết thống">Xác nhận có huyết thống</Option>
              <Option value="Không có huyết thống">Không có huyết thống</Option>
              <Option value="Không đủ mẫu để kết luận">Không đủ mẫu để kết luận</Option>
              <Option value="Kết quả không xác định">Kết quả không xác định</Option>
              <Option value="custom">Khác...</Option>
            </Select>
          </Form.Item>
          {showCustomConclusion && (
            <Form.Item name="customConclusion" label="Nhập kết luận khác">
              <TextArea rows={3} placeholder="Nhập kết luận cuối cùng..." />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
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
              Lưu kết quả
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem báo cáo */}
      <Modal
        title="Báo cáo kết quả xét nghiệm"
        open={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={2}>BÁO CÁO KẾT QUẢ XÉT NGHIỆM ADN</Title>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Mã đơn hàng: </Text>
              <Text>#{selectedOrder.id}</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Khách hàng: </Text>
              <Text>{selectedOrder.name}</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Loại xét nghiệm: </Text>
              <Text>{selectedOrder.type}</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Ngày xét nghiệm: </Text>
              <Text>{selectedOrder.date}</Text>
            </div>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <Title level={4}>Kết quả xét nghiệm</Title>
              <div style={{ padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
                <Text>{selectedOrder.result}</Text>
              </div>
            </div>

            {selectedOrder.conclusion && (
              <div style={{ marginBottom: 16 }}>
                <Title level={4}>Kết luận</Title>
                <div style={{ padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
                  <Text>{selectedOrder.conclusion}</Text>
                </div>
              </div>
            )}

            <Divider />

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Text>Báo cáo được tạo tự động bởi hệ thống DNA Lab</Text>
            </div>
          </div>
        )}
      </Modal>

      {/* Undo notification */}
      {undoOrder && (
        <div style={{
          position: "fixed", bottom: 32, right: 32, zIndex: 9999, background: "#fff", border: "2px solid #52c41a", borderRadius: 12, boxShadow: "0 4px 24px #52c41a33", padding: 28, display: "flex", alignItems: "center", gap: 20
        }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: '#222' }}>Đã xoá đơn <b style={{ color: '#fa541c' }}>#{undoOrder.id}</b>.</span>
          <Button
            icon={<UndoOutlined style={{ fontSize: 22, marginRight: 6 }} />}
            onClick={handleUndoDelete}
            type="primary"
            style={{
              background: "#52c41a",
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              border: "none",
              borderRadius: 8,
              boxShadow: "0 2px 8px #52c41a44",
              padding: "8px 28px",
              display: "flex",
              alignItems: "center",
              transition: "background 0.2s"
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#389e0d')}
            onMouseOut={e => (e.currentTarget.style.background = '#52c41a')}
          >
            Hoàn tác
          </Button>
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

export default TestingResults
