"use client";

import { useState, useEffect, useContext, useCallback } from "react";
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
  MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useOrderContext } from "../../context/OrderContext";
import { StaffDashboardContext } from "./StaffDashboard";
import { AuthContext } from "../../context/AuthContext";
import SampleCollection from "./SampleCollection";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const statusKeys = [
  { key: "Đã hẹn", color: "#42a5f5" },
  { key: "Đã đến", color: "#1976d2" },
  { key: "Đang lấy mẫu", color: "#ff7043" },
  { key: "Đang xử lý", color: "#7e57c2" },
  { key: "Hoàn thành", color: "#52c41a" },
];

const getStatusText = (status) => {
  switch (status) {
    case "SCHEDULED": return "Đã hẹn";
    case "ARRIVED": return "Đã đến";
    case "SAMPLE_COLLECTING": return "Đang lấy mẫu";
    case "PROCESSING": return "Đang xử lý";
    case "COMPLETED": return "Hoàn thành";
    default: return status;
  }
};

const allowedStatuses = [
  "Đã hẹn",
  "Đã đến",
  "Đang lấy mẫu",
  "Đang xử lý",
  "Hoàn thành",
  // "Đã hủy" // nếu muốn cho phép
];

const CenterSampling = () => {
  const { getAllOrders, updateOrder, updateSamplingStatus } = useOrderContext();
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
    waitingConfirm: 0,
    sampling: 0,
    processing: 0,
    completed: 0,
  });
  const dashboardCtx = useContext(StaffDashboardContext);

  // Lấy dữ liệu đơn hàng từ context
  const loadAppointments = useCallback(() => {
    const allOrders = getAllOrders();
    const centerSamplingOrders = allOrders
      .filter((order) =>
        order.sampleMethod === "center" &&
        !order.isHidden &&
        allowedStatuses.includes(getStatusText(order.status))
      )
      .map((order) => {
        let status = order.status || order.samplingStatus;
        return {
          ...order,
          status: status,
          appointmentDate: order.appointmentDate || null,
          staffAssigned: order.staffAssigned || null,
          notes: order.notes || "",
          timeSlot: order.timeSlot || "09:00-10:00",
        };
      });

    setAppointments(centerSamplingOrders);

    // Tính toán thống kê
    const statusCounts = statusKeys.reduce((acc, s) => {
      acc[s.key] = centerSamplingOrders.filter(apt => getStatusText(apt.status) === s.key).length;
      return acc;
    }, {});

    setStats(statusCounts);
  }, [getAllOrders]);

  useEffect(() => {
    // Load orders khi component mount
    loadAppointments();
  }, [loadAppointments]);

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
  }, [loadAppointments]);

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  // Hàm lấy màu sắc trạng thái
  // Dùng chung cho cả lịch hẹn và thống kê
  const getStatusColor = (status) => {
    switch (status) {
      case "Đã hẹn":         return "#42a5f5"; // xanh dương sáng
      case "Đã đến":         return "#1976d2"; // xanh dương đậm
      case "Đang lấy mẫu":   return "#ff7043"; // cam đỏ
      case "Đang xử lý":     return "#7e57c2"; // tím nhạt
      case "Đã hủy":         return "#e53935"; // đỏ đậm
      case "Hoàn thành":     return "#52c41a"; // xanh lá đồng bộ với Kết quả
      default:                return "#bdbdbd"; // xám trung tính
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
  const getCaseType = (type) => {
    if (!type) return '';
    if (type.toLowerCase().includes('dân sự')) return 'Dân sự';
    if (type.toLowerCase().includes('hành chính')) return 'Hành chính';
    return '';
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
      dataIndex: "type",
      key: "caseType",
      width: 100,
      render: (type) => {
        const caseType = getCaseType(type);
        if (!caseType) return null;
        return (
          <Tag color={caseType === 'Dân sự' ? '#722ed1' : '#36cfc9'} style={{ fontWeight: 600, fontSize: 14 }}>
            {caseType}
          </Tag>
        );
      },
    },
    {
      title: "Ngày hẹn",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      width: 120,
      render: (date) =>
        date ? (
          <span>
            <CalendarOutlined style={{ marginRight: 4 }} />
            {date}
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
              onMouseOver={(e) => (e.currentTarget.style.background = "#1765ad")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#1890ff")}
            >
              Xem
            </Button>
            {/* Đã hẹn: Đã đến */}
            {statusText === "Đã hẹn" && (
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
                  marginLeft: 8
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#389e0d")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#52c41a")}
                onClick={() => {
                  updateSamplingStatus(record.id, "Đã đến");
                  loadAppointments();
                  message.success("Đã chuyển trạng thái sang Đã đến!");
                }}
              >
                Đã đến
              </Button>
            )}
            {/* Đã đến: Lấy mẫu */}
            {statusText === "Đã đến" && (
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
                  marginLeft: 8
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#d46b08")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#fa8c16")}
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
                  marginLeft: 8
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#d46b08")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#fa8c16")}
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
      ) === today && getStatusText(apt.status) !== "Chờ xác nhận"
  );

  const handleGoToSampleCollection = (record, isFirst) => {
    const caseType = getCaseType(record.type);
    if (caseType === 'Dân sự') {
      localStorage.setItem(
        "dna_sample_collection_prefill",
        JSON.stringify({
          orderId: record.id,
          collectionDate: record.appointmentDate || "",
          requesterName: record.name || "",
          appointmentDate: record.appointmentDate || "",
          fullName: record.name || "",
          email: record.email || "",
          phone: record.phone || "",
          address: record.address || "",
          cccd: record.idNumber || record.cccd || "",
          serviceType: record.type || "",
        })
      );
      // Nếu là lần đầu bấm Lấy mẫu thì chuyển trạng thái sang Đang lấy mẫu
      if (isFirst) {
        safeUpdateOrder(record.id, {
          status: "Đang lấy mẫu",
          updatedAt: new Date().toLocaleString("vi-VN"),
        }, record.status);
        loadAppointments();
      }
      // Chuyển tab sang lấy mẫu dân sự
      if (dashboardCtx?.setActiveTab) {
        dashboardCtx.setActiveTab("civil-sample-collection");
      }
    } else {
      // Hành chính: cũng cập nhật trạng thái sang Đang lấy mẫu
      localStorage.setItem(
        "dna_sample_collection_prefill",
        JSON.stringify({
          orderId: record.id,
          collectionDate: record.appointmentDate || "",
          requesterName: record.name || "",
          serviceType: record.type || "",
        })
      );
      if (isFirst) {
        safeUpdateOrder(record.id, {
          status: "Đang lấy mẫu",
          updatedAt: new Date().toLocaleString("vi-VN"),
        }, record.status);
        loadAppointments();
      }
      if (dashboardCtx?.setActiveTab) {
        dashboardCtx.setActiveTab("sample-collection");
      }
    }
  };

  // ĐẢM BẢO KHÔNG ĐỔI TRẠNG THÁI KHI ĐÃ LÀ 'ĐANG XỬ LÝ', TRỪ KHI CHUYỂN SANG 'HOÀN THÀNH'
  const safeUpdateOrder = (orderId, updates, currentStatus) => {
    // Nếu trạng thái hiện tại là 'Đang xử lý' và cập nhật không phải sang 'Hoàn thành', giữ nguyên trạng thái
    if (getStatusText(currentStatus) === 'Đang xử lý' && updates.status && getStatusText(updates.status) !== 'Hoàn thành') {
      // eslint-disable-next-line no-unused-vars
      const { status, ...rest } = updates;
      updateOrder(orderId, rest); // chỉ update các trường khác, không đổi trạng thái
    } else {
      updateOrder(orderId, updates);
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
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {statusKeys.map(s => (
          <div style={{ flex: 1 }} key={s.key}>
            <Card>
              <Statistic title={s.key} value={stats[s.key]} valueStyle={{ color: s.color }} />
            </Card>
          </div>
        ))}
      </div>

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
          {/* Xoá nút Xem lịch tháng */}
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
                    background: "#fff",
                    padding: 20,
                    borderRadius: 16,
                    border: "1.5px solid #e6e6e6",
                    boxShadow: "0 4px 18px #e6e6e633",
                    marginBottom: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    minWidth: 320,
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#222" }}>
                    #{apt.id} - <span style={{ fontWeight: 700 }}>{apt.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                    <Tag color={getStatusColor(apt.status)} style={{ fontWeight: 700, fontSize: 15, padding: "4px 18px" }}>
                      {getStatusText(apt.status)}
                    </Tag>
                    {getCaseType(apt.type) && (
                      <Tag color={getCaseType(apt.type) === 'Dân sự' ? '#722ed1' : '#36cfc9'} style={{ fontWeight: 700, fontSize: 15, padding: "4px 18px" }}>
                        {getCaseType(apt.type)}
                      </Tag>
                    )}
                  </div>
                  <div style={{ color: "#444", fontSize: 15, marginBottom: 2 }}>
                    {apt.type}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 2 }}>
                    <span style={{ color: "#888", fontSize: 14 }}>
                      <PhoneOutlined style={{ marginRight: 4 }} />
                      {apt.phone}
                    </span>
                  </div>
                  {apt.appointmentDate && (
                    <div style={{ color: "#009e74", fontWeight: 600, fontSize: 15, marginTop: 2 }}>
                      <CalendarOutlined style={{ marginRight: 4 }} />
                      Ngày hẹn: {apt.appointmentDate}
                    </div>
                  )}
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
                (apt) => getStatusText(apt.status) === "Đã hẹn"
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
          <TabPane tab="Đã đến" key="arrived">
            <Table
              columns={columns}
              dataSource={appointments.filter(
                (apt) => getStatusText(apt.status) === "Đã đến"
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
          <TabPane tab="Đang lấy mẫu" key="collecting">
            <Table
              columns={columns}
              dataSource={appointments.filter(
                (apt) => getStatusText(apt.status) === "Đang lấy mẫu"
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
          <TabPane tab="Đang xử lý" key="processing">
            <Table
              columns={columns}
              dataSource={appointments.filter(
                (apt) => getStatusText(apt.status) === "Đang xử lý"
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
          <TabPane tab="Hoàn thành" key="completed">
            <Table
              columns={columns}
              dataSource={appointments.filter(
                (apt) => getStatusText(apt.status) === "Hoàn thành"
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
          <TabPane tab="Vắng mặt/Hủy" key="missed">
            <Table
              columns={columns}
              dataSource={appointments.filter(
                (apt) => getStatusText(apt.status) === "Đã hủy"
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
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#00a67e', margin: 0, letterSpacing: 1 }}>
                Chi tiết lịch hẹn #{selectedAppointment.id}
              </h2>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <Tag color={getStatusColor(selectedAppointment.status)} style={{ fontWeight: 700, fontSize: 16, padding: '4px 18px' }}>
                  {getStatusText(selectedAppointment.status)}
                </Tag>
                {(() => {
                  const caseType = getCaseType(selectedAppointment.type);
                  if (!caseType) return null;
                  return (
                    <Tag color={caseType === 'Dân sự' ? '#722ed1' : '#36cfc9'} style={{ fontWeight: 700, fontSize: 16, padding: '4px 18px' }}>
                      {caseType}
                    </Tag>
                  );
                })()}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Thông tin khách hàng */}
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: 18, boxShadow: '0 2px 8px #e6e6e633' }}>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: '#009e74' }}>Thông tin khách hàng</div>
                <div style={{ marginBottom: 4 }}><span style={{ fontWeight: 600, fontSize: 17 }}>Họ tên:</span> <span style={{ fontSize: 17 }}>{selectedAppointment.name}</span></div>
                <div style={{ marginBottom: 4 }}><span style={{ fontWeight: 600, fontSize: 17 }}>Email:</span> <span style={{ fontSize: 17 }}>{selectedAppointment.email}</span></div>
                <div style={{ marginBottom: 4 }}><span style={{ fontWeight: 600, fontSize: 17 }}>Số điện thoại:</span> <span style={{ fontSize: 17 }}>{selectedAppointment.phone}</span></div>
              </div>
              {/* Thông tin lịch hẹn */}
              <div style={{ background: '#f6fafd', borderRadius: 10, padding: 18, boxShadow: '0 2px 8px #e6e6e633' }}>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: '#009e74' }}>Thông tin lịch hẹn</div>
                <div style={{ marginBottom: 4 }}><span style={{ fontWeight: 600, fontSize: 17 }}>Loại xét nghiệm:</span> <span style={{ fontSize: 17 }}>{selectedAppointment.type}</span></div>
                <div style={{ marginBottom: 4 }}><span style={{ fontWeight: 600, fontSize: 17 }}>Ngày hẹn:</span> <span style={{ fontWeight: 600, fontSize: 17 }}>{selectedAppointment.appointmentDate || 'Chưa hẹn'}</span></div>
              </div>
              {/* Ghi chú nếu có */}
              {selectedAppointment.notes && (
                <div style={{ background: '#fffbe6', border: '1.5px solid #ffe58f', borderRadius: 10, padding: 16, color: '#ad6800', fontWeight: 600, fontSize: 16 }}>
                  Ghi chú: {selectedAppointment.notes}
                </div>
              )}
              {/* Bảng thông tin mẫu khi Đang xử lý */}
              {getStatusText(selectedAppointment.status) === 'Đang xử lý' && (
                (() => {
                  let data = Array.isArray(selectedAppointment.members) && selectedAppointment.members.length > 0
                    ? selectedAppointment.members
                    : (Array.isArray(selectedAppointment.resultTableData) && selectedAppointment.resultTableData.length > 0
                        ? selectedAppointment.resultTableData
                        : []);
                  if (data.length === 0) return null;
                  return (
                    <div style={{ marginTop: 24 }}>
                      <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: '#009e74' }}>Bảng thông tin mẫu của khách hàng</div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f8fafc', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                        <thead>
                          <tr style={{ background: '#e6f7ff' }}>
                            <th style={{ padding: 8, fontWeight: 700, color: '#009e74' }}>STT</th>
                            <th style={{ padding: 8, fontWeight: 700, color: '#009e74' }}>Họ và tên</th>
                            <th style={{ padding: 8, fontWeight: 700, color: '#009e74' }}>Ngày sinh</th>
                            <th style={{ padding: 8, fontWeight: 700, color: '#009e74' }}>Giới tính</th>
                            <th style={{ padding: 8, fontWeight: 700, color: '#009e74' }}>Mối quan hệ</th>
                            <th style={{ padding: 8, fontWeight: 700, color: '#009e74' }}>Loại mẫu</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((mem, idx) => (
                            <tr key={idx} style={{ background: idx % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                              <td style={{ textAlign: 'center', padding: 6 }}>{idx + 1}</td>
                              <td style={{ padding: 6 }}>{mem.name || mem.hoTen || mem.hovaten || ''}</td>
                              <td style={{ padding: 6 }}>{mem.birth || mem.birthYear || mem.namSinh || mem.namsinh || ''}</td>
                              <td style={{ padding: 6 }}>{mem.gender || mem.gioiTinh || mem.gioitinh || ''}</td>
                              <td style={{ padding: 6 }}>{mem.relation || mem.relationship || mem.moiQuanHe || mem.moiquanhe || ''}</td>
                              <td style={{ padding: 6 }}>{mem.sampleType || mem.loaiMau || mem.loaimau || ''}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()
              )}
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
