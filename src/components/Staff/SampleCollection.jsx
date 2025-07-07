"use client";

import { useState, useEffect, useContext } from "react";
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
  Upload,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  PrinterOutlined,
  CameraOutlined,
  SaveOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { AuthContext } from "../../context/AuthContext";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const SampleCollection = ({ caseType }) => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [sampleForms, setSampleForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
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
      sampleType: "Máu",
      sampleQuantity: "01",
      relationship: "",
      healthIssues: "không",
      fingerprint: null,
    },
  ]);
  const { user } = useContext(AuthContext);

  const title = caseType === 'Dân sự' ? 'Lấy mẫu xét nghiệm dân sự' : 'Lấy mẫu xét nghiệm hành chính';

  useEffect(() => {
    const savedForms = JSON.parse(
      localStorage.getItem("sample_collection_forms") || "[]"
    );
    setSampleForms(savedForms);
  }, []);

  useEffect(() => {
    // Chỉ tự động điền orderId và requesterName nếu có, KHÔNG tự động điền collectionDate
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");
    const requesterName = params.get("requesterName");
    if (orderId) {
      form.setFieldsValue({ orderId: orderId.toString() });
    }
    if (requesterName) {
      form.setFieldsValue({ requesterName });
    }
  }, [location.search, form]);

  useEffect(() => {
    // Tự động điền thông tin nếu có prefill trong localStorage, chỉ điền orderId và requesterName
    const prefill = localStorage.getItem("dna_sample_collection_prefill");
    if (prefill) {
      const data = JSON.parse(prefill);
      if (data.orderId) {
        form.setFieldsValue({ orderId: data.orderId.toString() });
      }
      if (data.requesterName) {
        form.setFieldsValue({ requesterName: data.requesterName });
      }
      localStorage.removeItem("dna_sample_collection_prefill");
    }
    // Tự động điền tên nhân viên thu mẫu
    if (user && user.name) {
      form.setFieldsValue({ collector: user.name });
    }
  }, [form, user]);

  // Auto-save form draft mỗi khi form thay đổi
  const handleAutoSave = (changedValues, allValues) => {
    localStorage.setItem(
      "sample_collection_draft",
      JSON.stringify({
        form: allValues,
        donors: donors,
      })
    );
  };
  // Auto-save khi donors thay đổi
  useEffect(() => {
    const values = form.getFieldsValue();
    localStorage.setItem(
      "sample_collection_draft",
      JSON.stringify({
        form: values,
        donors: donors,
      })
    );
  }, [donors]);

  // Khi mở tab, nếu có draft thì tự động điền lại
  useEffect(() => {
    const draft = localStorage.getItem("sample_collection_draft");
    if (draft) {
      try {
        const data = JSON.parse(draft);
        if (data.form) {
          form.setFieldsValue(data.form);
        }
        if (data.donors) {
          setDonors(data.donors);
        }
      } catch (error) {
        console.log("Error parsing sample collection draft:", error);
      }
    }
  }, [form]);

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
      sampleType: "Máu",
      sampleQuantity: "01",
      relationship: "",
      healthIssues: "không",
      fingerprint: null,
    };
    const newDonors = [...donors, newDonor];
    setDonors(newDonors);
    const values = form.getFieldsValue();
    localStorage.setItem(
      "sample_collection_draft",
      JSON.stringify({ form: values, donors: newDonors })
    );
  };

  const removeDonor = (id) => {
    if (donors.length > 1) {
      const newDonors = donors.filter((donor) => donor.id !== id);
      setDonors(newDonors);
      const values = form.getFieldsValue();
      localStorage.setItem(
        "sample_collection_draft",
        JSON.stringify({ form: values, donors: newDonors })
      );
    }
  };

  const updateDonor = (id, field, value) => {
    const newDonors = donors.map((donor) =>
      donor.id === id ? { ...donor, [field]: value } : donor
    );
    setDonors(newDonors);
    const values = form.getFieldsValue();
    localStorage.setItem(
      "sample_collection_draft",
      JSON.stringify({ form: values, donors: newDonors })
    );
  };

  const handleSave = async (values) => {
    try {
      const newForm = {
        id: Date.now(),
        ...values,
        collectionDate: values.collectionDate.format("DD/MM/YYYY"),
        donors: donors,
        createdAt: new Date().toLocaleString("vi-VN"),
        status: "Đã lấy mẫu",
      };

      const updatedForms = [...sampleForms, newForm];
      setSampleForms(updatedForms);
      localStorage.setItem(
        "sample_collection_forms",
        JSON.stringify(updatedForms)
      );

      // Cập nhật đơn hàng tương ứng nếu có
      const orders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
      const updatedOrders = orders.map((order) => {
        if (
          order.id.toString() === values.orderId &&
          order.type.includes("hành chính")
        ) {
          return {
            ...order,
            sampleCollected: true,
            sampleCollectionId: newForm.id,
            status: "Đang xử lý",
            sampleInfo: {
              location: values.location,
              collector: values.collector,
              collectionDate: values.collectionDate.format("DD/MM/YYYY"),
              donors: donors,
            },
          };
        }
        return order;
      });
      localStorage.setItem("dna_orders", JSON.stringify(updatedOrders));

      form.resetFields();
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
          sampleType: "Máu",
          sampleQuantity: "01",
          relationship: "",
          healthIssues: "không",
          fingerprint: null,
        },
      ]);
      localStorage.removeItem("sample_collection_draft");

      message.success("Lưu biên bản lấy mẫu thành công!");
    } catch {
      message.error("Có lỗi xảy ra khi lưu biên bản!");
    }
  };

  const handleViewForm = (formData) => {
    setSelectedForm(formData);
    setPreviewModalVisible(true);
  };

  const getAdministrativeOrders = () => {
    const orders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    return orders.filter(
      (order) => {
        const typeStr = (order.type || "").toLowerCase();
        return typeStr.includes("hành chính") && !order.sampleCollected;
      }
    );
  };

  const columns = [
    {
      title: "Mã biên bản",
      dataIndex: "id",
      key: "id",
      render: (id) => `BB-${id}`,
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
              backgroundColor: "#00a67e",
              borderColor: "#00a67e",
              fontWeight: "500",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#008f6b";
              e.target.style.borderColor = "#008f6b";
              e.target.style.fontWeight = "600";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#00a67e";
              e.target.style.borderColor = "#00a67e";
              e.target.style.fontWeight = "500";
            }}
          >
            Xem
          </Button>
          <Button
            size="small"
            icon={<PrinterOutlined />}
            onClick={() => handleViewForm(record)}
          >
            In
          </Button>
        </Space>
      ),
    },
  ];

  // Hàm kiểm tra ngày không hợp lệ (trước hôm nay hoặc là Chủ nhật)
  const disabledDate = (current) => {
    const today = dayjs().startOf("day");
    if (!current) return false;
    return current < today || current.day() === 0;
  };

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}
        >
          {title}
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
          Tạo biên bản lấy mẫu cho xét nghiệm ADN {caseType === 'Dân sự' ? 'dân sự' : 'hành chính'}
        </p>
      </div>

      <Tabs defaultActiveKey="create">
        <TabPane tab="Tạo biên bản mới" key="create">
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              onValuesChange={handleAutoSave}
            >
              <Title
                level={4}
                style={{ textAlign: "center", color: "#00a67e" }}
              >
                BIÊN BẢN LẤY MẪU XÉT NGHIỆM
              </Title>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="collectionDate"
                    label="Ngày lấy mẫu"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày lấy mẫu!",
                      },
                    ]}
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      style={{ width: "100%" }}
                      disabledDate={disabledDate}
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    name="location"
                    label="Địa điểm lấy mẫu"
                    rules={[
                      { required: true, message: "Vui lòng nhập địa điểm!" },
                    ]}
                  >
                    <Input placeholder="Ví dụ: 132 Hoàng Văn Thụ, phường Phương Sài, Nha Trang" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="collector"
                    label="Nhân viên thu mẫu"
                    rules={[
                      { required: true, message: "Vui lòng chọn nhân viên!" },
                    ]}
                  >
                    <Input
                      value={user?.name || ""}
                      disabled
                      style={{ fontWeight: 700, color: "#00a67e" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="orderId"
                    label="Mã đơn hàng (nếu có)"
                    rules={[
                      { required: true, message: "Vui lòng chọn đơn hàng!" },
                    ]}
                  >
                    <Select placeholder="Chọn đơn hàng xét nghiệm hành chính">
                      {getAdministrativeOrders().map((order) => (
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
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên người yêu cầu!",
                      },
                    ]}
                  >
                    <Input placeholder="Họ và tên người yêu cầu" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="requesterAddress"
                    label="Địa chỉ hiện tại"
                    rules={[
                      { required: true, message: "Vui lòng nhập địa chỉ!" },
                    ]}
                  >
                    <Input placeholder="Địa chỉ hiện tại của người yêu cầu" />
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
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeDonor(donor.id)}
                        style={{
                          color: "#ff4d4f",
                          fontWeight: "500",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.fontWeight = "600";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.fontWeight = "500";
                        }}
                      />
                    )
                  }
                  style={{ marginBottom: 16 }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Họ và tên" required>
                        <Input
                          value={donor.name}
                          onChange={(e) =>
                            updateDonor(donor.id, "name", e.target.value)
                          }
                          placeholder="Họ và tên đầy đủ"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="Loại giấy tờ" required>
                        <Select
                          value={donor.idType}
                          onChange={(value) =>
                            updateDonor(donor.id, "idType", value)
                          }
                        >
                          <Option value="CCCD">CCCD</Option>
                          <Option value="CMND">CMND</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="Số CCCD" required>
                        <Input
                          value={donor.idNumber}
                          onChange={(e) =>
                            updateDonor(donor.id, "idNumber", e.target.value)
                          }
                          placeholder="Số CCCD"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item label="Ngày cấp">
                        <DatePicker
                          value={donor.idIssueDate}
                          onChange={(date) =>
                            updateDonor(donor.id, "idIssueDate", date)
                          }
                          format="DD/MM/YYYY"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Nơi cấp">
                        <Input
                          value={donor.idIssuePlace}
                          onChange={(e) =>
                            updateDonor(
                              donor.id,
                              "idIssuePlace",
                              e.target.value
                            )
                          }
                          placeholder="Nơi cấp giấy tờ"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="Quốc tịch">
                        <Input
                          value={donor.nationality}
                          onChange={(e) =>
                            updateDonor(donor.id, "nationality", e.target.value)
                          }
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
                          onChange={(e) =>
                            updateDonor(donor.id, "address", e.target.value)
                          }
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
                          onChange={(value) =>
                            updateDonor(donor.id, "sampleType", value)
                          }
                        >
                          <Option value="Máu">Máu</Option>
                          <Option value="Niêm mạc miệng">Niêm mạc miệng</Option>
                          <Option value="Tóc">Tóc</Option>
                          <Option value="Móng tay">Móng tay</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label="Số lượng mẫu" required>
                        <Select
                          value={donor.sampleQuantity}
                          onChange={(value) =>
                            updateDonor(donor.id, "sampleQuantity", value)
                          }
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
                          onChange={(e) =>
                            updateDonor(
                              donor.id,
                              "relationship",
                              e.target.value
                            )
                          }
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
                          onChange={(e) =>
                            updateDonor(
                              donor.id,
                              "healthIssues",
                              e.target.value
                            )
                          }
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
                          onChange={(info) =>
                            updateDonor(donor.id, "fingerprint", info.file)
                          }
                        >
                          {donor.fingerprint ? (
                            <img
                              src={
                                URL.createObjectURL(donor.fingerprint) ||
                                "/placeholder.svg"
                              }
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
                  borderColor: "#00a67e",
                  color: "#00a67e",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#008f6b";
                  e.target.style.color = "#008f6b";
                  e.target.style.fontWeight = "600";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#00a67e";
                  e.target.style.color = "#00a67e";
                  e.target.style.fontWeight = "500";
                }}
              >
                Thêm người cho mẫu
              </Button>

              <Form.Item name="notes" label="Ghi chú bổ sung">
                <TextArea
                  rows={3}
                  placeholder="Ghi chú thêm về quá trình lấy mẫu..."
                />
              </Form.Item>

              <div style={{ textAlign: "center" }}>
                <Space size="large">
                  <Button
                    onClick={() => form.resetFields()}
                    style={{
                      backgroundColor: "#00a67e",
                      borderColor: "#00a67e",
                      color: "white",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#008f6b";
                      e.target.style.borderColor = "#008f6b";
                      e.target.style.fontWeight = "600";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#00a67e";
                      e.target.style.borderColor = "#00a67e";
                      e.target.style.fontWeight = "500";
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
                      backgroundColor: "#00a67e",
                      borderColor: "#00a67e",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#008f6b";
                      e.target.style.borderColor = "#008f6b";
                      e.target.style.fontWeight = "600";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#00a67e";
                      e.target.style.borderColor = "#00a67e";
                      e.target.style.fontWeight = "500";
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
              dataSource={sampleForms}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} biên bản`,
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Modal xem biên bản */}
      <Modal
        title="Xem biên bản lấy mẫu"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setPreviewModalVisible(false)}
            style={{
              backgroundColor: "#00a67e",
              borderColor: "#00a67e",
              color: "white",
              fontWeight: "500",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#008f6b";
              e.target.style.borderColor = "#008f6b";
              e.target.style.fontWeight = "600";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#00a67e";
              e.target.style.borderColor = "#00a67e";
              e.target.style.fontWeight = "500";
            }}
          >
            Đóng
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<PrinterOutlined />}
            style={{
              backgroundColor: "#00a67e",
              borderColor: "#00a67e",
              fontWeight: "500",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#008f6b";
              e.target.style.borderColor = "#008f6b";
              e.target.style.fontWeight = "600";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#00a67e";
              e.target.style.borderColor = "#00a67e";
              e.target.style.fontWeight = "500";
            }}
          >
            In biên bản
          </Button>,
        ]}
        width={800}
      >
        {selectedForm && (
          <div style={{ background: "#fff", padding: 24 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={4}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Title>
              <Text>Độc lập - Tự do - Hạnh phúc</Text>
              <Divider style={{ margin: "12px 0" }} />
              <Title level={3}>BIÊN BẢN LẤY MẪU XÉT NGHIỆM</Title>
            </div>

            <Paragraph>
              Hôm nay, ngày {selectedForm.collectionDate}, tại{" "}
              {selectedForm.location}
            </Paragraph>
            <Paragraph>Chúng tôi gồm có:</Paragraph>
            <Paragraph>
              1. Nhân viên thu mẫu: <strong>{selectedForm.collector}</strong>
            </Paragraph>
            <Paragraph>
              2. Người yêu cầu xét nghiệm:{" "}
              <strong>{selectedForm.requesterName}</strong>, Địa chỉ hiện tại:{" "}
              {selectedForm.requesterAddress}
            </Paragraph>

            <Paragraph>
              Chúng tôi tiến hành lấy mẫu của những người để nghị xét nghiệm
              ADN. Các mẫu của từng người được lấy riêng rẽ như sau:
            </Paragraph>

            {Array.isArray(selectedForm.donors) &&
              selectedForm.donors.length > 0 ? (
              selectedForm.donors.map((donor, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #000",
                    padding: 16,
                    marginBottom: 16,
                  }}
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
                      <Text>
                        Ngày cấp:{" "}
                        {donor.idIssueDate
                          ? donor.idIssueDate.format("DD/MM/YYYY")
                          : "Chưa có thông tin"}
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
                      <Text>
                        Tiểu sử bệnh về máu, truyền máu hoặc ghép tủy trong 6
                        tháng: {donor.healthIssues}
                      </Text>
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
              ))
            ) : (
              <Paragraph>Không có thông tin người cho mẫu.</Paragraph>
            )}

            <Paragraph style={{ fontStyle: "italic", fontSize: 12 }}>
              * Biên bản này và đơn yêu cầu xét nghiệm ADN là một phần không thể
              tách rời.
            </Paragraph>
            <Paragraph style={{ fontStyle: "italic", fontSize: 12 }}>
              * Mẫu xét nghiệm thu nhận được sẽ lưu trữ trong 30 ngày kể từ ngày
              trả kết quả. Sau thời gian đó người yêu cầu xét nghiệm cung cấp và
              chịu trách nhiệm.
            </Paragraph>

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
                  <Text>
                    {selectedForm.donors && selectedForm.donors[0]?.name}
                  </Text>
                </div>
              </Col>
              <Col span={8}>
                <Text strong>NGƯỜI YÊU CẦU XÉT NGHIỆM</Text>
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
  );
};

export default SampleCollection;
