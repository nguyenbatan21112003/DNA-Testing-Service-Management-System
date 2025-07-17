"use client"
import { Card, Row, Col, Statistic, Progress, Tag, Alert } from "antd"
import { ExperimentOutlined, CheckCircleOutlined, ClockCircleOutlined, AlertOutlined, SmileOutlined, MessageOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"

const ManagerOverview = () => {
    // Lắng nghe sự kiện storage để tự động reload dữ liệu khi localStorage thay đổi
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "dna_orders") {
                // Chỉ cập nhật lại dữ liệu, không reload trang
                // Gọi lại hàm fetchActivities hoặc setStats nếu cần
                fetchActivities && fetchActivities();
                // Nếu có hàm cập nhật thống kê, gọi ở đây
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

    // Dữ liệu hoạt động gần đây (fetch từ API hoặc backend sau này)
    const [activities, setActivities] = useState([]);

    // Hàm fetch hoạt động gần đây (sau này thay bằng API thực)
    const fetchActivities = async () => {
        // TODO: Thay thế bằng API thực khi backend sẵn sàng
        setActivities([]); // Hiện tại chưa có dữ liệu động
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    // Hàm hiển thị thời gian tương đối
    const timeAgo = (date) => {
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return `${diff} giây trước`;
        if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
        return date.toLocaleString("vi-VN");
    };

    // Dữ liệu mẫu cho phản hồi khách hàng
    const customerSatisfaction = 4.7;
    const newFeedbackCount = 3;
    // Dữ liệu cảnh báo
    const overdueCount = stats.find(s => s.title === "Quá hạn")?.value || 0;

    return (
        <div style={{ padding: "0" }}>
            {/* Header */}
            <div style={{ marginBottom: "24px", textAlign: "center" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#722ed1", margin: 0 }}>
                    Dashboard Manager - Tổng quan
                </h1>
                <p style={{ color: "#666", margin: "8px 0 0 0" }}>Giám sát và quản lý toàn bộ quy trình xét nghiệm DNA</p>
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
                                    suffix={<span style={{ fontSize: "14px", color: stat.color, fontWeight: 600 }}>{stat.change}</span>}
                                    valueStyle={{ color: stat.color, fontWeight: 700 }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            {/* Hiệu suất 7 ngày qua */}
            <Card title={<span style={{ color: "#52c41a" }}>Hiệu suất 7 ngày qua</span>} style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <span>Tỷ lệ đúng hạn</span>
                                    <span style={{ fontWeight: 600, color: "#52c41a" }}>94%</span>
                                </div>
                                <Progress percent={94} strokeColor="#52c41a" />
                            </div>
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <span>Thời gian xử lý TB</span>
                                    <span style={{ fontWeight: 600, color: "#722ed1" }}>2.3 ngày</span>
                                </div>
                                <Progress percent={77} strokeColor="#722ed1" />
                            </div>
                            <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <span>Độ hài lòng KH</span>
                                    <span style={{ fontWeight: 600, color: "#fa8c16" }}>4.8/5</span>
                                </div>
                                <Progress percent={96} strokeColor="#fa8c16" />
                            </div>
                        </Card>
            {/* Hoạt động gần đây */}
            <Card title={<span style={{ color: "#1890ff" }}>Hoạt động gần đây</span>}>
                <div style={{ padding: 8 }}>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {activities.map((item) => (
                            <li key={item.id} style={{ marginBottom: 16 }}>
                                <div style={{ fontWeight: 600 }}>{item.message}</div>
                                <div style={{ color: "#888", fontSize: 12 }}>{timeAgo(new Date(item.createdAt))}</div>
                            </li>
                        ))}
                    </ul>
                </div>
                        </Card>
        </div>
    )
}

export default ManagerOverview