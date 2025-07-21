"use client";

import { useState, useEffect } from "react";
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
  Statistic,
} from "antd";
import {
  HomeOutlined,
  GiftOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PrinterOutlined,
  CheckOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useOrderContext } from "../../context/OrderContext";

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

function mapOrderStatus(status) {
  const s = (status || "").toString().trim().toLowerCase();
  if (s === "chưa gửi kit" || s === "kit_not_sent") return "KIT_NOT_SENT";
  if (s === "đã gửi kit" || s === "kit_sent") return "KIT_SENT";
  if (s === "đã nhận mẫu" || s === "sample_received") return "SAMPLE_RECEIVED";
  if (s === "đang xử lý" || s === "processing") return "PROCESSING";
  if (s === "hoàn thành" || s === "completed") return "COMPLETED";
  if (
    [
      "kit_not_sent",
      "kit_sent",
      "sample_received",
      "processing",
      "completed",
    ].includes(s.toUpperCase())
  )
    return s.toUpperCase();
  return "KIT_NOT_SENT";
}

const HomeSampling = () => {
  const { updateOrder } = useOrderContext();
  const [samplingRequests, setSamplingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Lấy dữ liệu đơn hàng từ localStorage để luôn cập nhật mới nhất
  const loadSamplingRequests = () => {
    const allOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    const homeSamplingOrders = allOrders
      .filter(
        (order) =>
          order.sampleMethod === "home" &&
          !order.isHiddenByStaff &&
          order.staffAssigned
      )
      .map((order) => {
        // Ưu tiên lấy status mới nhất từ status, kitStatus, samplingStatus
        const mappedStatus = mapOrderStatus(
          order.status || order.kitStatus || order.samplingStatus
        );
        return {
          ...order,
          status: mappedStatus,
          kitStatus: mappedStatus,
          scheduledDate: order.scheduledDate || null,
          samplerName: order.samplerName || null,
          notes: order.notes || "",
        };
      })
      .filter((order) =>
        [
          "KIT_NOT_SENT",
          "KIT_SENT",
          "SAMPLE_RECEIVED",
          "PROCESSING",
          "COMPLETED",
        ].includes(order.status)
      );
    setSamplingRequests(homeSamplingOrders);
  };

  useEffect(() => {
    // Load orders khi component mount
    loadSamplingRequests();
  }, []);

  // Lắng nghe sự kiện storage để tự động cập nhật khi manager thay đổi trạng thái
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "dna_orders") {
        // Force re-render bằng cách reload data
        loadSamplingRequests();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleUpdateStatus = (request) => {
    setSelectedRequest(request);
    form.setFieldsValue({
      samplingStatus: request.status,
      scheduledDate: request.scheduledDate
        ? dayjs(request.scheduledDate.split(" ")[0], "DD/MM/YYYY")
        : null,
      scheduledTime: request.scheduledDate
        ? request.scheduledDate.split(" ")[1]
        : null,
      samplerName: request.samplerName || "",
      kitId: request.kitId || generateKitId(request),
      notes: request.notes || "",
    });
    setUpdateModalVisible(true);
  };

  const generateKitId = (request) => {
    const prefix = request.type.includes("huyết thống") ? "KIT-PC-" : "KIT-DT-";
    return `${prefix}${request.id}`;
  };

  // Hàm cập nhật trạng thái đơn hàng theo luồng chuẩn
  const handleSendKit = async (record, values) => {
    if (!record) {
      message.error("Không tìm thấy đơn để gửi kit!");
      return;
    }
    await updateOrder(String(record.id), {
      status: "Đã gửi kit",
      samplingStatus: "Đã gửi kit",
      kitStatus: "Đã gửi kit",
      kitId: values.kitId,
      notes: values.notes,
      updatedAt: new Date().toISOString(),
    });
    // Đợi 1 chút rồi reload lại dữ liệu từ localStorage để chắc chắn đã cập nhật
    setTimeout(() => {
      loadSamplingRequests();
      setUpdateModalVisible(false);
    }, 100);
    message.success(
      "Đã gửi kit thành công! Trạng thái chuyển sang 'Đã gửi kit'."
    );
  };

  // Sửa lại hàm handleProcessing: tự động insert dữ liệu mẫu từ members vào sampleInfo.donors nếu chưa có
  const handleProcessing = async (record) => {
    let sampleInfo = record.sampleInfo || {};
    if (
      (!sampleInfo.donors || sampleInfo.donors.length === 0) &&
      record.members &&
      Array.isArray(record.members) &&
      record.members.length > 0
    ) {
      sampleInfo.donors = record.members;
    }
    await updateOrder(String(record.id), {
      status: "Đang xử lý",
      samplingStatus: "Đang xử lý",
      kitStatus: "Đang xử lý",
      sampleInfo,
      updatedAt: new Date().toISOString(),
    });
    loadSamplingRequests();
    message.success("Đơn đã chuyển sang trạng thái 'Đang xử lý'.");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "KIT_NOT_SENT":
        return "#7c3aed"; // tím
      case "KIT_SENT":
        return "#0984e3"; // xanh dương
      case "SAMPLE_RECEIVED":
        return "#16a34a"; // xanh lá
      case "CANCELLED":
        return "#d63031"; // đỏ tươi
      case "PROCESSING":
        return "#fa8c16"; // cam
      case "COMPLETED":
        return "#52c41a"; // xanh lá (đồng bộ với Xét nghiệm & Kết quả)
      default:
        return "#b2bec3"; // xám nhạt
    }
  };

  // Hàm mapping trạng thái code sang tiếng Việt
  const getStatusText = (status) => {
    switch (status) {
      case "KIT_NOT_SENT":
        return "Chưa gửi kit";
      case "KIT_SENT":
        return "Đã gửi kit";
      case "SAMPLE_RECEIVED":
        return "Đã nhận mẫu";
      case "PROCESSING":
        return "Đang xử lý";
      case "COMPLETED":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  // Tính toán thống kê trạng thái
  const stats = {
    total: samplingRequests.length,
    kitNotSent: samplingRequests.filter((r) => r.status === "KIT_NOT_SENT")
      .length,
    kitSent: samplingRequests.filter((r) => r.status === "KIT_SENT").length,
    sampleReceived: samplingRequests.filter(
      (r) => r.status === "SAMPLE_RECEIVED"
    ).length,
    processing: samplingRequests.filter((r) => r.status === "PROCESSING")
      .length,
    completed: samplingRequests.filter((r) => r.status === "COMPLETED").length,
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 180,
      render: (id) => <span>#{id}</span>,
      align: "left",
    },
    {
      title: "Mã kit",
      dataIndex: "kitId",
      key: "kitId",
      width: 220,
      render: (kitId) => <span>{kitId || "-"}</span>,
      align: "left",
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
      width: 150,
      align: "left",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 250,
      render: (address) => (
        <span style={{ textAlign: "left", display: "block" }}>
          <EnvironmentOutlined style={{ marginRight: 4, color: "#00a67e" }} />
          {address}
        </span>
      ),
      ellipsis: true,
      align: "left",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      render: (phone) => (
        <span style={{ textAlign: "left", display: "block" }}>
          <PhoneOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          {phone}
        </span>
      ),
      align: "left",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (_, record) => (
        <div
          style={{ display: "flex", alignItems: "center", textAlign: "left" }}
        >
          <Tag
            style={{
              background: getStatusColor(record.status),
              color: "#fff",
              fontWeight: 600,
              borderRadius: 8,
              padding: "4px 16px",
              fontSize: 14,
              border: "none",
              letterSpacing: 0.5,
              textAlign: "left",
              minWidth: 110,
            }}
          >
            {getStatusText(record.status)}
          </Tag>
        </div>
      ),
      align: "left",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 280,
      render: (_, record) => (
        <Space size="small" style={{ textAlign: "left" }}>
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
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#1765ad")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#1890ff")}
          >
            Xem
          </Button>
          {/* Gửi Kit */}
          {record.status === "KIT_NOT_SENT" && (
            <Button
              size="small"
              icon={<GiftOutlined />}
              onClick={() => handleUpdateStatus(record)}
              style={{
                background: "#fa8c16",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 6,
                border: "none",
                boxShadow: "0 2px 8px #fa8c1655",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#d46b08")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#fa8c16")}
            >
              Gửi Kit
            </Button>
          )}
          {/* Xét nghiệm */}
          {record.status === "SAMPLE_RECEIVED" && (
            <Button
              type="primary"
              size="small"
              icon={<ExperimentOutlined />}
              onClick={() => handleProcessing(record)}
              style={{
                background: "#7c3aed",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 6,
                border: "none",
                boxShadow: "0 2px 8px #7c3aed55",
                transition: "background 0.2s",
                marginLeft: 8,
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#5b21b6")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#7c3aed")}
            >
              Xét Nghiệm
            </Button>
          )}
        </Space>
      ),
      align: "left",
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}
        >
          Thu mẫu tại nhà
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
          Quản lý các yêu cầu lấy mẫu tại nhà của khách hàng
        </p>
      </div>

      {/* Thống kê tổng quan các trạng thái */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng yêu cầu"
              value={stats.total}
              valueStyle={{ color: "#00a67e" }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Chưa gửi kit"
              value={stats.kitNotSent}
              valueStyle={{ color: "#7c3aed" }}
              prefix={<GiftOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã gửi kit"
              value={stats.kitSent}
              valueStyle={{ color: "#0984e3" }}
              prefix={<PrinterOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã nhận mẫu"
              value={stats.sampleReceived}
              valueStyle={{ color: "#16a34a" }}
              prefix={<CheckOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={stats.processing}
              valueStyle={{ color: "#fa8c16" }}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

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
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} yêu cầu`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          <TabPane tab="Chưa gửi kit" key="not_sent">
            <Table
              columns={columns}
              dataSource={samplingRequests.filter(
                (req) => req.status === "KIT_NOT_SENT"
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} yêu cầu`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          <TabPane tab="Đã gửi kit" key="sent">
            <Table
              columns={columns}
              dataSource={samplingRequests.filter(
                (req) => req.status === "KIT_SENT"
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} yêu cầu`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          <TabPane tab="Đã nhận mẫu" key="received">
            <Table
              columns={columns}
              dataSource={samplingRequests.filter(
                (req) => req.status === "SAMPLE_RECEIVED"
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} yêu cầu`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          <TabPane tab="Đang xử lý" key="processing">
            <Table
              columns={columns}
              dataSource={samplingRequests.filter(
                (req) => req.status === "PROCESSING"
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} yêu cầu`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
          {/* Thêm tab Hoàn thành */}
          <TabPane tab="Hoàn thành" key="completed">
            <Table
              columns={columns}
              dataSource={samplingRequests.filter(
                (req) => req.status === "COMPLETED"
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} yêu cầu`,
              }}
              scroll={{ x: 1200 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal xem chi tiết */}
      <Modal
        title={null}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedRequest && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#00a67e",
                  margin: 0,
                  letterSpacing: 1,
                }}
              >
                Chi tiết yêu cầu lấy mẫu #{selectedRequest.id}
              </h2>
            </div>
            <Divider style={{ margin: "16px 0" }} />
            <div style={{ marginBottom: 16 }}>
              <h3>Thông tin xét nghiệm:</h3>
              <p>
                <strong>Loại xét nghiệm:</strong> {selectedRequest.type}
              </p>
              <p>
                <strong>Mã kit:</strong>{" "}
                {selectedRequest.kitId || "Chưa cấp mã kit"}
              </p>
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
              {selectedRequest.category && (
                <p>
                  <strong>Thể loại:</strong>{" "}
                  {selectedRequest.category === "civil"
                    ? "Dân sự"
                    : selectedRequest.category === "admin"
                    ? "Hành chính"
                    : selectedRequest.category}
                </p>
              )}
              <p>
                <strong>Mã kit:</strong>{" "}
                {selectedRequest.kitId || "Chưa cấp mã kit"}
                <strong> -Trạng thái hiện tại:</strong>{" "}
                <Tag
                  color={getStatusColor(selectedRequest.status)}
                  style={{ fontWeight: 600, fontSize: 15 }}
                >
                  {getStatusText(selectedRequest.status)}
                </Tag>
              </p>
            </div>
            <Divider style={{ margin: "16px 0" }} />
            <div style={{ marginBottom: 24 }}>
              <h3>Tiến trình lấy mẫu:</h3>
              <Steps
                current={(() => {
                  switch (selectedRequest.status) {
                    case "KIT_NOT_SENT":
                    case "KIT_SENT":
                      return 0;
                    case "SAMPLE_RECEIVED":
                      return 1;
                    case "PROCESSING":
                      return 2;
                    case "COMPLETED":
                    case "Hoàn thành":
                      return 3;
                    default:
                      return 0;
                  }
                })()}
              >
                <Step
                  title="Chuẩn bị kit"
                  description="Chuẩn bị và gửi kit lấy mẫu"
                  status={(() => {
                    const s = selectedRequest.status;
                    if (
                      [
                        "PENDING_CONFIRM",
                        "KIT_NOT_SENT",
                        "KIT_SENT",
                        "SAMPLE_RECEIVED",
                        "PROCESSING",
                        "COMPLETED",
                        "Hoàn thành",
                      ].includes(s)
                    )
                      return "finish";
                    return "wait";
                  })()}
                />
                <Step
                  title="Đã gửi kit"
                  description="Kit đã được gửi đến khách hàng"
                  status={(() => {
                    const s = selectedRequest.status;
                    if (
                      [
                        "KIT_SENT",
                        "SAMPLE_RECEIVED",
                        "PROCESSING",
                        "COMPLETED",
                        "Hoàn thành",
                      ].includes(s)
                    )
                      return "finish";
                    if (["PENDING_CONFIRM", "KIT_NOT_SENT"].includes(s))
                      return "wait";
                    return "wait";
                  })()}
                />
                <Step
                  title="Nhận mẫu"
                  description="Đã nhận được mẫu từ khách hàng"
                  status={(() => {
                    const s = selectedRequest.status;
                    if (
                      [
                        "SAMPLE_RECEIVED",
                        "PROCESSING",
                        "COMPLETED",
                        "Hoàn thành",
                      ].includes(s)
                    )
                      return "finish";
                    if (["KIT_SENT"].includes(s)) return "process";
                    return "wait";
                  })()}
                />
                <Step
                  title="Xét nghiệm & Kết quả"
                  description="Xét nghiệm mẫu của khách hàng và cho kết quả"
                  status={(() => {
                    const s = selectedRequest.status;
                    if (["PROCESSING"].includes(s)) return "process";
                    if (["COMPLETED", "Hoàn thành"].includes(s))
                      return "finish";
                    return "wait";
                  })()}
                />
              </Steps>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal cập nhật trạng thái */}
      <Modal
        title={`Cập nhật trạng thái lấy mẫu #${selectedRequest?.id}`}
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => handleSendKit(selectedRequest, values)}
        >
          <Form.Item label="Trạng thái kit">
            <Select value={selectedRequest?.status} disabled>
              <Option value="PENDING_CONFIRM">Chờ xác nhận</Option>
              <Option value="KIT_NOT_SENT">Chưa gửi kit</Option>
              <Option value="KIT_SENT">Đã gửi kit</Option>
              <Option value="SAMPLE_RECEIVED">Đã nhận mẫu</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="kitId"
            label="Mã kit"
            rules={[{ required: true, message: "Vui lòng nhập mã kit!" }]}
          >
            <Input placeholder="Nhập mã kit" />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú về quá trình lấy mẫu..."
            />
          </Form.Item>
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => setUpdateModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: "#fa8c16", border: "none" }}
            >
              Gửi Kit
            </Button>
          </div>
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
          <div
            style={{
              background: "#fff",
              padding: 24,
              border: "1px solid #ddd",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={4}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Title>
              <Text>Độc lập - Tự do - Hạnh phúc</Text>
              <Divider style={{ margin: "12px 0" }} />
              <Title level={3}>BIÊN BẢN LẤY MẪU XÉT NGHIỆM</Title>
            </div>

            <Paragraph>
              Hôm nay, ngày {selectedRequest.sampleInfo.collectionDate}, tại{" "}
              {selectedRequest.sampleInfo.location}
            </Paragraph>
            <Paragraph>Chúng tôi gồm có:</Paragraph>
            <Paragraph>
              1. Nhân viên thu mẫu:{" "}
              <strong>{selectedRequest.sampleInfo.collector}</strong>
            </Paragraph>
            <Paragraph>
              2. Người yêu cầu xét nghiệm:{" "}
              <strong>{selectedRequest.name}</strong>, Địa chỉ hiện tại:{" "}
              {selectedRequest.address}
            </Paragraph>

            <Paragraph>
              Chúng tôi tiến hành lấy mẫu của những người để nghị xét nghiệm
              ADN. Các mẫu của từng người được lấy riêng rẽ như sau:
            </Paragraph>

            <div
              style={{
                border: "1px solid #000",
                padding: 16,
                marginBottom: 16,
              }}
            >
              {selectedRequest.sampleInfo.donors.map((donor, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom:
                      index < selectedRequest.sampleInfo.donors.length - 1
                        ? 24
                        : 0,
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
              ))}
            </div>

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
  );
};

export default HomeSampling;
