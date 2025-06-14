"use client"
import { Card, Row, Col, Statistic, Progress, Table, Tag, Timeline, Button } from "antd"
import { ExperimentOutlined, CheckCircleOutlined, ClockCircleOutlined, AlertOutlined } from "@ant-design/icons"

const ManagerOverview = () => {
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
