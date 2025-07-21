import React, { useState } from "react";
// import axios from 'axios'; // Bỏ comment khi dùng backend

const inputStyle = {
  width: "100%",
  border: "1px solid #bbb",
  borderRadius: 6,
  padding: 8,
  fontSize: 16,
  marginBottom: 4,
  background: "#fff",
  outline: "none",
};
const labelStyle = {
  fontWeight: 600,
  marginBottom: 4,
  display: "block",
};

const RequestFormModal = ({ open, onClose }) => {
  const [commitChecked, setCommitChecked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  if (!open) return null;
  const handleSave = () => {
    if (!commitChecked) return;
    // Lấy dữ liệu từ form (ví dụ đơn giản, bạn nên lấy đúng giá trị từng input nếu cần)
    const form = document.querySelector("form");
    const newOrder = {
      id: "DNA" + Date.now(),
      name: form[0].value,
      gender: form[1].value,
      address: form[2].value,
      cccd: form[3].value,
      cccd_date: form[4].value,
      cccd_place: form[5].value,
      phone: form[6].value,
      email: form[7].value,
      // Có thể lấy thêm dữ liệu bảng thành viên nếu muốn
      status: "pending_staff",
      createdAt: new Date().toISOString(),
    };
    // Lưu vào localStorage (hiện tại)
    const allOrders = JSON.parse(localStorage.getItem("dna_orders") || "[]");
    localStorage.setItem(
      "dna_orders",
      JSON.stringify([newOrder, ...allOrders])
    );
    // // Khi có backend, thay bằng đoạn này dùng axios:
    /*
    axios.post('https://your-backend-api.com/orders', newOrder)
      .then(res => {
        // Xử lý khi lưu thành công, ví dụ: thông báo thành công, đóng modal, v.v.
      })
      .catch(err => {
        // Xử lý lỗi, ví dụ: thông báo lỗi cho người dùng
      });
    */
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.18)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          minWidth: 600,
          maxWidth: 1000,
          maxHeight: "90vh",
          padding: 32,
          boxShadow: "0 8px 32px #0002",
          position: "relative",
          fontSize: 17,
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 18,
            background: "none",
            border: "none",
            fontSize: 26,
            color: "#888",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <h2
          style={{
            textAlign: "center",
            color: "#009e74",
            fontWeight: 800,
            fontSize: 32,
            marginBottom: 18,
          }}
        >
          ĐƠN YÊU CẦU PHÂN TÍCH ADN
        </h2>
        <form>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Họ và tên</label>
              <input style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Giới tính</label>
              <select style={inputStyle}>
                <option>Nam</option>
                <option>Nữ</option>
                <option>Không xác định</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Địa chỉ</label>
            <input style={inputStyle} />
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>CMND/CCCD</label>
              <input style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Ngày cấp</label>
              <input type="date" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Nơi cấp</label>
              <input style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Số điện thoại</label>
              <input style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} />
            </div>
          </div>
          <div
            style={{
              margin: "18px 0 10px 0",
              fontWeight: 600,
              color: "#009e74",
            }}
          >
            Bảng thông tin thành viên cung cấp mẫu:
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 18,
            }}
          >
            <thead>
              <tr style={{ background: "#f6f8fa" }}>
                <th style={{ border: "1px solid #ccc", padding: 6 }}>STT</th>
                <th style={{ border: "1px solid #ccc", padding: 6 }}>
                  Họ và tên
                </th>
                <th style={{ border: "1px solid #ccc", padding: 6 }}>
                  Năm sinh
                </th>
                <th style={{ border: "1px solid #ccc", padding: 6 }}>
                  Giới tính
                </th>
                <th style={{ border: "1px solid #ccc", padding: 6 }}>
                  Mối quan hệ
                </th>
                <th style={{ border: "1px solid #ccc", padding: 6 }}>
                  Loại mẫu
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #ccc", padding: 6 }}>{i}</td>
                  <td style={{ border: "1px solid #ccc", padding: 6 }}>
                    <input style={inputStyle} />
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 6 }}>
                    <input style={inputStyle} />
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 6 }}>
                    <select style={inputStyle}>
                      <option>Nam</option>
                      <option>Nữ</option>
                    </select>
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 6 }}>
                    <input style={inputStyle} />
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 6 }}>
                    <input style={inputStyle} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Nút cam kết và Lưu chuyển xuống cuối cùng */}
          <div style={{ marginTop: 18, marginBottom: 8 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={commitChecked}
                onChange={(e) => setCommitChecked(e.target.checked)}
              />
              <span style={{ fontSize: 16 }}>
                Tôi xin cam kết chịu trách nhiệm về thông tin đã cung cấp và
                đồng ý với các điều khoản của dịch vụ.
              </span>
            </label>
          </div>
          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button
              type="button"
              style={{
                padding: "10px 32px",
                borderRadius: 8,
                background: commitChecked ? "#009e74" : "#ccc",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                border: "none",
                cursor: commitChecked ? "pointer" : "not-allowed",
                transition: "background 0.2s",
              }}
              onClick={handleSave}
              disabled={!commitChecked}
            >
              Lưu
            </button>
          </div>
          {showSuccess && (
            <div
              style={{
                textAlign: "center",
                color: "#009e74",
                fontWeight: 600,
                fontSize: 18,
                marginTop: 8,
              }}
            >
              Gửi form thành công!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RequestFormModal;
