"use client"

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
} from "@ant-design/icons"

const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs
const { Title, Text, Paragraph } = Typography

const TestingResults = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [reportModalVisible, setReportModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]")
    setOrders(savedOrders)
    setFilteredOrders(savedOrders)
  }, [])

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter((order) => order.status === filterStatus))
    }
  }, [filterStatus, orders])

  const handleViewResult = (order) => {
    setSelectedOrder(order)
    setModalVisible(true)
  }

  const handleEditResult = (order) => {
    setSelectedOrder(order)
    form.setFieldsValue({
      status: order.status,
      result: order.result || "",
      testingMethod: order.testingMethod || "STR",
      testingNotes: order.testingNotes || "",
    })
    setEditModalVisible(true)
  }

  const handleViewReport = (order) => {
    setSelectedOrder(order)
    setReportModalVisible(true)
  }

  const handleSaveResult = async (values) => {
    try {
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: values.status,
              result: values.result,
              testingMethod: values.testingMethod,
              testingNotes: values.testingNotes,
              completedDate:
                values.status === "Hoàn thành" ? new Date().toLocaleDateString("vi-VN") : order.completedDate,
              updatedAt: new Date().toLocaleString("vi-VN"),
            }
          : order,
      )
      setOrders(updatedOrders)
      localStorage.setItem("dna_orders", JSON.stringify(updatedOrders))
      setEditModalVisible(false)
      message.success("Cập nhật kết quả thành công!")
    } catch {
      message.error("Có lỗi xảy ra khi cập nhật kết quả!")
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
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        let color = "default"
        if (status === "Chờ xử lý") color = "orange"
        if (status === "Đang xử lý") color = "blue"
        if (status === "Hoàn thành") color = "green"
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      render: (priority) => {
        let color = "default"
        if (priority === "Cao") color = "red"
        if (priority === "Trung bình") color = "orange"
        if (priority === "Thấp") color = "green"
        return <Tag color={color}>{priority}</Tag>
      },
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      key: "result",
      width: 120,
      render: (result) => (result ? <Tag color="green">Đã có</Tag> : <Tag color="orange">Chưa có</Tag>),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewResult(record)}>
            Xem
          </Button>
          <Button type="default" size="small" icon={<EditOutlined />} onClick={() => handleEditResult(record)}>
            Nhập kết quả
          </Button>
          {record.result && (
            <Button type="default" size="small" icon={<FileTextOutlined />} onClick={() => handleViewReport(record)}>
              Báo cáo
            </Button>
          )}
        </Space>
      ),
    },
  ]

  // Thống kê
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Chờ xử lý").length,
    processing: orders.filter((o) => o.status === "Đang xử lý").length,
    completed: orders.filter((o) => o.status === "Hoàn thành").length,
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
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.total}
              valueStyle={{ color: "#00a67e" }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={stats.pending}
              valueStyle={{ color: "#fa8c16" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={stats.processing}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Có kết quả"
              value={stats.withResults}
              valueStyle={{ color: "#722ed1" }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Tỷ lệ hoàn thành"
              value={orders.length > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}
              suffix="%"
              valueStyle={{ color: "#13c2c2" }}
              prefix={<CheckCircleOutlined />}
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
            <Option value="Hoàn thành">Hoàn thành</Option>
          </Select>
          <Space>
            <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            <Button icon={<PrinterOutlined />}>In báo cáo</Button>
          </Space>
        </div>

        <Tabs defaultActiveKey="all">
          <TabPane tab="Tất cả đơn hàng" key="all">
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
              scroll={{ x: 1000 }}
            />
          </TabPane>
          <TabPane tab="Cần xử lý gấp" key="urgent">
            <Table
              columns={columns}
              dataSource={filteredOrders.filter((order) => order.priority === "Cao" && order.status !== "Hoàn thành")}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
          <TabPane tab="Đã có kết quả" key="withResults">
            <Table
              columns={columns}
              dataSource={filteredOrders.filter((order) => order.result)}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal xem kết quả */}
      <Modal
        title={`Kết quả xét nghiệm - Đơn hàng #${selectedOrder?.id}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="edit"
            type="default"
            icon={<EditOutlined />}
            onClick={() => {
              setModalVisible(false)
              handleEditResult(selectedOrder)
            }}
          >
            Chỉnh sửa
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />}>
            In kết quả
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
              <p>
                <strong>Loại xét nghiệm:</strong> {selectedOrder.type}
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>Thông tin xét nghiệm:</h3>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <Tag
                  color={
                    selectedOrder.status === "Hoàn thành"
                      ? "green"
                      : selectedOrder.status === "Đang xử lý"
                        ? "blue"
                        : "orange"
                  }
                >
                  {selectedOrder.status}
                </Tag>
              </p>
              {selectedOrder.testingMethod && (
                <p>
                  <strong>Phương pháp xét nghiệm:</strong> {selectedOrder.testingMethod}
                </p>
              )}
              {selectedOrder.completedDate && (
                <p>
                  <strong>Ngày hoàn thành:</strong> {selectedOrder.completedDate}
                </p>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>Kết quả xét nghiệm:</h3>
              {selectedOrder.result ? (
                <div style={{ background: "#f6ffed", border: "1px solid #b7eb8f", padding: 16, borderRadius: 6 }}>
                  {selectedOrder.result}
                </div>
              ) : (
                <div style={{ background: "#fff7e6", border: "1px solid #ffd591", padding: 16, borderRadius: 6 }}>
                  Kết quả chưa có sẵn
                </div>
              )}
            </div>

            {selectedOrder.testingNotes && (
              <div>
                <h3>Ghi chú kỹ thuật:</h3>
                <div style={{ background: "#f6f6f6", padding: 12, borderRadius: 4 }}>{selectedOrder.testingNotes}</div>
              </div>
            )}

            {selectedOrder.sampleInfo && (
              <div style={{ marginTop: 16 }}>
                <h3>Thông tin mẫu xét nghiệm:</h3>
                <div style={{ background: "#f0f5ff", border: "1px solid #d6e4ff", padding: 12, borderRadius: 4 }}>
                  <p>
                    <strong>Ngày lấy mẫu:</strong> {selectedOrder.sampleInfo.collectionDate}
                  </p>
                  <p>
                    <strong>Nhân viên thu mẫu:</strong> {selectedOrder.sampleInfo.collector}
                  </p>
                  <p>
                    <strong>Số lượng người cho mẫu:</strong> {selectedOrder.sampleInfo.donors.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal chỉnh sửa kết quả */}
      <Modal
        title={`Cập nhật kết quả - Đơn hàng #${selectedOrder?.id}`}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveResult}>
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
            name="testingMethod"
            label="Phương pháp xét nghiệm"
            rules={[{ required: true, message: "Vui lòng chọn phương pháp xét nghiệm!" }]}
          >
            <Select placeholder="Chọn phương pháp">
              <Option value="STR">STR (Short Tandem Repeat)</Option>
              <Option value="SNP">SNP (Single Nucleotide Polymorphism)</Option>
              <Option value="CODIS">CODIS (Combined DNA Index System)</Option>
              <Option value="Y-STR">Y-STR (Y-chromosome STR)</Option>
              <Option value="mtDNA">mtDNA (Mitochondrial DNA)</Option>
            </Select>
          </Form.Item>

          <Form.Item name="result" label="Kết quả xét nghiệm">
            <TextArea rows={6} placeholder="Nhập kết quả xét nghiệm chi tiết..." />
          </Form.Item>

          <Form.Item name="testingNotes" label="Ghi chú kỹ thuật">
            <TextArea rows={3} placeholder="Nhập ghi chú về quá trình xét nghiệm, chất lượng mẫu..." />
          </Form.Item>

          <Form.Item label="Tải lên file kết quả">
            <Upload>
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal báo cáo kết quả */}
      <Modal
        title="Báo cáo kết quả xét nghiệm ADN"
        open={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setReportModalVisible(false)}>
            Đóng
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />}>
            In báo cáo
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <div style={{ background: "#fff", padding: 24, border: "1px solid #ddd" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={4}>TRUNG TÂM XÉT NGHIỆM DNA LAB</Title>
              <Text>123 Đường Nguyễn Văn Linh, Quận 7, Thành Phố Hồ Chí Minh</Text>
              <Divider style={{ margin: "12px 0" }} />
              <Title level={3}>KẾT QUẢ XÉT NGHIỆM ADN</Title>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>THÔNG TIN KHÁCH HÀNG</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Họ và tên: </Text>
                  <Text>{selectedOrder.name}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Mã đơn hàng: </Text>
                  <Text>#{selectedOrder.id}</Text>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 8 }}>
                <Col span={12}>
                  <Text strong>Địa chỉ: </Text>
                  <Text>{selectedOrder.address}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Số điện thoại: </Text>
                  <Text>{selectedOrder.phone}</Text>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 8 }}>
                <Col span={12}>
                  <Text strong>Loại xét nghiệm: </Text>
                  <Text>{selectedOrder.type}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Ngày hoàn thành: </Text>
                  <Text>{selectedOrder.completedDate}</Text>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>THÔNG TIN MẪU XÉT NGHIỆM</Title>
              {selectedOrder.sampleInfo ? (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text strong>Ngày lấy mẫu: </Text>
                      <Text>{selectedOrder.sampleInfo.collectionDate}</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Nhân viên thu mẫu: </Text>
                      <Text>{selectedOrder.sampleInfo.collector}</Text>
                    </Col>
                  </Row>
                  <Divider style={{ margin: "12px 0" }} />
                  {selectedOrder.sampleInfo.donors.map((donor, index) => (
                    <div key={index} style={{ marginBottom: 16 }}>
                      <Text strong>Người cho mẫu {index + 1}: </Text>
                      <Text>{donor.name}</Text>
                      <Row gutter={16} style={{ marginTop: 8 }}>
                        <Col span={8}>
                          <Text strong>Loại mẫu: </Text>
                          <Text>{donor.sampleType}</Text>
                        </Col>
                        <Col span={8}>
                          <Text strong>Số lượng: </Text>
                          <Text>{donor.sampleQuantity}</Text>
                        </Col>
                        <Col span={8}>
                          <Text strong>Mối quan hệ: </Text>
                          <Text>{donor.relationship}</Text>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </>
              ) : (
                <Text>Không có thông tin chi tiết về mẫu xét nghiệm</Text>
              )}
            </div>

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>PHƯƠNG PHÁP XÉT NGHIỆM</Title>
              <Paragraph>
                {selectedOrder.testingMethod === "STR" &&
                  "Phương pháp phân tích STR (Short Tandem Repeat) được sử dụng để xác định mối quan hệ huyết thống. Phương pháp này phân tích các vùng lặp lại ngắn trong DNA để xác định mối quan hệ di truyền giữa các cá nhân."}
                {selectedOrder.testingMethod === "SNP" &&
                  "Phương pháp phân tích SNP (Single Nucleotide Polymorphism) được sử dụng để xác định các biến thể di truyền. Phương pháp này phân tích các biến thể đơn nucleotide trong DNA."}
                {selectedOrder.testingMethod === "CODIS" &&
                  "Phương pháp CODIS (Combined DNA Index System) được sử dụng để phân tích các marker DNA tiêu chuẩn được sử dụng trong hệ thống dữ liệu DNA pháp y."}
                {selectedOrder.testingMethod === "Y-STR" &&
                  "Phương pháp Y-STR (Y-chromosome STR) được sử dụng để phân tích các marker STR trên nhiễm sắc thể Y, giúp xác định mối quan hệ cha con theo dòng nam."}
                {selectedOrder.testingMethod === "mtDNA" &&
                  "Phương pháp mtDNA (Mitochondrial DNA) được sử dụng để phân tích DNA ty thể, giúp xác định mối quan hệ theo dòng mẹ."}
              </Paragraph>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>KẾT QUẢ XÉT NGHIỆM</Title>
              <div style={{ background: "#f6ffed", border: "1px solid #b7eb8f", padding: 16, borderRadius: 6 }}>
                <Paragraph>{selectedOrder.result}</Paragraph>
              </div>
            </div>

            {selectedOrder.testingNotes && (
              <div style={{ marginBottom: 24 }}>
                <Title level={5}>GHI CHÚ KỸ THUẬT</Title>
                <Paragraph>{selectedOrder.testingNotes}</Paragraph>
              </div>
            )}

            <div style={{ marginTop: 36, textAlign: "right" }}>
              <Text strong>Ngày báo cáo: </Text>
              <Text>{new Date().toLocaleDateString("vi-VN")}</Text>
              <div style={{ marginTop: 60 }}>
                <Text strong>Người phụ trách xét nghiệm</Text>
                <div style={{ marginTop: 8 }}>
                  <Text>(Ký và ghi rõ họ tên)</Text>
                </div>
                <div style={{ marginTop: 40 }}>
                  <Text>TS. Nguyễn Văn Khoa</Text>
                  <div>
                    <Text>Giám đốc Kỹ thuật</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TestingResults
