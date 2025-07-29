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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          status === "success"
            ? "linear-gradient(135deg, #009e74 0%, #00b4a6 50%, #00d4aa 100%)"
            : "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
        zIndex: 9999,
        overflow: "hidden",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 450,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 24,
          padding: "48px 40px",
          boxShadow:
            "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          textAlign: "center",
          transform: "scale(1)",
          animation: "fadeInScale 0.6s ease-out",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <style>{`
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
          .success-icon {
            animation: pulse 2s infinite;
          }
        `}</style>

        <div
          className={status === "success" ? "success-icon" : ""}
          style={{
            fontSize: 80,
            marginBottom: 20,
            filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
          }}
        >
          {status === "success" ? "🎉" : "❌"}
        </div>

        <h1
          style={{
            color: status === "success" ? "#2d3748" : "#e53e3e",
            fontSize: 32,
            fontWeight: "700",
            margin: "0 0 16px 0",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          {status === "success"
            ? "Thanh toán thành công!"
            : "Thanh toán thất bại"}
        </h1>

        <p
          style={{
color: "#718096",
            fontSize: 16,
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          {status === "success"
            ? "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi"
            : "Đã xảy ra lỗi trong quá trình thanh toán"}
        </p>

        {status === "success" ? (
          <div
            style={{
              backgroundColor: "rgba(0, 158, 116, 0.1)",
              borderRadius: 16,
              padding: 24,
              marginBottom: 32,
              border: "1px solid rgba(0, 158, 116, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  color: "#4a5568",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Mã đơn hàng:
              </span>
              <span
                style={{
                  color: "#2d3748",
                  fontSize: 16,
                  fontWeight: "700",
                  fontFamily: "monospace",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  padding: "4px 8px",
                  borderRadius: 6,
                }}
              >
                {requestId}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "#4a5568",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Mã giao dịch:
              </span>
              <span
                style={{
                  color: "#2d3748",
                  fontSize: 16,
                  fontWeight: "700",
                  fontFamily: "monospace",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  padding: "4px 8px",
                  borderRadius: 6,
                }}
              >
                {transactionId}
              </span>
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "rgba(229, 62, 62, 0.1)",
              borderRadius: 16,
              padding: 24,
              marginBottom: 32,
              border: "1px solid rgba(229, 62, 62, 0.2)",
            }}
          >
            <p
              style={{
                color: "#e53e3e",
                fontSize: 14,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ
            </p>
          </div>
)}

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "16px 32px",
            background:
              status === "success"
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: "600",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            width: "100%",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          }}
        >
          🏠 Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;