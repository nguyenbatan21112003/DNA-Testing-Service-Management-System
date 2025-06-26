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
  DatePicker,
  message,
  Space,
  Steps,
  Tabs,
  Row,
  Col,
  Typography,
  Divider,
} from "antd"
import {
  HomeOutlined,
  CarOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PrinterOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import { useOrderContext } from "../../context/OrderContext"

const { Option } = Select
const { TextArea } = Input
const { Step } = Steps
const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

const HomeSampling = () => {
  const { getAllOrders, updateOrder } = useOrderContext()
  const [samplingRequests, setSamplingRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [reportModalVisible, setReportModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Lấy dữ liệu đơn hàng từ context
  const loadSamplingRequests = () => {
    // Lấy dữ liệu từ localStorage và lọc các đơn hàng lấy mẫu tại nhà
    const allOrders = getAllOrders()
    const homeSamplingOrders = allOrders
      .filter((order) => order.sampleMethod === "home")
      .map((order) => ({
        ...order,
        samplingStatus: order.kitStatus || "chua_gui",
        scheduledDate: order.scheduledDate || null,
        samplerName: order.samplerName || null,
        notes: order.notes || "",
      }))

    setSamplingRequests(homeSamplingOrders)
  }

  useEffect(() => {
    // Load orders khi component mount
    loadSamplingRequests()

    // Thêm event listener để cập nhật orders khi localStorage thay đổi
    window.addEventListener('storage', (event) => {
      if (event.key === 'dna_orders') {
        loadSamplingRequests()
      }
    })

    // Cleanup function
    return () => {
      window.removeEventListener('storage', () => { })
    }
  }, [])

  const handleViewRequest = (request) => {
    setSelectedRequest(request)
    setModalVisible(true)
  }

  const handleUpdateStatus = (request) => {
    setSelectedRequest(request)
    form.setFieldsValue({
      samplingStatus: request.kitStatus || "chua_gui",
      scheduledDate: request.scheduledDate ? dayjs(request.scheduledDate.split(" ")[0], "DD/MM/YYYY") : null,
      scheduledTime: request.scheduledDate ? request.scheduledDate.split(" ")[1] : null,
      samplerName: request.samplerName || "",
      kitId: request.kitId || generateKitId(request),
      notes: request.notes || "",
    })
    setUpdateModalVisible(true)
  }

  const handleViewReport = (request) => {
    setSelectedRequest(request)
    setReportModalVisible(true)
  }

  const generateKitId = (request) => {
    const prefix = request.type.includes("huyết thống") ? "KIT-PC-" : "KIT-DT-"
    return `${prefix}${request.id}`
  }

  const handleSaveUpdate = async (values) => {
    try {
      // Sử dụng updateOrder từ context để cập nhật đơn hàng
      updateOrder(selectedRequest.id, {
        kitStatus: values.samplingStatus,
        scheduledDate:
          values.scheduledDate && values.scheduledTime
            ? `${values.scheduledDate.format("DD/MM/YYYY")} ${values.scheduledTime}`
            : null,
        samplerName: values.samplerName,
        kitId: values.kitId,
        notes: values.notes,
        updatedAt: new Date().toLocaleString("vi-VN"),
      })

      // Cập nhật lại danh sách đơn hàng
      loadSamplingRequests()

      setUpdateModalVisible(false)
      message.success("Cập nhật trạng thái thành công!")
    } catch {
      message.error("Có lỗi xảy ra khi cập nhật!")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "chua_gui":
        return "orange"
      case "da_gui":
        return "blue"
      case "da_nhan":
        return "green"
      case "huy":
        return "red"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "chua_gui":
        return "Chưa gửi kit"
      case "da_gui":
        return "Đã gửi kit"
      case "da_nhan":
        return "Đã nhận mẫu"
      case "huy":
        return "Đã hủy"
      default:
        return status
    }
  }

  const getStepStatus = (currentStatus, stepStatus) => {
    const statusOrder = ["chua_gui", "da_gui", "da_nhan"]
    const currentIndex = statusOrder.indexOf(currentStatus)
    const stepIndex = statusOrder.indexOf(stepStatus)

    if (currentStatus === "huy") return "error"
    if (stepIndex < currentIndex) return "finish"
    if (stepIndex === currentIndex) return "process"
    return "wait"
  }

  // Hàm kiểm tra ngày không hợp lệ (trước hôm nay hoặc là Chủ nhật)
  const disabledDate = (current) => {
    // Không cho chọn ngày trước hôm nay
    const today = dayjs().startOf('day');
    if (!current) return false;
    // current.day() === 0 là Chủ nhật
    return current < today || current.day() === 0;
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => `#${id}`,
    },
    {
      title: "Mã kit",
      dataIndex: "kitId",
      key: "kitId",
      width: 120,
      render: (kitId) => kitId || "-",
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 250,
      render: (address) => (
        <span>
          <EnvironmentOutlined style={{ marginRight: 4, color: "#00a67e" }} />
          {address}
        </span>
      ),
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      render: (phone) => (
        <span>
          <PhoneOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          {phone}
        </span>
      ),
    },
    {
      title: "Trạng thái kit",
      dataIndex: "kitStatus",
      key: "kitStatus",
      width: 130,
      render: (status) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
    },
    {
      title: "Ngày hẹn",
      dataIndex: "scheduledDate",
      key: "scheduledDate",
      width: 140,
      render: (date) =>
        date ? (
          <span>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {date}
          </span>
        ) : (
          <span style={{ color: "#999" }}>Chưa hẹn</span>
        ),
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
            icon={<HomeOutlined />}
            onClick={() => handleViewRequest(record)}
            style={{
              background: "#1890ff",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 6,
              border: "none",
              boxShadow: "0 2px 8px #1890ff22",
              transition: "background 0.2s"
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#1765ad')}
            onMouseOut={e => (e.currentTarget.style.background = '#1890ff')}
          >
            Xem
          </Button>
          <Button
            size="small"
            icon={<CarOutlined />}
            onClick={() => handleUpdateStatus(record)}
            style={{
              background: "#fa8c16",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 6,
              border: "none",
              boxShadow: "0 2px 8px #fa8c1622",
              transition: "background 0.2s"
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#d46b08')}
            onMouseOut={e => (e.currentTarget.style.background = '#fa8c16')}
          >
            Cập nhật
          </Button>
          {record.kitStatus === "da_nhan" && (
            <Button type="default" size="small" icon={<FileTextOutlined />} onClick={() => handleViewReport(record)}>
              Biên bản
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}>Thu mẫu tại nhà</h1>
        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
          Quản lý các yêu cầu lấy mẫu tại nhà của khách hàng
        </p>
      </div>

      <Card>
        <Tabs defaultActiveKey="all">
          <TabPane tab="Tất cả yêu cầu" key="all">
            <Table
              columns={columns}
              dataSource={samplingRequests}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          <TabPane tab="Chưa gửi kit" key="pending">
            <Table
              columns={columns}
              dataSource={samplingRequests.filter((req) => req.kitStatus === "chua_gui")}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          <TabPane tab="Đã gửi kit" key="sent">
            <Table
              columns={columns}
              dataSource={samplingRequests.filter((req) => req.kitStatus === "da_gui")}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          <TabPane tab="Đã nhận mẫu" key="received">
            <Table
              columns={columns}
              dataSource={samplingRequests.filter((req) => req.kitStatus === "da_nhan")}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal xem chi tiết */}
      <Modal
        title={`Chi tiết yêu cầu lấy mẫu #${selectedRequest?.id}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="update"
            type="primary"
            icon={<CarOutlined />}
            onClick={() => {
              setModalVisible(false)
              handleUpdateStatus(selectedRequest)
            }}
            style={{
              background: "#fa8c16",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 6,
              border: "none",
              boxShadow: "0 2px 8px #fa8c1622",
              transition: "background 0.2s"
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#d46b08')}
            onMouseOut={e => (e.currentTarget.style.background = '#fa8c16')}
          >
            Cập nhật trạng thái
          </Button>,
        ]}
        width={800}
      >
        {selectedRequest && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h3>Thông tin khách hàng:</h3>
              <p>
                <strong>Họ tên:</strong> {selectedRequest.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedRequest.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedRequest.phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {selectedRequest.address}
              </p>
              <p>
                <strong>Loại xét nghiệm:</strong> {selectedRequest.type}
              </p>
              <p>
                <strong>Mã kit:</strong> {selectedRequest.kitId || "Chưa cấp mã kit"}
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3>Tiến trình lấy mẫu:</h3>
              <Steps current={["chua_gui", "da_gui", "da_nhan"].indexOf(selectedRequest.kitStatus)}>
                <Step
                  title="Chuẩn bị kit"
                  description="Chuẩn bị và gửi kit lấy mẫu"
                  status={getStepStatus(selectedRequest.kitStatus, "chua_gui")}
                />
                <Step
                  title="Đã gửi kit"
                  description="Kit đã được gửi đến khách hàng"
                  status={getStepStatus(selectedRequest.kitStatus, "da_gui")}
                />
                <Step
                  title="Nhận mẫu"
                  description="Đã nhận được mẫu từ khách hàng"
                  status={getStepStatus(selectedRequest.kitStatus, "da_nhan")}
                />
              </Steps>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>Thông tin bổ sung:</h3>
              <p>
                <strong>Trạng thái hiện tại:</strong>{" "}
                <Tag color={getStatusColor(selectedRequest.kitStatus)}>{getStatusText(selectedRequest.kitStatus)}</Tag>
              </p>
              {selectedRequest.scheduledDate && (
                <p>
                  <strong>Ngày hẹn:</strong> {selectedRequest.scheduledDate}
                </p>
              )}
              {selectedRequest.samplerName && (
                <p>
                  <strong>Nhân viên phụ trách:</strong> {selectedRequest.samplerName}
                </p>
              )}
              {selectedRequest.kitId && (
                <p>
                  <strong>Mã kit:</strong> {selectedRequest.kitId}
                </p>
              )}
              {selectedRequest.notes && (
                <div>
                  <strong>Ghi chú:</strong>
                  <div style={{ background: "#f6f6f6", padding: 12, borderRadius: 4, marginTop: 8 }}>
                    {selectedRequest.notes}
                  </div>
                </div>
              )}
            </div>

            {selectedRequest.sampleInfo && (
              <div>
                <h3>Thông tin người lấy mẫu:</h3>
                <div style={{ background: "#f6f6f6", padding: 12, borderRadius: 4, marginTop: 8 }}>
                  <p>
                    <strong>Địa điểm lấy mẫu:</strong> {selectedRequest.sampleInfo.location}
                  </p>
                  <p>
                    <strong>Nhân viên thu mẫu:</strong> {selectedRequest.sampleInfo.collector}
                  </p>
                  <p>
                    <strong>Ngày lấy mẫu:</strong> {selectedRequest.sampleInfo.collectionDate}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal cập nhật trạng thái */}
      <Modal
        title={`Cập nhật trạng thái lấy mẫu #${selectedRequest?.id}`}
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        onOk={() => form.submit()}
        okText="Cập nhật"
        cancelText="Hủy"
        width={600}
        okButtonProps={{
          style: {
            background: "#fa8c16",
            color: "#fff",
            fontWeight: 700,
            borderRadius: 6,
            border: "none",
            boxShadow: "0 2px 8px #fa8c1622",
            transition: "background 0.2s"
          },
          onMouseOver: e => (e.currentTarget.style.background = '#d46b08'),
          onMouseOut: e => (e.currentTarget.style.background = '#fa8c16')
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveUpdate}>
          <Form.Item
            name="samplingStatus"
            label="Trạng thái kit"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="chua_gui">Chưa gửi kit</Option>
              <Option value="da_gui">Đã gửi kit</Option>
              <Option value="da_nhan">Đã nhận mẫu</Option>
              <Option value="huy">Đã hủy</Option>
            </Select>
          </Form.Item>

          <Form.Item name="kitId" label="Mã kit" rules={[{ required: true, message: "Vui lòng nhập mã kit!" }]}>
            <Input placeholder="Nhập mã kit" />
          </Form.Item>

          <Form.Item name="scheduledDate" label="Ngày hẹn">
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày hẹn"
              style={{ width: "100%" }}
              disabledDate={disabledDate}
            />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={4} placeholder="Nhập ghi chú về quá trình lấy mẫu..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal biên bản lấy mẫu */}
      <Modal
        title="Biên bản lấy mẫu xét nghiệm"
        open={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setReportModalVisible(false)}>
            Đóng
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />}>
            In biên bản
          </Button>,
        ]}
        width={800}
      >
        {selectedRequest && selectedRequest.sampleInfo && (
          <div style={{ background: "#fff", padding: 24, border: "1px solid #ddd" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={4}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Title>
              <Text>Độc lập - Tự do - Hạnh phúc</Text>
              <Divider style={{ margin: "12px 0" }} />
              <Title level={3}>BIÊN BẢN LẤY MẪU XÉT NGHIỆM</Title>
            </div>

            <Paragraph>
              Hôm nay, ngày {selectedRequest.sampleInfo.collectionDate}, tại {selectedRequest.sampleInfo.location}
            </Paragraph>
            <Paragraph>Chúng tôi gồm có:</Paragraph>
            <Paragraph>
              1. Nhân viên thu mẫu: <strong>{selectedRequest.sampleInfo.collector}</strong>
            </Paragraph>
            <Paragraph>
              2. Người yêu cầu xét nghiệm: <strong>{selectedRequest.name}</strong>, Địa chỉ hiện tại:{" "}
              {selectedRequest.address}
            </Paragraph>

            <Paragraph>
              Chúng tôi tiến hành lấy mẫu của những người để nghị xét nghiệm ADN. Các mẫu của từng người được lấy riêng
              rẽ như sau:
            </Paragraph>

            <div style={{ border: "1px solid #000", padding: 16, marginBottom: 16 }}>
              {selectedRequest.sampleInfo.donors.map((donor, index) => (
                <div
                  key={index}
                  style={{ marginBottom: index < selectedRequest.sampleInfo.donors.length - 1 ? 24 : 0 }}
                >
                  <Row gutter={16}>
                    <Col span={18}>
                      <Text strong>Họ và tên: {donor.name}</Text>
                    </Col>
                    <Col span={6} style={{ textAlign: "right" }}>
                      <Text>Người cho mẫu thứ {index + 1}</Text>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 8 }}>
                    <Col span={8}>
                      <Text>Loại giấy tờ: {donor.idType}</Text>
                    </Col>
                    <Col span={16}>
                      <Text>Số/quyển số: {donor.idNumber}</Text>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 8 }}>
                    <Col span={8}>
                      <Text>Ngày cấp: {donor.idIssueDate}</Text>
                    </Col>
                    <Col span={8}>
                      <Text>Nơi cấp: {donor.idIssuePlace}</Text>
                    </Col>
                    <Col span={8}>
                      <Text>Quốc tịch: {donor.nationality}</Text>
                    </Col>
                  </Row>
                  {donor.address && (
                    <Row style={{ marginTop: 8 }}>
                      <Col span={24}>
                        <Text>Địa chỉ: {donor.address}</Text>
                      </Col>
                    </Row>
                  )}
                  <Row gutter={16} style={{ marginTop: 8 }}>
                    <Col span={8}>
                      <Text>Loại mẫu: {donor.sampleType}</Text>
                    </Col>
                    <Col span={8}>
                      <Text>Số lượng mẫu: {donor.sampleQuantity}</Text>
                    </Col>
                    <Col span={8}>
                      <Text>Mối quan hệ: {donor.relationship}</Text>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 8 }}>
                    <Col span={24}>
                      <Text>Tiểu sử bệnh về máu, truyền máu hoặc ghép tủy trong 6 tháng: {donor.healthIssues}</Text>
                    </Col>
                  </Row>
                  <div style={{ textAlign: "right", marginTop: 16 }}>
                    <Text>Vân tay ngón trỏ phải</Text>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        border: "1px dashed #999",
                        borderRadius: "50%",
                        display: "inline-block",
                        marginLeft: 8,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <Paragraph style={{ fontStyle: "italic", fontSize: 12 }}>
              * Biên bản này và đơn yêu cầu xét nghiệm ADN là một phần không thể tách rời.
            </Paragraph>
            <Paragraph style={{ fontStyle: "italic", fontSize: 12 }}>
              * Mẫu xét nghiệm thu nhận được sẽ lưu trữ trong 30 ngày kể từ ngày trả kết quả. Sau thời gian đó người yêu
              cầu xét nghiệm cung cấp và chịu trách nhiệm.
            </Paragraph>

            <Row gutter={24} style={{ marginTop: 24, textAlign: "center" }}>
              <Col span={8}>
                <Text strong>NGƯỜI THU MẪU</Text>
                <div style={{ marginTop: 8 }}>
                  <Text>(Ký, ghi rõ họ tên)</Text>
                </div>
                <div style={{ marginTop: 60 }}>
                  <Text>{selectedRequest.sampleInfo.collector}</Text>
                </div>
              </Col>
              <Col span={8}>
                <Text strong>NGƯỜI ĐƯỢC LẤY MẪU</Text>
                <div style={{ marginTop: 8 }}>
                  <Text>(Ký và ghi rõ họ tên)</Text>
                </div>
                <div style={{ marginTop: 60 }}>
                  <Text>{selectedRequest.sampleInfo.donors[0].name}</Text>
                </div>
              </Col>
              <Col span={8}>
                <Text strong>NGƯỜI YÊU CẦU XÉT NGHIỆM</Text>
                <div style={{ marginTop: 8 }}>
                  <Text>(Ký và ghi rõ họ tên)</Text>
                </div>
                <div style={{ marginTop: 60 }}>
                  <Text>{selectedRequest.name}</Text>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default HomeSampling
