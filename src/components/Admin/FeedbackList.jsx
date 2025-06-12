import React, { useState } from "react";
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
          email: fb.email || o.email || "",
        });
      });
    }
  });

  // Lấy danh sách loại dịch vụ duy nhất
  const serviceTypes = Array.from(
    new Set(feedbackRows.map((f) => f.type))
  ).filter(Boolean);

  // State cho filter
  const [starFilter, setStarFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");

  // Lọc feedback theo filter
  const filteredRows = feedbackRows.filter((f) => {
    const starOk =
      starFilter === "all" ? true : f.rating === Number(starFilter);
    const serviceOk = serviceFilter === "all" ? true : f.type === serviceFilter;
    return starOk && serviceOk;
  });

  if (feedbackRows.length === 0)
    return (
      <div style={{ padding: 32, color: "#888" }}>Chưa có đánh giá nào.</div>
    );
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 24 }}>
        Tất cả đánh giá của người dùng
      </h2>
      {/* Bộ lọc */}
      <div
        style={{ display: "flex", gap: 24, marginBottom: 28, flexWrap: "wrap" }}
      >
        <div>
          <label style={{ fontWeight: 600, marginRight: 8 }}>
            Lọc theo số sao:
          </label>
          <select
            value={starFilter}
            onChange={(e) => setStarFilter(e.target.value)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontWeight: 500,
            }}
          >
            <option value="all">Tất cả</option>
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star} sao
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600, marginRight: 8 }}>
            Lọc theo dịch vụ:
          </label>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontWeight: 500,
            }}
          >
            <option value="all">Tất cả</option>
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {filteredRows.length === 0 && (
          <div
            style={{
              color: "#888",
              textAlign: "center",
              fontSize: 17,
              padding: 32,
            }}
          >
            Không có đánh giá phù hợp.
          </div>
        )}
        {filteredRows.map((f, idx) => (
          <div
            key={f.id + "-" + idx}
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px #0001",
              padding: 0,
              overflow: "hidden",
              minWidth: 320,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
              }}
            >
              <thead>
                <tr style={{ background: "#f5f6fa" }}>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "left",
                      fontWeight: 700,
                      fontSize: 17,
                    }}
                  >
                    Mã đơn
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "left",
                      fontWeight: 700,
                      fontSize: 17,
                    }}
                  >
                    Tên khách hàng
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "left",
                      fontWeight: 700,
                      fontSize: 17,
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "left",
                      fontWeight: 700,
                      fontSize: 17,
                    }}
                  >
                    Loại dịch vụ
                  </th>
                  <th
                    style={{
                      padding: 16,
                      textAlign: "right",
                      fontWeight: 700,
                      fontSize: 17,
                    }}
                  >
                    Ngày
                  </th>
                </tr>
                <tr>
                  <td style={{ padding: 12, fontWeight: 500, color: "#222" }}>
                    #{f.id}
                  </td>
                  <td style={{ padding: 12 }}>{f.name}</td>
                  <td style={{ padding: 12 }}>{f.email}</td>
                  <td style={{ padding: 12 }}>{f.type}</td>
                  <td
                    style={{
                      padding: 12,
                      textAlign: "right",
                      color: "#222",
                      fontWeight: 500,
                    }}
                  >
                    {f.date}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} style={{ padding: 0, border: 0 }}>
                    <div
                      style={{
                        width: "100%",
                        borderBottom: "3px solid #444",
                        margin: 0,
                      }}
                    />
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: 10,
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    <div style={{ marginTop: 6 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          style={{
                            color: i < f.rating ? "#ffc107" : "#ddd",
                            fontSize: 22,
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: 10,
                      fontWeight: 600,
                      fontSize: 16,
                      textAlign: "left",
                      verticalAlign: "top",
                    }}
                  >
                    <span style={{ fontWeight: 400, fontSize: 15 }}>
                      {f.feedback}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;
