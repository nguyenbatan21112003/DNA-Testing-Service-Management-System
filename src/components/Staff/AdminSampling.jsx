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
    Upload,
} from "antd"
import {
    PlusOutlined,
    DeleteOutlined,
    PrinterOutlined,
    CameraOutlined,
    SaveOutlined,
    EyeOutlined,
    AuditOutlined,
} from "@ant-design/icons"

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TextArea } = Input
const { TabPane } = Tabs

const AdminSampling = () => {
    const [form] = Form.useForm()
    const [adminForms, setAdminForms] = useState([])
    const [selectedForm, setSelectedForm] = useState(null)
    const [previewModalVisible, setPreviewModalVisible] = useState(false)
    const [donors, setDonors] = useState([
        {
            id: 1,
            name: "",
            idType: "CCCD",
            idNumber: "",
            idIssueDate: null,
            idIssuePlace: "",
            nationality: "Việt Nam",
            address: "",
            sampleType: "Nước bọt",
            sampleQuantity: "01",
            relationship: "",
            healthIssues: "không",
            fingerprint: null,
        },
    ])

    useEffect(() => {
        const savedForms = JSON.parse(localStorage.getItem("admin_sample_forms") || "[]")
        setAdminForms(savedForms)
    }, [])

    const addDonor = () => {
        const newDonor = {
            id: donors.length + 1,
            name: "",
            idType: "CCCD",
            idNumber: "",
            idIssueDate: null,
            idIssuePlace: "",
            nationality: "Việt Nam",
            address: "",
            sampleType: "Nước bọt",
            sampleQuantity: "01",
            relationship: "",
            healthIssues: "không",
            fingerprint: null,
        }
        setDonors([...donors, newDonor])
    }

    const removeDonor = (id) => {
        if (donors.length > 1) {
            setDonors(donors.filter((donor) => donor.id !== id))
        }
    }

    const updateDonor = (id, field, value) => {
        setDonors(donors.map((donor) => (donor.id === id ? { ...donor, [field]: value } : donor)))
    }

    const handleSave = async (values) => {
        try {
            const newForm = {
                id: Date.now(),
                formNumber: `HC-${Date.now()}`,
                ...values,
                collectionDate: values.collectionDate ? values.collectionDate.format("DD/MM/YYYY") : null,
                donors: donors,
                createdAt: new Date().toLocaleString("vi-VN"),
                status: "Đã lấy mẫu",
                type: "administrative",
            }

            const updatedForms = [...adminForms, newForm]
            setAdminForms(updatedForms)
            localStorage.setItem("admin_sample_forms", JSON.stringify(updatedForms))

            // Cập nhật đơn hàng tương ứng nếu có
            const orders = JSON.parse(localStorage.getItem("dna_orders") || "[]")
            const updatedOrders = orders.map((order) => {
                if (order.id.toString() === values.orderId && order.type.includes("hành chính")) {
                    return {
                        ...order,
                        sampleCollected: true,
                        sampleCollectionId: newForm.id,
                        status: "Đang xử lý",
                        sampleInfo: {
                            location: values.location,
                            collector: values.collector,
                            collectionDate: values.collectionDate ? values.collectionDate.format("DD/MM/YYYY") : null,
                            donors: donors,
                        },
                    }
                }
                return order
            })
            localStorage.setItem("dna_orders", JSON.stringify(updatedOrders))

            form.resetFields()
            setDonors([
                {
                    id: 1,
                    name: "",
                    idType: "CCCD",
                    idNumber: "",
                    idIssueDate: null,
                    idIssuePlace: "",
                    nationality: "Việt Nam",
                    address: "",
                    sampleType: "Nước bọt",
                    sampleQuantity: "01",
                    relationship: "",
                    healthIssues: "không",
                    fingerprint: null,
                },
            ])

            message.success("Lưu biên bản lấy mẫu hành chính thành công!")
        } catch (error) {
            message.error("Có lỗi xảy ra khi lưu biên bản!")
            console.error("Error saving form:", error)
        }
    }

    const handleViewForm = (formData) => {
        setSelectedForm(formData)
        setPreviewModalVisible(true)
    }

    const getAdminOrders = () => {
        const orders = JSON.parse(localStorage.getItem("dna_orders") || "[]")
        return orders.filter((order) => order.type.includes("hành chính") && !order.sampleCollected)
    }

    const columns = [
        {
            title: "Mã biên bản",
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
            title: "Người yêu cầu",
            dataIndex: "requesterName",
            key: "requesterName",
        },
        {
            title: "Nhân viên thu mẫu",
            dataIndex: "collector",
            key: "collector",
        },
        {
            title: "Ngày lấy mẫu",
            dataIndex: "collectionDate",
            key: "collectionDate",
        },
        {
            title: "Số người cho mẫu",
            dataIndex: "donors",
            key: "donors",
            render: (donors) => donors.length,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => <Tag color="purple">{status}</Tag>,
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
                            backgroundColor: "#722ed1",
                            borderColor: "#722ed1",
                        }}
                    >
                        Xem
                    </Button>
                    <Button
                        size="small"
                        icon={<PrinterOutlined />}
                        onClick={() => handleViewForm(record)}
                        style={{
                            backgroundColor: "#722ed1",
                            borderColor: "#722ed1",
                            color: "white",
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
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#722ed1", margin: 0 }}>
                    <AuditOutlined /> Lấy mẫu xét nghiệm hành chính
                </h1>
                <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
                    Tạo biên bản lấy mẫu cho các trường hợp tranh chấp, tòa án, cơ quan công quyền
                </p>
            </div>

            <Tabs defaultActiveKey="create">
                <TabPane tab="Tạo biên bản mới" key="create">
                    <Card>
                        <Form form={form} layout="vertical" onFinish={handleSave}>
                            <Title level={4} style={{ textAlign: "center", color: "#722ed1" }}>
                                BIÊN BẢN LẤY MẪU XÉT NGHIỆM HÀNH CHÍNH
                            </Title>

                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="collectionDate"
                                        label="Ngày lấy mẫu"
                                        rules={[{ required: true, message: "Vui lòng chọn ngày lấy mẫu!" }]}
                                    >
                                        <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                                <Col span={16}>
                                    <Form.Item
                                        name="location"
                                        label="Địa điểm lấy mẫu"
                                        rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
                                    >
                                        <Input placeholder="Ví dụ: Tòa án nhân dân TP.HCM - Phòng 201" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="collector"
                                        label="Nhân viên thu mẫu"
                                        rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
                                    >
                                        <Select placeholder="Chọn nhân viên thu mẫu">
                                            <Option value="Trần Trung Tâm">Trần Trung Tâm</Option>
                                            <Option value="Nguyễn Văn A">Nguyễn Văn A</Option>
                                            <Option value="Trần Thị B">Trần Thị B</Option>
                                            <Option value="Lê Văn C">Lê Văn C</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="orderId" label="Mã đơn hàng (nếu có)">
                                        <Select placeholder="Chọn đơn hàng xét nghiệm hành chính">
                                            {getAdminOrders().map((order) => (
                                                <Option key={order.id} value={order.id.toString()}>
                                                    #{order.id} - {order.name} - {order.type}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="requesterName"
                                        label="Người yêu cầu xét nghiệm"
                                        rules={[{ required: true, message: "Vui lòng nhập tên người yêu cầu!" }]}
                                    >
                                        <Input placeholder="Họ và tên người yêu cầu" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="requesterAddress"
                                        label="Địa chỉ hiện tại"
                                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                                    >
                                        <Input placeholder="Địa chỉ hiện tại của người yêu cầu" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="caseNumber"
                                        label="Số vụ án/Số quyết định"
                                        rules={[{ required: true, message: "Vui lòng nhập số vụ án!" }]}
                                    >
                                        <Input placeholder="Ví dụ: 123/2024/KDTM-ST" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="court"
                                        label="Tòa án/Cơ quan yêu cầu"
                                        rules={[{ required: true, message: "Vui lòng nhập tên tòa án!" }]}
                                    >
                                        <Input placeholder="Ví dụ: TAND TP.HCM" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider>Thông tin người cho mẫu</Divider>

                            {donors.map((donor, index) => (
                                <Card
                                    key={donor.id}
                                    size="small"
                                    title={`Người cho mẫu thứ ${index + 1}`}
                                    extra={
                                        donors.length > 1 && (
                                            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeDonor(donor.id)} />
                                        )
                                    }
                                    style={{ marginBottom: 16 }}
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="Họ và tên" required>
                                                <Input
                                                    value={donor.name}
                                                    onChange={(e) => updateDonor(donor.id, "name", e.target.value)}
                                                    placeholder="Họ và tên đầy đủ"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item label="Loại giấy tờ" required>
                                                <Select value={donor.idType} onChange={(value) => updateDonor(donor.id, "idType", value)}>
                                                    <Option value="CCCD">CCCD</Option>
                                                    <Option value="CMND">CMND</Option>
                                                    <Option value="PASSPORT">Passport</Option>
                                                    <Option value="Giấy Chứng Sinh">Giấy Chứng Sinh</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item label="Số giấy tờ" required>
                                                <Input
                                                    value={donor.idNumber}
                                                    onChange={(e) => updateDonor(donor.id, "idNumber", e.target.value)}
                                                    placeholder="Số giấy tờ"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item label="Ngày cấp">
                                                <DatePicker
                                                    value={donor.idIssueDate}
                                                    onChange={(date) => updateDonor(donor.id, "idIssueDate", date)}
                                                    format="DD/MM/YYYY"
                                                    style={{ width: "100%" }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item label="Nơi cấp">
                                                <Input
                                                    value={donor.idIssuePlace}
                                                    onChange={(e) => updateDonor(donor.id, "idIssuePlace", e.target.value)}
                                                    placeholder="Nơi cấp giấy tờ"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item label="Quốc tịch">
                                                <Input
                                                    value={donor.nationality}
                                                    onChange={(e) => updateDonor(donor.id, "nationality", e.target.value)}
                                                    placeholder="Quốc tịch"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item label="Địa chỉ">
                                                <Input
                                                    value={donor.address}
                                                    onChange={(e) => updateDonor(donor.id, "address", e.target.value)}
                                                    placeholder="Địa chỉ thường trú"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={6}>
                                            <Form.Item label="Loại mẫu" required>
                                                <Select
                                                    value={donor.sampleType}
                                                    onChange={(value) => updateDonor(donor.id, "sampleType", value)}
                                                >
                                                    <Option value="Nước bọt">Nước bọt</Option>
                                                    <Option value="Máu">Máu</Option>
                                                    <Option value="Tóc">Tóc</Option>
                                                    <Option value="Móng tay">Móng tay</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item label="Số lượng mẫu" required>
                                                <Select
                                                    value={donor.sampleQuantity}
                                                    onChange={(value) => updateDonor(donor.id, "sampleQuantity", value)}
                                                >
                                                    <Option value="01">01</Option>
                                                    <Option value="02">02</Option>
                                                    <Option value="03">03</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Mối quan hệ" required>
                                                <Input
                                                    value={donor.relationship}
                                                    onChange={(e) => updateDonor(donor.id, "relationship", e.target.value)}
                                                    placeholder="Ví dụ: Bố, Con, Mẹ..."
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={18}>
                                            <Form.Item label="Tiểu sử bệnh về máu, truyền máu hoặc ghép tủy trong 6 tháng">
                                                <Input
                                                    value={donor.healthIssues}
                                                    onChange={(e) => updateDonor(donor.id, "healthIssues", e.target.value)}
                                                    placeholder="Nhập 'không' nếu không có"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item label="Vân tay ngón trỏ phải">
                                                <Upload
                                                    listType="picture-card"
                                                    showUploadList={false}
                                                    beforeUpload={() => false}
                                                    onChange={(info) => updateDonor(donor.id, "fingerprint", info.file)}
                                                >
                                                    {donor.fingerprint ? (
                                                        <img
                                                            src={URL.createObjectURL(donor.fingerprint) || "/placeholder.svg"}
                                                            alt="fingerprint"
                                                            style={{ width: "100%" }}
                                                        />
                                                    ) : (
                                                        <div>
                                                            <CameraOutlined />
                                                            <div style={{ marginTop: 8 }}>Chụp vân tay</div>
                                                        </div>
                                                    )}
                                                </Upload>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}

                            <Button
                                type="dashed"
                                onClick={addDonor}
                                icon={<PlusOutlined />}
                                style={{
                                    width: "100%",
                                    marginBottom: 24,
                                    borderColor: "#722ed1",
                                    color: "#722ed1",
                                }}
                            >
                                Thêm người cho mẫu
                            </Button>

                            <Form.Item name="notes" label="Ghi chú bổ sung">
                                <TextArea rows={3} placeholder="Ghi chú thêm về quá trình lấy mẫu..." />
                            </Form.Item>

                            <div style={{ textAlign: "center" }}>
                                <Space size="large">
                                    <Button onClick={() => form.resetFields()}>Làm mới</Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                        size="large"
                                        style={{
                                            backgroundColor: "#722ed1",
                                            borderColor: "#722ed1",
                                        }}
                                    >
                                        Lưu biên bản
                                    </Button>
                                </Space>
                            </div>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane tab="Danh sách biên bản" key="list">
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={adminForms}
                            rowKey="id"
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} biên bản`,
                            }}
                        />
                    </Card>
                </TabPane>
            </Tabs>

            {/* Modal xem biên bản */}
            <Modal
                title="Xem biên bản lấy mẫu hành chính"
                open={previewModalVisible}
                onCancel={() => setPreviewModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setPreviewModalVisible(false)}>
                        Đóng
                    </Button>,
                    <Button key="print" type="primary" icon={<PrinterOutlined />}>
                        In biên bản
                    </Button>,
                ]}
                width={800}
            >
                {selectedForm && (
                    <div style={{ background: "#fff", padding: 24 }}>
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                            <Title level={4}>BIÊN BẢN LẤY MẪU XÉT NGHIỆM HÀNH CHÍNH</Title>
                        </div>

                        <Paragraph>
                            Hôm nay, ngày {selectedForm.collectionDate}, tại {selectedForm.location}
                        </Paragraph>
                        <Paragraph>Chúng tôi gồm có:</Paragraph>
                        <Paragraph>
                            1. Nhân viên thu mẫu: <strong>{selectedForm.collector}</strong>
                        </Paragraph>
                        <Paragraph>
                            2. Người yêu cầu xét nghiệm: <strong>{selectedForm.requesterName}</strong>, Địa chỉ hiện tại:{" "}
                            {selectedForm.requesterAddress}
                        </Paragraph>
                        <Paragraph>
                            3. Số vụ án: <strong>{selectedForm.caseNumber}</strong> - Tòa án: <strong>{selectedForm.court}</strong>
                        </Paragraph>

                        <Paragraph>
                            Chúng tôi tiến hành lấy mẫu của những người để nghị xét nghiệm ADN theo yêu cầu của cơ quan có thẩm quyền.
                            Các mẫu của từng người được lấy riêng rẽ như sau:
                        </Paragraph>

                        {selectedForm.donors.map((donor, index) => (
                            <div key={index} style={{ border: "1px solid #000", padding: 16, marginBottom: 16 }}>
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
                                        <Text>Số giấy tờ: {donor.idNumber}</Text>
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginTop: 8 }}>
                                    <Col span={8}>
                                        <Text>
                                            Ngày cấp: {donor.idIssueDate ? donor.idIssueDate.format("DD/MM/YYYY") : "Chưa có thông tin"}
                                        </Text>
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
                            </div>
                        ))}

                        <Row gutter={24} style={{ marginTop: 24, textAlign: "center" }}>
                            <Col span={8}>
                                <Text strong>NGƯỜI THU MẪU</Text>
                                <div style={{ marginTop: 8 }}>
                                    <Text>(Ký, ghi rõ họ tên)</Text>
                                </div>
                                <div style={{ marginTop: 60 }}>
                                    <Text>{selectedForm.collector}</Text>
                                </div>
                            </Col>
                            <Col span={8}>
                                <Text strong>NGƯỜI ĐƯỢC LẤY MẪU</Text>
                                <div style={{ marginTop: 8 }}>
                                    <Text>(Ký và ghi rõ họ tên)</Text>
                                </div>
                                <div style={{ marginTop: 60 }}>
                                    <Text>{selectedForm.donors[0]?.name}</Text>
                                </div>
                            </Col>
                            <Col span={8}>
                                <Text strong>ĐẠI DIỆN CƠ QUAN YÊU CẦU</Text>
                                <div style={{ marginTop: 8 }}>
                                    <Text>(Ký và ghi rõ họ tên)</Text>
                                </div>
                                <div style={{ marginTop: 60 }}>
                                    <Text>{selectedForm.requesterName}</Text>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default AdminSampling
