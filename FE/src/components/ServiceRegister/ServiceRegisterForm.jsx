import { useState, useContext, useEffect } from "react";
// import { useOrderContext } from "../../context/OrderContext";
import { AuthContext } from "../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import userApi from "../../api/userApI";
import { useServiceContext } from "../../context/ServiceContext";
import vnpayApi from "../../api/vnpayApi";

const sampleMethodOptions = {
  Voluntary: [
    { value: "At Center", label: "Tại trung tâm" },
    {
      value: "At Home",
      label: `Tự nguyện Thu mẫu tại nhà (gửi bộ kit về nhà)`,
    },
  ],
  Administrative: [{ value: "At Center", label: "Tại trung tâm" }],
};

const ServiceRegisterForm = () => {
  // const { addOrder } = useOrderContext();
  const { user } = useContext(AuthContext);
  // const { pricingData } = useOrderContext();
  const [category, setCategory] = useState("Voluntary");
  const [serviceType, setServiceType] = useState("");
  const [sampleMethod, setSampleMethod] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [readGuide, setReadGuide] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [numPeople, setNumPeople] = useState(2);
  const [price, setPrice] = useState(0);
  const [memberTable, setMemberTable] = useState([
    { name: "", birth: "", gender: "Nam", relation: "", sampleType: "" },
    { name: "", birth: "", gender: "Nam", relation: "", sampleType: "" },
  ]);
  const [cccdError, setCccdError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const services = useServiceContext();

  useEffect(() => {
    if (sampleMethod === "At Center") {
      setMemberTable((prev) => {
        const current = [...prev];
        const difference = numPeople - current.length;

        if (difference > 0) {
          // Thêm người
          for (let i = 0; i < difference; i++) {
            current.push({
              name: "",
              birth: "",
              gender: "Nam",
              relation: "",
              sampleType: "",
            });
          }
        } else if (difference < 0) {
          // Cắt bớt
          current.splice(numPeople);
        }

        return current;
      });
    }
  }, [numPeople, sampleMethod]);

  // Mapping from serviceType value to keyword to match pricing name
  useEffect(() => {
    if (!serviceType) {
      setPrice(0);
      return;
    }

    const selectedService = services.find(
      (s) => String(s.id) === String(serviceType)
    );

    if (!selectedService) {
      setPrice(0);
      return;
    }

    let peopleCount = 0;
    if (sampleMethod === "At Center") {
      peopleCount = numPeople;
    } else if (sampleMethod === "At Home") {
      peopleCount = memberTable.length;
    }
    if (peopleCount < 2) peopleCount = 2;

    const base = selectedService.price2Samples || 0;
    const extra =
      peopleCount > 2
        ? (peopleCount - 2) * (selectedService.price3Samples || 0)
        : 0;

    setPrice(base + extra);
  }, [serviceType, numPeople, sampleMethod, memberTable, services]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (category === "Voluntary" && sampleMethod === "At Home" && !readGuide) {
      alert("Bạn cần xác nhận đã đọc và hiểu quy trình tự thu mẫu tại nhà.");
      return;
    }

    if (!agreed) {
      alert("Bạn cần xác nhận cam kết pháp lý và tự nguyện để tiếp tục.");
      return;
    }

    const form = e.target;
    const selectedService = services.find(
      (service) => String(service.id) == String(serviceType)
    );

    if (!selectedService) {
      alert("Dịch vụ không hợp lệ. Vui lòng chọn lại.");
      return;
    }

    // ✅ Check năm sinh
    if (sampleMethod === "At Home") {
      const invalidBirth = memberTable.some((m) => {
        const birth = Number(m.birth);
        return isNaN(birth) || birth < 1945 || birth > new Date().getFullYear();
      });

      if (invalidBirth) {
        alert(
          "Vui lòng nhập năm sinh hợp lệ (1945 đến nay) cho tất cả thành viên."
        );
        return;
      }
    }

    const sampleCount = memberTable.length;
    let price = 0;
    if (sampleCount === 2) {
      price = selectedService.price2Samples;
    } else if (sampleCount > 2) {
      price = selectedService.price2Samples + selectedService.price3Samples;
    }
    if (!appointmentDate) {
      alert("Vui lòng chọn ngày hẹn xét nghiệm.");
      return;
    }

    // Validate phone: only numbers and must start with 0
    const phoneValue = form.phone.value.trim();
    if (!/^0\d+$/.test(phoneValue)) {
      setPhoneError("Số điện thoại sai định dạng.");
      return;
    }
    setPhoneError("");

    ////////////
    // Validate CCCD
    const cccdValue = form.cccd.value.trim();
    // Validate CCCD: only numbers
    if (/[^0-9]/.test(cccdValue)) {
      setCccdError("Số CCCD chỉ được nhập số, không được nhập chữ hay ký tự.");
      return;
    }
    // Validate CCCD: must be 11 or 12 digits
    if (!/^\d{11,12}$/.test(cccdValue)) {
      setCccdError("Số CCCD phải gồm 11 hoặc 12 chữ số.");
      return;
    }
    setCccdError(""); // Clear error if valid

    // 1. Gửi đơn hàng đến BE
    // console.log( appointmentDate.toISOString().slice(0, 10))
    const submitPayload = {
      testRequest: {
        userId: user?.userId || null,
        serviceId: Number(serviceType),
        typeId: sampleMethod === "At Home" ? 1 : 2,
        category: category,
        scheduleDate: appointmentDate
          ? appointmentDate?.toISOString().split("T")[0] // yyyy-MM-dd
          : "",
        address: form.address.value,
        status: "Pending",
      },
      declarant: {
        fullName: form.fullName.value,
        gender: form.gender?.value || "Nam",
        address: form.address.value,
        identityNumber: form.cccd.value,
        identityIssuedDate: null,
        identityIssuedPlace: "",
        phone: form.phone.value,
        email: form.email.value,
      },
      samples: memberTable.map((m) => ({
        ownerName: m.name || "",
        gender: m.gender || "",
        relationship: m.relation || "",
        sampleType: m.sampleType || "",
        yob: Number(m.birth) || 0,
      })),
    };
    // console.log("form submit: ", submitPayload);
    try {
      const response = await userApi.submitFormRequest(submitPayload); // POST /user/submit
      // console.log(response);
      if (!response || response.status !== 200 || !response.data?.requestId) {
        throw new Error("Không thể tạo đơn hàng");
      }
      const requestId = response.data?.requestId;
      // console.log(requestId);
      if (!requestId) {
        alert("Không thể tạo đơn hàng. Vui lòng thử lại.");
        return;
      }

      // 2. Gọi API tạo link VNPAY
      const paymentData = {
        requestId: requestId,
        orderType: "other",
        amount: price,
        orderDescription: "Thanh toán dịch vụ ADN",
        name: form.fullName.value || user?.fullName || "",
      };
      // console.log(paymentData)
      const paymentRes = await vnpayApi.paymentRequest(paymentData); // POST /Payment/create-vnpay-url
      // await console.log("asdasdasd",  paymentRes)
      if (paymentRes.status === 200 && paymentRes.data.paymentUrl) {
        if (paymentRes.status === 200 && paymentRes.data.paymentUrl) {
          setShowToast(true);
          setAppointmentDate(null);
          setTimeout(() => setShowToast(false), 2500);
          window.location.href = paymentRes.data.paymentUrl;
        }
        window.location.href = paymentRes.data.paymentUrl;
      } else {
        alert("❌ Không tạo được liên kết thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi gửi đơn hàng hoặc thanh toán:", error.status);
      alert("🚫 Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      form.reset();
      setAgreed(false);
      setAppointmentDate(null);

      // setShowToast(true);
      setReadGuide(false);
      // setTimeout(() => setShowToast(false), 2500);
    }
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
                onChange={() => setPhoneError("")}
              />
              {phoneError && (
                <p style={{ color: "red", marginTop: 4, fontSize: "14px" }}>
                  {phoneError}
                </p>
              )}
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
                defaultValue={""}
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
                <option value="Voluntary">Dân sự</option>
                <option value="Administrative">Hành chính</option>
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
                {services
                  .filter((service) => service.category == category)
                  .map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.serviceName}
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
            {/* Số người xét nghiệm (chỉ khi tại trung tâm) */}
            {sampleMethod === "At Center" && (
              <div className="form-group" style={{ marginTop: 16 }}>
                <label htmlFor="numPeople">Số người xét nghiệm</label>
                <p style={{ color: "red" }}>
                  **Lưu ý: Chọn chính xác số người xét nghiệm
                </p>
                <select
                  id="numPeople"
                  name="numPeople"
                  value={numPeople}
                  onChange={(e) => setNumPeople(Number(e.target.value))}
                  required
                >
                  <option value={2}>2 người</option>
                  <option value={3}>3 người</option>
                </select>
              </div>
            )}
          </div>
          {price > 0 && (
            <div
              style={{
                background: "#f0fffa",
                border: "1px solid #b7eb8f",
                borderRadius: 8,
                padding: 16,
                margin: "16px 0",
                fontWeight: 600,
                color: "#389e0d",
                fontSize: 18,
              }}
            >
              Số tiền cần thanh toán:{" "}
              {new Intl.NumberFormat("vi-VN").format(price)} VNĐ
            </div>
          )}
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="cccd">Số CCCD</label>
              <input
                autoComplete="off" // ✅ THÊM DÒNG NÀY
                type="text"
                id="cccd"
                name="cccd"
                placeholder="Nhập số CCCD"
                onChange={() => setCccdError("")} // Clear error when user types
              />
              {cccdError && (
                <p style={{ color: "red", marginTop: 4, fontSize: "14px" }}>
                  {cccdError}
                </p>
              )}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="appointmentDate">Ngày hẹn xét nghiệm</label>
              <DatePicker
                autoComplete="off" // ✅ THÊM DÒNG NÀY
                selected={appointmentDate}
                onChange={(date) => setAppointmentDate(date)}
                minDate={(() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 2);
                  return d;
                })()}
                maxDate={(() => {
                  const d = new Date();
                  d.setMonth(d.getMonth() + 2);
                  return d;
                })()}
                filterDate={(date) => {
                  const today = new Date();
                  const threeDaysLater = new Date();
                  threeDaysLater.setDate(today.getDate() + 3);
                  return date >= threeDaysLater;
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày"
                id="appointmentDate"
                name="appointmentDate"
                required
                className="form-control"
              />

              {/* 🔻 Đặt thông báo bên ngoài DatePicker */}
              {!appointmentDate && (
                <p style={{ color: "red", marginTop: 4 }}>
                  ⚠️ Vui lòng chọn ngày xét nghiệm
                </p>
              )}
            </div>
          </div>
          {/* Bảng thông tin thành viên cung cấp mẫu (chỉ hiện khi tự thu tại nhà) */}
          {category === "Voluntary" && sampleMethod === "At Home" && (
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
          )}
          <div className="form-group">
            <label htmlFor="message">Ghi chú thêm</label>
            <textarea id="message" name="message" rows="4"></textarea>
          </div>
          {/* Hướng dẫn tự thu mẫu tại nhà */}
          {category === "Voluntary" && sampleMethod === "At Home" && (
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
                  href="https://www.youtube.com/watch?v=arLtbkwZETk"
                  target="_blank"
                  rel="noopener noreferrer"
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
