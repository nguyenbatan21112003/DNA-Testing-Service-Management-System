"use client";

import { useState, useEffect, useContext } from "react";
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
  Calendar,
  Badge,
  Tabs,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  BankOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
// import { useOrderContext } from "../../context/OrderContext";
import { StaffDashboardContext } from "./StaffDashboard";
import { AuthContext } from "../../context/AuthContext";
import SampleCollection from "./SampleCollection";
import staffApi from "../../api/staffApi";
// import { useServiceContext } from "../../context/ServiceContext";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const CenterSampling = () => {
  // const { getAllOrders, updateOrder } = useOrderContext();
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  // const [form] = Form.useForm();
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    arrived: 0,
    missed: 0,
    canceled: 0,
  });
  const dashboardCtx = useContext(StaffDashboardContext);
  const { user } = useContext(AuthContext);
  // const services = useServiceContext();

  // Lấy dữ liệu đơn hàng từ context
  const fetchSamples = async (requestId) => {
    try {
      const res = await staffApi.getSamplesByRequestId(requestId);
      // console.log(res);
      if (res.status !== 200) throw new Error("Lỗi khi lấy samples");
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      console.error("Fetch samples error:", err);
      return [];
    }
  };
  const loadAppointments = async () => {
    try {
      const res = await staffApi.getTestProccesses();
      if (res.status !== 200) throw new Error("Lỗi khi gọi API");
      // console.log("res center", res);
      if (!Array.isArray(res.data)) {
        setAppointments([]);
        return;
      }
      const rawData = res.data.filter(
        (item) => item.request?.collectType == "At Center"
      );

      const mapped = await Promise.all(
        rawData.map(async (item) => {
          const declarant = item.declarant || {};
          const samples = await fetchSamples(item.request.requestId);
          const sampleIds = samples.map((s) => s.sampleId);
          const status =
            item.testProcess?.currentStatus?.toUpperCase() ||
            item.status?.toUpperCase() ||
            "";
          return {
            processId: item.testProcess?.processId,
            id: item.request.requestId,
            sampleIds,
            type: item.request?.serviceName,
            category: item.request?.category,
            status,
            createdAt: item.request?.createdAt,
            identityNumber: declarant.identityNumber || "",
            appointmentDate: item.request?.scheduleDate
              ? dayjs(item.request.scheduleDate)
              : null,
            name: declarant.fullName,
            phone: declarant.phone,
            address: declarant.address,
            email: declarant.email,
            kitStatus: item.testProcess?.currentStatus,
            samplerName: item.testProcess?.samplerName,
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

      // Cập nhật thống kê
      const today = dayjs().startOf("day");

      const stat = {
        total: mapped.length,
        scheduled: mapped.filter((m) => m.status === "WAITING_FOR_APPOINTMENT")
          .length,
        arrived: mapped.filter((m) => m.status === "SAMPLE_RECEIVED").length,
        missed: mapped.filter(
          (m) =>
            m.status === "WAITING_FOR_APPOINTMENT" &&
            m.appointmentDate &&
            dayjs(m.appointmentDate).isBefore(today, "day")
        ).length,
      };

      setStats(stat);

      setAppointments(mapped);
    } catch (error) {
      console.log("Error loading home sampling requests:", error);
    }
  };

  useEffect(() => {
    // Load orders khi component mount
    loadAppointments();
  }, []);

  // Lắng nghe sự kiện storage để tự động cập nhật khi manager thay đổi trạng thái
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "dna_orders") {
        // Force re-render bằng cách reload data
        loadAppointments();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  // Hàm lấy màu sắc trạng thái
  // Dùng chung cho cả lịch hẹn và thống kê
  const getStatusColor = (status) => {
    switch (status) {
      case "WAITING_FOR_APPOINTMENT":
        return "#40a9ff"; // xanh dương nhạt
      case "SAMPLE_RECEIVED":
        return "#52c41a"; // xanh lá
      case "":
        return "#fa8c16"; // cam
      case "COMPLETED":
        return "gold"; // xanh dương tươi

      default:
        return "#b2bec3"; // xám nhạt
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "WAITING_FOR_APPOINTMENT":
        return "Đã hẹn";
      case "COMPLETED":
        return "Đã trả kết quả";
      case "SAMPLE_RECEIVED":
        return "Đã lấy mẫu";
      case "Đang xử lý":
        return "Đang xử lý";
      default:
        return status;
    }
  };

  const getListData = (value) => {
    const dateStr = value.format("DD/MM/YYYY");
    return appointments.filter((apt) => apt.appointmentDate === dateStr);
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {listData.map((item) => (
          <li key={item.id}>
            <Badge
              status={getStatusColor(item.status)}
              text={`${item.timeSlot} - ${item.name}`}
              style={{ fontSize: 12 }}
            />
          </li>
        ))}
      </ul>
    );
  };

  // Hàm xác định phân loại
  const getCaseType = (category) => {
    if (!category) return "";
    if (category.includes("Voluntary")) return "Dân sự";
    if (category.includes("Administrative")) return "Hành chính";
    return "";
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => `#DNA${id}`,
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
      width: 150,
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
      title: "Loại xét nghiệm",
      dataIndex: "type",
      key: "type",
      width: 180,
    },
    {
      title: "Phân loại",
      dataIndex: "category", // <-- thay vì "type"
      key: "caseType",
      width: 100,
      render: (category) => {
        const caseType = getCaseType(category);
        if (!caseType) return null;
        return (
          <Tag
            color={caseType === "Dân sự" ? "#722ed1" : "#fa8c16"}
            style={{ fontWeight: 600, fontSize: 14 }}
          >
            {caseType}
          </Tag>
        );
      },
    },
    {
      title: "Ngày hẹn",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) =>
        date ? (
          <span>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {dayjs(date).format("DD/MM/YYYY")}
          </span>
        ) : (
          <span style={{ color: "#999" }}>Chưa hẹn</span>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => {
        const statusText = getStatusText(record.status);
        return (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewAppointment(record)}
              style={{
                background: "#1890ff",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 6,
                border: "none",
                boxShadow: "0 2px 8px #1890ff22",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#1765ad")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#1890ff")}
            >
              Xem
            </Button>
            {/* Chờ xác nhận: Xác nhận */}
            {statusText === "Chờ xác nhận" && (
              <Button
                size="small"
                icon={<CheckCircleOutlined />}
                style={{
                  background: "#52c41a",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 6,
                  border: "none",
                  boxShadow: "0 2px 8px #52c41a22",
                  transition: "background 0.2s",
                  marginLeft: 8,
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#389e0d")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#52c41a")
                }
                onClick={() => {
                  // updateOrder(record.id, {
                  //   status: "Đã hẹn",
                  //   updatedAt: new Date().toLocaleString("vi-VN"),
                  // });
                  loadAppointments();
                  message.success("Đã chuyển trạng thái sang Đã hẹn!");
                }}
              >
                Xác nhận
              </Button>
            )}
            {/* Đã hẹn: Đã đến */}
            {/* {statusText === "Đã hẹn" && (
              <Button
                size="small"
                icon={<CheckCircleOutlined />}
                style={{
                  background: "#52c41a",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 6,
                  border: "none",
                  boxShadow: "0 2px 8px #52c41a22",
                  transition: "background 0.2s",
                  marginLeft: 8,
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#389e0d")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#52c41a")
                }
                onClick={() => {
                  updateOrder(record.id, {
                    status: "Đã đến",
                    updatedAt: new Date().toLocaleString("vi-VN"),
                  });
                  loadAppointments();
                  message.success("Đã chuyển trạng thái sang Đã đến!");
                }}
              >
                Đã đến
              </Button>
            )} */}
            {/* Đã đến: Lấy mẫu */}
            {statusText === "Đã hẹn" && (
              <Button
                size="small"
                icon={<ExperimentOutlined />}
                style={{
                  background: "#fa8c16",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 6,
                  border: "none",
                  boxShadow: "0 2px 8px #fa8c1622",
                  transition: "background 0.2s",
                  marginLeft: 8,
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#d46b08")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#fa8c16")
                }
                onClick={() => handleGoToSampleCollection(record, true)}
              >
                Lấy mẫu
              </Button>
            )}
            {/* Đang lấy mẫu: Tiếp tục lấy mẫu */}
            {statusText === "Đang lấy mẫu" && (
              <Button
                size="small"
                icon={<ExperimentOutlined />}
                style={{
                  background: "#fa8c16",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 6,
                  border: "none",
                  boxShadow: "0 2px 8px #fa8c1622",
                  transition: "background 0.2s",
                  marginLeft: 8,
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "#d46b08")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "#fa8c16")
                }
                onClick={() => handleGoToSampleCollection(record, false)}
              >
                Tiếp tục lấy mẫu
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  const today = dayjs().format("DD/MM/YYYY");
  const todayAppointments = appointments.filter(
    (apt) =>
      dayjs(apt.appointmentDate, ["D/M/YYYY", "DD/MM/YYYY"]).format(
        "DD/MM/YYYY"
      ) === today
  );

  const handleGoToSampleCollection = async (record) => {
    const caseType = record.category;
    if (caseType === "Voluntary") {
      const dataCollec = {
        orderId: record.id,
        sampleIds: record.sampleIds || [],
        orderProcessId: record.processId,
        requesterName: record.name || "",
        appointmentDate: record.appointmentDate || "",
        fullName: record.name || "",
        email: record.email || "",
        phone: record.phone || "",
        address: record.address || "",
        cccd: record.identityNumber || record.cccd || "",
        serviceType: record.type || "",
      };
      // console.log(dataCollec);
      localStorage.setItem(
        "dna_sample_collection_prefill",

        JSON.stringify(dataCollec)
      );

      // Nếu là lần đầu bấm Lấy mẫu thì chuyển trạng thái sang Đang lấy mẫu
      // if (isFirst) {
      //   updateOrder(record.id, {
      //     status: "Đang lấy mẫu",
      //     updatedAt: new Date().toLocaleString("vi-VN"),
      //   });
      //   loadAppointments();
      // }
      // Chuyển tab sang lấy mẫu dân sự
      if (dashboardCtx?.setActiveTab) {
        dashboardCtx.setActiveTab("civil-sample-collection");
      }
    } else {
      // Hành chính: giữ logic cũ
      const dataCollec = {
        staffId: user.userId,
        sampleIds: record.sampleIds || [],
        staffName: user.fullName,
        orderId: record.id,
        orderProcessId: record.processId,
        collectionDate: record.appointmentDate || "",
        serviceType: record.type || "",
        cccd: record.identityNumber || record.cccd || "",
        address: record.address || "",
        fullName: record.name || "",
        email: record.email || "",
        phone: record.phone || "",
      };
      console.log(dataCollec);
      localStorage.setItem(
        "dna_sample_collection_prefill",
        JSON.stringify(dataCollec)
      );
      if (dashboardCtx?.setActiveTab) {
        dashboardCtx.setActiveTab("sample-collection");
      }
    }
  };

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}
        >
          Thu mẫu tại cơ sở
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
          Quản lý lịch hẹn lấy mẫu tại trung tâm
        </p>
      </div>

      {/* Thống kê */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Tổng lịch hẹn"
              value={stats.total}
              valueStyle={{ color: "#00a67e" }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Đã hẹn"
              value={stats.scheduled}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Đã lấy mẫu"
              value={stats.arrived}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Vắng mặt"
              value={stats.missed}
              valueStyle={{ color: "#fa8c16" }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        {/* <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={stats.canceled}
              valueStyle={{ color: "#f5222d" }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col> */}
        <Col xs={24} sm={8} md={4}>
          <Card>
            <Statistic
              title="Tỷ lệ đến"
              value={
                stats.scheduled > 0
                  ? Math.round(
                      (stats.arrived /
                        (stats.scheduled + stats.arrived + stats.missed)) *
                        100
                    )
                  : 0
              }
              suffix="%"
              valueStyle={{ color: "#13c2c2" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Thống kê hôm nay */}
      <Card style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ margin: 0, color: "#00a67e" }}>
              Lịch hẹn hôm nay ({dayjs().format("DD/MM/YYYY")})
            </h3>
            <p style={{ margin: "8px 0 0 0", color: "#666" }}>
              Tổng cộng: {todayAppointments.length} lịch hẹn
            </p>
          </div>
          {/* <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => setCalendarModalVisible(true)}
          >
            Xem lịch tháng
          </Button> */}
        </div>

        {todayAppointments.length > 0 ? (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 12,
              }}
            >
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    background: "#f9f9f9",
                    padding: 12,
                    borderRadius: 6,
                    border: "1px solid #e8e8e8",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <strong>
                      #{apt.id} - {apt.name}
                    </strong>
                    <Tag color={getStatusColor(apt.status)}>
                      {getStatusText(apt.status)}
                    </Tag>
                    {/* Hiển thị phân loại */}
                    {getCaseType(apt.type) && (
                      <Tag
                        color={
                          getCaseType(apt.type) === "Dân sự"
                            ? "#722ed1"
                            : "#fa8c16"
                        }
                        style={{ fontWeight: 600, fontSize: 14, marginLeft: 8 }}
                      >
                        {getCaseType(apt.type)}
                      </Tag>
                    )}
                  </div>
                  {apt.type && (
                    <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
                      {apt.type}
                    </p>
                  )}
                  <p
                    style={{ margin: "4px 0 0 0", fontSize: 12, color: "#666" }}
                  >
                    <PhoneOutlined style={{ marginRight: 4 }} />
                    {apt.phone}
                  </p>
                  <p
                    style={{ margin: "4px 0 0 0", fontSize: 12, color: "#666" }}
                  >
                    <UserOutlined style={{ marginRight: 4 }} />
                    {apt.staffAssigned ||
                    (apt.status === "Xác nhận" && user?.name)
                      ? `Nhân viên: ${apt.staffAssigned || user?.name}`
                      : "Chưa phân công"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{ textAlign: "center", padding: "20px 0", color: "#999" }}
          >
            <CalendarOutlined style={{ fontSize: 24, color: "#d9d9d9" }} />
            <p style={{ marginTop: 8 }}>Không có lịch hẹn nào hôm nay</p>
          </div>
        )}
      </Card>

      <Card>
        <Tabs defaultActiveKey="all">
          <TabPane tab="Tất cả lịch hẹn" key="all">
            <Table
              columns={columns}
              dataSource={appointments}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} lịch hẹn`,
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
          <TabPane tab="Đã hẹn" key="scheduled">
            <Table
              columns={columns}
              dataSource={appointments.filter(
                (apt) => apt.status === "WAITING_FOR_APPOINTMENT"
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} lịch hẹn`,
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
          <TabPane tab="Đã lấy mẫu" key="arrived">
            <Table
              columns={columns}
              dataSource={appointments.filter(
                (apt) => apt.status === "SAMPLE_RECEIVED"
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} lịch hẹn`,
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane>
          {/* <TabPane tab="Vắng mặt/Hủy" key="missed">
            <Table
              columns={columns}
              dataSource={appointments.filter(
                (apt) => apt.status === "CANCELLED"
              )}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} lịch hẹn`,
              }}
              scroll={{ x: 1000 }}
            />
          </TabPane> */}
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
        width={600}
      >
        {selectedAppointment && (
          <div style={{ padding: 8 }}>
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
                Chi tiết lịch hẹn #{selectedAppointment.id}
              </h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 8,
                }}
              >
                <Tag
                  color={getStatusColor(selectedAppointment.status)}
                  style={{ fontWeight: 700, fontSize: 16, padding: "4px 18px" }}
                >
                  {getStatusText(selectedAppointment.status)}
                </Tag>
                {(() => {
                  const caseType = getCaseType(selectedAppointment.type);
                  if (!caseType) return null;
                  return (
                    <Tag
                      color={caseType === "Dân sự" ? "#722ed1" : "#36cfc9"}
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        padding: "4px 18px",
                      }}
                    >
                      {caseType}
                    </Tag>
                  );
                })()}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Thông tin khách hàng */}
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 10,
                  padding: 18,
                  boxShadow: "0 2px 8px #e6e6e633",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 17,
                    marginBottom: 10,
                    color: "#009e74",
                  }}
                >
                  Thông tin khách hàng
                </div>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 17 }}>Họ tên:</span>{" "}
                  <span style={{ fontSize: 17 }}>
                    {selectedAppointment.name}
                  </span>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 17 }}>Email:</span>{" "}
                  <span style={{ fontSize: 17 }}>
                    {selectedAppointment.email}
                  </span>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 17 }}>
                    Số điện thoại:
                  </span>{" "}
                  <span style={{ fontSize: 17 }}>
                    {selectedAppointment.phone}
                  </span>
                </div>
              </div>
              {/* Thông tin lịch hẹn */}
              <div
                style={{
                  background: "#f6fafd",
                  borderRadius: 10,
                  padding: 18,
                  boxShadow: "0 2px 8px #e6e6e633",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 17,
                    marginBottom: 10,
                    color: "#009e74",
                  }}
                >
                  Thông tin lịch hẹn
                </div>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 17 }}>
                    Loại xét nghiệm:
                  </span>{" "}
                  <span style={{ fontSize: 17 }}>
                    {selectedAppointment.type}
                  </span>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 17 }}>
                    Ngày hẹn:
                  </span>{" "}
                  <span style={{ fontWeight: 600, fontSize: 17 }}>
                    {selectedAppointment.appointmentDate
                      ? dayjs(selectedAppointment.appointmentDate).format(
                          "DD/MM/YYYY"
                        )
                      : "Chưa hẹn"}
                  </span>
                </div>
              </div>
              {/* Ghi chú nếu có */}
              {selectedAppointment.notes && (
                <div
                  style={{
                    background: "#fffbe6",
                    border: "1.5px solid #ffe58f",
                    borderRadius: 10,
                    padding: 16,
                    color: "#ad6800",
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                >
                  Ghi chú: {selectedAppointment.notes}
                </div>
              )}
              {/* Bảng thông tin mẫu khi Đang xử lý */}
              {getStatusText(selectedAppointment.status) === "Đang xử lý" &&
                (() => {
                  let data =
                    Array.isArray(selectedAppointment.members) &&
                    selectedAppointment.members.length > 0
                      ? selectedAppointment.members
                      : Array.isArray(selectedAppointment.resultTableData) &&
                        selectedAppointment.resultTableData.length > 0
                      ? selectedAppointment.resultTableData
                      : [];
                  if (data.length === 0) return null;
                  return (
                    <div style={{ marginTop: 24 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 17,
                          marginBottom: 10,
                          color: "#009e74",
                        }}
                      >
                        Bảng thông tin mẫu của khách hàng
                      </div>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          background: "#f8fafc",
                          borderRadius: 8,
                          overflow: "hidden",
                          marginTop: 8,
                        }}
                      >
                        <thead>
                          <tr style={{ background: "#e6f7ff" }}>
                            <th
                              style={{
                                padding: 8,
                                fontWeight: 700,
                                color: "#009e74",
                              }}
                            >
                              STT
                            </th>
                            <th
                              style={{
                                padding: 8,
                                fontWeight: 700,
                                color: "#009e74",
                              }}
                            >
                              Họ và tên
                            </th>
                            <th
                              style={{
                                padding: 8,
                                fontWeight: 700,
                                color: "#009e74",
                              }}
                            >
                              Ngày sinh
                            </th>
                            <th
                              style={{
                                padding: 8,
                                fontWeight: 700,
                                color: "#009e74",
                              }}
                            >
                              Giới tính
                            </th>
                            <th
                              style={{
                                padding: 8,
                                fontWeight: 700,
                                color: "#009e74",
                              }}
                            >
                              Mối quan hệ
                            </th>
                            <th
                              style={{
                                padding: 8,
                                fontWeight: 700,
                                color: "#009e74",
                              }}
                            >
                              Loại mẫu
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((mem, idx) => (
                            <tr
                              key={idx}
                              style={{
                                background: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                              }}
                            >
                              <td style={{ textAlign: "center", padding: 6 }}>
                                {idx + 1}
                              </td>
                              <td style={{ padding: 6 }}>
                                {mem.name || mem.hoTen || mem.hovaten || ""}
                              </td>
                              <td style={{ padding: 6 }}>
                                {mem.birth ||
                                  mem.birthYear ||
                                  mem.namSinh ||
                                  mem.namsinh ||
                                  ""}
                              </td>
                              <td style={{ padding: 6 }}>
                                {mem.gender ||
                                  mem.gioiTinh ||
                                  mem.gioitinh ||
                                  ""}
                              </td>
                              <td style={{ padding: 6 }}>
                                {mem.relation ||
                                  mem.relationship ||
                                  mem.moiQuanHe ||
                                  mem.moiquanhe ||
                                  ""}
                              </td>
                              <td style={{ padding: 6 }}>
                                {mem.sampleType ||
                                  mem.loaiMau ||
                                  mem.loaimau ||
                                  ""}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal lịch tháng */}
      <Modal
        title="Lịch hẹn tháng"
        open={calendarModalVisible}
        onCancel={() => setCalendarModalVisible(false)}
        footer={null}
        width={800}
      >
        <Calendar dateCellRender={dateCellRender} />
      </Modal>
    </div>
  );
};

export default CenterSampling;
