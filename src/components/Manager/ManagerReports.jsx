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

    useEffect(() => {
        // Tạo dữ liệu báo cáo mẫu
        const orders = JSON.parse(localStorage.getItem("dna_orders") || "[]")

        setReportData({
            totalOrders: orders.length || 156,
            totalRevenue: 2450000000, // 2.45 tỷ VNĐ
            onTimeRate: 92.3,
            customerSatisfaction: 4.7,
        })// Dữ liệu biểu đồ xu hướng 12 tháng
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
        setChartData(monthlyData)// Hiệu suất nhân viên
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
