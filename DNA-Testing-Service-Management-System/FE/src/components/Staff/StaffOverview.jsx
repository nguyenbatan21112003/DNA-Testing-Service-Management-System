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
import staffApi from "../../api/staffApi";

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
  if (s === "sample_received") return "Đã nhận mẫu";
  if (s === "kit_sent") return "Đã gửi kit";
  if (s === "kit_not_sent") return "Chưa gửi kit";
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
  // const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await staffApi.getTestProccesses();
        const data = res.data; // ✅ Fix chỗ này
        console.log(data);
        const orders = Array.isArray(data) ? data : [];
        setOrders(orders);

        const total = orders.length;

        const pending = orders.filter(
          (o) => o.request?.status?.toLowerCase() === "pending"
        ).length;

        const processing = orders.filter(
          (o) => o.request?.status?.toLowerCase() === "confirmed"
        ).length;

        const completed = orders.filter(
          (o) => o.testProcess?.currentStatus === "COMPLETED"
        ).length;

        const homeSampling = orders.filter(
          (o) => o.request?.collectType === "At Home"
        ).length;

        const centerSampling = orders.filter(
          (o) => o.request?.collectType === "At Center"
        ).length;

        setStats({
          total,
          pending,
          processing,
          completed,
          homeSampling,
          centerSampling,
        });

        generateRecentActivities(orders);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      }
    };

    fetchData();
  }, []);

  const generateRecentActivities = (orders) => {
    const activities = [];

    orders.forEach((order) => {
      const r = order.request || {};
      const p = order.testProcess || {};
      const declarantName = order.declarant?.fullName || "Chưa rõ";
      const requestId = r.requestId;

      const currentStatus = p.currentStatus?.toUpperCase();
      const requestStatus = r.status?.toLowerCase();

      // 1. Nếu vừa được nhận xử lý (status === confirmed)
      if (requestStatus === "confirmed" && r.updatedAt) {
        activities.push({
          time: dayjs(r.updatedAt).format("DD/MM/YYYY HH:mm"),
          content: `Nhận xử lý đơn #${requestId} - ${declarantName}`,
          type: "new",
          icon: <FileTextOutlined style={{ color: "#00a67e" }} />,
        });
        return; // ✅ Không thêm vào các mục cập nhật nữa
      }

      // 2. Nếu hoàn thành
      if (currentStatus === "COMPLETED" && p.updatedAt) {
        activities.push({
          time: dayjs(p.updatedAt).format("DD/MM/YYYY HH:mm"),
          content: `Hoàn thành đơn hàng #${requestId} - ${declarantName}`,
          type: "done",
          icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        });
        return;
      }

      // 3. Các trạng thái xử lý khác (nhận mẫu, gửi kit, ...)
      const translated = getStatusText(p.currentStatus);
      if (
        translated &&
        translated !== "Hoàn thành" &&
        translated !== "Đang xử lý" &&
        translated !== "Chờ xác nhận"
      ) {
        activities.push({
          time: p.updatedAt
            ? dayjs(p.updatedAt).format("DD/MM/YYYY HH:mm")
            : "Gần đây",
          content: `Cập nhật trạng thái đơn #${requestId} - ${translated}`,
          type: "update",
          icon: <LoadingOutlined style={{ color: "#1890ff" }} />,
        });
      }
    });

    activities.sort(
      (a, b) =>
        dayjs(b.time, "DD/MM/YYYY HH:mm").valueOf() -
        dayjs(a.time, "DD/MM/YYYY HH:mm").valueOf()
    );

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
              title="Tổng đơn hàng đã nhận"
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
