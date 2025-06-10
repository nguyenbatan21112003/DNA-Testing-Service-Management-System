"use client"

import { useState, useEffect } from "react"
import { Card, Table, Tag, Button, Modal, Form, Input, Select, message, Space, Rate, Avatar } from "antd"
import { EyeOutlined, MessageOutlined, UserOutlined, StarOutlined } from "@ant-design/icons"

const { TextArea } = Input
const { Option } = Select

const CustomerFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([])
    const [selectedFeedback, setSelectedFeedback] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [replyModalVisible, setReplyModalVisible] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        // Tạo dữ liệu mẫu cho phản hồi khách hàng
        const sampleFeedbacks = [
            {
                id: 1,
                customerName: "Nguyễn Văn Minh",
                email: "nguyenvanminh@gmail.com",
                orderId: "1001",
                rating: 5,
                feedback: "Dịch vụ rất tốt, kết quả chính xác và nhanh chóng. Nhân viên tư vấn nhiệt tình.",
                category: "Dịch vụ",
                status: "Chưa phản hồi",
                createdAt: "16/06/2024 10:30",
            },
            {
                id: 2,
                customerName: "Trần Thị Hương",
                email: "tranthihuong@gmail.com",
                orderId: "1002",
                rating: 4,
                feedback: "Quy trình lấy mẫu chuyên nghiệp, tuy nhiên thời gian chờ kết quả hơi lâu.",
                category: "Quy trình",
                status: "Đã phản hồi",
                createdAt: "15/06/2024 14:20",
                reply: "Cảm ơn anh/chị đã đánh giá. Chúng tôi sẽ cải thiện thời gian xử lý để phục vụ khách hàng tốt hơn.",
                repliedAt: "15/06/2024 16:45",
            },
            {
                id: 3,
                customerName: "Lê Văn Đức",
                email: "levanduc@gmail.com",
                orderId: "1003",
                rating: 5,
                feedback: "Rất hài lòng với kết quả xét nghiệm. Báo cáo chi tiết và dễ hiểu.",
                category: "Kết quả",
                status: "Chưa phản hồi",
                createdAt: "14/06/2024 09:15",
            },
            {
                id: 4,
                customerName: "Phạm Thị Mai",
                email: "phamthimai@gmail.com",
                orderId: "1004",
                rating: 3,
                feedback: "Dịch vụ ổn nhưng giá cả hơi cao so với thị trường.",
                category: "Giá cả",
                status: "Chưa phản hồi",
                createdAt: "13/06/2024 16:45",
            },
            {
                id: 5,
                customerName: "Hoàng Văn Nam",
                email: "hoangvannam@gmail.com",
                orderId: "1005",
                rating: 4,
                feedback: "Nhân viên lấy mẫu tại nhà rất chuyên nghiệp và lịch sự.",
                category: "Nhân viên",
                status: "Đã phản hồi",
                createdAt: "12/06/2024 11:30",
                reply: "Cảm ơn anh/chị đã tin tưởng dịch vụ của chúng tôi. Chúng tôi sẽ tiếp tục duy trì chất lượng phục vụ.",
                repliedAt: "12/06/2024 14:20",
            },
        ]

        setFeedbacks(sampleFeedbacks)
    }, [])

    const handleViewFeedback = (feedback) => {
        setSelectedFeedback(feedback)
        setModalVisible(true)
    }

    const handleReply = (feedback) => {
        setSelectedFeedback(feedback)
        form.resetFields()
        setReplyModalVisible(true)
    }

    const handleSendReply = async (values) => {
        try {
            const updatedFeedbacks = feedbacks.map((feedback) =>
                feedback.id === selectedFeedback.id
                    ? {
                        ...feedback,
                        status: "Đã phản hồi",
                        reply: values.reply,
                        repliedAt: new Date().toLocaleString("vi-VN"),
                    }
                    : feedback,
            )
            setFeedbacks(updatedFeedbacks)
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
            render: (name) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                    {name}
                </div>
            ),
        },
        {
            title: "Mã đơn hàng",
            dataIndex: "orderId",
            key: "orderId",
            width: 100,
            render: (orderId) => `#${orderId}`,
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            width: 120,
            render: (rating) => <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />,
        },
        {
            title: "Danh mục",
            dataIndex: "category",
            key: "category",
            width: 100,
            render: (category) => <Tag color="blue">{category}</Tag>,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status) => {
                const color = status === "Đã phản hồi" ? "green" : "orange"
                return <Tag color={color}>{status}</Tag>
            },
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
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewFeedback(record)}>
                        Xem
                    </Button>
                    {record.status !== "Đã phản hồi" && (
                        <Button size="small" icon={<MessageOutlined />} onClick={() => handleReply(record)}>
                            Phản hồi
                        </Button>
                    )}
                </Space>
            ),
        },
    ]

    const averageRating = feedbacks.length > 0 ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length : 0
    const pendingCount = feedbacks.filter((fb) => fb.status === "Chưa phản hồi").length

    return (
        <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}>Phản hồi khách hàng</h1>
                <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>Quản lý và phản hồi đánh giá từ khách hàng</p>
            </div>

            {/* Thống kê */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 16,
                    marginBottom: 24,
                }}
            >
                <Card>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: "#00a67e" }}>{feedbacks.length}</div>
                        <div style={{ color: "#666" }}>Tổng phản hồi</div>
                    </div>
                </Card>
                <Card>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: "#fa8c16" }}>{pendingCount}</div>
                        <div style={{ color: "#666" }}>Chờ phản hồi</div>
                    </div>
                </Card>
                <Card>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            <span style={{ fontSize: 24, fontWeight: 700, color: "#52c41a" }}>{averageRating.toFixed(1)}</span>
                            <StarOutlined style={{ color: "#faad14" }} />
                        </div>
                        <div style={{ color: "#666" }}>Đánh giá trung bình</div>
                    </div>
                </Card>
                <Card>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: "#1890ff" }}>
                            {feedbacks.filter((fb) => fb.status === "Đã phản hồi").length}
                        </div>
                        <div style={{ color: "#666" }}>Đã phản hồi</div>
                    </div>
                </Card>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={feedbacks}
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

            {/* Modal xem chi tiết */}
            <Modal
                title={`Chi tiết phản hồi #${selectedFeedback?.id}`}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setModalVisible(false)}>
                        Đóng
                    </Button>,
                    selectedFeedback?.status !== "Đã phản hồi" && (
                        <Button
                            key="reply"
                            type="primary"
                            icon={<MessageOutlined />}
                            onClick={() => {
                                setModalVisible(false)
                                handleReply(selectedFeedback)
                            }}
                        >
                            Phản hồi
                        </Button>
                    ),
                ]}
                width={700}
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
                                <strong>Mã đơn hàng:</strong> #{selectedFeedback.orderId}
                            </p>
                            <p>
                                <strong>Danh mục:</strong> <Tag color="blue">{selectedFeedback.category}</Tag>
                            </p>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <h3>Đánh giá:</h3>
                            <Rate disabled defaultValue={selectedFeedback.rating} />
                            <span style={{ marginLeft: 8 }}>({selectedFeedback.rating}/5 sao)</span>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <h3>Nội dung phản hồi:</h3>
                            <div style={{ background: "#f6f6f6", padding: 16, borderRadius: 6 }}>{selectedFeedback.feedback}</div>
                        </div>

                        {selectedFeedback.reply && (
                            <div>
                                <h3>Phản hồi của chúng tôi:</h3>
                                <div style={{ background: "#f6ffed", border: "1px solid #b7eb8f", padding: 16, borderRadius: 6 }}>
                                    {selectedFeedback.reply}
                                </div>
                                <p style={{ color: "#666", fontSize: 12, marginTop: 8 }}>Phản hồi lúc: {selectedFeedback.repliedAt}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Modal phản hồi */}
            <Modal
                title={`Phản hồi đánh giá #${selectedFeedback?.id}`}
                open={replyModalVisible}
                onCancel={() => setReplyModalVisible(false)}
                onOk={() => form.submit()}
                okText="Gửi phản hồi"
                cancelText="Hủy"
                width={700}
            >
                <Form form={form} layout="vertical" onFinish={handleSendReply}>
                    <div style={{ marginBottom: 16, background: "#f6f6f6", padding: 16, borderRadius: 6 }}>
                        <h4>Đánh giá của khách hàng:</h4>
                        <Rate disabled defaultValue={selectedFeedback?.rating} style={{ marginBottom: 8 }} />
                        <p>{selectedFeedback?.feedback}</p>
                    </div>

                    <Form.Item
                        name="reply"
                        label="Nội dung phản hồi"
                        rules={[{ required: true, message: "Vui lòng nhập nội dung phản hồi!" }]}
                    >
                        <TextArea rows={6} placeholder="Nhập nội dung phản hồi cho khách hàng..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default CustomerFeedback
