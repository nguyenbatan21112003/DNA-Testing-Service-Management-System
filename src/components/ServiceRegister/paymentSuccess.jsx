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
      <div className="flex items-center justify-center min-h-[80vh] py-10 bg-gray-100">
        <div className="w-full max-w-lg bg-white rounded-lg p-8 shadow-lg text-center">
          <div className="text-6xl mb-4">
            {status === "success" ? "✅" : "❌"}
          </div>
          <h2 className={`text-2xl font-semibold ${status === "success" ? "text-green-700" : "text-red-700"}`}>
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
            className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  };

  export default PaymentSuccessPage;
