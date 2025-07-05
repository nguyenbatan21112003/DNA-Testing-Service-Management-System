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
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useOrderContext } from "../../context/OrderContext";

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const HomeSampling = () => {
  const { getAllOrders, updateOrder } = useOrderContext();
  const [samplingRequests, setSamplingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Lấy dữ liệu đơn hàng từ context
  const loadSamplingRequests = () => {
    const allOrders = getAllOrders();
    const homeSamplingOrders = allOrders
      .filter((order) => order.sampleMethod === "home" && !order.isHidden)
      .map((order) => {
        let mappedStatus = order.status || order.kitStatus;
        let mappedKitStatus = order.kitStatus || order.status;
        switch (mappedStatus) {
          case "chua_gui":
            mappedStatus = "PENDING_CONFIRM";
            mappedKitStatus = "PENDING_CONFIRM";
            break;
          case "da_gui":
            mappedStatus = "KIT_SENT";
            mappedKitStatus = "KIT_SENT";
            break;
          case "da_nhan":
            mappedStatus = "SAMPLE_RECEIVED";
            mappedKitStatus = "SAMPLE_RECEIVED";
            break;
          case "huy":
            mappedStatus = "CANCELLED";
            mappedKitStatus = "CANCELLED";
            break;
          // Nếu là các status hợp lệ thì giữ nguyên
          case "PENDING_CONFIRM":
          case "KIT_NOT_SENT":
          case "KIT_SENT":
          case "SAMPLE_RECEIVED":
            break;
          // Nếu là các status khác thì map về PENDING_CONFIRM
          default:
            mappedStatus = "PENDING_CONFIRM";
            mappedKitStatus = "PENDING_CONFIRM";
            break;
        }
        return {
          ...order,
          status: mappedStatus,
          kitStatus: mappedKitStatus,
          scheduledDate: order.scheduledDate || null,
          samplerName: order.samplerName || null,
          notes: order.notes || "",
        };
      });

    setSamplingRequests(homeSamplingOrders);
  };

  useEffect(() => {
    // Load orders khi component mount
    loadSamplingRequests();
    // Thêm event listener để cập nhật orders khi localStorage thay đổi
    window.addEventListener("storage", (event) => {
      if (event.key === "dna_orders") {
        loadSamplingRequests();
      }
    });

    // Cleanup function
    return () => {
      window.removeEventListener("storage", () => { });
    };
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

  const handleViewReport = (request) => {
    setSelectedRequest(request);
    setReportModalVisible(true);
  };

  const generateKitId = (request) => {
    const prefix = request.type.includes("huyết thống") ? "KIT-PC-" : "KIT-DT-";
    return `${prefix}${request.id}`;
  };

  const handleSaveUpdate = async (values) => {
    try {
      await updateOrder(String(selectedRequest.id), {
        status: "KIT_SENT",
        kitStatus: "KIT_SENT",
        kitId: values.kitId,
        notes: values.notes,
        updatedAt: new Date().toLocaleString("vi-VN"),
      });
      loadSamplingRequests();
      setUpdateModalVisible(false);
      message.success("Đã gửi kit thành công! Trạng thái chuyển sang 'Đã gửi kit'.");
    } catch {
      message.error("Có lỗi xảy ra khi gửi kit!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING_CONFIRM":
        return "#00b894"; // xanh ngọc bích
      case "KIT_NOT_SENT":
        return "#7c3aed"; // tím
      case "KIT_SENT":
        return "#0984e3"; // xanh dương
      case "SAMPLE_RECEIVED":
        return "#16a34a"; // xanh lá
      case "CANCELLED":
        return "#d63031"; // đỏ tươi
      default:
        return "#b2bec3"; // xám nhạt
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING_CONFIRM":
        return "Chờ xác nhận";
      case "KIT_NOT_SENT":
        return "Chưa gửi kit";
      case "KIT_SENT":
        return "Đã gửi kit";
      case "SAMPLE_RECEIVED":
        return "Đã nhận mẫu";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStepStatus = (currentStatus, stepStatus) => {
    const statusOrder = ["chua_gui", "da_gui", "da_nhan"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (currentStatus === "huy") return "error";
    if (stepIndex < currentIndex) return "finish";
    if (stepIndex === currentIndex) return "process";
    return "wait";
  };

  // Hàm ánh xạ status sang step tiến trình
  const mapStatusToStep = (status) => {
    switch (status) {
      case "PENDING_CONFIRM":
      case "KIT_NOT_SENT":
        return "chua_gui";
      case "KIT_SENT":
        return "da_gui";
      case "SAMPLE_RECEIVED":
        return "da_nhan";
      default:
        return "chua_gui";
    }
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
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Tag
            style={{
              background: getStatusColor(record.status),
              color: '#fff',
              fontWeight: 600,
              borderRadius: 8,
              padding: '4px 16px',
              fontSize: 14,
              border: 'none',
              letterSpacing: 0.5,
              textAlign: 'center',
              minWidth: 110,
            }}
          >
            {getStatusText(record.status)}
          </Tag>
        </div>
      ),
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
      width: 280,
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
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#1765ad")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#1890ff")}
          >
            Xem
          </Button>
          {/* Nếu là Chờ xác nhận thì hiện nút Xác nhận màu xanh lá */}
          {record.status === "PENDING_CONFIRM" && (
            <Button
              size="small"
              icon={<CheckOutlined />}
              onClick={async () => {
                await updateOrder(String(record.id), {
                  status: "KIT_NOT_SENT",
                  updatedAt: new Date().toLocaleString("vi-VN"),
                });
                loadSamplingRequests();
                message.success("Đã xác nhận! Trạng thái chuyển sang 'Chưa gửi kit'.");
              }}
              style={{
                background: "#16a34a",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 6,
                border: "none",
                boxShadow: "0 2px 8px #16a34a55",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#15803d")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#16a34a")}
            >
              Xác nhận
            </Button>
          )}
          {/* Nút Gửi Kit chỉ hiện khi trạng thái là 'Chưa gửi kit' và không render thêm nút nào khác cho trạng thái này */}
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
              onMouseOver={(e) => (e.currentTarget.style.background = "#d46b08")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#fa8c16")}
            >
              Gửi Kit
            </Button>
          )}
          {/* Ẩn nút Cập nhật cho trạng thái KIT_NOT_SENT */}
          {record.status !== "KIT_SENT" && record.status !== "SAMPLE_RECEIVED" && record.status !== "PENDING_CONFIRM" && record.status !== "KIT_NOT_SENT" && (
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
                boxShadow: "0 2px 8px #fa8c1622",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#d46b08")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#fa8c16")}
            >
              Cập nhật
            </Button>
          )}
          {record.status === "SAMPLE_RECEIVED" && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<ExperimentOutlined />}
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
                onMouseOver={(e) => (e.currentTarget.style.background = "#5b21b6")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#7c3aed")}
                onClick={async () => {
                  await updateOrder(String(record.id), {
                    status: "PROCESSING",
                    updatedAt: new Date().toLocaleString("vi-VN"),
                  });
                  loadSamplingRequests();
                  message.success("Đơn đã chuyển sang trạng thái 'Đang xử lý'.");
                }}
              >
                Xét Nghiệm
              </Button>
            </>
          )}
        </Space>
      ),
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
          <TabPane tab="Chờ xác nhận" key="pending">
            <Table
              columns={columns}
              dataSource={samplingRequests.filter(
                (req) => req.status === "PENDING_CONFIRM"
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
                <strong>Mã kit:</strong>{" "}
                {selectedRequest.kitId || "Chưa cấp mã kit"}
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3>Tiến trình lấy mẫu:</h3>
              <Steps
                current={["chua_gui", "da_gui", "da_nhan"].indexOf(mapStatusToStep(selectedRequest.status))}
              >
                <Step
                  title="Chuẩn bị kit"
                  description="Chuẩn bị và gửi kit lấy mẫu"
                  status={getStepStatus(mapStatusToStep(selectedRequest.status), "chua_gui")}
                />
                <Step
                  title="Đã gửi kit"
                  description="Kit đã được gửi đến khách hàng"
                  status={getStepStatus(mapStatusToStep(selectedRequest.status), "da_gui")}
                />
                <Step
                  title="Nhận mẫu"
                  description="Đã nhận được mẫu từ khách hàng"
                  status={getStepStatus(mapStatusToStep(selectedRequest.status), "da_nhan")}
                />
              </Steps>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>Thông tin bổ sung:</h3>
              <p>
                <strong>Trạng thái hiện tại:</strong>{" "}
                <Tag color={getStatusColor(selectedRequest.status)}>
                  {getStatusText(selectedRequest.status)}
                </Tag>
              </p>
              {selectedRequest.scheduledDate && (
                <p>
                  <strong>Ngày hẹn:</strong> {selectedRequest.scheduledDate}
                </p>
              )}
              {selectedRequest.samplerName && (
                <p>
                  <strong>Nhân viên phụ trách:</strong>{" "}
                  {selectedRequest.samplerName}
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
                  <div
                    style={{
                      background: "#f6f6f6",
                      padding: 12,
                      borderRadius: 4,
                      marginTop: 8,
                    }}
                  >
                    {selectedRequest.notes}
                  </div>
                </div>
              )}
            </div>

            {selectedRequest.sampleInfo && (
              <div>
                <h3>Thông tin người lấy mẫu:</h3>
                <div
                  style={{
                    background: "#f6f6f6",
                    padding: 12,
                    borderRadius: 4,
                    marginTop: 8,
                  }}
                >
                  <p>
                    <strong>Địa điểm lấy mẫu:</strong>{" "}
                    {selectedRequest.sampleInfo.location}
                  </p>
                  <p>
                    <strong>Nhân viên thu mẫu:</strong>{" "}
                    {selectedRequest.sampleInfo.collector}
                  </p>
                  <p>
                    <strong>Ngày lấy mẫu:</strong>{" "}
                    {selectedRequest.sampleInfo.collectionDate}
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
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveUpdate}>
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
            <TextArea rows={3} placeholder="Nhập ghi chú về quá trình lấy mẫu..." />
          </Form.Item>
          <div style={{ textAlign: "right" }}>
            <Button onClick={() => setUpdateModalVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" style={{ background: "#fa8c16", border: "none" }}>
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

            {/* Thông tin user gửi từ form yêu cầu xét nghiệm
            <div style={{ marginBottom: 24, background: "#f6f6f6", padding: 16, borderRadius: 6 }}>
              <h3>Thông tin yêu cầu xét nghiệm từ khách hàng</h3>
              <p><strong>Họ tên người yêu cầu:</strong> {selectedRequest.name}</p>
              <p><strong>Số điện thoại:</strong> {selectedRequest.phone}</p>
              <p><strong>Email:</strong> {selectedRequest.email}</p>
              <p><strong>Địa chỉ:</strong> {selectedRequest.address}</p>
              <p><strong>Loại xét nghiệm:</strong> {selectedRequest.type}</p>
              {selectedRequest.date && (
                <p><strong>Ngày đăng ký:</strong> {selectedRequest.date}</p>
              )}
              {selectedRequest.idNumber && (
                <p><strong>Số CCCD:</strong> {selectedRequest.idNumber}</p>
              )}
               //Danh sách thành viên cung cấp mẫu 
              {selectedRequest.members && Array.isArray(selectedRequest.members) && selectedRequest.members.length > 0 ? (
                <div style={{ marginTop: 16 }}>
                  <strong>Danh sách thành viên cung cấp mẫu:</strong>
                  <ul>
                    {selectedRequest.members.map((mem, idx) => (
                      <li key={idx}>
                        {mem.name} {mem.birth ? `- Năm sinh: ${mem.birth}` : ""}
                        {mem.relation ? `- Mối quan hệ: ${mem.relation}` : ""}
                        {mem.sampleType ? `- Loại mẫu: ${mem.sampleType}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (selectedRequest.sampleInfo && selectedRequest.sampleInfo.donors && Array.isArray(selectedRequest.sampleInfo.donors) && selectedRequest.sampleInfo.donors.length > 0) ? (
                <div style={{ marginTop: 16 }}>
                  <strong>Danh sách thành viên cung cấp mẫu:</strong>
                  <ul>
                    {selectedRequest.sampleInfo.donors.map((donor, idx) => (
                      <li key={idx}>
                        {donor.name} {donor.dob ? `- Năm sinh: ${donor.dob}` : ""}
                        {donor.relationship ? `- Mối quan hệ: ${donor.relationship}` : ""}
                        {donor.sampleType ? `- Loại mẫu: ${donor.sampleType}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
                </div> */}

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
