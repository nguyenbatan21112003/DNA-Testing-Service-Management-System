import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const stats = [
  { label: "Tổng số xét nghiệm", value: 1287, color: "#009e74", icon: "🧬" },
  { label: "Đang xử lý", value: 34, color: "#f7b731", icon: "⏳" },
  { label: "Hoàn thành", value: 1200, color: "#4cd137", icon: "✅" },
  { label: "Lỗi/Hủy", value: 12, color: "#e74c3c", icon: "❌" },
  { label: "Khách hàng mới (tháng)", value: 56, color: "#2980b9", icon: "👤" },
];

const lineData = {
  labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
  datasets: [
    {
      label: "Số lượng xét nghiệm",
      data: [180, 210, 190, 250, 230, 226],
      fill: false,
      borderColor: "#009e74",
      backgroundColor: "#009e74",
      tension: 0.3,
    },
  ],
};

const pieData = {
  labels: ["Huyết thống", "Nguồn gốc", "Sức khỏe", "Hành chính", "Khác"],
  datasets: [
    {
      data: [45, 25, 15, 10, 5],
      backgroundColor: ["#00b894", "#0984e3", "#fdcb6e", "#e17055", "#636e72"],
      borderWidth: 1,
    },
  ],
};

const AdminDNAStatsDashboard = () => {
  return (
    <div style={{ width: "100%", minHeight: 500 }}>
      <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 24 }}>
        Thống kê xét nghiệm ADN
      </h2>
      <div
        style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 32 }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              flex: "1 1 180px",
              minWidth: 180,
              background: "#fff",
              borderRadius: 14,
              boxShadow: "0 2px 12px #e6e6e6",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
              borderLeft: `6px solid ${s.color}`,
            }}
          >
            <span style={{ fontSize: 28 }}>{s.icon}</span>
            <span style={{ fontWeight: 700, fontSize: 22, color: s.color }}>
              {s.value}
            </span>
            <span style={{ color: "#444", fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        <div
          style={{
            flex: 1,
            minWidth: 320,
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 2px 12px #e6e6e6",
            padding: 24,
          }}
        >
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>
            Xu hướng số lượng xét nghiệm (6 tháng)
          </h3>
          <Line
            data={lineData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
            height={180}
          />
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 320,
            background: "#fff",
            borderRadius: 14,
            boxShadow: "0 2px 12px #e6e6e6",
            padding: 24,
          }}
        >
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>
            Tỉ lệ các loại xét nghiệm
          </h3>
          <Pie
            data={pieData}
            options={{
              responsive: true,
              plugins: { legend: { position: "right" } },
            }}
            height={180}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDNAStatsDashboard;
