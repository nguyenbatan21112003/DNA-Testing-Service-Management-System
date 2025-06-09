import React from "react";
import { useOrderContext } from "../../context/OrderContext";

const FeedbackList = () => {
  const { getAllOrders } = useOrderContext();
  const orders = getAllOrders();
  // Lấy tất cả feedbacks của mọi đơn, mỗi feedback là 1 dòng
  const feedbackRows = [];
  orders.forEach((o) => {
    if (o.feedbacks && Array.isArray(o.feedbacks)) {
      o.feedbacks.forEach((fb) => {
        feedbackRows.push({
          id: o.id,
          name: o.name || o.fullName || o.email,
          type: o.type,
          rating: fb.rating,
          feedback: fb.feedback,
          date: fb.date,
        });
      });
    }
  });
  if (feedbackRows.length === 0)
    return (
      <div style={{ padding: 32, color: "#888" }}>Chưa có đánh giá nào.</div>
    );
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 24 }}>
        Tất cả đánh giá của người dùng
      </h2>
      <table
        style={{
          width: "100%",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 12px #e6e6e6",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#f5f6fa", color: "#222", fontWeight: 700 }}>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>
              Mã đơn
            </th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>
              Tên khách hàng
            </th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>
              Loại dịch vụ
            </th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>
              Số sao
            </th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>
              Nội dung
            </th>
            <th style={{ padding: 12, borderBottom: "1px solid #eee" }}>
              Ngày
            </th>
          </tr>
        </thead>
        <tbody>
          {feedbackRows.map((f, idx) => (
            <tr
              key={f.id + "-" + idx}
              style={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <td style={{ padding: 10 }}>#{f.id}</td>
              <td style={{ padding: 10 }}>{f.name}</td>
              <td style={{ padding: 10 }}>{f.type}</td>
              <td style={{ padding: 10 }}>
                {"★".repeat(f.rating)}
                {"☆".repeat(5 - f.rating)}
              </td>
              <td
                style={{ padding: 10, maxWidth: 320, whiteSpace: "pre-line" }}
              >
                {f.feedback}
              </td>
              <td style={{ padding: 10 }}>{f.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackList;
