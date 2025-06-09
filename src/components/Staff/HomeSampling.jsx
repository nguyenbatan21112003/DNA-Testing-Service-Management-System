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
} from "antd"
import { HomeOutlined, CarOutlined, PhoneOutlined, EnvironmentOutlined, ClockCircleOutlined } from "@ant-design/icons"
import dayjs from "dayjs"

const { Option } = Select
const { TextArea } = Input
const { Step } = Steps
const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

const HomeSampling = () => {
    const [samplingRequests, setSamplingRequests] = useState([])
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [updateModalVisible, setUpdateModalVisible] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        // Lấy dữ liệu từ localStorage và lọc các đơn hàng lấy mẫu tại nhà
        const savedOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]")
        const homeSamplingOrders = savedOrders
            .filter((order) => order.sampleMethod === "home")
            .map((order) => ({
                ...order,
                samplingStatus: order.kitStatus || "chua_gui",
                scheduledDate: order.scheduledDate || null,
                samplerName: order.samplerName || null,
                notes: order.notes || "",
            }))

        setSamplingRequests(homeSamplingOrders)
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

    const generateKitId = (request) => {
        const prefix = request.type.includes("huyết thống") ? "KIT-PC-" : "KIT-DT-"
        return `${prefix}${request.id}`
    }

    const handleSaveUpdate = async (values) => {
        try {
            const updatedRequests = samplingRequests.map((request) =>
                request.id === selectedRequest.id
                    ? {
                        ...request,
                        kitStatus: values.samplingStatus,
                        scheduledDate:
                            values.scheduledDate && values.scheduledTime
                                ? `${values.scheduledDate.format("DD/MM/YYYY")} ${values.scheduledTime}`
                                : null,
                        samplerName: values.samplerName,
                        kitId: values.kitId,
                        notes: values.notes,
                        updatedAt: new Date().toLocaleString("vi-VN"),
                    }
                    : request,
            )

            setSamplingRequests(updatedRequests)

            // Cập nhật lại localStorage
            const allOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]")
            const updatedAllOrders = allOrders.map((order) => {
                const updatedRequest = updatedRequests.find((req) => req.id === order.id)
                if (updatedRequest) {
                    return {
                        ...order,
                        kitStatus: updatedRequest.kitStatus,
                        scheduledDate: updatedRequest.scheduledDate,
                        samplerName: updatedRequest.samplerName,
                        kitId: updatedRequest.kitId,
                        notes: updatedRequest.notes,
                        updatedAt: updatedRequest.updatedAt,
                    }
                }
                return order
            })
            localStorage.setItem("dna_orders", JSON.stringify(updatedAllOrders))

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
            title: "Nhân viên",
            dataIndex: "samplerName",
            key: "samplerName",
            width: 120,
            render: (name) => name || <span style={{ color: "#999" }}>Chưa phân công</span>,
        },
        {
            title: "Độ ưu tiên",
            dataIndex: "priority",
            key: "priority",
            width: 100,
            render: (priority) => {
                let color = "default"
                if (priority === "Cao") color = "red"
                if (priority === "Trung bình") color = "orange"
                if (priority === "Thấp") color = "green"
                return <Tag color={color}>{priority}</Tag>
            },
        },
        {
            title: "Thao tác",
            key: "action",
            width: 250,
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" size="small" icon={<HomeOutlined />} onClick={() => handleViewRequest(record)}>
                        Xem
                    </Button>
                    <Button size="small" icon={<CarOutlined />} onClick={() => handleUpdateStatus(record)}>
                        Cập nhật
                    </Button>
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

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="scheduledDate" label="Ngày hẹn">
                                <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày hẹn" style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="scheduledTime" label="Giờ hẹn">
                                <Select placeholder="Chọn giờ hẹn">
                                    <Option value="08:00">08:00</Option>
                                    <Option value="09:00">09:00</Option>
                                    <Option value="10:00">10:00</Option>
                                    <Option value="11:00">11:00</Option>
                                    <Option value="13:00">13:00</Option>
                                    <Option value="14:00">14:00</Option>
                                    <Option value="15:00">15:00</Option>
                                    <Option value="16:00">16:00</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="samplerName" label="Nhân viên phụ trách">
                        <Select placeholder="Chọn nhân viên">
                            <Option value="Trần Trung Tâm">Trần Trung Tâm</Option>
                            <Option value="Nguyễn Văn A">Nguyễn Văn A</Option>
                            <Option value="Trần Thị B">Trần Thị B</Option>
                            <Option value="Lê Văn C">Lê Văn C</Option>
                            <Option value="Phạm Thị D">Phạm Thị D</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="notes" label="Ghi chú">
                        <TextArea rows={4} placeholder="Nhập ghi chú về quá trình lấy mẫu..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default HomeSampling
