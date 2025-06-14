"use client"

import { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Layout, Menu, Modal, message, Button } from "antd"
import {
    DashboardOutlined,
    SafetyCertificateOutlined,
    BarChartOutlined,
    MessageOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from "@ant-design/icons"
import "antd/dist/reset.css"

// Import các component con
import ManagerOverview from "./ManagerOverview"
import TestResultVerification from "./TestResultVerification"
import ManagerReports from "./ManagerReports"
import CustomerFeedbackManager from "./CustomerFeedbackManager"

const { Sider, Content } = Layout

const menuItems = [
    {
        key: "overview",
        icon: <DashboardOutlined />,
        label: "Tổng quan",
    },
    {
        key: "verification",
        icon: <SafetyCertificateOutlined />,
        label: "Xác thực kết quả",
    },
    {
        key: "reports",
        icon: <BarChartOutlined />,
        label: "Báo cáo",
    },
    {
        key: "feedback",
        icon: <MessageOutlined />,
        label: "Phản hồi khách hàng",
    },
]

const ManagerDashboard = () => {
    const { user, logout } = useContext(AuthContext)
    const [logoutModal, setLogoutModal] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")
    const [collapsed, setCollapsed] = useState(false)
    const [loading, setLoading] = useState(true)
    const [unauthorized, setUnauthorized] = useState(false)

    const navigate = useNavigate()



    // Kiểm tra quyền truy cập
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)

            if (!user) {
                message.error("Vui lòng đăng nhập để truy cập trang này!")
                setUnauthorized(true)
                navigate("/", { replace: true })
                return
            }

            if (user.role_id !== 4) {
                message.error("Bạn không có quyền truy cập trang này!")
                setUnauthorized(true)
                navigate("/", { replace: true })
                return
            }
        }, 1000)

        return () => clearTimeout(timer)
    }, [user, navigate])

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    flexDirection: "column",
                    background: "#f5f5f5",
                }}
            >
                <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: "#722ed1" }}>
                    Đang tải Dashboard Manager...
                </div>
                <div style={{ fontSize: 16, color: "#666" }}>Vui lòng đợi trong giây lát</div>
            </div>
        )
    }

    if (unauthorized) {
        return null
    }

    const handleMenuClick = (e) => {
        if (e.key === "logout") {
            setLogoutModal(true)
        } else {
            setActiveTab(e.key)
        }
    }

    const confirmLogout = () => {
        logout()
        setLogoutModal(false)
        navigate("/")
    }

    const cancelLogout = () => {
        setLogoutModal(false)
    }

    const handleLogout = () => {
        setLogoutModal(true)
    }

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return <ManagerOverview />
            case "verification":
                return <TestResultVerification />
            case "reports":
                return <ManagerReports />
            case "feedback":
                return <CustomerFeedbackManager />
            default:
                return <ManagerOverview />
        }
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
                        background: "#722ed1",
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
                        boxShadow: "0 2px 8px #722ed155",
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
                    {!collapsed && <span style={{ color: "#722ed1", fontWeight: 800 }}>DNA LAB</span>}
                </div>

                <Menu
                    mode="inline"
                    selectedKeys={[activeTab]}
                    style={{
                        height: "calc(100vh - 200px)",
                        borderRight: 0,
                        paddingTop: 12,
                    }}
                    items={menuItems}
                    onClick={handleMenuClick}
                />

                {/* Nút Đăng xuất */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 16,
                        left: 16,
                        right: 16,
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 16,
                    }}
                >
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            textAlign: "left",
                            color: "#ff4d4f",
                            fontWeight: 500,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: collapsed ? "center" : "flex-start",
                        }}
                    >
                        {!collapsed && "Đăng xuất"}
                    </Button>
                </div>
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
                        color: "#722ed1",
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
                                        border: "2px solid #722ed1",
                                        background: "#f9f0ff",
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        background: "#f9f0ff",
                                        color: "#722ed1",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 700,
                                        fontSize: 18,
                                        marginRight: 10,
                                        border: "2px solid #722ed1",
                                    }}
                                >
                                    {(user.name || user.fullName || user.email || "M").charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span>Xin chào, {user.name || user.fullName || user.email} (Manager)</span>
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
                okButtonProps={{
                    style: {
                        backgroundColor: "#ff4d4f",
                        borderColor: "#ff4d4f",
                        color: "white",
                    },
                }}
                title="Xác nhận đăng xuất"
            >
                <p>Bạn có chắc muốn đăng xuất không?</p>
            </Modal>
        </Layout>
    )
}

export default ManagerDashboard
