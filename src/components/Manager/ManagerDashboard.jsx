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

    // Tạo tài khoản Manager và dữ liệu mẫu tự động
    useEffect(() => {
        if (!user || user.role_id !== 4) {
            const tempManagerAccount = {
                user_id: 4,
                name: "Nguyễn Văn Quản",
                email: "manager@dnalab.com",
                phone: "0987654321",
                password: "manager123",
                role_id: 4,
                avatar: null,
            }

            localStorage.setItem("dna_user", JSON.stringify(tempManagerAccount))
            window.location.reload()
            return
        }
    }, [user])

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
        
    )
}

export default ManagerDashboard
