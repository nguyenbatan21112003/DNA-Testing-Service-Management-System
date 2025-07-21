import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const transactionId = searchParams.get("transactionId");
  const requestId = searchParams.get("requestId");

  useEffect(() => {
    if (status === "success") {
      // alert(`message || "Thanh toán thành công!"}`);
    } else {
      alert("🚫 Thanh toán thất bại hoặc bị hủy.");
    }
  }, [status, message]);

  return (
    <div style={{
      padding: "40px 20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      backgroundColor: "#f5f5f5"
    }}>
      <div style={{
        maxWidth: 500,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 32,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        textAlign: "center"
      }}>
        <div style={{ fontSize: 64 }}>
          {status === "success" ? "✅" : "❌"}
        </div>
        <h2 style={{ color: status === "success" ? "#2e7d32" : "#d32f2f" }}>
          {status === "success" ? "Thanh toán thành công" : "Thanh toán thất bại"}
        </h2>

        {status === "success" ? (
          <>
            <p>Mã đơn hàng: <strong>{requestId}</strong></p>
            <p>Mã giao dịch: <strong>{transactionId}</strong></p>
          </>
        ) : (
          <p>Vui lòng thử lại hoặc kiểm tra trạng thái thanh toán của bạn.</p>
        )}

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 24,
            padding: "10px 20px",
            backgroundColor: "#009e74",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16
          }}
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
