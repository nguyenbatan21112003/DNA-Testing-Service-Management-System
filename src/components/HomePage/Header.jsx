"use client";

import { useState, useContext, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Modal } from "antd";
import NotificationBell from "./NotificationBell";
import "../../css/Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const [logoutModal, setLogoutModal] = useState(false);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDropdown]);

  const handleLogout = () => {
    setLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setLogoutModal(false);
    setShowDropdown(false);
    window.location.href = "/";
  };

  const cancelLogout = () => {
    setLogoutModal(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-container" style={{ cursor: "pointer" }}>
          <span className="logo-icon">🧬</span>
          <span className="logo-text">DNA Lab</span>
        </Link>

        <button
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="menu-icon"></span>
        </button>

        <nav className={`main-nav ${isMenuOpen ? "open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/dichvu"
                className={`nav-link ${
                  location.pathname === "/dichvu" ? "active" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dịch vụ
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/dangki"
                className={`nav-link ${
                  location.pathname === "/dangki" ? "active" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng kí
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/vechungtoi"
                className={`nav-link ${
                  location.pathname === "/vechungtoi" ? "active" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Về chúng tôi
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/tintuc"
                className={`nav-link ${
                  location.pathname === "/tintuc" ? "active" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Tin tức
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/lienhe"
                className={`nav-link ${
                  location.pathname === "/lienhe" ? "active" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </nav>
        <div className="header-buttons">
          {user ? (
            <>
              <NotificationBell />
              <div
                style={{ position: "relative", display: "inline-block" }}
                ref={dropdownRef}
              >
                <span
                  style={{
                    marginRight: 12,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                  onClick={() => setShowDropdown((v) => !v)}
                >
                  {user.name || user.fullName || user.email}{" "}
                  <span style={{ fontSize: 18, verticalAlign: "middle" }}>
                    &#x25BC;
                  </span>
                </span>
                {showDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      background: "#fff",
                      boxShadow: "0 2px 12px #0002",
                      borderRadius: 8,
                      minWidth: 160,
                      zIndex: 100,
                    }}
                  >
                    {user.role_id === 4 && (
                      <Link
                        to="/admin"
                        style={{
                          display: "block",
                          padding: "12px 20px",
                          color: "#222",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                        onClick={() => setShowDropdown(false)}
                      >
                        Trang quản trị
                      </Link>
                    )}
                    {user.role_id === 3 && (
                      <Link
                        to="/manager"
                        style={{
                          display: "block",
                          padding: "12px 20px",
                          color: "#222",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                        onClick={() => setShowDropdown(false)}
                      >
                        Quản lý
                      </Link>
                    )}
                    {user.role_id === 2 ? (
                      <Link
                        to="/nhanvien"
                        style={{
                          display: "block",
                          padding: "12px 20px",
                          color: "#222",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                        onClick={() => setShowDropdown(false)}
                      >
                        Quản lý
                      </Link>
                    ) : (
                      user.role_id === 1 && (
                        <Link
                          to="/taikhoan"
                          style={{
                            display: "block",
                            padding: "12px 20px",
                            color: "#222",
                            textDecoration: "none",
                            fontWeight: 500,
                          }}
                          onClick={() => setShowDropdown(false)}
                        >
                          Tài khoản
                        </Link>
                      )
                    )}
                    <div style={{ height: 1, background: "#eee" }}></div>
                    <button
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "12px 20px",
                        background: "none",
                        border: "none",
                        color: "#e74c3c",
                        textAlign: "left",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="login-button">
                Đăng nhập
              </Link>
              <Link to="/register" className="register-button">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>

      <Modal
        open={logoutModal}
        onOk={confirmLogout}
        onCancel={cancelLogout}
        okText="Đăng xuất"
        cancelText="Hủy"
        okButtonProps={{ className: "custom-logout-btn" }}
        title="Xác nhận đăng xuất"
      >
        <p>Bạn có chắc muốn đăng xuất không?</p>
      </Modal>
    </header>
  );
};

export default Header;
