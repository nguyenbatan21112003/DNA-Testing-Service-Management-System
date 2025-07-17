"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Statistic, Progress, Table, Tag, Button, Empty } from "antd"
import { BarChartOutlined, PieChartOutlined, UserOutlined, FileExcelOutlined, PrinterOutlined, SmileOutlined } from "@ant-design/icons"

const ManagerReports = () => {
    const [reportData, setReportData] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        onTimeRate: 0,
        customerSatisfaction: 0,
    })
    const [chartData, setChartData] = useState([])
    const [serviceDistribution, setServiceDistribution] = useState([])

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "dna_orders") {
                const orders = JSON.parse(localStorage.getItem("dna_orders") || "[]")
                setReportData({
                    totalOrders: orders.length || 156,
                    totalRevenue: 2450000000,
                    onTimeRate: 92.3,
                    customerSatisfaction: 4.7,
                });
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        const orders = JSON.parse(localStorage.getItem("dna_orders") || "[]")
        setReportData({
            totalOrders: orders.length || 156,
            totalRevenue: 2450000000,
            onTimeRate: 92.3,
            customerSatisfaction: 4.7,
        })
        const monthlyData = []
        for (let i = 11; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const month = date.toLocaleDateString("vi-VN", { month: "short" })
            monthlyData.push({
                month,
                orders: Math.floor(Math.random() * 30) + 20,
                revenue: Math.floor(Math.random() * 200000000) + 150000000,
            })
        }
        setChartData(monthlyData)
        setServiceDistribution([
            { name: "Xét nghiệm ADN cha con", value: 45, color: "#722ed1" },
            { name: "Xét nghiệm huyết thống", value: 25, color: "#1890ff" },
            { name: "Xét nghiệm anh em", value: 20, color: "#52c41a" },
            { name: "Xét nghiệm khác", value: 10, color: "#faad14" },
        ])
    }, [])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const staffColumns = [
        { title: "Nhân viên", dataIndex: "name", key: "name", render: (text) => <span><UserOutlined /> {text}</span> },
        { title: "Hoàn thành", dataIndex: "completed", key: "completed" },
        { title: "Đúng hạn", dataIndex: "onTime", key: "onTime" },
        { title: "Đánh giá", dataIndex: "rating", key: "rating", render: (val) => val ? `${val} ⭐` : "-" },
        { title: "Hiệu suất", dataIndex: "efficiency", key: "efficiency", render: (val) => val ? `${val}%` : "-" },
        { title: "Xếp hạng", dataIndex: "rank", key: "rank", render: (val) => val ? <Tag color="#722ed1">#{val}</Tag> : "-" },
    ]

    return (
        <div style={{ padding: 0 }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#722ed1", margin: 0 }}>Báo cáo & Thống kê</h1>
                <p style={{ color: "#666", margin: "8px 0 0 0" }}>Tổng quan hoạt động kinh doanh và vận hành</p>
                </div>
            {/* Nút xuất/in báo cáo trên cùng */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 24 }}>
                <Button icon={<FileExcelOutlined />} type="primary" style={{ background: "#52c41a", borderColor: "#52c41a" }} onClick={() => alert("Chức năng xuất Excel đang phát triển")}>Xuất Excel</Button>
                <Button icon={<PrinterOutlined />} type="primary" style={{ background: "#1890ff", borderColor: "#1890ff" }} onClick={() => window.print()}>In báo cáo</Button>
            </div>
            {/* KPI Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ background: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)", color: "#fff" }}>
                        <Statistic title={<span style={{ color: "#fff" }}>Tổng đơn hàng</span>} value={reportData.totalOrders} prefix={<BarChartOutlined />} valueStyle={{ color: "#fff" }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)", color: "#fff" }}>
                        <Statistic title={<span style={{ color: "#fff" }}>Doanh thu</span>} value={formatCurrency(reportData.totalRevenue)} prefix={<PieChartOutlined />} valueStyle={{ color: "#fff" }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ background: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)", color: "#fff" }}>
                        <Statistic title={<span style={{ color: "#fff" }}>Tỷ lệ đúng hạn</span>} value={reportData.onTimeRate + "%"} prefix={<SmileOutlined />} valueStyle={{ color: "#fff" }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card style={{ background: "linear-gradient(135deg, #faad14 0%, #ffc53d 100%)", color: "#fff" }}>
                        <Statistic title={<span style={{ color: "#fff" }}>Hài lòng KH</span>} value={reportData.customerSatisfaction + "/5"} prefix={<SmileOutlined />} valueStyle={{ color: "#fff" }} />
                    </Card>
                </Col>
            </Row>
            {/* Biểu đồ xu hướng & Phân tích dịch vụ */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                <Col xs={24} lg={16}>
                    <Card title={<span style={{ color: "#722ed1" }}>Xu hướng 12 tháng</span>}>
                        <div style={{ height: 250, display: "flex", alignItems: "end", gap: 4, padding: "0 8px" }}>
                            {chartData.map((month, idx) => (
                                <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div style={{ width: "100%", height: `${(month.orders / 50) * 200}px`, background: "linear-gradient(to top, #722ed1, #9254de)", borderRadius: "4px 4px 0 0", marginBottom: 8, position: "relative" }}>
                                        <div style={{ position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)", fontSize: 10, fontWeight: 600, color: "#722ed1" }}>{month.orders}</div>
                                    </div>
                                    <div style={{ fontSize: 12, color: "#666", textAlign: "center" }}>{month.month}</div>
                            </div>
                        ))}
                    </div>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title={<span style={{ color: "#1890ff" }}>Phân bố dịch vụ</span>}>
                        {serviceDistribution.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                                <div style={{ width: 12, height: 12, borderRadius: "50%", background: item.color, marginRight: 8 }}></div>
                                <span style={{ flex: 1 }}>{item.name}</span>
                                <span style={{ fontWeight: 600, color: item.color }}>{item.value}%</span>
                            </div>
                        ))}
                    </Card>
                </Col>
            </Row>
            {/* Hiệu suất nhân viên */}
            <Card title={<span style={{ color: "#722ed1" }}>Hiệu suất nhân viên</span>} style={{ marginBottom: 32 }}>
                <Table
                    columns={staffColumns}
                    dataSource={[]}
                    locale={{ emptyText: <Empty description="Chưa có dữ liệu nhân viên" /> }}
                    pagination={false}
                    rowKey="name"
                />
            </Card>
            {/* XÓA PHẦN PHẢN HỒI KHÁCH HÀNG */}
        </div>
    )
}

export default ManagerReports
