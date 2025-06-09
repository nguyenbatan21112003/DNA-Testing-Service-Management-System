"use client"

import { useState, useEffect } from "react"
import {
    Card,
    Form,
    Input,
    Button,
    DatePicker,
    Row,
    Col,
    message,
    Typography,
    Space,
    Table,
    Radio,
    Checkbox,
    Modal,
} from "antd"
import { PlusOutlined, FileTextOutlined, PrinterOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons"
import dayjs from "dayjs"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const CivilSampling = () => {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [participants, setParticipants] = useState([
        {
            key: 1,
            name: "",
            birthYear: "",
            gender: "Nam",
            relationship: "",
            sampleType: "",
            collectionDate: "",
            note: "",
        },
    ])
    const [samplingReports, setSamplingReports] = useState([])
    const [viewModalVisible, setViewModalVisible] = useState(false)
    const [selectedReport, setSelectedReport] = useState(null)

    useEffect(() => {
        const savedReports = JSON.parse(localStorage.getItem("civil_sampling_reports") || "[]")
        setSamplingReports(savedReports)
    }, [])

    const addParticipant = () => {
        const newKey = participants.length > 0 ? Math.max(...participants.map((p) => p.key)) + 1 : 1
        setParticipants([
            ...participants,
            {
                key: newKey,
                name: "",
                birthYear: "",
                gender: "Nam",
                relationship: "",
                sampleType: "",
                collectionDate: "",
                note: "",
            },
        ])
    }

    const removeParticipant = (key) => {
        if (participants.length > 1) {
            setParticipants(participants.filter((p) => p.key !== key))
        }
    }

    const updateParticipant = (key, field, value) => {
        setParticipants(participants.map((p) => (p.key === key ? { ...p, [field]: value } : p)))
    }

    const handleSaveReport = async (values) => {
        if (participants.some((p) => !p.name || !p.birthYear || !p.relationship || !p.sampleType)) {
            message.error("Vui lòng điền đầy đủ thông tin người tham gia!")
            return
        }

        setLoading(true)

        try {
            const newReport = {
                id: Date.now(),
                ...values,
                participants: participants,
                createdAt: new Date().toLocaleString("vi-VN"),
                status: "Đã tạo đơn yêu cầu",
                type: "civil",
            }

            const updatedReports = [...samplingReports, newReport]
            setSamplingReports(updatedReports)
            localStorage.setItem("civil_sampling_reports", JSON.stringify(updatedReports))

            message.success("Đơn yêu cầu phân tích ADN dân sự đã được tạo thành công!")

            form.resetFields()
            setParticipants([
                {
                    key: 1,
                    name: "",
                    birthYear: "",
                    gender: "Nam",
                    relationship: "",
                    sampleType: "",
                    collectionDate: "",
                    note: "",
                },
            ])
        } catch (error) {
            message.error("Có lỗi xảy ra khi tạo đơn yêu cầu")
            console.error("Error saving report:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleViewReport = (report) => {
        setSelectedReport(report)
        setViewModalVisible(true)
    }

    const participantColumns = [
        {
            title: "STT",
            dataIndex: "key",
            key: "stt",
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: "Họ và tên (viết hoa)",
            dataIndex: "name",
            key: "name",
            render: (_, record) => (
                <Input
                    value={record.name}
                    onChange={(e) => updateParticipant(record.key, "name", e.target.value.toUpperCase())}
                    placeholder="NGUYỄN VĂN A"
                    style={{ color: "#ff1493", fontWeight: "bold" }}
                />
            ),
        },
        {
            title: "Năm sinh",
            dataIndex: "birthYear",
            key: "birthYear",
            width: 100,
            render: (_, record) => (
                <Input
                    value={record.birthYear}
                    onChange={(e) => updateParticipant(record.key, "birthYear", e.target.value)}
                    placeholder="1977"
                    style={{ color: "#ff1493" }}
                />
            ),
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            key: "gender",
            width: 100,
            render: (_, record) => (
                <Radio.Group
                    value={record.gender}
                    onChange={(e) => updateParticipant(record.key, "gender", e.target.value)}
                    style={{ color: "#ff1493" }}
                >
                    <Radio value="Nam">Nam</Radio>
                    <Radio value="Nữ">Nữ</Radio>
                </Radio.Group>
            ),
        },
        {
            title: "Mối quan hệ",
            dataIndex: "relationship",
            key: "relationship",
            width: 120,
            render: (_, record) => (
                <Input
                    value={record.relationship}
                    onChange={(e) => updateParticipant(record.key, "relationship", e.target.value)}
                    placeholder="Cha"
                    style={{ color: "#ff1493" }}
                />
            ),
        },
        {
            title: "Loại mẫu",
            dataIndex: "sampleType",
            key: "sampleType",
            width: 120,
            render: (_, record) => (
                <Input
                    value={record.sampleType}
                    onChange={(e) => updateParticipant(record.key, "sampleType", e.target.value)}
                    placeholder="Máu"
                    style={{ color: "#ff1493" }}
                />
            ),
        },
        {
            title: "Ngày thu mẫu",
            dataIndex: "collectionDate",
            key: "collectionDate",
            width: 120,
            render: (_, record) => (
                <DatePicker
                    value={record.collectionDate ? dayjs(record.collectionDate, "DD/MM/YYYY") : null}
                    onChange={(date) => updateParticipant(record.key, "collectionDate", date ? date.format("DD/MM/YYYY") : "")}
                    format="DD/MM/YYYY"
                    style={{ width: "100%", color: "#ff1493" }}
                />
            ),
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            render: (_, record) => (
                <Input
                    value={record.note}
                    onChange={(e) => updateParticipant(record.key, "note", e.target.value)}
                    placeholder="tại nhà"
                    style={{ color: "#ff1493" }}
                />
            ),
        },
        {
            title: "",
            key: "action",
            width: 60,
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeParticipant(record.key)}
                    disabled={participants.length === 1}
                />
            ),
        },
    ]

    const reportColumns = [
        {
            title: "Mã đơn",
            dataIndex: "id",
            key: "id",
            render: (id) => `DS-${id}`,
        },
        {
            title: "Khách hàng",
            dataIndex: "customerName",
            key: "customerName",
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
            render: (status) => <span style={{ color: "#52c41a" }}>{status}</span>,
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button type="primary" icon={<FileTextOutlined />} onClick={() => handleViewReport(record)}>
                        Xem
                    </Button>
                    <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
                        In
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
            <Card>
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img src="/DNA.jpg" alt="Logo" style={{ height: 50 }} />
                                <Text style={{ marginLeft: 8, fontSize: 12 }}>
                                    XÉT NGHIỆM
                                    <br />
                                    ADN
                                    <br />
                                    HUYẾT THỐNG
                                </Text>
                            </div>
                            <div style={{ textAlign: "right", fontSize: 12 }}>
                                <Text>Mã XN: .........................</Text>
                                <br />
                                <Text>TC: ...2 bản gốc + 1 TA</Text>
                            </div>
                        </div>

                        <Title level={3} style={{ color: "#0066cc", margin: 0 }}>
                            ĐƠN YÊU CẦU PHÂN TÍCH ADN
                        </Title>
                        <Text>Kính gửi: Viện Công Nghệ ADN và Phân Tích Di Truyền</Text>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSaveReport}
                        initialValues={{
                            gender: "Nữ",
                            contactMethod: ["mail", "email"],
                            urgency: "3_ngay",
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={18}>
                                <Form.Item
                                    label="Tôi tên là (viết hoa)"
                                    name="customerName"
                                    rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                                >
                                    <Input placeholder="TRẦN THỊ C" style={{ color: "#ff1493", fontWeight: "bold" }} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Giới tính" name="gender">
                                    <Radio.Group>
                                        <Radio value="Nam">Nam</Radio>
                                        <Radio value="Nữ">Nữ</Radio>
                                        <Radio value="Không xác định">Không xác định</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
                            <Input placeholder="99 Cộng Hòa, phường 4, quận Tân Bình, Tp. Hồ Chí Minh" style={{ color: "#ff1493" }} />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    label="CMND/CCCD/Passport"
                                    name="idNumber"
                                    rules={[{ required: true, message: "Vui lòng nhập số CMND/CCCD!" }]}
                                >
                                    <Input placeholder="012345678" style={{ color: "#ff1493" }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Ngày cấp"
                                    name="issueDate"
                                    rules={[{ required: true, message: "Vui lòng chọn ngày cấp!" }]}
                                >
                                    <DatePicker format="DD/MM/YYYY" style={{ width: "100%", color: "#ff1493" }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Nơi cấp"
                                    name="issuePlace"
                                    rules={[{ required: true, message: "Vui lòng nhập nơi cấp!" }]}
                                >
                                    <Input placeholder="HCM" style={{ color: "#ff1493" }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Số điện thoại"
                                    name="customerPhone"
                                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                                >
                                    <Input placeholder="0877.000.008" style={{ color: "#ff1493" }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Email/zalo"
                                    name="email"
                                    rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                                >
                                    <Input placeholder="tranthic24@gmail.com" style={{ color: "#ff1493" }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Paragraph style={{ marginBottom: 16 }}>
                            Đề nghị Viện phân tích ADN và xác định mối quan hệ huyết thống cho những người cung cấp mẫu dưới đây:
                        </Paragraph>

                        <div style={{ marginBottom: 16, border: "1px solid #1890ff", borderRadius: 2, overflow: "hidden" }}>
                            <Table
                                dataSource={participants}
                                columns={participantColumns}
                                pagination={false}
                                size="small"
                                rowKey="key"
                                bordered
                                style={{ marginBottom: 0 }}
                                rowClassName={() => "participant-row"}
                            />
                        </div>

                        <Button type="dashed" onClick={addParticipant} icon={<PlusOutlined />} style={{ marginBottom: 24 }}>
                            Thêm người tham gia
                        </Button>

                        <div style={{ marginBottom: 16 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <div style={{ backgroundColor: "#ffd700", padding: "8px 16px" }}>
                                        <Text>Có xanh tím: bắt buộc</Text>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div
                                        style={{
                                            backgroundColor: "#e0e0e0",
                                            padding: "8px 16px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text>Có hình sử bệnh về máu, cây ghép tủy khớp</Text>
                                        <div>
                                            <Radio.Group name="hasBloodDisease">
                                                <Radio value={true}>có</Radio>
                                                <Radio value={false} checked>
                                                    không
                                                </Radio>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ marginTop: 8 }}>
                                <Col span={12}>
                                    <div style={{ backgroundColor: "#ffd700", padding: "8px 16px" }}>
                                        <Text>Có cạo vảng: không bắt buộc</Text>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div
                                        style={{
                                            backgroundColor: "#e0e0e0",
                                            padding: "8px 16px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text>Có nhận mẫu trong 06 tháng gần đây không?</Text>
                                        <div>
                                            <Radio.Group name="hasRecentSample">
                                                <Radio value={true}>có</Radio>
                                                <Radio value={false} checked>
                                                    không
                                                </Radio>
                                            </Radio.Group>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <Title level={5} style={{ marginBottom: 8 }}>
                                Tôi xin cam kết:
                            </Title>
                            <ol style={{ paddingLeft: 20 }}>
                                <li>Tôi tự nguyện đề nghị xét nghiệm ADN và chấp nhận chi phí xét nghiệm.</li>
                                <li>Những thông tin tôi đã khai trên đây là đúng sự thật và không thay đổi.</li>
                                <li>Tôi không để người nhà, người quen đến phiền nhiễu, làm mất trật tự.</li>
                                <li>
                                    Những trường hợp sinh đôi, người ghép tủy, nhận nuôi, nếu không khai báo trung thực sẽ bị phạt gấp 2
                                    lần lệ phí đã nộp.
                                </li>
                                <li>
                                    Tôi đã đọc và chấp nhận các điều khoản của Viện tại trang 02 của đơn này và tôi đồng ý để Viện thực
                                    hiện các phân tích ADN các mẫu trên. Nếu vi phạm, tôi sẽ chịu hoàn toàn trách nhiệm trước pháp luật.
                                </li>
                            </ol>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <Form.Item label="Hình thức nhận kết quả" name="contactMethod">
                                <Checkbox.Group>
                                    <Checkbox value="office">Nhận tại văn phòng</Checkbox>
                                    <Checkbox value="mail">Thư đảm bảo</Checkbox>
                                    <Checkbox value="email">Email/zalo</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </div>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Địa chỉ nhận thư" name="mailAddress">
                                    <Input
                                        placeholder="99 Cộng Hòa, phường 4, quận Tân Bình, Tp. Hồ Chí Minh"
                                        style={{ color: "#ff1493" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Yêu cầu biết kết quả trong thời gian là" name="urgency">
                                    <Radio.Group>
                                        <Radio value="1_tuan">1 tuần</Radio>
                                        <Radio value="3_ngay">3 ngày</Radio>
                                        <Radio value="24h">24h</Radio>
                                        <Radio value="12h">12h</Radio>
                                        <Radio value="6h">6h</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    label="Địa điểm"
                                    name="location"
                                    rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
                                >
                                    <Input placeholder="HCM" style={{ color: "#ff1493" }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Ngày" name="requestDate" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}>
                                    <DatePicker format="DD/MM/YYYY" style={{ width: "100%", color: "#ff1493" }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Năm" name="requestYear" rules={[{ required: true, message: "Vui lòng nhập năm!" }]}>
                                    <Input placeholder="20.24" style={{ color: "#ff1493" }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, marginBottom: 24 }}>
                            <div style={{ textAlign: "center", width: "30%" }}>
                                <Title level={5} style={{ margin: 0 }}>
                                    NGƯỜI TIẾP NHẬN MẪU
                                </Title>
                                <Text style={{ fontSize: 12 }}>(Ký và ghi rõ họ tên)</Text>
                                <div style={{ height: 80 }}></div>
                                <Text>TRẦN TRUNG TÂM</Text>
                            </div>
                            <div style={{ textAlign: "center", width: "30%" }}>
                                <Title level={5} style={{ margin: 0 }}>
                                    NGÓN TRỎ PHẢI
                                </Title>
                                <Text style={{ fontSize: 12 }}>(Dấu vân tay hành chính)</Text>
                                <div
                                    style={{ height: 80, border: "1px solid #ddd", width: 80, margin: "0 auto", borderRadius: "50%" }}
                                ></div>
                            </div>
                            <div style={{ textAlign: "center", width: "30%" }}>
                                <Title level={5} style={{ margin: 0 }}>
                                    NGƯỜI YÊU CẦU PHÂN TÍCH
                                </Title>
                                <Text style={{ fontSize: 12 }}>(Ký và ghi rõ họ tên)</Text>
                                <div style={{ height: 80 }}></div>
                            </div>
                        </div>

                        <Form.Item style={{ textAlign: "center", marginTop: 32 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                icon={<SaveOutlined />}
                                style={{
                                    backgroundColor: "#0066cc",
                                    borderColor: "#0066cc",
                                    height: "48px",
                                    padding: "0 32px",
                                    fontSize: "16px",
                                }}
                            >
                                {loading ? "Đang lưu..." : "Tạo Đơn Yêu Cầu Dân Sự"}
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </Card>

            {samplingReports.length > 0 && (
                <Card style={{ marginTop: 24 }}>
                    <Title level={4}>Đơn yêu cầu dân sự đã tạo</Title>
                    <Table columns={reportColumns} dataSource={samplingReports} rowKey="id" />
                </Card>
            )}

            {/* Modal xem biên bản */}
            {selectedReport && (
                <Modal
                    title={`Đơn yêu cầu phân tích ADN DS-${selectedReport.id}`}
                    open={viewModalVisible}
                    onCancel={() => setViewModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setViewModalVisible(false)}>
                            Đóng
                        </Button>,
                        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
                            In đơn
                        </Button>,
                    ]}
                    width={1000}
                >
                    {/* Nội dung xem đơn */}
                </Modal>
            )}
        </div>
    )
}

export default CivilSampling
