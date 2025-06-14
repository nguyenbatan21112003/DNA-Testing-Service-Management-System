"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const modalRef = useRef(null);
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      setError("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      setTimeout(onClose, 1000);
      if (result.role_id === 1) {
        navigate("/taikhoan");
      } else if (result.role_id === 2) {
        navigate("/nhanvien");
      } else if (result.role_id === 5) {
        navigate("/admin");
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="modal-overlay">
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            background: "#00a67e",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: 8,
            boxShadow: "0 2px 12px #0002",
            zIndex: 2000,
            fontWeight: 500,
            fontSize: 16,
          }}
        >
          Đăng nhập thành công!
        </div>
      )}
      <div className="modal-container" ref={modalRef}>
        <div className="modal-header">
          <h2>Đăng nhập</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
              className="bg-white p-4"
                type="email"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ position: "relative" }}>
              <label htmlFor="login-password">Mật khẩu</label>

              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: 36 }}
                className="bg-white p-4 password-input w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-10 inset-y-0 right-0 pr-3 flex items-center  transition-colors"
                tabIndex={0}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff size={20} className="h-5 w-5" />
                ) : (
                  <Eye size={20} className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="form-options">
              <label className="checkbox-label ">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  className="bg-white"
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="forgot-password">
                Quên mật khẩu?
              </a>
            </div>
            {error && (
              <div className="error-msg" style={{ marginBottom: 8 }}>
                {error}
              </div>
            )}
            <button type="submit" className="modal-button">
              Đăng nhập
            </button>
          </form>
        </div>
        <div className="modal-footer">
          <p>
            Chưa có tài khoản?{" "}
            <button className="switch-modal" onClick={onSwitchToRegister}>
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
