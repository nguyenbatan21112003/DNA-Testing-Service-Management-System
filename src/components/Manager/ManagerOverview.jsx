"use client"
import { Card, Row, Col, Statistic, Progress, Table, Tag, Timeline, Button } from "antd"
import { ExperimentOutlined, CheckCircleOutlined, ClockCircleOutlined, AlertOutlined } from "@ant-design/icons"
import { useEffect } from "react"
import { Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const ManagerOverview = () => {
    // Lắng nghe sự kiện storage để tự động reload dữ liệu khi localStorage thay đổi
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "dna_orders") {
                // Force re-render để cập nhật thống kê
                window.location.reload();
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Dữ liệu thống kê
    const stats = [
        {
            title: "Tổng mẫu xét nghiệm",
            value: 1247,
            icon: <ExperimentOutlined style={{ color: "#722ed1" }} />,
            color: "#722ed1",
            change: "+12%",
        },
        {
            title: "Đang xử lý",
            value: 89,
            icon: <ClockCircleOutlined style={{ color: "#fa8c16" }} />,
            color: "#fa8c16",
            change: "+5%",
        },
        {
            title: "Hoàn thành",
            value: 1158,
            icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
            color: "#52c41a",
            change: "+8%",
        },
        {
            title: "Quá hạn",
            value: 12,
            icon: <AlertOutlined style={{ color: "#ff4d4f" }} />,
            color: "#ff4d4f",
            change: "-3%",
        },
    ]

    // Timeline hoạt động
    const activities = [
        {
            color: "#52c41a",
            children: (
                <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>Hoàn thành xét nghiệm DNA-2024-001</p>
                    <p style={{ margin: 0, color: "#666", fontSize: "12px" }}>2 phút trước</p>
                </div>
            ),
        },
        {
            color: "#722ed1",
            children: (
                <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>Xác thực kết quả DNA-2024-002</p>
                    <p style={{ margin: 0, color: "#666", fontSize: "12px" }}>15 phút trước</p>
                </div>
            ),
        },
        {
            color: "#fa8c16",
            children: (
                <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>Nhận mẫu mới từ khách hàng</p>
                    <p style={{ margin: 0, color: "#666", fontSize: "12px" }}>1 giờ trước</p>
                </div>
            ),
        },
        {
            color: "#1890ff",
            children: (
                <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>Gửi báo cáo tuần cho Ban Giám Đốc</p>
                    <p style={{ margin: 0, color: "#666", fontSize: "12px" }}>3 giờ trước</p>
                </div>
            ),
        },
    ]

    // Dữ liệu biểu đồ (tương tự giao diện Admin)
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
    }

    const pieData = {
        labels: ["Huyết thống", "Nguồn gốc", "Sức khỏe", "Hành chính", "Khác"],
        datasets: [
            {
                data: [45, 25, 15, 10, 5],
                backgroundColor: ["#00b894", "#0984e3", "#fdcb6e", "#e17055", "#636e72"],
                borderWidth: 1,
            },
        ],
    }

    // Thay đổi phần return để thêm màu nền và đường viền
    return (
        <div style={{ padding: "0" }}>
            {/* Header */}
            <div style={{ marginBottom: "24px", textAlign: "center" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#722ed1", margin: 0 }}>
                    Dashboard Manager - Tổng quan
                </h1>
                <p style={{ color: "#666", margin: "8px 0 0 0" }}>Giám sát và quản lý toàn bộ quy trình xét nghiệm DNA</p>
            </div>

            {/* Thống kê tổng quan */}
            <div
                style={{
                    background: "#fff",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "1px solid #f0f0f0",
                    marginBottom: "24px",
                }}
            >
                <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                    {stats.map((stat, index) => (
                        <Col xs={24} sm={12} lg={6} key={index}>
                            <Card>
                                <Statistic
                                    title={stat.title}
                                    value={stat.value}
                                    prefix={stat.icon}
                                    suffix={<span style={{ fontSize: "14px", color: stat.color, fontWeight: 600 }}>{stat.change}</span>}
                                    valueStyle={{ color: stat.color, fontWeight: 700 }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Row gutter={[16, 16]}>
                    {/* Hiệu suất 7 ngày */}
                    <Col xs={24} lg={12}>
                        <Card title="Hiệu suất 7 ngày qua" style={{ height: "300px" }}>
                            <div style={{ marginBottom: "16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <span>Tỷ lệ đúng hạn</span>
                                    <span style={{ fontWeight: 600, color: "#52c41a" }}>94%</span>
                                </div>
                                <Progress percent={94} strokeColor="#52c41a" />
                            </div>
                            <div style={{ marginBottom: "16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <span>Thời gian xử lý TB</span>
                                    <span style={{ fontWeight: 600, color: "#722ed1" }}>2.3 ngày</span>
                                </div>
                                <Progress percent={77} strokeColor="#722ed1" />
                            </div>
                            <div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <span>Độ hài lòng KH</span>
                                    <span style={{ fontWeight: 600, color: "#fa8c16" }}>4.8/5</span>
                                </div>
                                <Progress percent={96} strokeColor="#fa8c16" />
                            </div>
                        </Card>
                    </Col>
                    {/* Timeline hoạt động */}
                    <Col xs={24} lg={12}>
                        <Card title="Hoạt động gần đây" style={{ height: "300px" }}>
                            <Timeline items={activities} />
                        </Card>
                    </Col>
                </Row>

                {/* Biểu đồ */}
                <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
                    <Col xs={24} lg={12}>
                        <Card title="Xu hướng số lượng xét nghiệm (6 tháng)" style={{ height: "500px" }}>
                            <Line
                                data={lineData}
                                options={{ responsive: true, plugins: { legend: { display: false } } }}
                                height={180}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card title="Tỉ lệ các loại xét nghiệm" style={{ height: "500px" }}>
                            <Pie
                                data={pieData}
                                options={{ responsive: true, plugins: { legend: { position: "right" } } }}
                                height={180}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default ManagerOverview