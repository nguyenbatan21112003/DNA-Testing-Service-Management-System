"use client"

import { useState, useEffect } from "react"

const CustomerFeedbackManager = () => {
    const [activeTab, setActiveTab] = useState("all")
    const [feedbacks, setFeedbacks] = useState([])
    const [selectedFeedback, setSelectedFeedback] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [stats, setStats] = useState({
        avgRating: 0,
        totalFeedbacks: 0,
        pending: 0,
        complaints: 0,
    })

    useEffect(() => {
        // Tạo dữ liệu phản hồi mẫu
        const sampleFeedbacks = [
            {
                id: 1,
                customerName: "Nguyễn Văn Minh",
                email: "nguyenvanminh@gmail.com",
                phone: "0123456789",
                orderType: "Xét nghiệm ADN cha con",
                rating: 5,
                comment: "Dịch vụ rất tốt, kết quả chính xác và nhanh chóng. Nhân viên tư vấn nhiệt tình.",
                status: "Mới",
                priority: "Thấp",
                date: "20/06/2024",
                category: "Khen ngợi",
                responseStatus: "Chưa phản hồi",
            },
            {
                id: 2,
                customerName: "Trần Thị Hương",
                email: "tranthihuong@gmail.com",
                phone: "0987654321",
                orderType: "Xét nghiệm huyết thống",
                rating: 2,
                comment: "Thời gian chờ kết quả quá lâu, không đúng như cam kết ban đầu. Cần cải thiện.",
                status: "Khiếu nại",
                priority: "Cao",
                date: "19/06/2024",
                category: "Khiếu nại",
                responseStatus: "Chưa phản hồi",
            },
            {
                id: 3,
                customerName: "Lê Văn Đức",
                email: "levanduc@gmail.com",
                phone: "0123987456",
                orderType: "Xét nghiệm ADN cha con",
                rating: 4,
                comment: "Kết quả chính xác, nhân viên chuyên nghiệp. Tuy nhiên giá cả hơi cao.",
                status: "Đã giải quyết",
                priority: "Trung bình",
                date: "18/06/2024",
                category: "Góp ý",
                responseStatus: "Đã phản hồi",
                response: "Cảm ơn anh đã góp ý. Chúng tôi sẽ xem xét điều chỉnh giá cả phù hợp hơn.",
                responseDate: "19/06/2024",
                responseBy: "Trần Văn Quản",
            },
            {
                id: 4,
                customerName: "Phạm Thị Mai",
                email: "phamthimai@gmail.com",
                phone: "0369852147",
                orderType: "Xét nghiệm ADN anh em",
                rating: 1,
                comment: "Rất không hài lòng! Nhân viên lấy mẫu không chuyên nghiệp, thái độ không tốt.",
                status: "Khiếu nại",
                priority: "Cao",
                date: "17/06/2024",
                category: "Khiếu nại",
                responseStatus: "Đang xử lý",
                actionPlan: "Đã liên hệ khách hàng để xin lỗi và sắp xếp lấy mẫu lại miễn phí",
            },
            {
                id: 5,
                customerName: "Hoàng Văn Nam",
                email: "hoangvannam@gmail.com",
                phone: "0741852963",
                orderType: "Xét nghiệm huyết thống",
                rating: 5,
                comment: "Excellent service! Very professional staff and accurate results.",
                status: "Đã giải quyết",
                priority: "Thấp",
                date: "16/06/2024",
                category: "Khen ngợi",
                responseStatus: "Đã phản hồi",
                response: "Thank you for your positive feedback! We appreciate your trust in our services.",
                responseDate: "17/06/2024",
                responseBy: "Trần Văn Quản",
            },
        ]

        setFeedbacks(sampleFeedbacks)
        // Tính toán thống kê
        const totalFeedbacks = sampleFeedbacks.length
        const avgRating = sampleFeedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks
        const pending = sampleFeedbacks.filter((f) => f.responseStatus === "Chưa phản hồi").length
        const complaints = sampleFeedbacks.filter((f) => f.category === "Khiếu nại").length

        setStats({
            avgRating: avgRating.toFixed(1),
            totalFeedbacks,
            pending,
            complaints,
        })
    }, [])

    const tabs = [
        { key: "all", label: "Tất cả", count: feedbacks.length },
        { key: "new", label: "Mới", count: feedbacks.filter((f) => f.status === "Mới").length },
        { key: "processing", label: "Đang xử lý", count: feedbacks.filter((f) => f.status === "Đang xử lý").length },
        { key: "resolved", label: "Đã giải quyết", count: feedbacks.filter((f) => f.status === "Đã giải quyết").length },
        { key: "complaints", label: "Khiếu nại", count: feedbacks.filter((f) => f.category === "Khiếu nại").length },
        { key: "high-priority", label: "Ưu tiên cao", count: feedbacks.filter((f) => f.priority === "Cao").length },
    ]

    const getFilteredFeedbacks = () => {
        switch (activeTab) {
            case "new":
                return feedbacks.filter((f) => f.status === "Mới")
            case "processing":
                return feedbacks.filter((f) => f.status === "Đang xử lý")
            case "resolved":
                return feedbacks.filter((f) => f.status === "Đã giải quyết")
            case "complaints":
                return feedbacks.filter((f) => f.category === "Khiếu nại")
            case "high-priority":
                return feedbacks.filter((f) => f.priority === "Cao")
            default:
                return feedbacks
        }
    }
    const handleResponseFeedback = (feedback) => {
        setSelectedFeedback(feedback)
        setShowModal(true)
    }

    const handleSubmitResponse = (responseData) => {
        const updatedFeedbacks = feedbacks.map((feedback) => {
            if (feedback.id === selectedFeedback.id) {
                return {
                    ...feedback,
                    status: responseData.status,
                    responseStatus: "Đã phản hồi",
                    response: responseData.response,
                    responseDate: new Date().toLocaleDateString("vi-VN"),
                    responseBy: "Trần Văn Quản",
                    actionPlan: responseData.actionPlan,
                    contactMethod: responseData.contactMethod,
                }
            }
            return feedback
        })

        setFeedbacks(updatedFeedbacks)
        setShowModal(false)
        setSelectedFeedback(null)
    }

    const getRatingColor = (rating) => {
        if (rating >= 4) return "#52c41a"
        if (rating >= 3) return "#faad14"
        return "#ff4d4f"
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "Cao":
                return "#ff4d4f"
            case "Trung bình":
                return "#faad14"
            case "Thấp":
                return "#52c41a"
            default:
                return "#666"
        }
    }

    return (
        <div style={{ padding: "0" }}>
            {/* Header */}
            <div style={{ marginBottom: "24px", textAlign: "center" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#722ed1", margin: 0 }}>
                    Quản lý phản hồi khách hàng
                </h1>
                <p style={{ color: "#666", margin: "8px 0 0 0" }}>
                    Xem, phân loại và phản hồi đánh giá, khiếu nại của khách hàng
                </p>
            </div>
            {/* Stats Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                    marginBottom: "32px",
                }}
            >
                <div
                    style={{
                        background: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
                        color: "#fff",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(114, 46, 209, 0.3)",
                    }}
                >
                    <div style={{ fontSize: "16px", opacity: 0.9, marginBottom: "8px" }}>⭐ Đánh giá TB</div>
                    <div style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>{stats.avgRating}/5</div>
                    <div style={{ fontSize: "14px", opacity: 0.8 }}>{"⭐".repeat(Math.floor(stats.avgRating))}</div>
                </div>

                <div
                    style={{
                        background: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
                        color: "#fff",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                    }}
                >
                    <div style={{ fontSize: "16px", opacity: 0.9, marginBottom: "8px" }}>📝 Tổng phản hồi</div>
                    <div style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>{stats.totalFeedbacks}</div>
                    <div style={{ fontSize: "14px", opacity: 0.8 }}>Tháng này</div>
                </div>

                <div
                    style={{
                        background: "linear-gradient(135deg, #faad14 0%, #ffc53d 100%)",
                        color: "#fff",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(250, 173, 20, 0.3)",
                    }}
                >
                    <div style={{ fontSize: "16px", opacity: 0.9, marginBottom: "8px" }}>⏳ Chưa xử lý</div>
                    <div style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>{stats.pending}</div>
                    <div style={{ fontSize: "14px", opacity: 0.8 }}>Cần phản hồi</div>
                </div>

                <div
                    style={{
                        background: "linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)",
                        color: "#fff",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(255, 77, 79, 0.3)",
                    }}
                >
                    <div style={{ fontSize: "16px", opacity: 0.9, marginBottom: "8px" }}>🚨 Khiếu nại</div>
                    <div style={{ fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>{stats.complaints}</div>
                    <div style={{ fontSize: "14px", opacity: 0.8 }}>Cần ưu tiên</div>
                </div>
            </div>
