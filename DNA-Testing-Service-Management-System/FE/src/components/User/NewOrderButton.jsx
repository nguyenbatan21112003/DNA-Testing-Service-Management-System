import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const NewOrderButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/dangki");
    setTimeout(() => {
      const el = document.getElementById("registration");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };
  return (
    <button
      style={{
        padding: "10px 22px",
        borderRadius: 8,
        background: "#009e74",
        color: "#fff",
        fontWeight: 700,
        fontSize: 16,
        border: "none",
        cursor: "pointer",
        transition: "background 0.2s",
        marginLeft: 8,
        display: "flex",
        alignItems: "center",
        gap: 8
      }}
      onClick={handleClick}
    >
       Đăng ký mới <Plus size={20} style={{ marginRight: 2 }} />
    </button>
  );
};

export default NewOrderButton; 