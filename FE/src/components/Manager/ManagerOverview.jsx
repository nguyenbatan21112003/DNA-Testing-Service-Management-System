"use client";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Tag,
  Timeline,
  Button,
} from "antd";

import {
  ExperimentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  BarElement,
  Legend,
} from "chart.js";
import managerApi from "../../api/managerApi";
import serviceApi from "../../api/serviceApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const ManagerOverview = () => {
  const [totalSamples, setTotalSamples] = useState(0);
  const [processingCount, setProcessingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  // const [overdueCount, setOverdueCount] = useState(0);
  const [pieData, setPieData] = useState(null);
  // const [onTimeRate, setOnTimeRate] = useState(0);
  // const [avgProcessingTime, setAvgProcessingTime] = useState(0);
  const [avgSatisfaction, setAvgSatisfaction] = useState(0);
  const [lineData, setLineData] = useState(null);
  const [serviceDistribution, setServiceDistribution] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchRevenue = async () => {
    try {
      const [sampleRes, requestRes, serviceRes] = await Promise.all([
        managerApi.getTestSamples(),
        managerApi.getTestRequests(),
        serviceApi.getServices(),
      ]);

      const samples = sampleRes.data || [];
      const requests = requestRes.data || [];
      const services = serviceRes.data || [];

      const requestMap = {}; // requestId -> serviceId
      requests.forEach((r) => {
        requestMap[r.requestId] = r.serviceId;
      });

      const priceMap = {}; // serviceId -> { price2Samples, price3Samples }
      services.forEach((s) => {
        priceMap[s.id] = {
          price2: s.price2Samples || 0,
          price3: s.price3Samples || 0,
        };
      });

      // Đếm số mẫu theo requestId
      const sampleCountMap = {};
      samples.forEach((s) => {
        if (!sampleCountMap[s.requestId]) sampleCountMap[s.requestId] = 0;
        sampleCountMap[s.requestId]++;
      });

      // Tính doanh thu mỗi request duy nhất
      let total = 0;
      Object.entries(sampleCountMap).forEach(([reqId, count]) => {
        const serviceId = requestMap[reqId];
        const priceObj = priceMap[serviceId];
        if (!priceObj) return;

        if (count === 2) {
          total += priceObj.price2;
        } else if (count >= 3) {
          total += priceObj.price3;
        }
      });

      setTotalRevenue(total);
    } catch (err) {
      console.error("Lỗi khi tính doanh thu:", err);
    }
  };

  const fetchChartData = async () => {
    try {
      const requestRes = await managerApi.getTestRequests();
      const requests = requestRes.data;

      // ---------- Pie Chart ----------
      const administrative = requests.filter(
        (r) => r.category?.toLowerCase() === "administrative"
      ).length;
      const civil = requests.filter(
        (r) => r.category?.toLowerCase() === "voluntary"
      ).length;

      setPieData({
        labels: ["Hành chính", "Dân sự"],
        datasets: [
          {
            data: [administrative, civil],
            backgroundColor: ["#e17055", "#00b894"],
            borderWidth: 1,
          },
        ],
      });

      // ---------- Line Chart ----------
      const countByMonth = new Array(6).fill(0);
      const now = new Date();

      // Tạo nhãn và mốc thời gian cho 6 tháng gần nhất
      const monthLabels = [];
      const months = [];

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = `${d.getMonth() + 1}/${d.getFullYear()}`;
        monthLabels.push(label);
        months.push({ month: d.getMonth(), year: d.getFullYear() });
      }

      // Tính khoảng ngày đầu - cuối tháng
      const monthRanges = months.map(({ month, year }) => {
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0, 23, 59, 59, 999); // cuối tháng
        return { start, end };
      });

      // Đếm request nằm trong khoảng của mỗi tháng
      // Đếm request nằm trong khoảng của mỗi tháng
      requests.forEach((r) => {
        const created = new Date(r.createdAt);
        created.setHours(created.getHours() + 7); // ép timezone nếu backend trả UTC

        const index = monthRanges.findIndex(
          (range) => created >= range.start && created <= range.end
        );

        if (index !== -1) {
          countByMonth[index]++;
        }
      });

      setLineData({
        labels: monthLabels,
        datasets: [
          {
            label: "Số lượng xét nghiệm",
            data: countByMonth,
            fill: false,
            borderColor: "#009e74",
            backgroundColor: "#009e74",
            tension: 0.3,
          },
        ],
      });
    } catch (error) {
      console.error("Lỗi khi fetch biểu đồ:", error);
    }
  };

  const fetchServiceDistribution = async () => {
    try {
      const [requestRes, serviceRes] = await Promise.all([
        managerApi.getTestRequests(),
        serviceApi.getServices(), // Giả định là managerApi có hàm này
      ]);
      console.log("ferch doanh thu", requestRes, serviceRes);

      const requests = requestRes.data || [];
      const services = serviceRes.data || [];

      const countMap = {};
      requests.forEach((r) => {
        if (r.serviceId) {
          countMap[r.serviceId] = (countMap[r.serviceId] || 0) + 1;
        }
      });

      const total = requests.length;
      const distribution = services.map((s) => ({
        name: s.serviceName,
        percent: total ? ((countMap[s.id] || 0) / total) * 100 : 0,
        color: getColorByIndex(s.id), // tùy chọn màu
      }));

      setServiceDistribution(distribution);
    } catch (error) {
      console.error("Lỗi khi tính phân bố dịch vụ:", error);
    }
  };

  const getColorByIndex = (i) => {
    const colors = ["#6c5ce7", "#0984e3", "#00b894", "#fdcb6e", "#e17055"];
    return colors[i % colors.length];
  };

  // Lắng nghe sự kiện storage để tự động reload dữ liệu khi localStorage thay đổi
  useEffect(() => {
    fetchStats();
    fetchChartData();
    fetchServiceDistribution();
    fetchRevenue();
  }, []);

  const fetchStats = async () => {
    try {
      const [samplesRes, processRes, requestRes, feedbackRes] =
        await Promise.all([
          managerApi.getTestSamples(),
          managerApi.getTestProcess(),
          managerApi.getTestRequests(),
          managerApi.getFeedbacks(),
        ]);

      const samples = Array.isArray(samplesRes.data) ? samplesRes.data : [];
      const processes = Array.isArray(processRes.data?.data)
        ? processRes.data.data
        : [];
      const requests = Array.isArray(requestRes.data) ? requestRes.data : [];
      const feedbacks = Array.isArray(feedbackRes.data?.data)
        ? feedbackRes.data.data
        : [];

      setTotalSamples(samples.length);
      console.log("🧪 Samples:", samples);
      console.log("🧪 Requests:", requests);
      console.log("🧪 Processes:", processes);
      console.log("🧪 Feedbacks:", feedbacks);
      const completed = processes.filter(
        (p) => p.currentStatus?.toLowerCase() === "completed"
      ).length;
      setCompletedCount(completed);

      const processing = requests.filter(
        (r) =>
          r.status?.toLowerCase() === "confirmed" ||
          r.status?.toLowerCase() === "pending"
      ).length;
      setProcessingCount(processing);

      // const now = new Date();
      // const overdue = requests.filter((r) => {
      //   const created = new Date(r.createdAt);
      //   const daysDiff = (now - created) / (1000 * 60 * 60 * 24);
      //   return daysDiff > 15 && r.status?.toLowerCase() !== "confirmed";
      // }).length;
      // setOverdueCount(overdue);

      // ====== Tính tỷ lệ đúng hạn ======
      // const confirmedRequests = requests.filter(
      //   (r) => r.status?.toLowerCase() === "confirmed"
      // );
      // const onTime = confirmedRequests.filter((r) => {
      //   const proc = processes.find(
      //     (p) =>
      //       p.requestId === r.requestId &&
      //       p.currentStatus?.toLowerCase() === "completed"
      //   );
      //   if (!proc) return false;
      //   const diffDays =
      //     (new Date(proc.claimedAt) - new Date(r.createdAt)) /
      //     (1000 * 60 * 60 * 24);
      //   return diffDays <= 15;
      // }).length;
      // const rate =
      //   confirmedRequests.length > 0
      //     ? (onTime / confirmedRequests.length) * 100
      //     : 0;
      // setOnTimeRate(rate.toFixed(1));

      // ====== Tính thời gian xử lý TB ======
      // const durations = processes
      //   .filter((p) => p.currentStatus?.toLowerCase() === "completed")
      //   .map((p) => {
      //     const req = requests.find((r) => r.requestId === p.requestId);
      //     if (!req || !p.claimedAt) {
      //       console.log(
      //         "❌ Không tìm thấy request cho process:",
      //         p.processId,
      //         p.requestId
      //       );
      //       return null;
      //     }
      //     const created = new Date(req.createdAt);
      //     const claimed = new Date(p.claimedAt);
      //     const days = (claimed - created) / (1000 * 60 * 60 * 24);
      //     console.log(`✔️ Process ${p.processId}: ${days.toFixed(1)} ngày`);
      //     return days;
      //   })
      //   .filter((v) => typeof v === "number" && !isNaN(v));

      // const avgTime = durations.length
      //   ? durations.reduce((a, b) => a + b, 0) / durations.length
      //   : 0;
      // setAvgProcessingTime(avgTime.toFixed(1));

      // ====== Tính độ hài lòng KH TB ======
      const avgRating =
        feedbacks.length > 0
          ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length
          : 0;
      setAvgSatisfaction(avgRating.toFixed(1));
    } catch (err) {
      console.error("Lỗi khi fetch thống kê:", err);
    }
  };

  // Dữ liệu thống kê
  const stats = [
    {
      title: "Tổng mẫu xét nghiệm",
      value: totalSamples,
      icon: <ExperimentOutlined style={{ color: "#722ed1" }} />,
      color: "#722ed1",
      change: "+12%", // Có thể tính toán hoặc để cố định
    },
    {
      title: "Số đơn đăng ký xét nghiệm",
      value: processingCount,
      icon: <ClockCircleOutlined style={{ color: "#fa8c16" }} />,
      color: "#fa8c16",
      change: "+5%",
    },
    {
      title: "Hoàn thành",
      value: completedCount,
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      color: "#52c41a",
      change: "+8%",
    },
    {
      title: "Doanh thu",
      value: totalRevenue.toLocaleString("vi-VN") + " ₫",
      icon: <DollarOutlined style={{ color: "#52c41a" }} />,
      color: "#52c41a",
      change: "+10%",
    },
  ];

  // Thay đổi phần return để thêm màu nền và đường viền
  return (
    <div style={{ padding: 0, overflowX: "hidden" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#722ed1",
            margin: 0,
          }}
        >
          Dashboard Manager - Tổng quan
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0 0" }}>
          Giám sát và quản lý toàn bộ quy trình xét nghiệm DNA
        </p>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                suffix={
                  <span
                    style={{
                      fontSize: "14px",
                      color: stat.color,
                      fontWeight: 600,
                    }}
                  >
                    {stat.change}
                  </span>
                }
                valueStyle={{ color: stat.color, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Card
        title={
          <span style={{ color: "#1890ff", fontWeight: 600 }}>
            Phân bố dịch vụ
          </span>
        }
        style={{ marginBottom: 24 }}
      >
        <ul style={{ listStyle: "none", padding: 0 }}>
          {serviceDistribution.map((s, index) => (
            <li key={index} style={{ marginBottom: 8 }}>
              <span style={{ color: s.color, fontWeight: 600 }}>{s.name}</span>
              <span style={{ float: "right", fontWeight: 500 }}>
                {s.percent.toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </Card>
      {/* Hiệu suất 7 ngày qua */}
      <Card
        title={
          <span style={{ color: "#52c41a", fontWeight: 600 }}>
            Độ hài lòng của khách hàng
          </span>
        }
        style={{ marginBottom: 24 }}
      >
        {/* <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span>Tỷ lệ đúng hạn</span>
            <span style={{ fontWeight: 600, color: "#52c41a" }}>
              {onTimeRate}%
            </span>
          </div>
          <Progress percent={parseFloat(onTimeRate)} strokeColor="#52c41a" />
        </div> */}
        {/* <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span>Thời gian xử lý TB</span>
            <span style={{ fontWeight: 600, color: "#722ed1" }}>
              {avgProcessingTime} ngày
            </span>
          </div>
          <Progress
            percent={Math.min((avgProcessingTime / 10) * 100, 100)}
            strokeColor="#722ed1"
          />
        </div> */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span></span>
            <span style={{ fontWeight: 600, color: "#fa8c16" }}>
              {avgSatisfaction}/5
            </span>
          </div>
          <Progress
            percent={Math.round((avgSatisfaction / 5) * 100)}
            strokeColor="#fa8c16"
          />
        </div>

        {/* <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span>Tỷ lệ đúng hạn</span>
            <span style={{ fontWeight: 600, color: "#52c41a" }}>94%</span>
          </div>
          <Progress percent={94} strokeColor="#52c41a" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span>Thời gian xử lý TB</span>
            <span style={{ fontWeight: 600, color: "#722ed1" }}>2.3 ngày</span>
          </div>
          <Progress percent={77} strokeColor="#722ed1" />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span>Độ hài lòng KH</span>
            <span style={{ fontWeight: 600, color: "#fa8c16" }}>4.8/5</span>
          </div>
          <Progress percent={96} strokeColor="#fa8c16" />
        </div> */}
      </Card>
      {/* Hoạt động gần đây */}
      {/* <Card title={<span style={{ color: "#1890ff" }}>Hoạt động gần đây</span>}>
        <div style={{ padding: 8 }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {activities.map((item) => (
              <li key={item.id} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600 }}>{item.message}</div>
                <div style={{ color: "#888", fontSize: 12 }}>
                  {timeAgo(new Date(item.createdAt))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card> */}

      {/* Biểu đồ */}
      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={12}>
          <Card
            title="Xu hướng số lượng xét nghiệm (6 tháng)"
            style={{ height: "500px" }}
          >
            {/* {lineData && (
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
                height={180}
              />
            )} */}
            {lineData && (
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: "top",
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `Số lượng: ${context.parsed.y}`;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 2,
                      },
                    },
                  },
                  elements: {
                    line: {
                      tension: 0.4,
                      borderWidth: 3,
                    },
                    point: {
                      radius: 5,
                      hoverRadius: 7,
                    },
                  },
                  animation: {
                    duration: 1200,
                  },
                }}
                height={300}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Tỉ lệ các loại xét nghiệm">
            <div style={{ height: "350px", position: "relative" }}>
              {pieData && (
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: "right" },
                      datalabels: {
                        color: "#fff",
                        font: {
                          weight: "bold",
                          size: 14,
                        },
                        formatter: (value, context) => {
                          const total =
                            context.chart.data.datasets[0].data.reduce(
                              (a, b) => a + b,
                              0
                            );
                          const percentage = ((value / total) * 100).toFixed(1);
                          return percentage + "%";
                        },
                      },
                    },
                  }}
                  plugins={[ChartDataLabels]} // ✅ bật plugin
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManagerOverview;
