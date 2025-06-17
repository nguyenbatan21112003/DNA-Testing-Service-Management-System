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
            {/* Tabs */}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "24px",
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: "16px",
                    flexWrap: "wrap",
                }}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: "10px 16px",
                            border: "none",
                            borderRadius: "8px",
                            background: activeTab === tab.key ? "#722ed1" : "#f5f5f5",
                            color: activeTab === tab.key ? "#fff" : "#666",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.2s ease",
                            fontSize: "14px",
                        }}
                    >
                        {tab.label}
                        <span
                            style={{
                                background: activeTab === tab.key ? "rgba(255,255,255,0.2)" : "#ddd",
                                color: activeTab === tab.key ? "#fff" : "#666",
                                padding: "2px 6px",
                                borderRadius: "10px",
                                fontSize: "12px",
                                fontWeight: "700",
                            }}
                        >
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>
            {/* Feedbacks List */}
            <div style={{ display: "grid", gap: "16px" }}>
                {getFilteredFeedbacks().map((feedback) => (
                    <div
                        key={feedback.id}
                        style={{
                            background: "#fff",
                            padding: "24px",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            border: "1px solid #f0f0f0",
                            borderLeft: `4px solid ${getPriorityColor(feedback.priority)}`,
                        }}
                    >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "start" }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                    <h3 style={{ margin: 0, color: "#722ed1", fontSize: "18px" }}>{feedback.customerName}</h3>
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        {"⭐".repeat(feedback.rating)}
                                        <span
                                            style={{
                                                marginLeft: "8px",
                                                color: getRatingColor(feedback.rating),
                                                fontWeight: "600",
                                            }}
                                        >
                                            {feedback.rating}/5
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            padding: "4px 12px",
                                            borderRadius: "16px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            background:
                                                feedback.priority === "Cao"
                                                    ? "#fff2f0"
                                                    : feedback.priority === "Trung bình"
                                                        ? "#fff7e6"
                                                        : "#f6ffed",
                                            color: getPriorityColor(feedback.priority),
                                        }}
                                    >
                                        {feedback.priority}
                                    </span>
                                    <span
                                        style={{
                                            padding: "4px 12px",
                                            borderRadius: "16px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            background:
                                                feedback.category === "Khiếu nại"
                                                    ? "#fff2f0"
                                                    : feedback.category === "Khen ngợi"
                                                        ? "#f6ffed"
                                                        : "#f0f5ff",
                                            color:
                                                feedback.category === "Khiếu nại"
                                                    ? "#ff4d4f"
                                                    : feedback.category === "Khen ngợi"
                                                        ? "#52c41a"
                                                        : "#1890ff",
                                        }}
                                    >
                                        {feedback.category}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                        gap: "16px",
                                        marginBottom: "16px",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Loại dịch vụ</div>
                                        <div style={{ fontWeight: "600" }}>{feedback.orderType}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Liên hệ</div>
                                        <div style={{ fontWeight: "600" }}>{feedback.phone}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Ngày phản hồi</div>
                                        <div style={{ fontWeight: "600" }}>{feedback.date}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Trạng thái</div>
                                        <span
                                            style={{
                                                padding: "4px 8px",
                                                borderRadius: "12px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                background:
                                                    feedback.status === "Đã giải quyết"
                                                        ? "#f6ffed"
                                                        : feedback.status === "Đang xử lý"
                                                            ? "#fff7e6"
                                                            : "#f0f5ff",
                                                color:
                                                    feedback.status === "Đã giải quyết"
                                                        ? "#52c41a"
                                                        : feedback.status === "Đang xử lý"
                                                            ? "#faad14"
                                                            : "#1890ff",
                                            }}
                                        >
                                            {feedback.status}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ marginBottom: "16px" }}>
                                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>Nội dung phản hồi</div>
                                    <div
                                        style={{
                                            padding: "12px",
                                            background: "#f9f9f9",
                                            borderRadius: "8px",
                                            border: "1px solid #e8e8e8",
                                            fontSize: "14px",
                                            lineHeight: "1.5",
                                        }}
                                    >
                                        {feedback.comment}
                                    </div>
                                </div>

                                {feedback.response && (
                                    <div style={{ marginBottom: "16px" }}>
                                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>Phản hồi của chúng tôi</div>
                                        <div
                                            style={{
                                                padding: "12px",
                                                background: "#f0f5ff",
                                                borderRadius: "8px",
                                                border: "1px solid #d6e4ff",
                                                fontSize: "14px",
                                                lineHeight: "1.5",
                                            }}
                                        >
                                            {feedback.response}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                                            Phản hồi bởi: <strong>{feedback.responseBy}</strong> vào {feedback.responseDate}
                                        </div>
                                    </div>
                                )}

                                {feedback.actionPlan && (
                                    <div style={{ marginBottom: "16px" }}>
                                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>Kế hoạch hành động</div>
                                        <div
                                            style={{
                                                padding: "12px",
                                                background: "#fff7e6",
                                                borderRadius: "8px",
                                                border: "1px solid #ffe58f",
                                                fontSize: "14px",
                                                lineHeight: "1.5",
                                            }}
                                        >
                                            {feedback.actionPlan}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {feedback.responseStatus === "Chưa phản hồi" && (
                                    <button
                                        onClick={() => handleResponseFeedback(feedback)}
                                        style={{
                                            padding: "8px 16px",
                                            background: "#722ed1",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            fontSize: "14px",
                                        }}
                                    >
                                        💬 Phản hồi
                                    </button>
                                )}

                                <button
                                    onClick={() => window.open(`tel:${feedback.phone}`)}
                                    style={{
                                        padding: "8px 16px",
                                        background: "#52c41a",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                    }}
                                >
                                    📞 Gọi
                                </button>