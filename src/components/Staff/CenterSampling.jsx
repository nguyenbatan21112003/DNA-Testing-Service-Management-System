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
  Calendar,
  Badge,
  Tabs,
  Row,
  Col,
  Statistic,
} from "antd"
import {
  BankOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import { useOrderContext } from "../../context/OrderContext"

const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs

const CenterSampling = () => {
  const { getAllOrders } = useOrderContext()
  const [appointments, setAppointments] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [calendarModalVisible, setCalendarModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    arrived: 0,
    missed: 0,
    canceled: 0,
  })

  useEffect(() => {
    // Lấy dữ liệu từ localStorage và lọc các đơn hàng lấy mẫu tại trung tâm
    const allOrders = getAllOrders()
    const centerSamplingOrders = allOrders
      .filter((order) => order.sampleMethod === "center")
      .map((order) => ({
        ...order,
        appointmentStatus: order.appointmentStatus || "da_hen",
        appointmentDate: order.appointmentDate || null,
        staffAssigned: order.staffAssigned || null,
        notes: order.notes || "",
        timeSlot: order.timeSlot || "09:00-10:00",
      }))

    setAppointments(centerSamplingOrders)

    // Tính toán thống kê
    const newStats = {
      total: centerSamplingOrders.length,
      scheduled: centerSamplingOrders.filter((apt) => apt.appointmentStatus === "da_hen").length,
      arrived: centerSamplingOrders.filter((apt) => apt.appointmentStatus === "da_den").length,
      missed: centerSamplingOrders.filter((apt) => apt.appointmentStatus === "vang_mat").length,
      canceled: centerSamplingOrders.filter((apt) => apt.appointmentStatus === "huy").length,
    }
    setStats(newStats)
  }, [])

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    setModalVisible(true)
  }

  const handleUpdateAppointment = (appointment) => {
    setSelectedAppointment(appointment)
    form.setFieldsValue({
      appointmentStatus: appointment.appointmentStatus,
      appointmentDate: appointment.appointmentDate ? dayjs(appointment.appointmentDate, "DD/MM/YYYY") : null,
      timeSlot: appointment.timeSlot,
      staffAssigned: appointment.staffAssigned || "",
      notes: appointment.notes || "",
    })
    setUpdateModalVisible(true)
  }

  const handleSaveUpdate = async (values) => {
    try {
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === selectedAppointment.id
          ? {
              ...appointment,
              appointmentStatus: values.appointmentStatus,
              appointmentDate: values.appointmentDate ? values.appointmentDate.format("DD/MM/YYYY") : null,
              timeSlot: values.timeSlot,
              staffAssigned: values.staffAssigned,
              notes: values.notes,
              updatedAt: new Date().toLocaleString("vi-VN"),
            }
          : appointment,
      )

      setAppointments(updatedAppointments)

      // Cập nhật lại localStorage
      const allOrders = getAllOrders()
      const updatedAllOrders = allOrders.map((order) => {
        const updatedAppointment = updatedAppointments.find((apt) => apt.id === order.id)
        return updatedAppointment || order
      })
      localStorage.setItem("dna_orders", JSON.stringify(updatedAllOrders))

      // Cập nhật thống kê
      const newStats = {
        total: updatedAppointments.length,
        scheduled: updatedAppointments.filter((apt) => apt.appointmentStatus === "da_hen").length,
        arrived: updatedAppointments.filter((apt) => apt.appointmentStatus === "da_den").length,
        missed: updatedAppointments.filter((apt) => apt.appointmentStatus === "vang_mat").length,
        canceled: updatedAppointments.filter((apt) => apt.appointmentStatus === "huy").length,
      }
      setStats(newStats)

      setUpdateModalVisible(false)
      message.success("Cập nhật lịch hẹn thành công!")
    } catch {
      message.error("Có lỗi xảy ra khi cập nhật!")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "da_hen":
        return "blue"
      case "da_den":
        return "green"
      case "vang_mat":
        return "orange"
      case "huy":
        return "red"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "da_hen":
        return "Đã hẹn"
      case "da_den":
        return "Đã đến"
      case "vang_mat":
        return "Vắng mặt"
      case "huy":
        return "Đã hủy"
      default:
        return status
    }
  }

  const getListData = (value) => {
    const dateStr = value.format("DD/MM/YYYY")
    return appointments.filter((apt) => apt.appointmentDate === dateStr)
  }

  const dateCellRender = (value) => {
    const listData = getListData(value)
    return (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {listData.map((item) => (
          <li key={item.id}>
            <Badge
              status={getStatusColor(item.appointmentStatus)}
              text={`${item.timeSlot} - ${item.name}`}
              style={{ fontSize: 12 }}
            />
          </li>
        ))}
      </ul>
    )
  }

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => `#${id}`,
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
      width: 150,
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
      title: "Loại xét nghiệm",
      dataIndex: "type",
      key: "type",
      width: 180,
    },
    {
      title: "Ngày hẹn",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      width: 120,
      render: (date) =>
        date ? (
          <span>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {date}
          </span>
        ) : (
          <span style={{ color: "#999" }}>Chưa hẹn</span>
        ),
    },
    {
      title: "Giờ hẹn",
      dataIndex: "timeSlot",
      key: "timeSlot",
      width: 120,
      render: (timeSlot) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {timeSlot}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "appointmentStatus",
      key: "appointmentStatus",
      width: 120,
      render: (status) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
    },
    {
      title: "Nhân viên",
      dataIndex: "staffAssigned",
      key: "staffAssigned",
      width: 120,
      render: (staff) =>
        staff ? (
          <span>
            <UserOutlined style={{ marginRight: 4 }} />
            {staff}
          </span>
        ) : (
          <span style={{ color: "#999" }}>Chưa phân công</span>
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<BankOutlined />} onClick={() => handleViewAppointment(record)}>
            Xem
          </Button>
          <Button
            type="default"
            size="small"
            icon={<CalendarOutlined />}
            onClick={() => handleUpdateAppointment(record)}
          >
            Cập nhật
          </Button>
        </Space>
      ),
    },
  ]

  const todayAppointments = appointments.filter((apt) => apt.appointmentDate === dayjs().format("DD/MM/YYYY"))

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}>Thu mẫu tại cơ sở</h1>
        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>Quản lý lịch hẹn lấy mẫu tại trung tâm</p>
      </div>

      {/* Thống kê */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Tổng lịch hẹn"
              value={stats.total}
              valueStyle={{ color: "#00a67e" }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Đã hẹn"
              value={stats.scheduled}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Đã đến"
              value={stats.arrived}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Vắng mặt"
              value={stats.missed}
              valueStyle={{ color: "#fa8c16" }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={stats.canceled}
              valueStyle={{ color: "#f5222d" }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Tỷ lệ đến"
              value={
                stats.scheduled > 0
                  ? Math.round((stats.arrived / (stats.scheduled + stats.arrived + stats.missed)) * 100)
                  : 0
              }
              suffix="%"
              valueStyle={{ color: "#13c2c2" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Thống kê hôm nay */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, color: "#00a67e" }}>Lịch hẹn hôm nay ({dayjs().format("DD/MM/YYYY")})</h3>
            <p style={{ margin: "8px 0 0 0", color: "#666" }}>Tổng cộng: {todayAppointments.length} lịch hẹn</p>
          </div>
          <Button type="primary" icon={<CalendarOutlined />} onClick={() => setCalendarModalVisible(true)}>
            Xem lịch tháng
          </Button>
        </div>

        {todayAppointments.length > 0 ? (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    background: "#f9f9f9",
                    padding: 12,
                    borderRadius: 6,
                    border: "1px solid #e8e8e8",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}
                  >
                    <strong>
                      #{apt.id} - {apt.name}
                    </strong>
                    <Tag color={getStatusColor(apt.appointmentStatus)}>{getStatusText(apt.appointmentStatus)}</Tag>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {apt.timeSlot} | {apt.type}
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#666" }}>
                    <PhoneOutlined style={{ marginRight: 4 }} />
                    {apt.phone}
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#666" }}>
                    <UserOutlined style={{ marginRight: 4 }} />
                    {apt.staffAssigned || "Chưa phân công"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0", color: "#999" }}>
            <CalendarOutlined style={{ fontSize: 24, color: "#d9d9d9" }} />
            <p style={{ marginTop: 8 }}>Không có lịch hẹn nào hôm nay</p>
          </div>
        )}
      </Card>

      <Card>
        <Tabs defaultActiveKey="all">
          <TabPane tab="Tất cả lịch hẹn" key="all">
            <Table
              columns={columns}
              dataSource={appointments}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch hẹn`,
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
          <TabPane tab="Đã hẹn" key="scheduled">
            <Table
              columns={columns}
              dataSource={appointments.filter((apt) => apt.appointmentStatus === "da_hen")}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch hẹn`,
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
          <TabPane tab="Đã đến" key="arrived">
            <Table
              columns={columns}
              dataSource={appointments.filter((apt) => apt.appointmentStatus === "da_den")}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch hẹn`,
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
          <TabPane tab="Vắng mặt/Hủy" key="missed">
            <Table
              columns={columns}
              dataSource={appointments.filter(
                (apt) => apt.appointmentStatus === "vang_mat" || apt.appointmentStatus === "huy",
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch hẹn`,
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal xem chi tiết */}
      <Modal
        title={`Chi tiết lịch hẹn #${selectedAppointment?.id}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="update"
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => {
              setModalVisible(false)
              handleUpdateAppointment(selectedAppointment)
            }}
          >
            Cập nhật lịch hẹn
          </Button>,
        ]}
        width={600}
      >
        {selectedAppointment && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>Thông tin khách hàng:</h3>
              <p>
                <strong>Họ tên:</strong> {selectedAppointment.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedAppointment.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedAppointment.phone}
              </p>
              <p>
                <strong>Loại xét nghiệm:</strong> {selectedAppointment.type}
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>Thông tin lịch hẹn:</h3>
              <p>
                <strong>Ngày hẹn:</strong> {selectedAppointment.appointmentDate || "Chưa hẹn"}
              </p>
              <p>
                <strong>Giờ hẹn:</strong> {selectedAppointment.timeSlot}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <Tag color={getStatusColor(selectedAppointment.appointmentStatus)}>
                  {getStatusText(selectedAppointment.appointmentStatus)}
                </Tag>
              </p>
              <p>
                <strong>Nhân viên phụ trách:</strong> {selectedAppointment.staffAssigned || "Chưa phân công"}
              </p>
            </div>

            {selectedAppointment.notes && (
              <div>
                <h3>Ghi chú:</h3>
                <div style={{ background: "#f6f6f6", padding: 12, borderRadius: 4 }}>{selectedAppointment.notes}</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal cập nhật lịch hẹn */}
      <Modal
        title={`Cập nhật lịch hẹn #${selectedAppointment?.id}`}
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        onOk={() => form.submit()}
        okText="Cập nhật"
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveUpdate}>
          <Form.Item
            name="appointmentStatus"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="da_hen">Đã hẹn</Option>
              <Option value="da_den">Đã đến</Option>
              <Option value="vang_mat">Vắng mặt</Option>
              <Option value="huy">Đã hủy</Option>
            </Select>
          </Form.Item>

          <Form.Item name="appointmentDate" label="Ngày hẹn">
            <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày hẹn" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="timeSlot" label="Giờ hẹn">
            <Select placeholder="Chọn khung giờ">
              <Option value="08:00-09:00">08:00 - 09:00</Option>
              <Option value="09:00-10:00">09:00 - 10:00</Option>
              <Option value="10:00-11:00">10:00 - 11:00</Option>
              <Option value="11:00-12:00">11:00 - 12:00</Option>
              <Option value="13:00-14:00">13:00 - 14:00</Option>
              <Option value="14:00-15:00">14:00 - 15:00</Option>
              <Option value="15:00-16:00">15:00 - 16:00</Option>
              <Option value="16:00-17:00">16:00 - 17:00</Option>
            </Select>
          </Form.Item>

          <Form.Item name="staffAssigned" label="Nhân viên phụ trách">
            <Select placeholder="Chọn nhân viên">
              <Option value="Trần Trung Tâm">Trần Trung Tâm</Option>
              <Option value="Nguyễn Thị Lan">Nguyễn Thị Lan</Option>
              <Option value="Trần Văn Minh">Trần Văn Minh</Option>
              <Option value="Lê Thị Hoa">Lê Thị Hoa</Option>
              <Option value="Phạm Văn Đức">Phạm Văn Đức</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={3} placeholder="Nhập ghi chú về lịch hẹn..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal lịch tháng */}
      <Modal
        title="Lịch hẹn tháng"
        open={calendarModalVisible}
        onCancel={() => setCalendarModalVisible(false)}
        footer={null}
        width={800}
      >
        <Calendar dateCellRender={dateCellRender} />
      </Modal>
    </div>
  )
}

export default CenterSampling
