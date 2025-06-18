import React from "react";

const TimelineProgress = ({ order }) => {
  if (!order) return null;
  // Tùy vào sampleMethod, quyết định có mốc 'Gửi kit' hay không
  const steps = [
    { key: "registered", label: "Đăng ký", date: order.date },
    ...(order.sampleMethod === "home"
      ? [{ key: "kit_sent", label: "Gửi kit", date: order.kitSentDate }]
      : []),
    { key: "sample_received", label: "Nhận mẫu", date: order.sampleReceivedDate },
    { key: "analyzing", label: "Phân tích", date: order.analyzingDate },
    { key: "completed", label: "Hoàn thành", date: order.completedDate || order.finishDate },
  ];
  // Đếm số mốc đã hoàn thành (có date)
  const completedSteps = steps.filter(step => !!step.date).length;
  const percent = Math.round((completedSteps / steps.length) * 100);
  return (
    <div style={{ width: "100%", marginTop: 18 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Tiến độ</div>
      <div style={{ width: "100%", background: "#f0f4f8", borderRadius: 8, height: 10, marginBottom: 8 }}>
        <div style={{ width: `${percent}%`, background: "#009e74", height: 10, borderRadius: 8, transition: "width 0.4s" }} />
      </div>
      <div style={{ fontSize: 15, color: "#888", marginBottom: 18 }}>{percent}%</div>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Timeline xử lý</div>
      <div style={{ background: "#f6f8fa", borderRadius: 10, padding: 16, marginBottom: 8 }}>
        {steps.map((step, idx) => (
          <div key={step.key} style={{ display: "flex", alignItems: "center", marginBottom: idx < steps.length - 1 ? 10 : 0 }}>
            <span style={{
              display: "inline-block",
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: step.date ? "#00c292" : "#ccc",
              marginRight: 12,
              border: step.date ? "2px solid #00c292" : "2px solid #ccc",
              transition: "background 0.2s, border 0.2s"
            }} />
            <span style={{ fontWeight: step.date ? 600 : 400, color: step.date ? "#00a67e" : "#888", minWidth: 110 }}>{step.label}</span>
            <span style={{ color: "#888", marginLeft: 12, fontSize: 15 }}>{step.date || ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineProgress; 