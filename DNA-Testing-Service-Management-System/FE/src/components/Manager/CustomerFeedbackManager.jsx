"use client"

import { useState, useEffect } from "react"
import { useOrderContext } from "../../context/OrderContext"

const CustomerFeedbackManager = () => {
    const { getAllOrders, updateOrder } = useOrderContext()
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

    // Hàm load feedbacks từ các đơn hàng (giống Staff)
    const loadFeedbacks = () => {
        const allOrders = getAllOrders()
        const allFeedbacks = []
        allOrders.forEach((order) => {
            if (order.feedbacks && order.feedbacks.length > 0) {
                order.feedbacks.forEach((feedback, index) => {
                    allFeedbacks.push({
                        id: `${order.id}-${index}`,
                        orderId: order.id,
                        customerName: feedback.user,
                        email: feedback.email,
                        phone: order.phone,
                        orderType: order.type,
                        rating: feedback.rating,
                        comment: feedback.feedback,
                        date: feedback.date,
                        status: feedback.status || "Chưa phản hồi",
                        category: feedback.category || "Tổng thể",
                        response: feedback.response || "",
                        responseDate: feedback.responseDate || "",
                        responseBy: feedback.responseBy || "",
                        actionPlan: feedback.actionPlan || "",
                        responseStatus: feedback.response ? "Đã phản hồi" : "Chưa phản hồi",
                    })
                })
            }
        })
        // Sắp xếp mới nhất lên đầu
        allFeedbacks.sort((a, b) => {
            const dateA = new Date(a.date.split("/").reverse().join("-"))
            const dateB = new Date(b.date.split("/").reverse().join("-"))
            return dateB - dateA
        })
        setFeedbacks(allFeedbacks)
        // Tính toán thống kê
        const totalFeedbacks = allFeedbacks.length
        const avgRating = totalFeedbacks > 0 ? (allFeedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / totalFeedbacks).toFixed(1) : 0
        const pending = allFeedbacks.filter((f) => f.responseStatus === "Chưa phản hồi").length
        const complaints = allFeedbacks.filter((f) => f.category === "Khiếu nại").length
        setStats({
            avgRating,
            totalFeedbacks,
            pending,
            complaints,
        })
    }

    useEffect(() => {
        loadFeedbacks()
        // Lắng nghe sự kiện storage để tự động reload dữ liệu khi localStorage thay đổi
        const handleStorageChange = (event) => {
            if (event.key === "dna_orders") {
                loadFeedbacks(); // Chỉ reload dữ liệu thay vì reload cả trang
            }
        };
        window.addEventListener("storage", handleStorageChange)
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [])

    // Khi Manager phản hồi, cập nhật lại feedback trong đơn hàng (localStorage)
    const handleSubmitResponse = (responseData) => {
        if (!selectedFeedback) return
        // Lấy tất cả đơn hàng
        const allOrders = getAllOrders()
        // Tìm đơn hàng chứa feedback này
        const orderIdx = allOrders.findIndex(o => o.id === selectedFeedback.orderId)
        if (orderIdx === -1) return
        const order = allOrders[orderIdx]
        // Tìm feedback trong đơn hàng
        const fbIdx = order.feedbacks.findIndex((fb, idx) => `${order.id}-${idx}` === selectedFeedback.id)
        if (fbIdx === -1) return
        // Cập nhật nội dung phản hồi
        order.feedbacks[fbIdx] = {
            ...order.feedbacks[fbIdx],
            response: responseData.response,
            responseDate: new Date().toLocaleDateString("vi-VN"),
            responseBy: "Manager",
            actionPlan: responseData.actionPlan,
            status: responseData.status,
        }
        // Lưu lại đơn hàng
        updateOrder(order.id, order)
        setShowModal(false)
        setSelectedFeedback(null)
        setTimeout(loadFeedbacks, 300) // reload lại feedbacks
    }

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
                                    onClick={() => window.open(`mailto:${feedback.email}`)}
                                    style={{
                                        padding: "8px 16px",
                                        background: "#1890ff",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                    }}
                                >
                                    📧 Email
                                </button>

                                {feedback.responseStatus === "Đã phản hồi" && (
                                    <div
                                        style={{
                                            padding: "8px 12px",
                                            background: "#f6ffed",
                                            color: "#52c41a",
                                            borderRadius: "6px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            textAlign: "center",
                                        }}
                                    >
                                        ✅ Đã xử lý
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {getFilteredFeedbacks().length === 0 && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        color: "#666",
                    }}
                >
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
                    <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Không có phản hồi nào</div>
                    <div style={{ fontSize: "14px" }}>Chưa có phản hồi nào trong danh mục này</div>
                </div>
            )}

            {/* Response Modal */}
            {showModal && selectedFeedback && (
                <ResponseModal
                    feedback={selectedFeedback}
                    onSubmit={handleSubmitResponse}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    )
}

const ResponseModal = ({ feedback, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        response: "",
        actionPlan: "",
        contactMethod: "email",
        status: "Đã giải quyết",
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "32px",
                    borderRadius: "12px",
                    width: "90%",
                    maxWidth: "700px",
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
            >
                <h2 style={{ margin: "0 0 24px 0", color: "#722ed1" }}>💬 Phản hồi khách hàng</h2>

                <div style={{ marginBottom: "20px", padding: "16px", background: "#f9f9f9", borderRadius: "8px" }}>
                    <div style={{ fontWeight: "600", marginBottom: "8px" }}>{feedback.customerName}</div>
                    <div style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}>{feedback.orderType}</div>
                    <div style={{ fontSize: "14px", fontStyle: "italic" }}>"{feedback.comment}"</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Nội dung phản hồi *</label>
                        <textarea
                            value={formData.response}
                            onChange={(e) => setFormData((prev) => ({ ...prev, response: e.target.value }))}
                            placeholder="Nhập nội dung phản hồi cho khách hàng..."
                            style={{
                                width: "100%",
                                minHeight: "120px",
                                padding: "12px",
                                border: "1px solid #d9d9d9",
                                borderRadius: "6px",
                                fontSize: "14px",
                                resize: "vertical",
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                            Kế hoạch hành động (nếu có)
                        </label>
                        <textarea
                            value={formData.actionPlan}
                            onChange={(e) => setFormData((prev) => ({ ...prev, actionPlan: e.target.value }))}
                            placeholder="Mô tả các bước cụ thể để giải quyết vấn đề..."
                            style={{
                                width: "100%",
                                minHeight: "80px",
                                padding: "12px",
                                border: "1px solid #d9d9d9",
                                borderRadius: "6px",
                                fontSize: "14px",
                                resize: "vertical",
                            }}
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Phương thức liên hệ</label>
                            <select
                                value={formData.contactMethod}
                                onChange={(e) => setFormData((prev) => ({ ...prev, contactMethod: e.target.value }))}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #d9d9d9",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                }}
                            >
                                <option value="email">📧 Email</option>
                                <option value="meeting">🤝 Gặp trực tiếp</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Trạng thái</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #d9d9d9",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                }}
                            >
                                <option value="Đã giải quyết">✅ Đã giải quyết</option>
                                <option value="Đang xử lý">⏳ Đang xử lý</option>
                                <option value="Cần theo dõi">👀 Cần theo dõi</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: "10px 20px",
                                border: "1px solid #d9d9d9",
                                background: "#fff",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: "10px 20px",
                                background: "#722ed1",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "600",
                            }}
                        >
                            Gửi phản hồi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CustomerFeedbackManager
