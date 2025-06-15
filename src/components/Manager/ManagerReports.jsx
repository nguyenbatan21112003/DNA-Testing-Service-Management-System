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
        setChartData(monthlyData)