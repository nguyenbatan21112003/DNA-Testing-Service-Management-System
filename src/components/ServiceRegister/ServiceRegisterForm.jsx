import { useState, useContext } from "react";
import { useOrderContext } from "../../context/OrderContext";
import { AuthContext } from "../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const serviceOptions = {
  civil: [
    { value: "civil-paternity", label: "Xét nghiệm ADN dân sự - Cha con" },
    { value: "civil-maternity", label: "Xét nghiệm ADN dân sự - Mẹ con" },
    { value: "civil-siblings", label: "Xét nghiệm ADN dân sự - Anh chị em" },
    { value: "civil-relatives", label: "Xét nghiệm ADN dân sự - Họ hàng" },
    { value: "civil-ancestry", label: "Xét nghiệm ADN dân sự - Nguồn gốc" },
    {
      value: "civil-health",
      label: "Xét nghiệm ADN dân sự - Sức khỏe di truyền",
    },
    { value: "civil-express", label: "Xét nghiệm ADN dân sự - Nhanh" },
  ],
  admin: [
    { value: "admin-birth", label: "Xét nghiệm ADN hành chính - Khai sinh" },
    { value: "admin-immigration", label: "Xét nghiệm ADN hành chính - Di trú" },
    {
      value: "admin-inheritance",
      label: "Xét nghiệm ADN hành chính - Thừa kế",
    },
    { value: "admin-dispute", label: "Xét nghiệm ADN hành chính - Tranh chấp" },
    { value: "admin-express", label: "Xét nghiệm ADN hành chính - Nhanh" },
  ],
};

const sampleMethodOptions = {
  civil: [
    { value: "center", label: "Tại trung tâm" },
    { value: "home", label: `Tự nguyện Thu mẫu tại nhà (gửi bộ kit về nhà)` },
  ],
  admin: [{ value: "center", label: "Tại trung tâm" }],
};

const ServiceRegisterForm = () => {
  const { addOrder } = useOrderContext();
  const { user } = useContext(AuthContext);
  const [category, setCategory] = useState("civil");
  const [serviceType, setServiceType] = useState("");
  const [sampleMethod, setSampleMethod] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [readGuide, setReadGuide] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [memberTable, setMemberTable] = useState([
    { name: "", birth: "", gender: "Nam", relation: "", sampleType: "" },
    { name: "", birth: "", gender: "Nam", relation: "", sampleType: "" },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (category === "civil" && sampleMethod === "home" && !readGuide) {
      alert("Bạn cần xác nhận đã đọc và hiểu quy trình tự thu mẫu tại nhà.");
      return;
    }
    if (!agreed) {
      alert("Bạn cần xác nhận cam kết pháp lý và tự nguyện để tiếp tục.");
      return;
    }
    const form = e.target;
    const newOrder = {
      id: "DNA" + Date.now(),
      type: form.serviceType.options[form.serviceType.selectedIndex].text,
      date: new Date().toLocaleDateString("vi-VN"),
      price: 0,
      status: "Chờ xác nhận",
      name: user ? user.fullName || user.name : form.fullName.value,
      phone: form.phone.value,
      email: user ? user.email : form.email.value,
      address: form.address.value,
      appointmentDate: appointmentDate
        ? appointmentDate.toLocaleDateString("vi-VN")
        : "",
      category: form.category.value,
      sampleMethod: form.sampleMethod.value,
      note: form.message.value,
      userId: user ? user.user_id : null,
      idNumber: form.cccd.value,
      members: memberTable.filter((m) => Object.values(m).some((v) => v)),
    };
    addOrder(newOrder);
    form.reset();
    setAgreed(false);
    setShowToast(true);
    setReadGuide(false);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleMemberChange = (idx, field, value) => {
    setMemberTable((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  const handleAddMember = () => {
    if (memberTable.length < 5) {
      setMemberTable((prev) => [
        ...prev,
        { name: "", birth: "", gender: "Nam", relation: "", sampleType: "" },
      ]);
    }
  };

  const handleRemoveMember = (idx) => {
    if (memberTable.length > 2) {
      setMemberTable((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  return (
    <section className="service-registration" id="registration">
      <div className="registration-description" style={{ textAlign: "center" }}>
        <h2> Đăng ký dịch vụ xét nghiệm</h2>
        <p>
          Vui lòng điền đầy đủ thông tin vào form dưới đây để đăng ký dịch vụ
          xét nghiệm ADN. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
        </p>
        {!user && (
          <div
            style={{
              background: "#f0f7ff",
              border: "1px solid #d0e3ff",
              borderRadius: "8px",
              padding: "12px 16px",
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div style={{ color: "#0a66c2", fontSize: "18px" }}>ℹ️</div>
            <div>
              <p style={{ margin: 0, color: "#0a66c2", fontWeight: 500 }}>
                Đăng nhập để trải nghiệm tốt hơn
              </p>
              <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
                Đăng nhập để thông tin của bạn được tự động điền vào biểu mẫu và
                dễ dàng theo dõi đơn đăng ký.
              </p>
            </div>
          </div>
        )}
      </div>
      <div
        className="service-form-container"
        style={{
          maxWidth: 1200,
          margin: "32px auto 0 auto",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 8px 32px #0002",
          padding: 36,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {showToast && (
          <div
            style={{
              position: "fixed",
              top: 24,
              right: 24,
              zIndex: 9999,
              background: "#009e74",
              color: "#fff",
              padding: "16px 32px",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 18,
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              transition: "opacity 0.3s",
            }}
          >
            🎉 Đăng ký dịch vụ thành công!
          </div>
        )}
        <form
          className="service-form"
          onSubmit={handleSubmit}
          style={{ width: "100%" }}
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                defaultValue={user ? user.fullName : ""}
                style={
                  user ? { backgroundColor: "#f9f9f9", color: "#333" } : {}
                }
              />
              {user && (
                <small
                  style={{
                    color: "#009e74",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  Tự động điền từ tài khoản của bạn (có thể chỉnh sửa)
                </small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                defaultValue={user ? user.phone : ""}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                defaultValue={user ? user.email : ""}
                readOnly={user ? true : false}
                style={
                  user ? { backgroundColor: "#f5f5f5", color: "#333" } : {}
                }
              />
              {user && (
                <small
                  style={{
                    color: "#009e74",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  Tự động điền từ tài khoản của bạn
                </small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Càng chi tiết càng tốt"
                defaultValue={user && user.address ? user.address : ""}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Thể loại xét nghiệm</label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setServiceType("");
                  setSampleMethod("");
                }}
                required
              >
                <option value="civil">Dân sự</option>
                <option value="admin">Hành chính</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="serviceType">Loại dịch vụ</label>
              <select
                id="serviceType"
                name="serviceType"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
              >
                <option value="">Chọn loại dịch vụ</option>
                {serviceOptions[category].map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label
                htmlFor="sampleMethod"
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Chọn hình thức thu mẫu
              </label>
              <div
                style={{
                  display: "flex",
                  gap: 32,
                  alignItems: "center",
                  flexWrap: "nowrap",
                }}
              >
                {sampleMethodOptions[category].map((opt) => (
                  <label
                    key={opt.value}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <input
                      type="radio"
                      id={`sampleMethod-${opt.value}`}
                      name="sampleMethod"
                      value={opt.value}
                      checked={sampleMethod === opt.value}
                      onChange={(e) => setSampleMethod(e.target.value)}
                      required
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="cccd">Số CCCD</label>
              <input
                type="text"
                id="cccd"
                name="cccd"
                placeholder="Nhập số CCCD"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="appointmentDate">Ngày cấp CCCD</label>
              <DatePicker
                selected={appointmentDate}
                onChange={(date) => setAppointmentDate(date)}
                // minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày"
                id="appointmentDate"
                name="appointmentDate"
                required
                className="form-control"
              />
            </div>
          </div>
          {/* Bảng thông tin thành viên cung cấp mẫu */}
          <>
            <div
              style={{
                margin: "18px 0 10px 0",
                fontWeight: 600,
                color: "#009e74",
                textAlign: "left",
              }}
            >
              Bảng thông tin thành viên cung cấp mẫu:
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: 18,
              }}
            >
              <thead>
                <tr style={{ background: "#f6f8fa" }}>
                  <th style={{ border: "1px solid #ccc", padding: 6 }}>
                    STT
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: 6 }}>
                    Họ và tên
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: 6 }}>
                    Năm sinh
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: 6 }}>
                    Giới tính
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: 6 }}>
                    Mối quan hệ
                  </th>
                  <th style={{ border: "1px solid #ccc", padding: 6 }}>
                    Loại mẫu
                  </th>
                </tr>
              </thead>
              <tbody>
                {memberTable.map((row, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #ccc", padding: 6 }}>
                      {i + 1}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: 6 }}>
                      <input
                        style={{
                          width: "100%",
                          border: "1px solid #bbb",
                          borderRadius: 6,
                          padding: 8,
                          fontSize: 16,
                        }}
                        value={row.name}
                        onChange={(e) =>
                          handleMemberChange(i, "name", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: 6 }}>
                      <input
                        style={{
                          width: "100%",
                          border: "1px solid #bbb",
                          borderRadius: 6,
                          padding: 8,
                          fontSize: 16,
                        }}
                        value={row.birth}
                        onChange={(e) =>
                          handleMemberChange(i, "birth", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: 6 }}>
                      <select
                        style={{
                          width: "100%",
                          border: "1px solid #bbb",
                          borderRadius: 6,
                          padding: 8,
                          fontSize: 16,
                        }}
                        value={row.gender}
                        onChange={(e) =>
                          handleMemberChange(i, "gender", e.target.value)
                        }
                      >
                        <option>Nam</option>
                        <option>Nữ</option>
                      </select>
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: 6 }}>
                      <input
                        style={{
                          width: "100%",
                          border: "1px solid #bbb",
                          borderRadius: 6,
                          padding: 8,
                          fontSize: 16,
                        }}
                        value={row.relation}
                        onChange={(e) =>
                          handleMemberChange(i, "relation", e.target.value)
                        }
                      />
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <select
                        style={{
                          width: "100%",
                          border: "1px solid #bbb",
                          borderRadius: 6,
                          padding: 8,
                          fontSize: 16,
                        }}
                        value={row.sampleType}
                        onChange={(e) =>
                          handleMemberChange(i, "sampleType", e.target.value)
                        }
                      >
                        <option value="">Chọn loại mẫu</option>
                        <option value="Nước bọt">Nước bọt</option>
                        <option value="Máu">Máu</option>
                        <option value="Tóc">Tóc</option>
                        <option value="Móng">Móng</option>
                        <option value="Niêm mạc">Niêm mạc</option>
                      </select>
                      {memberTable.length > 2 && i >= 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(i)}
                          style={{
                            marginLeft: 4,
                            background: "#e74c3c",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 10px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                        >
                          Xóa
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {memberTable.length < 3 && (
              <div style={{ textAlign: "right", marginBottom: 18 }}>
                <button
                  type="button"
                  onClick={handleAddMember}
                  style={{
                    background: "#009e74",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 18px",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  + Thêm người
                </button>
              </div>
            )}
          </>
          <div className="form-group">
            <label htmlFor="message">Ghi chú thêm</label>
            <textarea id="message" name="message" rows="4"></textarea>
          </div>
          {/* Hướng dẫn tự thu mẫu tại nhà */}
          {category === "civil" && sampleMethod === "home" && (
            <div
              style={{
                background: "#f6f8fa",
                border: "1px solid #cce3d3",
                borderRadius: 8,
                padding: 20,
                margin: "18px 0 10px 0",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: "#009e74",
                  marginBottom: 8,
                }}
              >
                Quy trình tự thu mẫu tại nhà:
              </div>
              <ul
                style={{
                  marginLeft: 18,
                  marginBottom: 10,
                  paddingLeft: 18,
                }}
              >
                <li>
                  Nhận bộ kit gồm hướng dẫn thu mẫu và Đơn Yêu Cầu Xét Nghiệm.
                </li>
                <li>
                  Tự thu mẫu theo hướng dẫn, điền đầy đủ Đơn Yêu Cầu Xét Nghiệm.
                </li>
                <li>
                  Gửi lại bộ kit đã sử dụng (gồm mẫu và đơn) về trung tâm theo
                  hướng dẫn kèm trong kit.
                </li>
              </ul>
              <div style={{ marginBottom: 6 }}>
                <a
                  href="/Giấy%20xác%20nhận%20là%20sinh%20viên%20.docx"
                  download
                  style={{
                    color: "#0a7cff",
                    textDecoration: "underline",
                    fontWeight: 500,
                    marginRight: 18,
                  }}
                >
                  Tải hướng dẫn thu mẫu
                </a>
              </div>
              <div style={{ marginTop: 12 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 15,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={readGuide}
                    onChange={(e) => setReadGuide(e.target.checked)}
                    required
                  />
                  <span>Tôi đã đọc và hiểu quy trình tự thu mẫu tại nhà.</span>
                </label>
              </div>
            </div>
          )}
          <div className="form-group" style={{ marginTop: 12 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 15,
                fontWeight: 400,
                color: "#333",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                style={{
                  width: 18,
                  height: 18,
                  accentColor: "#009e74",
                  marginRight: 8,
                }}
              />
              <span style={{ lineHeight: 1.5 }}>
                <span style={{ fontWeight: 500, color: "#009e74" }}>
                  Tôi cam kết và tự nguyện
                </span>{" "}
                đăng ký dịch vụ, đồng ý với các
                <a
                  href="/vechungtoi#dieu-khoan"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#009e74",
                    textDecoration: "underline",
                    marginLeft: 4,
                  }}
                >
                  điều khoản pháp lý
                </a>
                <span> của trung tâm.</span>
              </span>
            </label>
          </div>
          <div className="form-group">
            <button type="submit" className="submit-button">
              Đăng ký dịch vụ
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ServiceRegisterForm;
