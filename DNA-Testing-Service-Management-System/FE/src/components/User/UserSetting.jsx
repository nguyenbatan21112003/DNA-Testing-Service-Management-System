import React, { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const UserSetting = () => {
  const { requestPasswordChange, logout } = useContext(AuthContext);

  const [pwForm, setPwForm] = useState({ current: "", new: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [pwMsg, setPwMsg] = useState("");

  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg("");

    const { current, new: newPw, confirm } = pwForm;

    if (!current || !newPw || !confirm) {
      setPwMsg("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPw !== confirm) {
      setPwMsg("Mật khẩu mới và xác nhận không khớp!");
      return;
    }

    if (newPw.length < 6) {
      setPwMsg("Mật khẩu mới phải từ 6 ký tự!");
      return;
    }

    const res = await requestPasswordChange(current, newPw);
    if (res.success) {
      setPwMsg(res.message);
      setPwForm({ current: "", new: "", confirm: "" });
      await logout()
    } else {
      setPwMsg(res.message);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 2px 12px #e6e6e6",
        padding: 48,
        margin: 0,
      }}
    >
      <form className="change-password-form" onSubmit={handleChangePassword}>
        <div className="form-title">Thay đổi mật khẩu</div>

        {/* Mật khẩu hiện tại */}
        <div className="form-group password-group">
          <label>Mật khẩu hiện tại</label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPw.current ? "text" : "password"}
              name="current"
              value={pwForm.current}
              onChange={handlePwChange}
              required
              style={{
                height: 44,
                padding: "0 44px 0 12px",
                width: "100%",
                borderRadius: 10,
                border: "1.5px solid #e0e7ef",
                fontSize: 16,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw((p) => ({ ...p, current: !p.current }))}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#888",
              }}
              aria-label={showPw.current ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPw.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Mật khẩu mới */}
        <div className="form-group password-group">
          <label>Mật khẩu mới</label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPw.new ? "text" : "password"}
              name="new"
              value={pwForm.new}
              onChange={handlePwChange}
              required
              style={{
                height: 44,
                padding: "0 44px 0 12px",
                width: "100%",
                borderRadius: 10,
                border: "1.5px solid #e0e7ef",
                fontSize: 16,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw((p) => ({ ...p, new: !p.new }))}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#888",
              }}
              aria-label={showPw.new ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPw.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Xác nhận mật khẩu mới */}
        <div className="form-group password-group">
          <label>Xác nhận mật khẩu mới</label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPw.confirm ? "text" : "password"}
              name="confirm"
              value={pwForm.confirm}
              onChange={handlePwChange}
              required
              style={{
                height: 44,
                padding: "0 44px 0 12px",
                width: "100%",
                borderRadius: 10,
                border: "1.5px solid #e0e7ef",
                fontSize: 16,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw((p) => ({ ...p, confirm: !p.confirm }))}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#888",
              }}
              aria-label={showPw.confirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPw.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button className="submit-button" type="submit">
          Đổi mật khẩu
        </button>

        {pwMsg && (
          <div
            className={`form-msg${
              pwMsg.includes("thành công") ? " success" : " error"
            }`}
          >
            {pwMsg}
          </div>
        )}
      </form>
    </div>
  );
};

export default UserSetting;
