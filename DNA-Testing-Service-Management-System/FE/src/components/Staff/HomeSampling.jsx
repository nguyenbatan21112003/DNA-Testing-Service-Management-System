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
  CarOutlined,
} from "@ant-design/icons";
// import dayjs from "dayjs";
// import dayjs from "dayjs";
// import { useOrderContext } from "../../context/OrderContext";


import staffApi from "../../api/staffApi";

const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const HomeSampling = () => {
  // const { getAllOrders, updateOrder } = useOrderContext();
  const [samplingRequests, setSamplingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [form] = Form.useForm();
  // const navigate = ()

  // Lấy dữ liệu đơn hàng từ context
  const fetchSamples = async (requestId) => {
    try {
      const res = await staffApi.getSamplesByRequestId(requestId) || {}
      // console.log(res);
      if (res.status !== 200) throw new Error("Lỗi khi lấy samples");
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Fetch samples error:", err);
      return [];
    }
  };

    // Tính toán thống kê trạng thái
  const stats = {
    total: samplingRequests.length,
    kitNotSent: samplingRequests.filter((r) => r.status === "KIT NOT SENT")
      .length,
    kitSent: samplingRequests.filter((r) => r.status === "KIT SENT").length,
    sampleReceived: samplingRequests.filter(
      (r) => r.status === "SAMPLE_RECEIVED"
    ).length,
    processing: samplingRequests.filter((r) => r.status.toUpperCase() !== "COMPLETED")
      .length,
    completed: samplingRequests.filter((r) => r.status.toUpperCase() === "COMPLETED").length,
  };

  const loadSamplingRequests = async () => {
    try {
      const res = await staffApi.getTestProccesses();
      // console.log(res);
      // console.log(res);
      if (res.status !== 200 ) throw new Error("Lỗi khi gọi API");
      if(!Array.isArray(res.data)) {
        setSamplingRequests([]) 
        return
      } 
      const rawData = res.data.filter(
        (item) => item.request?.collectType === "At Home"
      );

      const mapped = await Promise.all(
        rawData.map(async (item) => {
          const declarant = item.declarant || {};
          const samples = await fetchSamples(item.request.requestId);
          // console.log(samples);
          return {
            processId: item.testProcess?.processId,
            id: item.request.requestId,
            type: item.request?.serviceName,
            category: item.request?.category,
            status: item.testProcess?.currentStatus.toUpperCase() || item.status.toUpperCase(),
            createdAt: item.request?.createdAt,
            scheduledDate: item.request?.scheduleDate
              ? new Date(item.request.scheduleDate).toLocaleDateString("vi-VN")
              : null,
            name: declarant.fullName,
            phone: declarant.phone,
            address: declarant.address,
            email: declarant.email,
            kitStatus: item.testProcess?.currentStatus,
            samplerName: item.testProcess?.samplerName,
            kitId: item.testProcess?.kitCode,
            notes: item.testProcess?.notes,
            sampleInfo: {
              location: item.testProcess?.collectionLocation,
              collector: item.testProcess?.collector,
              collectionDate: item.testProcess?.collectionDate,
              donors: samples.map((s) => ({
                name: s.ownerName,
                gender: s.gender,
                relationship: s.relationship,
                yob: s.yob,
                sampleType: s.sampleType,
                idType: s.idType,
                idNumber: s.idNumber,
                idIssueDate: s.idIssueDate,
                idIssuePlace: s.idIssuePlace,
                nationality: s.nationality,
                address: s.address,
                sampleQuantity: s.sampleQuantity,
                healthIssues: s.healthIssues,
              })),
            },
          };
        })
      );

      setSamplingRequests(mapped);
    } catch (error) {
      console.log("Error loading home sampling requests:", error);
    }
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
      window.removeEventListener("storage", () => {});
    };
  }, []);
  // const generateKitCode = (order) => {
  //   const methodCode = order.sampleMethod === "home" ? "H" : "C";
  //   const now = new Date();
  //   const datePart = `${now.getFullYear().toString().slice(2)}${(
  //     now.getMonth() + 1
  //   )
  //     .toString()
  //     .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
  //   return `KIT-${methodCode}-${datePart}-${order.id
  //     .toString()
  //     .padStart(3, "0")}`;
  // };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const handleUpdateStatus = (request) => {
    setSelectedRequest(request);
    form.setFieldsValue({
      samplingStatus: request.status,

      samplerName: request.samplerName || "",
      kitId: generateKitId(request), // luôn luôn tự động sinh mã kit

      notes: request.notes || "",
    });
    setUpdateModalVisible(true);
  };

  // const handleViewReport = (request) => {
  //   setSelectedRequest(request);
  //   setReportModalVisible(true);
  // };

  const generateKitId = (request) => {
    const methodCode = "H"; // Tại nhà
    const now = new Date();
    const datePart = `${now.getFullYear().toString().slice(2)}${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
    return `KIT-${methodCode}-${datePart}-${request.id
      .toString()
      .padStart(3, "0")}`;
  };

  const handleSaveUpdate = async (values) => {
    try {
      const processId = selectedRequest.processId;
      const payload = {
        processId,
        kitCode: values.kitId,
      };

      if (values.samplingStatus === "KIT SENT") {
        await staffApi.sendKit(payload);
      } else if (values.samplingStatus === "SAMPLE_RECEIVED") {
        await staffApi.receiveSample({ processId });
      }

      loadSamplingRequests();
      setUpdateModalVisible(false);
      message.success("Cập nhật trạng thái thành công!");
      alert("✅Cập nhật trạng thái thành công!")
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      message.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "KIT SENT":
        return "Đã gửi kit";
      case "KIT NOT SENT":
        return "Chưa gửi kit";
      case "SAMPLE_RECEIVED":
        return "Đã nhận mẫu";
      case "TESTING":
        return "Đang xét nghiệm";
      case "COMPLETED":
        return "Đã trả kết quả";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "KIT NOT SENT":
        return "#7c3aed";
      case "KIT SENT":
        return "#0984e3";
      case "SAMPLE_RECEIVED":
        return "#16a34a";
      case "TESTING":
        return "magenta";
      case "COMPLETED":
        return "gold";
      default:
        return "gray";
    }
  };

  // Hàm kiểm tra ngày không hợp lệ (trước hôm nay hoặc là Chủ nhật)
  // const disabledDate = (current) => {
  //   // Không cho chọn ngày trước hôm nay
  //   const today = dayjs().startOf("day");
  //   if (!current) return false;
  //   // current.day() === 0 là Chủ nhật
  //   return current < today || current.day() === 0;
  // };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => `#DNA${id}`,
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>
          {getStatusText(record.status)}
        </Tag>
      ),
    },

    {
      title: "Thao tác",
      key: "action",
      width: 200,
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
          {record.status !== "SAMPLE_RECEIVED" && record.status !== "COMPLETED" && (
            <Button
              size="small"
              icon={<CarOutlined />}
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
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#d46b08")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#fa8c16")}
            >
              Cập nhật
            </Button>
          )}
          {/* {record.status === "SAMPLE_RECEIVED" && (
            <Button
              type="default"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleViewReport(record)}
            >
              Biên bản
            </Button>
          )} */}
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
          <TabPane tab="Chưa gửi kit" key="pending">
            <Table
              columns={columns}
              dataSource={samplingRequests.filter(
                (req) => req.status === "KIT NOT SENT"
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
                (req) => req.status === "KIT SENT"
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
        title={
          <div
            style={{
              textAlign: "center",
              fontSize: 28,
              fontWeight: 800,
              color: "#00a67e",
              margin: 0,
              letterSpacing: 1,
            }}
          >
            Chi tiết yêu cầu lấy mẫu #DNA{selectedRequest?.id}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          selectedRequest?.status !== "SAMPLE_RECEIVED" && (
            <Button
              key="update"
              type="primary"
              icon={<CarOutlined />}
              onClick={() => {
                setModalVisible(false);
                handleUpdateStatus(selectedRequest);
              }}
              style={{
                background: "#fa8c16",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 6,
                border: "none",
                boxShadow: "0 2px 8px #fa8c1622",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#d46b08")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#fa8c16")}
            >
              Cập nhật trạng thái
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedRequest && (
          
          <div style={{ marginBottom: 24 }}>
            <Divider style={{ margin: "16px 0" }} />
            <h3>Thông tin xét nghiệm:</h3>
            <p>
              <strong>Mã đơn yêu cầu:</strong> #{selectedRequest.id}
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
            <p>
              <strong>Loại thu mẫu:</strong> Tại nhà
            </p>
            <p>
              <strong>Phân loại:</strong>{" "}
              {selectedRequest.category || "Không xác định"}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {selectedRequest.createdAt
                ? new Date(selectedRequest.createdAt).toLocaleString("vi-VN")
                : "Không rõ"}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <Tag color={getStatusColor(selectedRequest.status)}>
                {getStatusText(selectedRequest.status)}
              </Tag>
            </p>
            <p>
              <strong>Mã kit:</strong>{" "}
              {selectedRequest.kitId || "Chưa cấp mã kit"}
            </p>
            <Divider style={{ margin: "16px 0" }} />
            <Steps
              current={
                selectedRequest?.status === "KIT NOT SENT"
                  ? 1
                  : selectedRequest?.status === "KIT SENT"
                  ? 2
                  : selectedRequest?.status === "SAMPLE_RECEIVED"
                  ? 3
                  : selectedRequest?.status === "TESTING"
                  ? 4
                  : selectedRequest?.status === "COMPLETED"
                  ? 4
                  : 0
              }
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Step
                title="Chuẩn bị kit"
                description="Chuẩn bị và gửi kit lấy mẫu"
              />
              <Step
                title="Đã gửi kit"
                description="Kit đã được gửi đến khách hàng"
              />
              <Step
                title="Nhận mẫu"
                description="Đã nhận được mẫu từ khách hàng"
              />
              <Step
                title="Xét nghiệm & Kết quả"
                description="Xét nghiệm mẫu và cho kết quả"
              />
            </Steps>
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
        okButtonProps={{
          style: {
            background: "#fa8c16",
            color: "#fff",
            fontWeight: 700,
            borderRadius: 6,
            border: "none",
            boxShadow: "0 2px 8px #fa8c1622",
            transition: "background 0.2s",
          },
          onMouseOver: (e) => (e.currentTarget.style.background = "#d46b08"),
          onMouseOut: (e) => (e.currentTarget.style.background = "#fa8c16"),
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveUpdate}>
          <Form.Item
            label="Trạng thái kit"
            name="samplingStatus"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              {selectedRequest?.status !== "KIT SENT" && (
                <Select.Option value="KIT NOT SENT">Chưa gửi kit</Select.Option>
              )}
              <Select.Option value="KIT SENT">Gửi kit</Select.Option>
              <Select.Option value="SAMPLE_RECEIVED">Đã nhận mẫu</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="kitId"
            label="Mã kit"
            rules={[{ required: true, message: "Mã kit không được để trống!" }]}
          >
            <Input
              readOnly
              style={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
            />
          </Form.Item>

          {/* <Form.Item name="scheduledDate" label="Ngày hẹn">
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Chọn ngày hẹn"
              style={{ width: "100%" }}
              disabledDate={disabledDate}
            />
          </Form.Item> */}

          <Form.Item name="notes" label="Ghi chú">
            <TextArea
              rows={4}
              placeholder="Nhập ghi chú về quá trình lấy mẫu..."
            />
          </Form.Item>
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
