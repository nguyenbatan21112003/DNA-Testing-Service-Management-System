import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Error404 = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8fafc"
    }}>
      <AlertTriangle size={64} color="#fbbf24" style={{ marginBottom: 24 }} />
      <h1 style={{ fontSize: 48, fontWeight: 800, color: "#e74c3c", marginBottom: 12 }}>404</h1>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: "#222", marginBottom: 8 }}>Không tìm thấy trang</h2>
      
      <button
        style={{
          padding: "10px 28px",
          borderRadius: 8,
          background: "#009e74",
          color: "#fff",
          fontWeight: 700,
          fontSize: 18,
          border: "none",
          cursor: "pointer",
          transition: "background 0.2s"
        }}
        onClick={() => navigate("/")}
      >
        Quay về trang chủ
      </button>
    </div>
  );
};

export default Error404; 