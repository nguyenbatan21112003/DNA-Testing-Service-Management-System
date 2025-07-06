"use client"

import { useState, useEffect } from "react"

const ManagerReports = () => {
    const [reportData, setReportData] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        onTimeRate: 0,
        customerSatisfaction: 0,
    })

    const [chartData, setChartData] = useState([])
    const [staffPerformance, setStaffPerformance] = useState([])
    const [serviceDistribution, setServiceDistribution] = useState([])

    // Lắng nghe sự kiện storage để tự động reload dữ liệu khi localStorage thay đổi
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "dna_orders") {
                // Force re-render để cập nhật báo cáo
                window.location.reload();
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        // Tạo dữ liệu báo cáo mẫu
        const orders = JSON.parse(localStorage.getItem("dna_orders") || "[]")

        setReportData({
            totalOrders: orders.length || 156,
            totalRevenue: 2450000000, // 2.45 tỷ VNĐ
            onTimeRate: 92.3,
            customerSatisfaction: 4.7,
        })

        // Dữ liệu biểu đồ xu hướng 12 tháng
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

        // Hiệu suất nhân viên
        setStaffPerformance([
            { name: "Nguyễn Thị Lan", completed: 45, onTime: 42, rating: 4.8, efficiency: 93.3 },
            { name: "Trần Văn Nam", completed: 38, onTime: 35, rating: 4.6, efficiency: 92.1 },
            { name: "Lê Thị Hoa", completed: 41, onTime: 39, rating: 4.7, efficiency: 95.1 },
            { name: "Phạm Văn Đức", completed: 33, onTime: 30, rating: 4.5, efficiency: 90.9 },
        ])

        // Phân bố loại dịch vụ
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

    const exportToExcel = () => {
        alert("Chức năng xuất Excel đang được phát triển...")
    }

    const printReport = () => {
        window.print()
    }

    return (
        <div style={{ padding: "0" }}>
            {/* Header */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#722ed1", margin: 0, textAlign: "center" }}>
                        Báo cáo & Thống kê
                    </h1>
                    <p style={{ color: "#666", margin: "8px 0 0 0", textAlign: "center" }}>
                        Phân tích hiệu suất và xu hướng kinh doanh
                    </p>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                    <button
                        onClick={exportToExcel}
                        style={{
                            padding: "10px 16px",
                            background: "#52c41a",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        Xuất Excel
                    </button>
                    <button
                        onClick={printReport}
                        style={{
                            padding: "10px 16px",
                            background: "#1890ff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        In báo cáo
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                    marginBottom: "32px",
                }}
            >
                <div
                    style={{
                        background: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
                        color: "#fff",
                        padding: "24px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(114, 46, 209, 0.3)",
                    }}
                >
                    <div style={{ fontSize: "16px", opacity: 0.9, marginBottom: "8px" }}>Tổng đơn hàng</div>
                    <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "4px" }}>{reportData.totalOrders}</div>
                    <div style={{ fontSize: "14px", opacity: 0.8 }}>+12% so với tháng trước</div>
                </div>

                <div
                    style={{
                        background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                        color: "#fff",
                        padding: "24px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(82, 196, 26, 0.3)",
                    }}
                >
                    <div style={{ fontSize: "16px", opacity: 0.9, marginBottom: "8px" }}>Doanh thu</div>
                    <div style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>
                        {formatCurrency(reportData.totalRevenue)}
                    </div>
                    <div style={{ fontSize: "14px", opacity: 0.8 }}>+8% so với tháng trước</div>
                </div>

                <div
                    style={{
                        background: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
                        color: "#fff",
                        padding: "24px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                    }}
                >
                    <div style={{ fontSize: "16px", opacity: 0.9, marginBottom: "8px" }}>Tỷ lệ đúng hạn</div>
                    <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "4px" }}>{reportData.onTimeRate}%</div>
                    <div style={{ fontSize: "14px", opacity: 0.8 }}>Mục tiêu: ≥95%</div>
                </div>

                <div
                    style={{
                        background: "linear-gradient(135deg, #faad14 0%, #ffc53d 100%)",
                        color: "#fff",
                        padding: "24px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(250, 173, 20, 0.3)",
                    }}
                >
                    <div style={{ fontSize: "16px", opacity: 0.9, marginBottom: "8px" }}>Hài lòng KH</div>
                    <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "4px" }}>
                        {reportData.customerSatisfaction}/5
                    </div>
                    <div style={{ fontSize: "14px", opacity: 0.8 }}>
                        {"⭐".repeat(Math.floor(reportData.customerSatisfaction))}
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "32px" }}>
                {/* Biểu đồ xu hướng */}
                <div
                    style={{
                        background: "#fff",
                        padding: "24px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        border: "1px solid #f0f0f0",
                    }}
                >
                    <h3 style={{ margin: "0 0 20px 0", color: "#722ed1" }}>Xu hướng 12 tháng</h3>
                    <div style={{ height: "250px", display: "flex", alignItems: "end", gap: "4px", padding: "0 8px" }}>
                        {chartData.map((month, index) => (
                            <div key={index} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div
                                    style={{
                                        width: "100%",
                                        height: `${(month.orders / 50) * 200}px`,
                                        background: "linear-gradient(to top, #722ed1, #9254de)",
                                        borderRadius: "4px 4px 0 0",
                                        marginBottom: "8px",
                                        position: "relative",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "-20px",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            fontSize: "10px",
                                            fontWeight: "600",
                                            color: "#722ed1",
                                        }}
                                    >
                                        {month.orders}
                                    </div>
                                </div>
                                <div style={{ fontSize: "12px", color: "#666", textAlign: "center" }}>{month.month}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>Số đơn hàng theo tháng</div>
                </div>

                {/* Phân bố loại xét nghiệm */}
                <div
                    style={{
                        background: "#fff",
                        padding: "24px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        border: "1px solid #f0f0f0",
                    }}
                >
                    <h3 style={{ margin: "0 0 20px 0", color: "#722ed1" }}>Phân bố dịch vụ</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {serviceDistribution.map((service, index) => (
                            <div key={index}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                    <span style={{ fontSize: "14px", fontWeight: "600" }}>{service.name}</span>
                                    <span style={{ fontSize: "14px", color: "#666" }}>{service.value}%</span>
                                </div>
                                <div
                                    style={{
                                        width: "100%",
                                        height: "8px",
                                        background: "#f0f0f0",
                                        borderRadius: "4px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${service.value}%`,
                                            height: "100%",
                                            background: service.color,
                                            borderRadius: "4px",
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bảng hiệu suất nhân viên */}
            <div
                style={{
                    background: "#fff",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "1px solid #f0f0f0",
                }}
            >
                <h3 style={{ margin: "0 0 20px 0", color: "#722ed1" }}>Hiệu suất nhân viên</h3>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f9f9f9" }}>
                                <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e8e8e8" }}>Nhân viên</th>
                                <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e8e8e8" }}>Hoàn thành</th>
                                <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e8e8e8" }}>Đúng hạn</th>
                                <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e8e8e8" }}>Đánh giá</th>
                                <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e8e8e8" }}>Hiệu suất</th>
                                <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #e8e8e8" }}>Xếp hạng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffPerformance.map((staff, index) => (
                                <tr key={index}>
                                    <td style={{ padding: "12px", borderBottom: "1px solid #f0f0f0" }}>
                                        <div style={{ fontWeight: "600" }}>{staff.name}</div>
                                    </td>
                                    <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                                        {staff.completed}
                                    </td>
                                    <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                                        <span style={{ color: staff.onTime >= staff.completed * 0.9 ? "#52c41a" : "#ff4d4f" }}>
                                            {staff.onTime}
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                                            <span>{staff.rating}</span>
                                            <span style={{ color: "#faad14" }}>⭐</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                                        <span
                                            style={{
                                                padding: "4px 8px",
                                                borderRadius: "12px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                background: staff.efficiency >= 95 ? "#f6ffed" : staff.efficiency >= 90 ? "#fff7e6" : "#fff2f0",
                                                color: staff.efficiency >= 95 ? "#52c41a" : staff.efficiency >= 90 ? "#faad14" : "#ff4d4f",
                                            }}
                                        >
                                            {staff.efficiency}%
                                        </span>
                                    </td>
                                    <td style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
                                        <span
                                            style={{
                                                padding: "4px 8px",
                                                borderRadius: "12px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                background: index === 0 ? "#fff7e6" : index === 1 ? "#f6ffed" : "#f0f5ff",
                                                color: index === 0 ? "#faad14" : index === 1 ? "#52c41a" : "#1890ff",
                                            }}
                                        >
                                            #{index + 1}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ManagerReports
