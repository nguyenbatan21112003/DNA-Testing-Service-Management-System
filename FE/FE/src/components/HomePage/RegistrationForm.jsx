"use client";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
// import { useOrderContext } from "../../context/OrderContext";
import userApi from "../../api/userApI";
import { ServiceContext } from "../../context/ServiceContext";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    category: "Voluntary",
    serviceType: "",
    message: "",
  });
  const { user } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  // const { addOrder } = useOrderContext();
  // const [services, setServices] = useState([]);
  // const [category, setCategory] = useState("Voluntary");
  const services = useContext(ServiceContext);



  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!/^0\d{9,10}$/.test(formData.phone))
      newErrors.phone = "Số điện thoại không hợp lệ";
    if (!formData.serviceType)
      newErrors.serviceType = "Vui lòng chọn loại dịch vụ";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { serviceType: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0 || !formData.serviceType) return;
    // addOrder({
    //   id: Date.now().toString(),
    //   name: formData.fullName,
    //   phone: formData.phone,
    //   type: formData.serviceType || "",
    //   category: formData.category,
    //   message: formData.message,
    //   date: new Date().toLocaleDateString("vi-VN"),
    //   sampleMethod: "",
    //   priority: "Trung bình",
    // });
    const consultationData = {
      fullName: formData.fullName,
      phone: formData.phone,
      category: formData.category,
      serviceId: formData.serviceType,
      email: user?.email || "",
      message: formData.message,
    };

    try {
      const res = await userApi.sendConsultRequest(consultationData);
      console.log(res)
      // Kiểm tra phản hồi hợp lệ
      const consultResult = res?.data?.result;
      const consultId = consultResult?.consultId;

      if (!consultResult || !consultId || consultId === 0) {
        throw new Error("Tư vấn không được ghi nhận (consultId = 0).");
      }

      setShowSuccess(true);
      setFormData({
        fullName: "",
        phone: "",
        category: "Voluntary",
        serviceType: "",
        message: "",
      });
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (err) {
      console.error("Lỗi gửi tư vấn:", err);
      let message = "Không thể gửi yêu cầu tư vấn. Vui lòng thử lại sau.";
      window.alert(message);
    }
  };

  // useEffect(() => {
  //   // fetchServices();
  // }, []);

  return (
    <section className="registration-section" id="registration">
      <div
        className="registration-2col-layout"
        style={{
          display: "flex",
          gap: 32,
          alignItems: "stretch",
          justifyContent: "center",
          maxWidth: 1100,
          margin: "0 auto",
          minHeight: 500,
          background: "none",
        }}
      >
        {/* Bên trái: Hình ảnh minh họa */}
        <div
          style={{
            flex: "0 0 40%",
            maxWidth: "40%",
            minWidth: 420,
            minHeight: 970,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            background: "#f6f8fa",
            borderRadius: 16,
            height: "100%",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <style>
              {`
                .tuvan-cta {
                  margin-top: 24px;
                  text-align: center;
                  font-weight: 700;
                  font-size: 22px;
                  padding: 12px 18px;
                  border-radius: 12px;
                  background: linear-gradient(90deg, #0a7cff, #7f5fff, #00e0d3, #0a7cff);
                  background-size: 300% 300%;
                  color: #fff;
                  box-shadow: 0 4px 24px 0 rgba(10,124,255,0.08);
                  transition: transform 0.2s, box-shadow 0.2s;
                  animation: gradientMove 3s ease-in-out infinite;
                  cursor: pointer;
                  user-select: none;
                }
                .tuvan-cta:hover {
                  transform: scale(1.06);
                  box-shadow: 0 8px 32px 0 rgba(127,95,255,0.18);
                }
                @keyframes gradientMove {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}
            </style>
            <img
              src="/new-tu-van.png"
              alt="Xét nghiệm ADN"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 12,
              }}
            />
            <div className="tuvan-cta">
              Đăng ký ngay để nhận tư vấn miễn phí từ chuyên gia của chúng tôi!
            </div>
          </div>
        </div>
        {/* Bên phải: Form tư vấn */}
        <div
          style={{
            flex: "1 1 60%",
            maxWidth: "60%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <div
            className="registration-container"
            style={{ width: "100%", minWidth: 320 }}
          >
            <h2 className="registration-title">Đăng ký nhận tư vấn</h2>
            <p className="registration-desc">
              Vui lòng điền thông tin để nhận tư vấn miễn phí về các dịch vụ xét
              nghiệm ADN của chúng tôi.
            </p>
            <form
              className="registration-form"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Họ và tên</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    className={errors.fullName ? "input-error" : ""}
                    required
                  />
                  {errors.fullName && (
                    <span className="error-msg">{errors.fullName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className={errors.phone ? "input-error" : ""}
                    required
                  />
                  {errors.phone && (
                    <span className="error-msg">{errors.phone}</span>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Thể loại xét nghiệm</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => handleChange(e)}
                    required
                  >
                    <option value="Voluntary">Dân sự</option>
                    <option value="Administrative">Hành chính</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="serviceType">Loại dịch vụ xét nghiệm</label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className={errors.serviceType ? "input-error" : ""}
                    required
                  >
                    <option value="">Chọn loại dịch vụ</option>
                    {services
                      ?.filter((option) => option.category == formData.category)
                      ?.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.serviceName}
                        </option>
                      ))}
                  </select>
                  {errors.serviceType && (
                    <span className="error-msg">{errors.serviceType}</span>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div
                  className="form-group"
                  style={{ width: "100%", gridColumn: "1/-1" }}
                >
                  <label htmlFor="message">
                    Nội dung cần tư vấn (không bắt buộc)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung bạn muốn được tư vấn..."
                    rows={7}
                    style={{
                      width: "100%",
                      minWidth: "100%",
                      maxWidth: "100%",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="submit-button"
                style={{ opacity: 1, cursor: "pointer" }}
              >
                Đăng ký nhận tư vấn
              </button>
              {showSuccess && (
                <div className="login-warning">
                  Đăng ký nhận tư vấn thành công! Chúng tôi sẽ liên hệ với bạn
                  sớm.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
