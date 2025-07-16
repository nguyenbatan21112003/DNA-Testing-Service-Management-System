"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Progress } from "antd";
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

// Đưa hàm getStatusText ra ngoài để dùng chung
const getStatusText = (status) => {
  if (!status) return "";
  const s = status.toString().trim().toLowerCase();
  if (
    s === "waiting_approval" ||
    s === "chờ xác nhận" ||
    s === "pending_confirm" ||
    s === "pending" ||
    s === "choxacnhan"
  )
    return "Chờ xác nhận";
  if (s === "completed" || s === "hoàn thành") return "Hoàn thành";
  if (s === "đang xử lý" || s === "processing" || s === "dangxuly")
    return "Đang xử lý";
  return status;
};

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
  const [recentActivities, setRecentActivities] = useState([]);
  const [, setTodayAppointments] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    setOrders(savedOrders);

    // Đếm đơn chờ xác nhận
    const waitingCount = savedOrders.filter(
      (o) => getStatusText(o.status) === "Chờ xác nhận"
    ).length;
    // Đếm đơn đang xử lý
    const processingCount = savedOrders.filter(
      (o) => getStatusText(o.status) === "Đang xử lý"
    ).length;

    // Tính toán thống kê
    const newStats = {
      total: savedOrders.length,
      waiting: waitingCount,
      processing: processingCount,
      completed: savedOrders.filter(
        (order) => getStatusText(order.status) === "Hoàn thành"
      ).length,
      homeSampling: savedOrders.filter((order) => order.sampleMethod === "home")
        .length,
      centerSampling: savedOrders.filter(
        (order) => order.sampleMethod === "center"
      ).length,
    };
    setStats(newStats);

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
    // Đơn hàng mới tạo
    orders.slice(-3).forEach((order) => {
      activities.push({
        time: order.createdAt
          ? dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")
          : "Gần đây",
        content: `Tạo đơn hàng #${order.id} - ${
          order.name || order.fullName || order.email
        }`,
        type: "new",
        icon: <FileTextOutlined style={{ color: "#00a67e" }} />,
      });
    });
    // Đơn hàng hoàn thành
    orders
      .filter((o) => getStatusText(o.status) === "Hoàn thành")
      .slice(-2)
      .forEach((order) => {
        activities.push({
          time: order.updatedAt
            ? dayjs(order.updatedAt).format("DD/MM/YYYY HH:mm")
            : "Gần đây",
          content: `Hoàn thành đơn hàng #${order.id} - ${
            order.name || order.fullName || order.email
          }`,
          type: "done",
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
      });

    // Đơn hàng cập nhật trạng thái gần đây
    orders.slice(-5).forEach((order) => {
      if (
        getStatusText(order.status) &&
        getStatusText(order.status) !== "Hoàn thành"
      ) {
        activities.push({
          time: order.updatedAt
            ? dayjs(order.updatedAt).format("DD/MM/YYYY HH:mm")
            : "Gần đây",
          content: `Cập nhật trạng thái đơn #${order.id} - ${getStatusText(
            order.status
          )}`,
          type: "update",
          icon: <LoadingOutlined style={{ color: "#1890ff" }} />,
        });
      }
    });

    // Sắp xếp theo thời gian mới nhất
    activities.sort((a, b) => (b.time > a.time ? 1 : -1));
    setRecentActivities(activities.slice(0, 6));
  };

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
              title="Chờ xác nhận"
              value={stats.waiting}
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

      {/* Hoạt động gần đây */}
      <Card
        title="Hoạt động gần đây"
        style={{ minHeight: 300, width: "100%", marginBottom: 24 }}
      >
        {recentActivities.length === 0 ? (
          <div style={{ color: "#aaa", textAlign: "center", marginTop: 32 }}>
            Chưa có hoạt động nào gần đây.
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {recentActivities.map((act, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <span style={{ marginRight: 12, fontSize: 20 }}>
                  {act.icon}
                </span>
                <div>
                  <div style={{ fontWeight: 500 }}>{act.content}</div>
                  <div style={{ color: "#888", fontSize: 12 }}>{act.time}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Đơn hàng ưu tiên cao */}
    </div>
  );
};

export default StaffOverview;
