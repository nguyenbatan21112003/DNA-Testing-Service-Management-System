import React, { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const UserSetting = () => {
  const { requestPasswordChange, verifyPasswordChange } = useContext(AuthContext);

  // State quản lý form đổi mật khẩu
  const [pwForm, setPwForm] = useState({ current: "", new: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [pwStep, setPwStep] = useState(1); // 1: nhập, 2: nhập OTP
  const [otpSent, setOtpSent] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [otpInput, setOtpInput] = useState("");

  // Xử lý change input cho form mật khẩu
  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  };

  // Gửi OTP đổi mật khẩu
  const handleSendOtp = (e) => {
    e.preventDefault();
    setPwMsg("");
    if (!pwForm.current || !pwForm.new || !pwForm.confirm) {
      setPwMsg("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (pwForm.new !== pwForm.confirm) {
      setPwMsg("Mật khẩu mới và xác nhận không khớp!");
      return;
    }
    if (pwForm.new.length < 6) {
      setPwMsg("Mật khẩu mới phải từ 6 ký tự!");
      return;
    }
    const res = requestPasswordChange(pwForm.current, pwForm.new);
    if (res.success) {
      setOtpSent(res.otp); // Giả lập gửi mail, hiển thị luôn cho user
      setPwStep(2);
      setPwMsg("");
    } else {
      setPwMsg(res.message);
    }
  };

  // Xác thực OTP và đổi mật khẩu
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setPwMsg("");
    if (!otpInput) {
      setPwMsg("Vui lòng nhập mã xác thực!");
      return;
    }
    const res = verifyPasswordChange(otpInput);
    if (res.success) {
      setPwMsg("Đổi mật khẩu thành công!");
      setPwStep(1);
      setPwForm({ current: "", new: "", confirm: "" });
      setOtpInput("");
      setOtpSent("");
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
        marginBottom: 0,
      }}
    >
      <form
        className="change-password-form"
        onSubmit={pwStep === 1 ? handleSendOtp : handleVerifyOtp}
      >
        <div className="form-title">Thay đổi mật khẩu</div>
        {pwStep === 1 ? (
          <>
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
                    background: "#fff",
                    borderRadius: 10,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 16,
                    fontWeight: 500,
                    outline: "none",
                    boxShadow: "none",
                    transition: "border 0.2s",
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 12,
                    height: "100%",
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: "#888",
                  }}
                  onClick={() => setShowPw((p) => ({ ...p, current: !p.current }))}
                  tabIndex={0}
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
                    background: "#fff",
                    borderRadius: 10,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 16,
                    fontWeight: 500,
                    outline: "none",
                    boxShadow: "none",
                    transition: "border 0.2s",
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 12,
                    height: "100%",
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: "#888",
                  }}
                  onClick={() => setShowPw((p) => ({ ...p, new: !p.new }))}
                  tabIndex={0}
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
                    background: "#fff",
                    borderRadius: 10,
                    border: "1.5px solid #e0e7ef",
                    fontSize: 16,
                    fontWeight: 500,
                    outline: "none",
                    boxShadow: "none",
                    transition: "border 0.2s",
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 12,
                    height: "100%",
                    background: "none",
                    border: "none",
                    padding: 0,
                    margin: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: "#888",
                  }}
                  onClick={() => setShowPw((p) => ({ ...p, confirm: !p.confirm }))}
                  tabIndex={0}
                  aria-label={showPw.confirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPw.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {/* Submit */}
            <button className="submit-button" type="submit">
              Gửi mã xác thực
            </button>
            {/* Thông báo */}
            {pwMsg && (
              <div className={`form-msg${pwMsg.includes("thành công") ? " success" : " error"}`}>{pwMsg}</div>
            )}
            {/* OTP hiển thị demo */}
            {otpSent && (
              <div className="otp-demo">
                Mã xác thực (giả lập gửi email): <b>{otpSent}</b>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Nhập mã xác thực đã gửi về email</label>
              <input
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                required
              />
            </div>
            <button className="submit-button" type="submit">
              Xác nhận đổi mật khẩu
            </button>
            {pwMsg && (
              <div className={`form-msg${pwMsg.includes("thành công") ? " success" : " error"}`}>{pwMsg}</div>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default UserSetting;
