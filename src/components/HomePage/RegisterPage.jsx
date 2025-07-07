"use client";

import { useState, useContext } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { register } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }
    const result = await register({ fullName, email, phone, password });
    if (result.success) {
      setError("");
    } else {
      setError(result.message);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00a67e 0%, #36cfc9 100%)',
      }}
    >
      <div style={{ background: '#fff', borderRadius: 18, maxWidth: 420, width: '100%', boxShadow: '0 8px 32px #0002', padding: 36 }}>
        <h2 style={{ textAlign: 'center', color: '#009e74', fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-fullname">Họ và tên</label>
            <input
              className="input-register bg-white"
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
              className="input-register bg-white"
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
              className="input-register bg-white"
              type="tel"
              id="register-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="register-password">Mật khẩu</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                id="register-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  height: 44,
                  padding: '0 44px 0 12px',
                  width: '100%',
                  background: '#fff',
                  borderRadius: 10,
                  border: '1.5px solid #e0e7ef',
                  fontSize: 16,
                  fontWeight: 500,
                  outline: 'none',
                  boxShadow: 'none',
                  transition: 'border 0.2s',
                }}
                className="input-register"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 12,
                  height: '100%',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#888'
                }}
                tabIndex={0}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="register-confirm-password">Xác nhận mật khẩu</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="register-confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  height: 44,
                  padding: '0 44px 0 12px',
                  width: '100%',
                  background: '#fff',
                  borderRadius: 10,
                  border: '1.5px solid #e0e7ef',
                  fontSize: 16,
                  fontWeight: 500,
                  outline: 'none',
                  boxShadow: 'none',
                  transition: 'border 0.2s',
                }}
                className="input-register"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 12,
                  height: '100%',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#888'
                }}
                tabIndex={0}
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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
          <button type="submit" className="modal-button">Đăng ký</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          Đã có tài khoản? <Link to="/login" style={{ color: '#009e74', fontWeight: 600 }}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;