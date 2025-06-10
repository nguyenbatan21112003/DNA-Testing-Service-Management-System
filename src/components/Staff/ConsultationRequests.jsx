"use client"

import { useState, useEffect } from "react"
import { Card, Table, Tag, Button, Modal, Form, Input, Select, message, Space, Badge } from "antd"
import { EyeOutlined, MessageOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from "@ant-design/icons"

const { TextArea } = Input
const { Option } = Select

const ConsultationRequests = () => {
    const [consultations, setConsultations] = useState([])
    const [selectedConsultation, setSelectedConsultation] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [replyModalVisible, setReplyModalVisible] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        // Tạo dữ liệu mẫu cho yêu cầu tư vấn
        const sampleConsultations = [
            {
                id: 1,
                customerName: "Nguyễn Văn An",
                email: "nguyenvanan@gmail.com",
                phone: "0123456789",
                subject: "Tư vấn về xét nghiệm ADN cha con",
                message: "Tôi muốn biết quy trình xét nghiệm ADN cha con và thời gian có kết quả. Chi phí như thế nào?",
                status: "Chờ phản hồi",
                priority: "Cao",
                createdAt: "16/06/2024 09:30",
                category: "Xét nghiệm ADN",
            },
            {
                id: 2,
                customerName: "Trần Thị Bình",
                email: "tranthibinh@gmail.com",
                phone: "0987654321",
                subject: "Hỏi về độ chính xác kết quả",
                message: "Xin chào, tôi muốn hỏi về độ chính xác của xét nghiệm ADN huyết thống. Có thể tin tưởng được không?",
                status: "Đã phản hồi",
                priority: "Trung bình",
                createdAt: "15/06/2024 14:20",
                category: "Độ chính xác",
                reply:
                    "Xin chào anh/chị, xét nghiệm ADN huyết thống của chúng tôi có độ chính xác lên đến 99.99%. Chúng tôi sử dụng công nghệ hiện đại và được kiểm định bởi các tổ chức uy tín.",
                repliedAt: "15/06/2024 16:45",
            },
            {
                id: 3,
                customerName: "Lê Văn Cường",
                email: "levancuong@gmail.com",
                phone: "0369258147",
                subject: "Thủ tục lấy mẫu tại nhà",
                message: "Tôi ở xa trung tâm, có thể lấy mẫu tại nhà không? Thủ tục như thế nào?",
                status: "Đang xử lý",
                priority: "Trung bình",
                createdAt: "16/06/2024 11:15",
                category: "Lấy mẫu",
            },
            {
                id: 4,
                customerName: "Phạm Thị Dung",
                email: "phamthidung@gmail.com",
                phone: "0741963852",
                subject: "Giá cả dịch vụ",
                message: "Cho tôi hỏi bảng giá các loại xét nghiệm ADN. Có chương trình khuyến mãi nào không?",
                status: "Chờ phản hồi",
                priority: "Thấp",
                createdAt: "16/06/2024 08:45",
                category: "Giá cả",
            },
            {
                id: 5,
                customerName: "Hoàng Văn Em",
                email: "hoangvanem@gmail.com",
                phone: "0852741963",
                subject: "Thời gian có kết quả",
                message: "Xét nghiệm ADN anh em mất bao lâu để có kết quả? Có thể rút ngắn thời gian không?",
                status: "Đã phản hồi",
                priority: "Cao",
                createdAt: "14/06/2024 16:30",
                category: "Thời gian",
                reply:
                    "Thời gian xét nghiệm ADN anh em thường là 5-7 ngày làm việc. Chúng tôi có dịch vụ xét nghiệm nhanh trong 3 ngày với phụ phí.",
                repliedAt: "15/06/2024 09:20",
            },
        ]

        setConsultations(sampleConsultations)
    }, [])

    const handleViewConsultation = (consultation) => {
        setSelectedConsultation(consultation)
        setModalVisible(true)
    }

    const handleReply = (consultation) => {
        setSelectedConsultation(consultation)
        form.resetFields()
        setReplyModalVisible(true)
    }

    const handleSendReply = async (values) => {
        try {
            const updatedConsultations = consultations.map((consultation) =>
                consultation.id === selectedConsultation.id
                    ? {
                        ...consultation,
                        status: "Đã phản hồi",
                        reply: values.reply,
                        repliedAt: new Date().toLocaleString("vi-VN"),
                    }
                    : consultation,
            )
            setConsultations(updatedConsultations)
            setReplyModalVisible(false)
            message.success("Gửi phản hồi thành công!")
        } catch {
            message.error("Có lỗi xảy ra khi gửi phản hồi!")
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
            title: "Chủ đề",
            dataIndex: "subject",
            key: "subject",
            width: 200,
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
            width: 120,
            render: (status) => {
                let color = "default"
                if (status === "Chờ phản hồi") color = "orange"
                if (status === "Đang xử lý") color = "blue"
                if (status === "Đã phản hồi") color = "green"
                return <Tag color={color}>{status}</Tag>
            },
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
            title: "Thời gian",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 140,
            render: (time) => (
                <span>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    {time}
                </span>
            ),
        },
        {
            title: "Thao tác",
            key: "action",
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewConsultation(record)}>
                        Xem
                    </Button>
                    {record.status !== "Đã phản hồi" && (
                        <Button type="default" size="small" icon={<MessageOutlined />} onClick={() => handleReply(record)}>
                            Phản hồi
                        </Button>
                    )}
                </Space>
            ),
        },
    ]

    const pendingCount = consultations.filter((c) => c.status === "Chờ phản hồi").length

    return (
        <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}>
                    Yêu cầu tư vấn
                    <Badge count={pendingCount} style={{ marginLeft: 16 }} />
                </h1>
                <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
                    Quản lý và phản hồi các yêu cầu tư vấn từ khách hàng
                </p>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={consultations}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} yêu cầu`,
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>

            {/* Modal xem chi tiết */}
            <Modal
                title={`Chi tiết yêu cầu tư vấn #${selectedConsultation?.id}`}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setModalVisible(false)}>
                        Đóng
                    </Button>,
                    selectedConsultation?.status !== "Đã phản hồi" && (
                        <Button
                            key="reply"
                            type="primary"
                            icon={<MessageOutlined />}
                            onClick={() => {
                                setModalVisible(false)
                                handleReply(selectedConsultation)
                            }}
                        >
                            Phản hồi
                        </Button>
                    ),
                ]}
                width={800}
            >
                {selectedConsultation && (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <h3>Thông tin khách hàng:</h3>
                            <p>
                                <strong>Họ tên:</strong> {selectedConsultation.customerName}
                            </p>
                            <p>
                                <strong>Email:</strong>
                                <Button type="link" icon={<MailOutlined />} style={{ padding: 0, marginLeft: 8 }}>
                                    {selectedConsultation.email}
                                </Button>
                            </p>
                            <p>
                                <strong>Số điện thoại:</strong>
                                <Button type="link" icon={<PhoneOutlined />} style={{ padding: 0, marginLeft: 8 }}>
                                    {selectedConsultation.phone}
                                </Button>
                            </p>
                            <p>
                                <strong>Danh mục:</strong> <Tag color="blue">{selectedConsultation.category}</Tag>
                            </p>
                            <p>
                                <strong>Độ ưu tiên:</strong>{" "}
                                <Tag
                                    color={
                                        selectedConsultation.priority === "Cao"
                                            ? "red"
                                            : selectedConsultation.priority === "Trung bình"
                                                ? "orange"
                                                : "green"
                                    }
                                >
                                    {selectedConsultation.priority}
                                </Tag>
                            </p>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <h3>Chủ đề:</h3>
                            <p>{selectedConsultation.subject}</p>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <h3>Nội dung:</h3>
                            <div style={{ background: "#f6f6f6", padding: 16, borderRadius: 6 }}>{selectedConsultation.message}</div>
                        </div>

                        {selectedConsultation.reply && (
                            <div>
                                <h3>Phản hồi:</h3>
                                <div style={{ background: "#f6ffed", border: "1px solid #b7eb8f", padding: 16, borderRadius: 6 }}>
                                    {selectedConsultation.reply}
                                </div>
                                <p style={{ color: "#666", fontSize: 12, marginTop: 8 }}>
                                    Phản hồi lúc: {selectedConsultation.repliedAt}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Modal phản hồi */}
            <Modal
                title={`Phản hồi yêu cầu tư vấn #${selectedConsultation?.id}`}
                open={replyModalVisible}
                onCancel={() => setReplyModalVisible(false)}
                onOk={() => form.submit()}
                okText="Gửi phản hồi"
                cancelText="Hủy"
                width={800}
            >
                <Form form={form} layout="vertical" onFinish={handleSendReply}>
                    <div style={{ marginBottom: 16, background: "#f6f6f6", padding: 16, borderRadius: 6 }}>
                        <h4>Câu hỏi của khách hàng:</h4>
                        <p>{selectedConsultation?.message}</p>
                    </div>

                    <Form.Item
                        name="reply"
                        label="Nội dung phản hồi"
                        rules={[{ required: true, message: "Vui lòng nhập nội dung phản hồi!" }]}
                    >
                        <TextArea rows={8} placeholder="Nhập nội dung phản hồi chi tiết cho khách hàng..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ConsultationRequests
