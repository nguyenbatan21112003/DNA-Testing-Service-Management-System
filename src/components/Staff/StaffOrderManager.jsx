"use client"

import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Layout, Menu, Modal, message } from "antd"
import {
    DashboardOutlined,
    ExperimentOutlined,
    CustomerServiceOutlined,
    MessageOutlined,
    HomeOutlined,
    BankOutlined,
    FileTextOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from "@ant-design/icons"
import "antd/dist/reset.css"
import StaffDashboard from "./StaffDashboard"

const { Sider, Content } = Layout

const menuItems = [
    {
        key: "dashboard",
        icon: <DashboardOutlined />,
        label: "Tổng quan",
    },
    {
        key: "testing-results",
        icon: <ExperimentOutlined />,
        label: "Xét nghiệm & Kết quả",
    },
    {
        key: "consultation",
        icon: <CustomerServiceOutlined />,
        label: "Yêu cầu tư vấn",
    },
    {
        key: "feedback",
        icon: <MessageOutlined />,
        label: "Phản hồi khách hàng",
    },
    {
        key: "home-sampling",
        icon: <HomeOutlined />,
        label: "Thu mẫu tại nhà",
    },
    {
        key: "center-sampling",
        icon: <BankOutlined />,
        label: "Thu mẫu tại cơ sở",
    },
    {
        key: "order-management",
        icon: <FileTextOutlined />,
        label: "Quản lý đơn hàng",
    },
    {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
    },
]

const StaffOrderManager = () => {
    const { user, logout } = useContext(AuthContext)
    const [logoutModal, setLogoutModal] = useState(false)
    const [activeTab, setActiveTab] = useState("dashboard")
    const [collapsed, setCollapsed] = useState(false)

    const navigate = useNavigate()

    // Tạo tài khoản Staff tạm thời cho testing
    useEffect(() => {
        // Kiểm tra nếu chưa có user hoặc user không phải staff
        if (!user || user.role_id !== 2) {
            // Tạo tài khoản Staff tạm thời
            const tempStaffAccount = {
                user_id: 2,
                name: "Nhân viên DNA Lab",
                email: "staff@dnalab.com",
                phone: "0987654321",
                password: "password123",
                role_id: 2,
                avatar: null,
            }

            // Lưu vào localStorage để giả lập đăng nhập
            localStorage.setItem("dna_user", JSON.stringify(tempStaffAccount))

            // Tạo một số đơn hàng mẫu nếu chưa có
            const existingOrders = localStorage.getItem("dna_orders")
            if (!existingOrders) {
                const sampleOrders = [
                    // Đơn hàng xét nghiệm huyết thống cha con
                    {
                        id: 1001,
                        name: "Trần Thị C",
                        email: "tran.thic@gmail.com",
                        phone: "0912345678",
                        address: "99 Cống Hòa, P.4, Tân Bình, HCM",
                        type: "Xét nghiệm huyết thống cha con",
                        sampleMethod: "home",
                        status: "Đang xử lý",
                        priority: "Cao",
                        date: "05/01/2024",
                        kitId: "KIT-PC-1001",
                        kitStatus: "da_nhan",
                        scheduledDate: "05/01/2024 09:30",
                        samplerName: "Trần Trung Tâm",
                        notes: "Khách hàng yêu cầu kết quả gấp, cần xử lý trong 3 ngày",
                        sampleInfo: {
                            location: "132 Hoàng Văn Thụ, phường Phương Sài, Nha Trang",
                            donors: [
                                {
                                    name: "Nguyễn Văn A",
                                    dob: "01/01/1977",
                                    idType: "PASSPORT",
                                    idNumber: "B5556668",
                                    idIssueDate: "01/01/2015",
                                    idExpiry: "01/01/2025",
                                    idIssuePlace: "Cục QL XNC",
                                    nationality: "Việt Nam",
                                    address: "112 Trung Kính, Cầu Giấy, Hà Nội",
                                    sampleType: "Máu",
                                    sampleQuantity: "01",
                                    relationship: "Bố GĐ",
                                    healthIssues: "không",
                                },
                                {
                                    name: "Nguyễn Văn B",
                                    dob: "12/12/2023",
                                    idType: "Giấy Chứng Sinh",
                                    idNumber: "468/2022",
                                    idIssueDate: "13/12/2022",
                                    idIssuePlace: "BV ĐHYD HCM",
                                    nationality: "Việt Nam",
                                    sampleType: "Niêm Mạc Miệng",
                                    sampleQuantity: "02 que",
                                    relationship: "Con GĐ",
                                    healthIssues: "không",
                                },
                            ],
                            collector: "Trần Trung Tâm",
                            collectionDate: "05/01/2024",
                        },
                        result:
                            "Kết quả xét nghiệm ADN cho thấy xác suất quan hệ huyết thống cha-con giữa Nguyễn Văn A và Nguyễn Văn B là 99.9999%. Dựa trên kết quả phân tích 23 vị trí STR, không loại trừ mối quan hệ cha-con giữa hai người.",
                        testingMethod: "STR",
                        testingNotes: "Mẫu đạt chất lượng tốt, đủ điều kiện phân tích.",
                        completedDate: "08/01/2024",
                    },
                    // Đơn hàng xét nghiệm huyết thống anh chị em
                    {
                        id: 1002,
                        name: "Lê Văn Đức",
                        email: "duc.le@gmail.com",
                        phone: "0987654321",
                        address: "25 Nguyễn Thị Minh Khai, Q.1, TP.HCM",
                        type: "Xét nghiệm huyết thống anh chị em",
                        sampleMethod: "center",
                        status: "Hoàn thành",
                        priority: "Trung bình",
                        date: "02/01/2024",
                        appointmentDate: "03/01/2024",
                        appointmentStatus: "da_den",
                        timeSlot: "10:00-11:00",
                        staffAssigned: "Nguyễn Thị Lan",
                        result:
                            "Kết quả xét nghiệm ADN cho thấy xác suất quan hệ huyết thống anh chị em ruột là 99.73%. Phân tích 23 vị trí STR cho thấy mối quan hệ anh chị em ruột là rất có khả năng.",
                        testingMethod: "STR",
                        testingNotes: "Mẫu đạt chất lượng tốt.",
                        completedDate: "05/01/2024",
                    },
                    // Đơn hàng xét nghiệm di truyền
                    {
                        id: 1003,
                        name: "Hoàng Văn Nam",
                        email: "nam.hoang@gmail.com",
                        phone: "0977123456",
                        address: "56 Lê Lợi, Hải Châu, Đà Nẵng",
                        type: "Xét nghiệm di truyền bệnh lý",
                        sampleMethod: "home",
                        status: "Chờ xử lý",
                        priority: "Cao",
                        date: "06/01/2024",
                        kitId: "KIT-DT-1003",
                        kitStatus: "da_gui",
                        scheduledDate: "10/01/2024 14:00",
                        samplerName: "Phạm Văn Đức",
                    },
                    // Đơn hàng xét nghiệm huyết thống cha mẹ con
                    {
                        id: 1004,
                        name: "Phạm Thị Hương",
                        email: "huong.pham@gmail.com",
                        phone: "0909876543",
                        address: "78 Trần Phú, Nha Trang, Khánh Hòa",
                        type: "Xét nghiệm huyết thống cha mẹ con",
                        sampleMethod: "center",
                        status: "Đang xử lý",
                        priority: "Trung bình",
                        date: "04/01/2024",
                        appointmentDate: "09/01/2024",
                        appointmentStatus: "da_hen",
                        timeSlot: "09:00-10:00",
                        staffAssigned: "Lê Thị Hoa",
                    },
                    // Đơn hàng xét nghiệm huyết thống cha con
                    {
                        id: 1005,
                        name: "Nguyễn Thị Mai",
                        email: "mai.nguyen@gmail.com",
                        phone: "0918765432",
                        address: "45 Nguyễn Huệ, Q.1, TP.HCM",
                        type: "Xét nghiệm huyết thống cha con",
                        sampleMethod: "home",
                        status: "Chờ xử lý",
                        priority: "Thấp",
                        date: "07/01/2024",
                        kitId: "KIT-PC-1005",
                        kitStatus: "chua_gui",
                    },
                ]
                localStorage.setItem("dna_orders", JSON.stringify(sampleOrders))
            }

            // Reload trang để cập nhật context
            window.location.reload()
            return
        }
    }, [user, navigate])

    // Kiểm tra quyền truy cập
    useEffect(() => {
        // Kiểm tra nếu user không phải là staff (role_id = 2)
        if (user && user.role_id !== 2) {
            message.error("Bạn không có quyền truy cập trang này!")
            navigate("/", { replace: true })
            return
        }
    }, [user, navigate])

    const handleMenuClick = (e) => {
        setActiveTab(e.key)
        if (e.key === "logout") {
            setLogoutModal(true)
        }
    }

    const confirmLogout = () => {
        logout()
        setLogoutModal(false)
        navigate("/", { replace: true })
    }

    const cancelLogout = () => {
        setLogoutModal(false)
    }

    const renderContent = () => {
        return <StaffDashboard activeTab={activeTab} />
    }

    return (
        <Layout style={{ minHeight: "100vh", height: "100vh", overflow: "hidden" }}>
            <Sider
                width={220}
                style={{ background: "#fff", position: "relative" }}
                collapsible
                collapsed={collapsed}
                trigger={null}
            >
                <span
                    style={{
                        position: "absolute",
                        top: 18,
                        right: -24,
                        background: "#00a67e",
                        borderRadius: 12,
                        width: 48,
                        height: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 100,
                        color: "#fff",
                        fontSize: 28,
                        boxShadow: "0 2px 8px #00a67e55",
                        border: "2px solid #fff",
                        transition: "right 0.2s",
                    }}
                    onClick={(e) => {
                        e.stopPropagation()
                        setCollapsed((c) => !c)
                    }}
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </span>

                <div
                    style={{
                        height: 64,
                        margin: 16,
                        fontWeight: 700,
                        fontSize: 22,
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: collapsed ? "center" : "flex-start",
                        gap: 8,
                        cursor: "pointer",
                        userSelect: "none",
                    }}
                    onClick={() => navigate("/")}
                >
                    <span style={{ fontSize: 28 }}>🧬</span>
                    {!collapsed && <span style={{ color: "#00a67e", fontWeight: 800 }}>DNA Lab</span>}
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[activeTab]}
                    style={{
                        height: "calc(100vh - 112px)",
                        borderRight: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        paddingTop: 12,
                        paddingBottom: 12,
                    }}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>

            <Layout style={{ height: "100vh" }}>
                <div
                    style={{
                        width: "100%",
                        height: 48,
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        padding: "0 32px",
                        borderBottom: "1px solid #f0f0f0",
                        fontWeight: 600,
                        fontSize: 16,
                        color: "#009e74",
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                        gap: 16,
                    }}
                >
                    {user && (
                        <>
                            {user.avatar || user.image ? (
                                <img
                                    src={user.avatar || user.image}
                                    alt="avatar"
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        marginRight: 10,
                                        border: "2px solid #00a67e",
                                        background: "#e6f7f1",
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        background: "#e6f7f1",
                                        color: "#00a67e",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 700,
                                        fontSize: 18,
                                        marginRight: 10,
                                        border: "2px solid #00a67e",
                                    }}
                                >
                                    {(user.name || user.fullName || user.email || "S").charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span>Xin chào, {user.name || user.fullName || user.email}</span>
                        </>
                    )}
                </div>

                <Content
                    style={{
                        margin: 0,
                        background: "#f5f5f5",
                        minHeight: 0,
                        height: "calc(100vh - 48px)",
                        overflow: "auto",
                    }}
                >
                    {renderContent()}
                </Content>
            </Layout>

            <Modal
                open={logoutModal}
                onOk={confirmLogout}
                onCancel={cancelLogout}
                okText="Đăng xuất"
                cancelText="Hủy"
                okButtonProps={{ className: "custom-logout-btn" }}
                title="Xác nhận đăng xuất"
            >
                <p>Bạn có chắc muốn đăng xuất không?</p>
            </Modal>
        </Layout>
    )
}

export default StaffOrderManager
