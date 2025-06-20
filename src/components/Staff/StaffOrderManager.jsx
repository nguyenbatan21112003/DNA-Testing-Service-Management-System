"use client"

import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { message } from "antd"
import StaffDashboard from "./StaffDashboard"

const StaffOrderManager = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Tạo tài khoản Staff tạm thời cho testing
  useEffect(() => {
    // Kiểm tra nếu chưa có user hoặc user không phải staff
    const existingOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    if ((!user || user.role_id !== 2) && existingOrders.length === 0) {
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

  // Trả về trực tiếp StaffDashboard thay vì lồng nó vào một layout khác
  return <StaffDashboard />
}

export default StaffOrderManager
