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
