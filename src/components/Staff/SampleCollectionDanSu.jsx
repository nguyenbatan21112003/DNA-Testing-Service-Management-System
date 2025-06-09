"use client"

import { useState, useEffect } from "react"
import {
    Card,
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    Row,
    Col,
    Divider,
    Typography,
    Space,
    Modal,
    Table,
    Tag,
    message,
    Tabs,
    Checkbox,
    Radio,
} from "antd"
import { PlusOutlined, DeleteOutlined, PrinterOutlined, SaveOutlined, EyeOutlined } from "@ant-design/icons"

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs

const SampleCollectionDanSu = () => {
    const [form] = Form.useForm()
    const [civilForms, setCivilForms] = useState([])
    const [selectedForm, setSelectedForm] = useState(null)
    const [previewModalVisible, setPreviewModalVisible] = useState(false)
    const [participants, setParticipants] = useState([
        {
            id: 1,
            name: "",
            birthYear: "",
            gender: "Nam",
            relationship: "",
            sampleType: "Máu",
            collectionDate: null,
            notes: "",
        },
        {
            id: 2,
            name: "",
            birthYear: "",
            gender: "Nam",
            relationship: "",
            sampleType: "NMM",
            collectionDate: null,
            notes: "",
        },
    ])

    useEffect(() => {
        const savedForms = JSON.parse(localStorage.getItem("civil_sample_forms") || "[]")
        setCivilForms(savedForms)
    }, [])

    const addParticipant = () => {
        const newParticipant = {
            id: participants.length + 1,
            name: "",
            birthYear: "",
            gender: "Nam",
            relationship: "",
            sampleType: "Máu",
            collectionDate: null,
            notes: "",
        }
        setParticipants([...participants, newParticipant])
    }

    const removeParticipant = (id) => {
        if (participants.length > 1) {
            setParticipants(participants.filter((participant) => participant.id !== id))
        }
    }

    const updateParticipant = (id, field, value) => {
        setParticipants(
            participants.map((participant) => (participant.id === id ? { ...participant, [field]: value } : participant)),
        )
    }

    const handleSave = async (values) => {
        try {
            const newForm = {
                id: Date.now(),
                formNumber: `DS-${Date.now()}`,
                ...values,
                participants: participants,
                createdAt: new Date().toLocaleString("vi-VN"),
                status: "Đã lấy mẫu",
            }

            const updatedForms = [...civilForms, newForm]
            setCivilForms(updatedForms)
            localStorage.setItem("civil_sample_forms", JSON.stringify(updatedForms))

            // Cập nhật đơn hàng tương ứng nếu có
            const orders = JSON.parse(localStorage.getItem("dna_orders") || "[]")
            const updatedOrders = orders.map((order) => {
                if (order.id.toString() === values.orderId && order.type.includes("dân sự")) {
                    return {
                        ...order,
                        sampleCollected: true,
                        sampleCollectionId: newForm.id,
                        status: "Đang xử lý",
                        sampleInfo: {
                            formNumber: newForm.formNumber,
                            participants: participants,
                            collectionDate: new Date().toLocaleString("vi-VN"),
                        },
                    }
                }
                return order
            })
            localStorage.setItem("dna_orders", JSON.stringify(updatedOrders))

            form.resetFields()
            setParticipants([
                {
                    id: 1,
                    name: "",
                    birthYear: "",
                    gender: "Nam",
                    relationship: "",
                    sampleType: "Máu",
                    collectionDate: null,
                    notes: "",
                },
                {
                    id: 2,
                    name: "",
                    birthYear: "",
                    gender: "Nam",
                    relationship: "",
                    sampleType: "NMM",
                    collectionDate: null,
                    notes: "",
                },
            ])

            message.success("Lưu đơn yêu cầu phân tích ADN thành công!")
        } catch {
            message.error("Có lỗi xảy ra khi lưu đơn!")
        }
    }

    const handleViewForm = (formData) => {
        setSelectedForm(formData)
        setPreviewModalVisible(true)
    }

    const getCivilOrders = () => {
        const orders = JSON.parse(localStorage.getItem("dna_orders") || "[]")
        return orders.filter((order) => order.type.includes("dân sự") && !order.sampleCollected)
    }

    const columns = [
        {
            title: "Mã đơn",
            dataIndex: "formNumber",
            key: "formNumber",
        },
        {
            title: "Mã đơn hàng",
            dataIndex: "orderId",
            key: "orderId",
            render: (id) => `#${id}`,
        },
        {
            title: "Tên khách hàng",
            dataIndex: "customerName",
            key: "customerName",
        },
        {
            title: "Số người tham gia",
            dataIndex: "participants",
            key: "participants",
            render: (participants) => participants.length,
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => <Tag color="green">{status}</Tag>,
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewForm(record)}
                        style={{
                            backgroundColor: "#13c2c2",
                            borderColor: "#13c2c2",
                            fontWeight: "500",
                        }}
                    >
                        Xem
                    </Button>
                    <Button
                        size="small"
                        icon={<PrinterOutlined />}
                        onClick={() => handleViewForm(record)}
                        style={{
                            backgroundColor: "#13c2c2",
                            borderColor: "#13c2c2",
                            color: "white",
                            fontWeight: "500",
                        }}
                    >
                        In
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#13c2c2", margin: 0 }}>Lấy mẫu xét nghiệm dân sự</h1>
                <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
                    Tạo đơn yêu cầu phân tích ADN cho xét nghiệm dân sự
                </p>
            </div>

            <Tabs defaultActiveKey="create">
                <TabPane tab="Tạo đơn mới" key="create">
                    <Card>
                        <Form form={form} layout="vertical" onFinish={handleSave}>
                            {/* Header giống form gốc */}
                            <div style={{ textAlign: "center", marginBottom: 24 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
                                    <div
                                        style={{
                                            width: 60,
                                            height: 60,
                                            background: "#13c2c2",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        DNA
                                    </div>
                                    <div>
                                        <Title level={4} style={{ margin: 0, color: "#13c2c2" }}>
                                            XÉT NGHIỆM ADN
                                        </Title>
                                        <Text style={{ fontSize: 12 }}>PHÂN TÍCH DI TRUYỀN</Text>
                                    </div>
                                </div>
                                <Title level={3} style={{ margin: "16px 0", color: "#13c2c2" }}>
                                    ĐƠN YÊU CẦU PHÂN TÍCH ADN
                                </Title>
                                <Text>Kính gửi: Viện Công Nghệ ADN và Phân Tích Di Truyền</Text>
                            </div>

                            {/* Thông tin khách hàng */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="customerName"
                                        label="Tôi tên là (viết hoa)"
                                        rules={[{ required: true, message: "Vui lòng nhập tên khách hàng!" }]}
                                    >
                                        <Input
                                            placeholder="TRẦN THỊ C"
                                            style={{ textTransform: "uppercase" }}
                                            onChange={(e) => {
                                                e.target.value = e.target.value.toUpperCase()
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="gender" label="Giới tính">
                                        <Radio.Group>
                                            <Radio value="Nam">Nam</Radio>
                                            <Radio value="Nữ">Nữ</Radio>
                                            <Radio value="Không xác định">Không xác định</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
                                <Input placeholder="99 Cộng Hòa, phường 4, quận Tân Bình, Tp. Hồ Chí Minh" />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="idNumber"
                                        label="CMND/CCCD/Passport"
                                        rules={[{ required: true, message: "Vui lòng nhập số giấy tờ!" }]}
                                    >
                                        <Input placeholder="012345678" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="idIssueDate"
                                        label="Ngày cấp"
                                        rules={[{ required: true, message: "Vui lòng chọn ngày cấp!" }]}
                                    >
                                        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="idIssuePlace"
                                        label="Nơi cấp"
                                        rules={[{ required: true, message: "Vui lòng nhập nơi cấp!" }]}
                                    >
                                        <Input placeholder="HCM" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="phone"
                                        label="Số điện thoại"
                                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                                    >
                                        <Input placeholder="0877.000.008" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email/Zalo"
                                        rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                                    >
                                        <Input placeholder="tranthic24@gmail.com" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="orderId"
                                label="Mã đơn hàng (nếu có)"
                                rules={[{ required: true, message: "Vui lòng chọn đơn hàng!" }]}
                            >
                                <Select placeholder="Chọn đơn hàng xét nghiệm dân sự">
                                    {getCivilOrders().map((order) => (
                                        <Option key={order.id} value={order.id.toString()}>
                                            #{order.id} - {order.name} - {order.type}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Divider>
                                <Text strong>
                                    Đề nghị Viện phân tích ADN và xác định mối quan hệ huyết thống cho những người cung cấp mẫu dưới đây:
                                </Text>
                            </Divider>

                            {/* Bảng người tham gia */}
                            <div style={{ marginBottom: 24 }}>
                                <table style={{ width: "100%", border: "1px solid #d9d9d9", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#fafafa" }}>
                                            <th
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    padding: 8,
                                                    textAlign: "center",
                                                    background: "#13c2c2",
                                                    color: "white",
                                                }}
                                            >
                                                STT
                                            </th>
                                            <th
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    padding: 8,
                                                    textAlign: "center",
                                                    background: "#13c2c2",
                                                    color: "white",
                                                }}
                                            >
                                                Họ và tên
                                                <br />
                                                (viết in hoa)
                                            </th>
                                            <th
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    padding: 8,
                                                    textAlign: "center",
                                                    background: "#13c2c2",
                                                    color: "white",
                                                }}
                                            >
                                                Năm sinh
                                            </th>
                                            <th
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    padding: 8,
                                                    textAlign: "center",
                                                    background: "#13c2c2",
                                                    color: "white",
                                                }}
                                            >
                                                Giới tính
                                            </th>
                                            <th
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    padding: 8,
                                                    textAlign: "center",
                                                    background: "#13c2c2",
                                                    color: "white",
                                                }}
                                            >
                                                Mối quan hệ
                                            </th>
                                            <th
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    padding: 8,
                                                    textAlign: "center",
                                                    background: "#13c2c2",
                                                    color: "white",
                                                }}
                                            >
                                                Loại mẫu
                                            </th>
                                            <th
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    padding: 8,
                                                    textAlign: "center",
                                                    background: "#13c2c2",
                                                    color: "white",
                                                }}
                                            >
                                                Ngày thu mẫu
                                            </th>
                                            <th
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    padding: 8,
                                                    textAlign: "center",
                                                    background: "#13c2c2",
                                                    color: "white",
                                                }}
                                            >
                                                Ghi chú
                                            </th>
                                            <th
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                    padding: 8,
                                                    textAlign: "center",
                                                    background: "#13c2c2",
                                                    color: "white",
                                                }}
                                            >
                                                Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participants.map((participant, index) => (
                                            <tr key={participant.id}>
                                                <td style={{ border: "1px solid #d9d9d9", padding: 4, textAlign: "center" }}>{index + 1}</td>
                                                <td style={{ border: "1px solid #d9d9d9", padding: 4 }}>
                                                    <Input
                                                        value={participant.name}
                                                        onChange={(e) => updateParticipant(participant.id, "name", e.target.value.toUpperCase())}
                                                        placeholder="NGUYỄN VĂN A"
                                                        style={{ border: "none", textTransform: "uppercase" }}
                                                    />
                                                </td>
                                                <td style={{ border: "1px solid #d9d9d9", padding: 4 }}>
                                                    <Input
                                                        value={participant.birthYear}
                                                        onChange={(e) => updateParticipant(participant.id, "birthYear", e.target.value)}
                                                        placeholder="1977"
                                                        style={{ border: "none" }}
                                                    />
                                                </td>
                                                <td style={{ border: "1px solid #d9d9d9", padding: 4 }}>
                                                    <Select
                                                        value={participant.gender}
                                                        onChange={(value) => updateParticipant(participant.id, "gender", value)}
                                                        style={{ width: "100%", border: "none" }}
                                                    >
                                                        <Option value="Nam">Nam</Option>
                                                        <Option value="Nữ">Nữ</Option>
                                                    </Select>
                                                </td>
                                                <td style={{ border: "1px solid #d9d9d9", padding: 4 }}>
                                                    <Input
                                                        value={participant.relationship}
                                                        onChange={(e) => updateParticipant(participant.id, "relationship", e.target.value)}
                                                        placeholder="Cha"
                                                        style={{ border: "none" }}
                                                    />
                                                </td>
                                                <td style={{ border: "1px solid #d9d9d9", padding: 4 }}>
                                                    <Select
                                                        value={participant.sampleType}
                                                        onChange={(value) => updateParticipant(participant.id, "sampleType", value)}
                                                        style={{ width: "100%", border: "none" }}
                                                    >
                                                        <Option value="Máu">Máu</Option>
                                                        <Option value="NMM">NMM</Option>
                                                        <Option value="Tóc">Tóc</Option>
                                                        <Option value="Móng">Móng</Option>
                                                    </Select>
                                                </td>
                                                <td style={{ border: "1px solid #d9d9d9", padding: 4 }}>
                                                    <DatePicker
                                                        value={participant.collectionDate}
                                                        onChange={(date) => updateParticipant(participant.id, "collectionDate", date)}
                                                        format="DD/MM/YYYY"
                                                        style={{ width: "100%", border: "none" }}
                                                    />
                                                </td>
                                                <td style={{ border: "1px solid #d9d9d9", padding: 4 }}>
                                                    <Input
                                                        value={participant.notes}
                                                        onChange={(e) => updateParticipant(participant.id, "notes", e.target.value)}
                                                        placeholder="tại nhà"
                                                        style={{ border: "none" }}
                                                    />
                                                </td>
                                                <td style={{ border: "1px solid #d9d9d9", padding: 4, textAlign: "center" }}>
                                                    {participants.length > 1 && (
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => removeParticipant(participant.id)}
                                                            size="small"
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <Button
                                    type="dashed"
                                    onClick={addParticipant}
                                    icon={<PlusOutlined />}
                                    style={{
                                        width: "100%",
                                        marginTop: 16,
                                        borderColor: "#13c2c2",
                                        color: "#13c2c2",
                                    }}
                                >
                                    Thêm người tham gia
                                </Button>
                            </div>

                            {/* Cam kết */}
                            <div style={{ marginBottom: 24 }}>
                                <Title level={5}>Tôi xin cam kết:</Title>
                                <div style={{ paddingLeft: 16 }}>
                                    <p>1. Tôi tự nguyện đề nghị xét nghiệm ADN và chấp nhận chi phí xét nghiệm.</p>
                                    <p>2. Những thông tin tôi đã khai trên đây là đúng sự thật và không thay đổi.</p>
                                    <p>3. Tôi không có người nhà, người quen đến phòng xét nghiệm, làm mất trật tự.</p>
                                    <p>
                                        4. Những trường hợp sinh học, người giúp tay, nhân viên, máy không thể báo trung thực sẽ bị phạt gấp
                                        2 lần lệ phí của nộp.
                                    </p>
                                    <p>
                                        5. Tôi đã đọc và chấp nhận các điều khoản của Viện tại trang 02 của đơn này và đồng ý Viện thực hiện
                                        các phân tích ADN các các mẫu trên. Nếu có phạm, tôi sẽ chịu hoàn toàn trách nhiệm trước pháp luật.
                                    </p>
                                </div>
                            </div>

                            {/* Thông tin liên hệ */}
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item name="contactAddress" label="Địa chỉ nhận thư">
                                        <Input placeholder="99 Cộng Hòa, phường 4, quận Tân Bình, Tp. Hồ Chí Minh" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="resultDelivery" label="Hình thức nhận kết quả">
                                        <Checkbox.Group>
                                            <Checkbox value="phone">Nhận tại văn phòng</Checkbox>
                                            <Checkbox value="mail">Thư điện tử</Checkbox>
                                            <Checkbox value="email">Email/zalo</Checkbox>
                                        </Checkbox.Group>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="timeRequirement" label="Yêu cầu biết kết quả trong thời gian là">
                                        <Checkbox.Group>
                                            <Checkbox value="1_tuan">1 tuần</Checkbox>
                                            <Checkbox value="3_ngay">3 ngày</Checkbox>
                                            <Checkbox value="24h">24h</Checkbox>
                                            <Checkbox value="6h">6h</Checkbox>
                                        </Checkbox.Group>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div style={{ textAlign: "center", marginTop: 32 }}>
                                <Space size="large">
                                    <Button
                                        onClick={() => form.resetFields()}
                                        style={{
                                            backgroundColor: "#13c2c2",
                                            borderColor: "#13c2c2",
                                            color: "white",
                                        }}
                                    >
                                        Làm mới
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                        size="large"
                                        style={{
                                            backgroundColor: "#13c2c2",
                                            borderColor: "#13c2c2",
                                        }}
                                    >
                                        Lưu đơn yêu cầu
                                    </Button>
                                </Space>
                            </div>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane tab="Danh sách đơn" key="list">
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={civilForms}
                            rowKey="id"
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn`,
                            }}
                        />
                    </Card>
                </TabPane>
            </Tabs>

            {/* Modal xem đơn */}
            <Modal
                title="Xem đơn yêu cầu phân tích ADN"
                open={previewModalVisible}
                onCancel={() => setPreviewModalVisible(false)}
                footer={[
                    <Button
                        key="close"
                        onClick={() => setPreviewModalVisible(false)}
                        style={{
                            backgroundColor: "#13c2c2",
                            borderColor: "#13c2c2",
                            color: "white",
                        }}
                    >
                        Đóng
                    </Button>,
                    <Button
                        key="print"
                        type="primary"
                        icon={<PrinterOutlined />}
                        style={{
                            backgroundColor: "#13c2c2",
                            borderColor: "#13c2c2",
                        }}
                    >
                        In đơn
                    </Button>,
                ]}
                width={900}
            >
                {selectedForm && (
                    <div style={{ background: "#fff", padding: 24 }}>
                        {/* Hiển thị form đã lưu */}
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                            <Title level={3}>ĐƠN YÊU CẦU PHÂN TÍCH ADN</Title>
                            <Text>Kính gửi: Viện Công Nghệ ADN và Phân Tích Di Truyền</Text>
                        </div>

                        <p>
                            <strong>Tôi tên là:</strong> {selectedForm.customerName}
                        </p>
                        <p>
                            <strong>Địa chỉ:</strong> {selectedForm.address}
                        </p>
                        <p>
                            <strong>CMND/CCCD:</strong> {selectedForm.idNumber}
                        </p>
                        <p>
                            <strong>Số điện thoại:</strong> {selectedForm.phone}
                        </p>

                        <Divider />

                        <table style={{ width: "100%", border: "1px solid #000", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ border: "1px solid #000", padding: 8 }}>STT</th>
                                    <th style={{ border: "1px solid #000", padding: 8 }}>Họ và tên</th>
                                    <th style={{ border: "1px solid #000", padding: 8 }}>Năm sinh</th>
                                    <th style={{ border: "1px solid #000", padding: 8 }}>Giới tính</th>
                                    <th style={{ border: "1px solid #000", padding: 8 }}>Mối quan hệ</th>
                                    <th style={{ border: "1px solid #000", padding: 8 }}>Loại mẫu</th>
                                    <th style={{ border: "1px solid #000", padding: 8 }}>Ngày thu mẫu</th>
                                    <th style={{ border: "1px solid #000", padding: 8 }}>Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedForm.participants.map((participant, index) => (
                                    <tr key={index}>
                                        <td style={{ border: "1px solid #000", padding: 8, textAlign: "center" }}>{index + 1}</td>
                                        <td style={{ border: "1px solid #000", padding: 8 }}>{participant.name}</td>
                                        <td style={{ border: "1px solid #000", padding: 8 }}>{participant.birthYear}</td>
                                        <td style={{ border: "1px solid #000", padding: 8 }}>{participant.gender}</td>
                                        <td style={{ border: "1px solid #000", padding: 8 }}>{participant.relationship}</td>
                                        <td style={{ border: "1px solid #000", padding: 8 }}>{participant.sampleType}</td>
                                        <td style={{ border: "1px solid #000", padding: 8 }}>
                                            {participant.collectionDate ? participant.collectionDate.format("DD/MM/YYYY") : ""}
                                        </td>
                                        <td style={{ border: "1px solid #000", padding: 8 }}>{participant.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between" }}>
                            <div style={{ textAlign: "center" }}>
                                <Text strong>NGƯỜI TIẾP NHẬN MẪU</Text>
                                <div style={{ marginTop: 60 }}>
                                    <Text>(Ký và ghi rõ họ tên)</Text>
                                </div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <Text strong>NGÓN TAY PHẢI</Text>
                                <div
                                    style={{
                                        width: 80,
                                        height: 80,
                                        border: "1px solid #000",
                                        borderRadius: "50%",
                                        margin: "16px auto",
                                    }}
                                ></div>
                                <Text>(Đóng vân tay hành chính)</Text>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <Text strong>NGƯỜI YÊU CẦU PHÂN TÍCH</Text>
                                <div style={{ marginTop: 60 }}>
                                    <Text>(Ký và ghi rõ họ tên)</Text>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default SampleCollectionDanSu
