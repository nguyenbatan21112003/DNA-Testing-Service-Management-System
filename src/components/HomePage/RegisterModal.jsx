"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const modalRef = useRef(null);
  const { register } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }
    const result = register({ fullName, email, phone, password });
    if (result.success) {
      setError("");
      onClose();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={modalRef}>
        <div className="modal-header">
          <h2>Đăng ký tài khoản</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="register-fullname">Họ và tên</label>
              <input
                type="text"
                id="register-fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-email">Email</label>
              <input
                type="email"
                id="register-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-phone">Số điện thoại</label>
              <input
                type="tel"
                id="register-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ position: "relative" }}>
              <label htmlFor="register-password">Mật khẩu</label>
              <input
                type={showPassword ? "text" : "password"}
                id="register-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: 36 }}
              />
              <span
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 36,
                  cursor: "pointer",
                  color: "#888",
                }}
                tabIndex={0}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            <div className="form-group" style={{ position: "relative" }}>
              <label htmlFor="register-confirm-password">
                Xác nhận mật khẩu
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="register-confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ paddingRight: 36 }}
              />
              <span
                onClick={() => setShowConfirmPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 36,
                  cursor: "pointer",
                  color: "#888",
                }}
                tabIndex={0}
                aria-label={
                  showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                />
                <span>Tôi đồng ý với các điều khoản và điều kiện</span>
              </label>
            </div>
            {error && (
              <div className="error-msg" style={{ marginBottom: 8 }}>
                {error}
              </div>
            )}
            <button type="submit" className="modal-button">
              Đăng ký
            </button>
          </form>
        </div>
        <div className="modal-footer">
          <p>
            Đã có tài khoản?{" "}
            <button className="switch-modal" onClick={onSwitchToLogin}>
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
