import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

// Feedback modal component extracted from UserProfile for easier maintenance
const Feedback = ({
  isOpen,
  order,
  onClose,
  onSubmitFeedback,
  // setUserOrders,
}) => {
  // Internal state for rating and comment
  const [overallRating, setOverallRating] = useState(0);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  // Sync when opening / switching order
  useEffect(() => {
    if (isOpen && order && order.feedbacks && order.feedbacks.length > 0) {
      const lastFb = order.feedbacks[order.feedbacks.length - 1];
      setOverallRating(lastFb.rating || 0);
      setFeedbackInput(lastFb.feedback || "");
    } else if (isOpen) {
      // Reset when opening for new feedback
      setOverallRating(0);
      setFeedbackInput("");
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  // Helpers replicated from UserProfile
  const getStatusText = (statusRaw) => {
    const status = statusRaw?.toUpperCase() || "";

    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đang xử lý";
      case "KIT NOT SENT":
        return "Chưa gửi kit";
      case "KIT SENT":
        return "Đã gửi kit";
      // case "SAMPLE_COLLECTING":
      case "SAMPLE_RECEIVED":
        return 'Đã nhận mẫu'
      // case "PROCESSING":
      // case "WAITING_APPROVAL":
      case "WAITING_FOR_APPOINTMENT":
        return "Chờ đến ngày hẹn";
      case "REJECTED":
        return "Đang xử lý";
      case "COMPLETED":
        return "Hoàn thành";
      default:
        return "Không xác định";
    }
  };

  const getDisplayStatus = (order) => {
    return (
      order.status ||
      order.samplingStatus ||
      order.kitStatus ||
      "PENDING_CONFIRM"
    );
  };

  const canRate =
    getStatusText(getDisplayStatus(order)) === "Đã có kết quả" ||
    getStatusText(getDisplayStatus(order)) === "Hoàn thành";

  if (!canRate) return null;

  const handleSubmit = () => {
    if (overallRating === 0) {
      setFeedbackSuccess("Vui lòng chọn số sao!");
      return;
    }
    if (onSubmitFeedback) {
      onSubmitFeedback(order, overallRating, feedbackInput);
    }

    // if (setUserOrders) {
    //   setUserOrders((prev) =>
    //     prev.map((o) =>
    //       o.id === order.id
    //         ? {
    //             ...o,
    //             feedbacks: [
    //               {
    //                 rating: overallRating,
    //                 feedback: feedbackInput,
    //                 date: `${new Date().getDate()}/${
    //                   new Date().getMonth() + 1
    //                 }/${new Date().getFullYear()}`,
    //               },
    //             ],
    //           }
    //         : o
    //     )
    //   );
    // }

    onClose();
    setFeedbackSuccess("Cảm ơn bạn đã đánh giá!");
    setTimeout(() => setFeedbackSuccess(""), 2000);
  };

  return (
    // Overlay
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
          width: "90%",
          maxWidth: 650,
          padding: 40,
          boxShadow: "0 8px 32px #0002",
          position: "relative",
          fontSize: 17,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
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
        <h3
          style={{
            fontWeight: 800,
            fontSize: 26,
            marginBottom: 24,
            color: "#b88900",
            letterSpacing: -1,
            textAlign: "center",
          }}
        >
          Đánh giá của bạn
        </h3>
        <p style={{ textAlign: "center" }}>
          Bạn hãy đánh giá dịch vụ của chúng tôi
        </p>
        {/* Stars */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "25px 0",
            gap: 10,
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={36}
              color={overallRating >= star ? "#ffc107" : "#ddd"}
              style={{
                cursor:
                  order.feedbacks && order.feedbacks.length > 0
                    ? "default"
                    : "pointer",
              }}
              onClick={() => {
                if (!(order.feedbacks && order.feedbacks.length > 0)) {
                  setOverallRating(star);
                }
              }}
            />
          ))}
          <span
            style={{
              color: "#888",
              fontSize: 16,
              marginLeft: 8,
              minWidth: 35,
            }}
          >
            {overallRating > 0 ? `${overallRating}/5` : ""}
          </span>
        </div>
        {/* Textarea */}
        <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 17 }}>
          Nhận xét của bạn
        </div>
        <textarea
          rows={4}
          placeholder="Nhận xét của bạn về dịch vụ..."
          value={feedbackInput}
          onChange={(e) => {
            if (!(order.feedbacks && order.feedbacks.length > 0)) {
              setFeedbackInput(e.target.value);
            }
          }}
          readOnly={order.feedbacks && order.feedbacks.length > 0}
          style={{
            width: "100%",
            borderRadius: 8,
            margin: "8px 0 16px",
            padding: 12,
            border: "1px solid #ccc",
            fontSize: 16,
            background:
              order.feedbacks && order.feedbacks.length > 0
                ? "#f6f8fa"
                : "#fff",
          }}
        />
        {/* Submit / info */}
        {order.feedbacks &&
        order.feedbacks.length > 0 &&
        order.feedbacks[0].rating ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 16,
            }}
          >
            <div
              style={{
                background: "#f6f8fa",
                border: "1px solid #e1e4e8",
                borderRadius: 8,
                padding: 12,
                fontSize: 15,
                color: "#666",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                Đánh giá vào ngày:{" "}
                {order.feedbacks[order.feedbacks.length - 1].date}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            style={{
              background: "#009e74",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 24px",
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
              marginTop: 8,
              fontSize: 16,
            }}
          >
            Gửi đánh giá
          </button>
        )}
        {feedbackSuccess && (
          <div
            style={{
              color: "#009e74",
              marginTop: 6,
              textAlign: "center",
            }}
          >
            {feedbackSuccess}
          </div>
        )}
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            background:
              order.feedbacks && order.feedbacks.length > 0
                ? "#009e74"
                : "#eee",
            color:
              order.feedbacks && order.feedbacks.length > 0 ? "#fff" : "#666",
            border: "none",
            borderRadius: 8,
            padding: "12px 24px",
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
            marginTop: 8,
            fontSize: 16,
          }}
        >
          {order.feedbacks && order.feedbacks.length > 0 ? "Đóng" : "Hủy"}
        </button>
      </div>
    </div>
  );
};

export default Feedback;
