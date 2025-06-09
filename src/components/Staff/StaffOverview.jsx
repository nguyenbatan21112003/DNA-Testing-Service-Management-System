"use client"

import { useState, useEffect } from "react"
import { Card, Row, Col, Statistic, Table, Tag, Progress, List, Avatar, Calendar, Badge } from "antd"
import {
    FileTextOutlined,
    ClockCircleOutlined,
    LoadingOutlined,
    CheckCircleOutlined,
    TrophyOutlined,
    CalendarOutlined,
    AlertOutlined,
    ExperimentOutlined,
    HomeOutlined,
    BankOutlined,
    PhoneOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"

const StaffOverview = () => {
    const [orders, setOrders] = useState([])
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        homeSampling: 0,
        centerSampling: 0,
    })
    const [recentActivities, setRecentActivities] = useState([])
    const [todayAppointments, setTodayAppointments] = useState([])
    const [urgentOrders, setUrgentOrders] = useState([])

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]")
        setOrders(savedOrders)

        // Tính toán thống kê
        const newStats = {
            total: savedOrders.length,
            pending: savedOrders.filter((order) => order.status === "Chờ xử lý").length,
            processing: savedOrders.filter((order) => order.status === "Đang xử lý").length,
            completed: savedOrders.filter((order) => order.status === "Hoàn thành").length,
            homeSampling: savedOrders.filter((order) => order.sampleMethod === "home").length,
            centerSampling: savedOrders.filter((order) => order.sampleMethod === "center").length,
        }
        setStats(newStats)

        // Lọc các đơn hàng ưu tiên cao
        const highPriorityOrders = savedOrders
            .filter((order) => order.priority === "Cao" && order.status !== "Hoàn thành")
            .slice(0, 5)
        setUrgentOrders(highPriorityOrders)

        // Lọc các cuộc hẹn hôm nay
        const today = dayjs().format("DD/MM/YYYY")
        const appointments = savedOrders
            .filter(
                (order) =>
                    (order.sampleMethod === "center" && order.appointmentDate === today) ||
                    (order.sampleMethod === "home" && order.scheduledDate && order.scheduledDate.includes(today)),
            )
            .slice(0, 5)
        setTodayAppointments(appointments)

        // Tạo hoạt động gần đây
        generateRecentActivities(savedOrders)
    }, [])

    const generateRecentActivities = (orders) => {
        const activities = []

        // Thêm hoạt động từ đơn hàng đã hoàn thành
        const completedOrders = orders.filter((order) => order.status === "Hoàn thành").slice(0, 2)
        completedOrders.forEach((order) => {
            activities.push({
                time: order.completedDate || "Gần đây",
                content: `Hoàn thành xét nghiệm cho đơn hàng #${order.id} - ${order.name}`,
                type: "success",
                icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
            })
        })

        // Thêm hoạt động từ đơn hàng đang xử lý
        const processingOrders = orders.filter((order) => order.status === "Đang xử lý").slice(0, 2)
        processingOrders.forEach((order) => {
            activities.push({
                time: order.date,
                content: `Bắt đầu xử lý đơn hàng #${order.id} - ${order.name}`,
                type: "processing",
                icon: <LoadingOutlined style={{ color: "#1890ff" }} />,
            })
        })

        // Thêm hoạt động từ đơn hàng lấy mẫu tại nhà
        const homeSamplingOrders = orders
            .filter((order) => order.sampleMethod === "home" && order.kitStatus === "da_nhan")
            .slice(0, 2)
        homeSamplingOrders.forEach((order) => {
            activities.push({
                time: order.date,
                content: `Đã nhận mẫu từ đơn hàng #${order.id} - ${order.name}`,
                type: "info",
                icon: <HomeOutlined style={{ color: "#13c2c2" }} />,
            })
        })

        // Thêm hoạt động từ đơn hàng lấy mẫu tại trung tâm
        const centerSamplingOrders = orders
            .filter((order) => order.sampleMethod === "center" && order.appointmentStatus === "da_den")
            .slice(0, 2)
        centerSamplingOrders.forEach((order) => {
            activities.push({
                time: order.appointmentDate,
                content: `Khách hàng ${order.name} đã đến lấy mẫu tại trung tâm`,
                type: "info",
                icon: <BankOutlined style={{ color: "#722ed1" }} />,
            })
        })

        // Sắp xếp hoạt động theo thời gian
        activities.sort(() => Math.random() - 0.5)
        setRecentActivities(activities.slice(0, 6))
    }

    const getListData = (value) => {
        const dateStr = value.format("DD/MM/YYYY")
        return orders.filter(
            (order) =>
                (order.sampleMethod === "center" && order.appointmentDate === dateStr) ||
                (order.sampleMethod === "home" && order.scheduledDate && order.scheduledDate.includes(dateStr)),
        )
    }

    const dateCellRender = (value) => {
        const listData = getListData(value)
        return (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {listData.slice(0, 2).map((item) => (
                    <li key={item.id}>
                        <Badge
                            status={item.priority === "Cao" ? "error" : item.priority === "Trung bình" ? "warning" : "success"}
                            text={`#${item.id} - ${item.name.substring(0, 10)}...`}
                            style={{ fontSize: 12 }}
                        />
                    </li>
                ))}
                {listData.length > 2 && (
                    <li>
                        <Badge status="default" text={`+${listData.length - 2} khác`} style={{ fontSize: 12 }} />
                    </li>
                )}
            </ul>
        )
    }

    return (
        <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}>Dashboard Nhân viên</h1>
                <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>Tổng quan hoạt động và thống kê hôm nay</p>
            </div>

            {/* Thống kê tổng quan */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng đơn hàng"
                            value={stats.total}
                            prefix={<FileTextOutlined style={{ color: "#00a67e" }} />}
                            valueStyle={{ color: "#00a67e", fontWeight: 600 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Chờ xử lý"
                            value={stats.pending}
                            prefix={<ClockCircleOutlined style={{ color: "#fa8c16" }} />}
                            valueStyle={{ color: "#fa8c16", fontWeight: 600 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Đang xử lý"
                            value={stats.processing}
                            prefix={<LoadingOutlined style={{ color: "#1890ff" }} />}
                            valueStyle={{ color: "#1890ff", fontWeight: 600 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Hoàn thành"
                            value={stats.completed}
                            prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                            valueStyle={{ color: "#52c41a", fontWeight: 600 }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Thu mẫu tại nhà"
                            value={stats.homeSampling}
                            prefix={<HomeOutlined style={{ color: "#13c2c2" }} />}
                            valueStyle={{ color: "#13c2c2", fontWeight: 600 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Thu mẫu tại trung tâm"
                            value={stats.centerSampling}
                            prefix={<BankOutlined style={{ color: "#722ed1" }} />}
                            valueStyle={{ color: "#722ed1", fontWeight: 600 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tỷ lệ hoàn thành"
                            value={stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}
                            suffix="%"
                            prefix={<TrophyOutlined style={{ color: "#eb2f96" }} />}
                            valueStyle={{ color: "#eb2f96", fontWeight: 600 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Lịch hẹn hôm nay"
                            value={todayAppointments.length}
                            prefix={<CalendarOutlined style={{ color: "#faad14" }} />}
                            valueStyle={{ color: "#faad14", fontWeight: 600 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Tiến độ công việc và Hoạt động gần đây */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title="Tiến độ công việc hôm nay" extra={<TrophyOutlined />}>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span>Đơn hàng đã xử lý</span>
                                <span>
                                    {stats.completed}/{stats.total}
                                </span>
                            </div>
                            <Progress
                                percent={stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}
                                strokeColor="#00a67e"
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span>Mẫu đã thu thập</span>
                                <span>
                                    {
                                        orders.filter(
                                            (o) =>
                                                (o.sampleMethod === "home" && o.kitStatus === "da_nhan") ||
                                                (o.sampleMethod === "center" && o.appointmentStatus === "da_den"),
                                        ).length
                                    }
                                    /{stats.total}
                                </span>
                            </div>
                            <Progress
                                percent={
                                    stats.total > 0
                                        ? Math.round(
                                            (orders.filter(
                                                (o) =>
                                                    (o.sampleMethod === "home" && o.kitStatus === "da_nhan") ||
                                                    (o.sampleMethod === "center" && o.appointmentStatus === "da_den"),
                                            ).length /
                                                stats.total) *
                                            100,
                                        )
                                        : 0
                                }
                                strokeColor="#1890ff"
                            />
                        </div>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span>Kết quả đã nhập</span>
                                <span>
                                    {orders.filter((o) => o.result).length}/{stats.total}
                                </span>
                            </div>
                            <Progress
                                percent={stats.total > 0 ? Math.round((orders.filter((o) => o.result).length / stats.total) * 100) : 0}
                                strokeColor="#52c41a"
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Hoạt động gần đây" extra={<CalendarOutlined />}>
                        <List
                            itemLayout="horizontal"
                            dataSource={recentActivities}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta avatar={<Avatar icon={item.icon} />} title={item.content} description={item.time} />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Đơn hàng ưu tiên cao và Lịch hẹn hôm nay */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title="Đơn hàng ưu tiên cao cần xử lý" extra={<AlertOutlined style={{ color: "#ff4d4f" }} />}>
                        <Table
                            columns={[
                                {
                                    title: "Mã đơn",
                                    dataIndex: "id",
                                    key: "id",
                                    render: (id) => `#${id}`,
                                },
                                {
                                    title: "Khách hàng",
                                    dataIndex: "name",
                                    key: "name",
                                },
                                {
                                    title: "Loại xét nghiệm",
                                    dataIndex: "type",
                                    key: "type",
                                    ellipsis: true,
                                },
                                {
                                    title: "Trạng thái",
                                    dataIndex: "status",
                                    key: "status",
                                    render: (status) => {
                                        let color = "default"
                                        if (status === "Chờ xử lý") color = "orange"
                                        if (status === "Đang xử lý") color = "blue"
                                        if (status === "Hoàn thành") color = "green"
                                        return <Tag color={color}>{status}</Tag>
                                    },
                                },
                            ]}
                            dataSource={urgentOrders}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            locale={{ emptyText: "Không có đơn hàng ưu tiên cao nào" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Lịch hẹn hôm nay" extra={<CalendarOutlined style={{ color: "#faad14" }} />}>
                        {todayAppointments.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={todayAppointments}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    icon={item.sampleMethod === "home" ? <HomeOutlined /> : <BankOutlined />}
                                                    style={{ backgroundColor: item.sampleMethod === "home" ? "#13c2c2" : "#722ed1" }}
                                                />
                                            }
                                            title={`#${item.id} - ${item.name}`}
                                            description={
                                                <div>
                                                    <div>
                                                        <PhoneOutlined style={{ marginRight: 4 }} /> {item.phone}
                                                    </div>
                                                    <div>
                                                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                                                        {item.scheduledDate || item.appointmentDate}
                                                        {item.timeSlot && ` (${item.timeSlot})`}
                                                    </div>
                                                    <div>
                                                        <ExperimentOutlined style={{ marginRight: 4 }} /> {item.type}
                                                    </div>
                                                </div>
                                            }
                                        />
                                        <Tag color={item.priority === "Cao" ? "red" : item.priority === "Trung bình" ? "orange" : "green"}>
                                            {item.priority}
                                        </Tag>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <div style={{ textAlign: "center", padding: "20px 0" }}>
                                <CalendarOutlined style={{ fontSize: 24, color: "#d9d9d9" }} />
                                <p style={{ marginTop: 8, color: "#999" }}>Không có lịch hẹn nào hôm nay</p>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Lịch tháng */}
            <Card title="Lịch hẹn tháng này" extra={<CalendarOutlined />}>
                <Calendar dateCellRender={dateCellRender} fullscreen={false} />
            </Card>
        </div>
    )
}

export default StaffOverview
