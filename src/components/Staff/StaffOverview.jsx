"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
} from "antd";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  CalendarOutlined,
  AlertOutlined,
  ExperimentOutlined,
  HomeOutlined,
  BankOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const StaffOverview = () => {
  const [, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    homeSampling: 0,
    centerSampling: 0,
  });
  const [, setRecentActivities] = useState([]);
  const [, setTodayAppointments] = useState([]);
  const [urgentOrders, setUrgentOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    setOrders(savedOrders);

    // Tính toán thống kê
    const newStats = {
      total: savedOrders.length,
      pending: savedOrders.filter((order) => order.status === "Chờ xử lý")
        .length,
      processing: savedOrders.filter((order) => order.status === "Đang xử lý")
        .length,
      completed: savedOrders.filter((order) => order.status === "Hoàn thành")
        .length,
      homeSampling: savedOrders.filter((order) => order.sampleMethod === "home")
        .length,
      centerSampling: savedOrders.filter(
        (order) => order.sampleMethod === "center"
      ).length,
    };
    setStats(newStats);

    // Lọc các đơn hàng ưu tiên cao
    const highPriorityOrders = savedOrders
      .filter(
        (order) => order.priority === "Cao" && order.status !== "Hoàn thành"
      )
      .slice(0, 5);
    setUrgentOrders(highPriorityOrders);

    // Lọc các cuộc hẹn hôm nay
    const today = dayjs().format("DD/MM/YYYY");
    const appointments = savedOrders
      .filter(
        (order) =>
          (order.sampleMethod === "center" &&
            order.appointmentDate === today) ||
          (order.sampleMethod === "home" &&
            order.scheduledDate &&
            order.scheduledDate.includes(today))
      )
      .slice(0, 5);
    setTodayAppointments(appointments);

    // Tạo hoạt động gần đây
    generateRecentActivities(savedOrders);
  }, []);

  const generateRecentActivities = (orders) => {
    const activities = [];

    // Thêm hoạt động từ đơn hàng đã hoàn thành
    const completedOrders = orders
      .filter((order) => order.status === "Hoàn thành")
      .slice(0, 2);
    completedOrders.forEach((order) => {
      activities.push({
        time: order.completedDate || "Gần đây",
        content: `Hoàn thành xét nghiệm cho đơn hàng #${order.id} - ${order.name}`,
        type: "success",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
    });

    // Thêm hoạt động từ đơn hàng đang xử lý
    const processingOrders = orders
      .filter((order) => order.status === "Đang xử lý")
      .slice(0, 2);
    processingOrders.forEach((order) => {
      activities.push({
        time: order.date,
        content: `Bắt đầu xử lý đơn hàng #${order.id} - ${order.name}`,
        type: "processing",
        icon: <LoadingOutlined style={{ color: "#1890ff" }} />,
      });
    });

    // Thêm hoạt động từ đơn hàng lấy mẫu tại nhà
    const homeSamplingOrders = orders
      .filter(
        (order) =>
          order.sampleMethod === "home" && order.kitStatus === "da_nhan"
      )
      .slice(0, 2);
    homeSamplingOrders.forEach((order) => {
      activities.push({
        time: order.date,
        content: `Đã nhận mẫu từ đơn hàng #${order.id} - ${order.name}`,
        type: "info",
        icon: <HomeOutlined style={{ color: "#13c2c2" }} />,
      });
    });

    // Thêm hoạt động từ đơn hàng lấy mẫu tại trung tâm
    const centerSamplingOrders = orders
      .filter(
        (order) =>
          order.sampleMethod === "center" &&
          order.appointmentStatus === "da_den"
      )
      .slice(0, 2);
    centerSamplingOrders.forEach((order) => {
      activities.push({
        time: order.appointmentDate,
        content: `Khách hàng ${order.name} đã đến lấy mẫu tại trung tâm`,
        type: "info",
        icon: <BankOutlined style={{ color: "#722ed1" }} />,
      });
    });

    // Sắp xếp hoạt động theo thời gian
    activities.sort(() => Math.random() - 0.5);
    setRecentActivities(activities.slice(0, 6));
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "PROCESSING":
        return "Đang xử lý";
      case "COMPLETED":
        return "Hoàn thành";
      default:
        if (status === "Chờ xử lý") return "Chờ xử lý";
        if (status === "Đang xử lý") return "Đang xử lý";
        if (status === "Hoàn thành") return "Hoàn thành";
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
      case "Chờ xử lý":
        return "orange";
      case "PROCESSING":
      case "Đang xử lý":
        return "blue";
      case "COMPLETED":
      case "Hoàn thành":
        return "green";
      default:
        return "default";
    }
  };

  const urgentColumns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (id) => `#${id}`,
      width: 100,
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Loại xét nghiệm",
      dataIndex: "type",
      key: "type",
      width: 200,
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
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}
        >
          Dashboard Nhân viên
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
          Tổng quan hoạt động và thống kê hôm nay
        </p>
      </div>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: "#00a67e" }} />}
              valueStyle={{ color: "#00a67e", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: "#fa8c16" }} />}
              valueStyle={{ color: "#fa8c16", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={stats.processing}
              prefix={<LoadingOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a", fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Thu mẫu tại nhà"
              value={stats.homeSampling}
              prefix={<HomeOutlined style={{ color: "#13c2c2" }} />}
              valueStyle={{ color: "#13c2c2", fontWeight: 600 }}
            />
            <Progress
              percent={
                stats.total > 0
                  ? Math.round((stats.homeSampling / stats.total) * 100)
                  : 0
              }
              strokeColor="#13c2c2"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Thu mẫu tại trung tâm"
              value={stats.centerSampling}
              prefix={<BankOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1", fontWeight: 600 }}
            />
              <Progress
                percent={
                  stats.total > 0
                  ? Math.round((stats.centerSampling / stats.total) * 100)
                    : 0
                }
              strokeColor="#722ed1"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Đơn hàng ưu tiên cao */}
      <Card
        title={
          <span>
            <AlertOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />
            Các đơn xét nghiệm đang xử lý
          </span>
        }
        style={{ marginBottom: 24 }}
      >
            <Table
              dataSource={urgentOrders}
          columns={urgentColumns}
              pagination={false}
              size="small"
          rowKey="id"
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default StaffOverview;
