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

    // Dữ liệu đơn hàng cần xử lý gấp
    const urgentOrders = [
        {
            key: "1",
            orderId: "DNA-2024-001",
            customer: "Nguyễn Văn A",
            type: "Xét nghiệm cha con",
            deadline: "2024-01-15",
            status: "urgent",
            priority: "Cao",
        },
        {
            key: "2",
            orderId: "DNA-2024-002",
            customer: "Trần Thị B",
            type: "Xét nghiệm huyết thống",
            deadline: "2024-01-16",
            status: "processing",
            priority: "Trung bình",
        },
        {
            key: "3",
            orderId: "DNA-2024-003",
            customer: "Lê Văn C",
            type: "Xét nghiệm anh em",
            deadline: "2024-01-17",
            status: "pending",
            priority: "Cao",
        },
    ]

    const columns = [
        {
            title: "Mã đơn",
            dataIndex: "orderId",
            key: "orderId",
            render: (text) => <span style={{ fontWeight: 600, color: "#722ed1" }}>{text}</span>,
        },
        {
            title: "Khách hàng",
            dataIndex: "customer",
            key: "customer",
        },
        {
            title: "Loại xét nghiệm",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Hạn xử lý",
            dataIndex: "deadline",
            key: "deadline",
        },
        {
            title: "Ưu tiên",
            dataIndex: "priority",
            key: "priority",
            render: (priority) => (
                <Tag color={priority === "Cao" ? "red" : priority === "Trung bình" ? "orange" : "blue"}>{priority}</Tag>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const statusMap = {
                    urgent: { color: "red", text: "Khẩn cấp" },
                    processing: { color: "blue", text: "Đang xử lý" },
                    pending: { color: "orange", text: "Chờ xử lý" },
                }
                return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>
            },
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

