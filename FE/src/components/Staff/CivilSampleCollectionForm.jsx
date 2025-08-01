import { useState, useEffect } from "react";
import { useOrderContext } from "../../context/OrderContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserPlus } from "lucide-react";
import staffApi from "../../api/staffApi";

const CivilSampleCollectionForm = ({ appointmentDate }) => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    serviceType: "",
    serviceCategory: "Dân sự",
    sampleMethod: "center",
    cccd: "",
    testDate: null,
    note: "",
    members: [
      { name: "", birth: "", gender: "Nam", relation: "", sampleType: "" },
      { name: "", birth: "", gender: "Nam", relation: "", sampleType: "" },
    ],
  });
  const { updateOrder, updateSamplingStatus } = useOrderContext();
  const [errors, setErrors] = useState({});
  const [prefill, setPrefill] = useState({});
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("dna_sample_collection_prefill");
    if (data) {
      const parsed = JSON.parse(data);
      setPrefill(parsed);
      // console.log("sampleIds:", parsed.sampleIds); // 👈 nếu bạn muốn debug
    }
  }, []);

  useEffect(() => {
    if (prefill?.sampleIds?.length) {
      // Nếu có sampleIds, tạo form.members dựa trên sample count
      setForm((prev) => ({
        ...prev,
        members: prefill.sampleIds.map(() => ({
          name: "",
          birth: "",
          gender: "Nam",
          relation: "",
          sampleType: "",
        })),
      }));
    }
  }, [prefill]);

  useEffect(() => {
    if (prefill) {
      setForm((prev) => ({
        ...prev,
        fullName: prefill.fullName || "",
        phone: prefill.phone || "",
        email: prefill.email || "",
        address: prefill.address || "",
        cccd: prefill.cccd || "",
        serviceType: prefill.serviceType || prefill.type || prev.serviceType,
        serviceCategory: "Dân sự",
        sampleMethod: "At Center",
      }));
    }
  }, [prefill]);

  const validate = () => {
    const newErrors = {};
    // Chỉ validate thành viên cung cấp mẫu
    form.members.forEach((m, i) => {
      if (!m.name.trim()) newErrors[`member_name_${i}`] = "Bắt buộc";
      if (!/^(19|20)\d{2}$/.test(m.birth.trim()))
        newErrors[`member_birth_${i}`] = "Năm sinh không hợp lệ";
      if (!m.gender) newErrors[`member_gender_${i}`] = "Bắt buộc";
      if (!m.relation.trim()) newErrors[`member_relation_${i}`] = "Bắt buộc";
      if (!m.sampleType.trim())
        newErrors[`member_sampleType_${i}`] = "Bắt buộc";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // handle CCCD input with inline validation
  const handleCccdChange = (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, cccd: val }));
    if (/[^0-9]/.test(val)) {
      setErrors((prev) => ({ ...prev, cccd: "Chỉ được nhập chữ số." }));
    } else if (!/^\d{11,12}$/.test(val)) {
      setErrors((prev) => ({
        ...prev,
        cccd: "CCCD phải gồm 11 hoặc 12 chữ số.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, cccd: "" }));
    }
  };

  const handleMemberChange = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.map((m, i) =>
        i === idx ? { ...m, [field]: value } : m
      ),
    }));
  };

  // const handleAddMember = () => {
  //   setForm((prev) => ({
  //     ...prev,
  //     members: [
  //       ...prev.members,
  //       { name: "", birth: "", gender: "Nam", relation: "", sampleType: "" },
  //     ],
  //   }));
  // };

  const handleRemoveMember = (idx) => {
    if (form.members.length > 2) {
      setForm((prev) => ({
        ...prev,
        members: prev.members.filter((_, i) => i !== idx),
      }));
    }
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      serviceType: "",
      serviceCategory: "Dân sự",
      sampleMethod: "center",
      cccd: "",
      testDate: null,
      note: "",
      members: [
        { name: "", birth: "", gender: "Nam", relation: "", sampleType: "" },
        { name: "", birth: "", gender: "Nam", relation: "", sampleType: "" },
      ],
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date().toISOString();

    const payload = form.members.map((m, index) => ({
      sampleId: prefill.sampleIds?.[index] ?? 0,
      requestId: prefill?.orderId || null,
      ownerName: m.name,
      gender: m.gender,
      relationship: m.relation,
      sampleType: m.sampleType,
      yob: parseInt(m.birth),
      collectedAt: now,
    }));
    const payloadUpdate = {
      processId: prefill.orderProcessId,
    };
    // console.log(payloadUpdate)
    // console.log(payload);
    try {
      const response = await staffApi.updateCenterSampleVoluntary(payload);

      const updateRes = await staffApi.receiveSample(payloadUpdate);
      // console.log("response nè", response, updateRes);
      if (
        response?.status === 200 &&
        response?.data.success == true &&
        updateRes?.data.success == true
      ) {
        // Nếu gọi thành công, thực hiện các hành động sau:
        setShowSuccessOverlay(true);
        setTimeout(() => {
          setShowSuccessOverlay(false);
          resetForm(); // ✅ dùng hàm đã tạo
        }, 5000);

        if (prefill?.orderId) {
          updateOrder(prefill.orderId, { members: form.members });
          if (typeof updateSamplingStatus === "function") {
            updateSamplingStatus(prefill.orderId, "Đang xử lý");
          }
        }
        alert("✅Cập nhật mẫu thành công");
      } else {
        alert("❌Không thể cập nhật mẫu, VUi lòng thử lại sau !!");
      }
    } catch (error) {
      console.error("Lỗi gửi dữ liệu:", error.status);
      alert("❌Gửi dữ liệu thất bại. Vui lòng thử lại.");
    }
  };

  const textFieldStyle = {
    height: 44,
    display: "flex",
    alignItems: "center",
    background: "#f9f9f9",
    borderRadius: 10,
    border: "1.5px solid #e0e7ef",
    fontSize: 16,
    fontWeight: 500,
    paddingLeft: 12,
    color: "#222",
    marginBottom: 8,
  };

  // DNA emoji icon giống logo
  const dnaIcon = (
    <div style={{ fontSize: 64, marginBottom: 18, lineHeight: 1 }}>🧬</div>
  );

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "32px auto",
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 8px 32px #0002",
        padding: 36,
        position: "relative",
      }}
    >
      {showSuccessOverlay && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.97)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 18,
            boxShadow: "0 8px 32px #0002",
            animation: "fadeIn 0.3s",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #e0f7fa 0%, #e6ffe6 100%)",
              border: "2.5px solid #00b894",
              borderRadius: 20,
              padding: "48px 40px",
              boxShadow: "0 4px 32px #00b89422",
              textAlign: "center",
              maxWidth: 480,
              minWidth: 320,
            }}
          >
            <div style={{ marginBottom: 18 }}>{dnaIcon}</div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 900,
                color: "#009e74",
                marginBottom: 14,
                letterSpacing: 0.5,
              }}
            >
              Lấy mẫu thành công!
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#222",
                marginBottom: 10,
                fontWeight: 500,
              }}
            >
              Mẫu sinh phẩm đã được tiếp nhận và chuyển đến phòng xét nghiệm.
            </div>
            <div
              style={{
                fontSize: 16,
                color: "#555",
                marginTop: 18,
                lineHeight: 1.6,
              }}
            >
              Cảm ơn bạn đã hoàn thành quy trình lấy mẫu.
              <br />
              Bạn có thể tiếp tục nhập đơn mới hoặc quay lại danh sách.
            </div>
          </div>
        </div>
      )}
      <h2
        style={{
          textAlign: "center",
          color: "#009e74",
          fontWeight: 800,
          fontSize: 32,
          marginBottom: 18,
        }}
      >
        Lấy mẫu dân sự
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Nhóm thông tin khách hàng */}
        <div
          style={{
            marginBottom: 36,
            background: "#f4fafe",
            borderRadius: 18,
            border: "2px solid #b6e4e0",
            boxShadow: "0 4px 16px #b6e4e033",
            padding: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <svg width="26" height="26" fill="#00b894" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            </svg>
            <span
              style={{
                fontWeight: 800,
                color: "#00b894",
                fontSize: 22,
                letterSpacing: 0.5,
              }}
            >
              Thông tin khách hàng
            </span>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
          >
            <div className="form-group">
              <label
                style={{ fontWeight: 600, marginBottom: 4, display: "block" }}
              >
                Họ và tên
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                style={textFieldStyle}
                required
              />
            </div>
            <div className="form-group">
              <label
                style={{ fontWeight: 600, marginBottom: 4, display: "block" }}
              >
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                style={textFieldStyle}
                required
              />
            </div>
            <div className="form-group">
              <label
                style={{ fontWeight: 600, marginBottom: 4, display: "block" }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={textFieldStyle}
                required
              />
            </div>
            <div className="form-group">
              <label
                style={{ fontWeight: 600, marginBottom: 4, display: "block" }}
              >
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                style={textFieldStyle}
                required
              />
            </div>
            <div className="form-group">
              <label
                style={{ fontWeight: 600, marginBottom: 4, display: "block" }}
              >
                Số CCCD
              </label>
              <input
                type="text"
                name="cccd"
                value={form.cccd}
                onChange={handleCccdChange}
                onBlur={() => setErrors((prev) => ({ ...prev, cccd: "" }))}
                style={textFieldStyle}
                required
              />
              {errors.cccd && <span className="error-msg">{errors.cccd}</span>}
            </div>
          </div>
        </div>
        {/* Nhóm thông tin xét nghiệm */}
        <div
          style={{
            marginBottom: 36,
            background: "#f4fafe",
            borderRadius: 18,
            border: "2px solid #b6e4e0",
            boxShadow: "0 4px 16px #b6e4e033",
            padding: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <svg width="26" height="26" fill="#0984e3" viewBox="0 0 24 24">
              <path d="M7 2v2h10V2h2v2h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8H4A1 1 0 0 1 3 7V5a1 1 0 0 1 1-1h1V2h2zm0 4v13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6H7zm2 2h6v2H9V8zm0 4h6v2H9v-2z" />
            </svg>
            <span
              style={{
                fontWeight: 800,
                color: "#0984e3",
                fontSize: 22,
                letterSpacing: 0.5,
              }}
            >
              Thông tin xét nghiệm
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="form-group">
              <label
                style={{ fontWeight: 600, marginBottom: 4, display: "block" }}
              >
                Thể loại xét nghiệm
              </label>
              <div
                style={{
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  background: "#f9f9f9",
                  borderRadius: 10,
                  border: "1.5px solid #e0e7ef",
                  fontSize: 16,
                  fontWeight: 500,
                  paddingLeft: 12,
                  color: "#222",
                  marginBottom: 8,
                }}
              >
                {form.serviceType || "Không xác định"}
              </div>
              {errors.serviceType && (
                <span className="error-msg">{errors.serviceType}</span>
              )}
            </div>
            <div className="form-group">
              <label
                style={{ fontWeight: 600, marginBottom: 4, display: "block" }}
              >
                Địa điểm thu mẫu
              </label>
              <div
                style={{
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  background: "#f9f9f9",
                  borderRadius: 10,
                  border: "1.5px solid #e0e7ef",
                  fontSize: 16,
                  fontWeight: 500,
                  paddingLeft: 12,
                  color: "#222",
                  marginBottom: 8,
                  width: "100%",
                }}
              >
                Tại trung tâm
              </div>
            </div>
            <div className="form-group">
              <label
                style={{ fontWeight: 600, marginBottom: 4, display: "block" }}
              >
                Ngày xét nghiệm
              </label>
              <DatePicker
                selected={
                  form.testDate ||
                  (prefill.appointmentDate
                    ? new Date(prefill.appointmentDate)
                    : appointmentDate
                    ? new Date(appointmentDate)
                    : null)
                }
                onChange={(date) =>
                  setForm((prev) => ({ ...prev, testDate: date }))
                }
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày xét nghiệm"
                className="form-control"
                style={{ ...textFieldStyle, width: "100%" }}
                required
                minDate={new Date()}
                filterDate={(date) => date.getDay() !== 0}
              />
              {errors.testDate && (
                <span className="error-msg">{errors.testDate}</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ width: "100%", margin: "32px 0 0 0" }}>
          <label
            style={{
              fontWeight: 600,
              color: "#009e74",
              marginBottom: 8,
              display: "block",
            }}
          >
            Bảng thông tin thành viên cung cấp mẫu:
          </label>
          <table
            style={{
              width: "100%",
              marginBottom: 12,
              borderCollapse: "separate",
              borderSpacing: 0,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 2px 12px #e6f7ff55",
              border: "1.5px solid #e6f7ff",
            }}
          >
            <thead>
              <tr style={{ background: "#e6f7ff" }}>
                <th
                  style={{
                    padding: 10,
                    fontWeight: 700,
                    color: "#009e74",
                    border: "none",
                  }}
                >
                  STT
                </th>
                <th
                  style={{
                    padding: 10,
                    fontWeight: 700,
                    color: "#009e74",
                    border: "none",
                  }}
                >
                  Họ và tên
                </th>
                <th
                  style={{
                    padding: 10,
                    fontWeight: 700,
                    color: "#009e74",
                    border: "none",
                  }}
                >
                  Năm sinh
                </th>
                <th
                  style={{
                    padding: 10,
                    fontWeight: 700,
                    color: "#009e74",
                    border: "none",
                  }}
                >
                  Giới tính
                </th>
                <th
                  style={{
                    padding: 10,
                    fontWeight: 700,
                    color: "#009e74",
                    border: "none",
                  }}
                >
                  Mối quan hệ
                </th>
                <th
                  style={{
                    padding: 10,
                    fontWeight: 700,
                    color: "#009e74",
                    border: "none",
                  }}
                >
                  Loại mẫu
                </th>
                <th style={{ padding: 10, border: "none" }}></th>
              </tr>
            </thead>
            <tbody>
              {form.members.map((m, idx) => (
                <tr
                  key={idx}
                  style={{ background: idx % 2 === 0 ? "#f9f9f9" : "#fff" }}
                >
                  <td style={{ textAlign: "center", padding: 8 }}>{idx + 1}</td>
                  <td style={{ padding: 6 }}>
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) =>
                        handleMemberChange(idx, "name", e.target.value)
                      }
                      required
                      style={{
                        width: "100%",
                        borderRadius: 6,
                        border: "1.2px solid #e0e7ef",
                        padding: "6px 8px",
                        fontSize: 15,
                      }}
                    />
                    {errors[`member_name_${idx}`] && (
                      <span className="error-msg">
                        {errors[`member_name_${idx}`]}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: 6 }}>
                    <input
                      type="text"
                      value={m.birth}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleMemberChange(idx, "birth", val);
                        const year = parseInt(val, 10);
                        const currentYear = new Date().getFullYear();
                        if (/[^0-9]/.test(val)) {
                          setErrors((prev) => ({
                            ...prev,
                            [`member_birth_${idx}`]:
                              "Năm sinh chỉ được nhập số.",
                          }));
                        } else if (
                          isNaN(year) ||
                          year < 1945 ||
                          year > currentYear
                        ) {
                          setErrors((prev) => ({
                            ...prev,
                            [`member_birth_${idx}`]: `Năm sinh phải từ 1945 đến ${currentYear}.`,
                          }));
                        } else {
                          setErrors((prev) => ({
                            ...prev,
                            [`member_birth_${idx}`]: "",
                          }));
                        }
                      }}
                      onBlur={() =>
                        setErrors((prev) => ({
                          ...prev,
                          [`member_birth_${idx}`]: "",
                        }))
                      }
                      required
                      style={{
                        width: "100%",
                        borderRadius: 6,
                        border: "1.2px solid #e0e7ef",
                        padding: "6px 8px",
                        fontSize: 15,
                      }}
                    />
                    {errors[`member_birth_${idx}`] && (
                      <span className="error-msg">
                        {errors[`member_birth_${idx}`]}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: 6 }}>
                    <select
                      value={m.gender}
                      onChange={(e) =>
                        handleMemberChange(idx, "gender", e.target.value)
                      }
                      style={{
                        width: "100%",
                        borderRadius: 6,
                        border: "1.2px solid #e0e7ef",
                        padding: "6px 8px",
                        fontSize: 15,
                      }}
                      required
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                    {errors[`member_gender_${idx}`] && (
                      <span className="error-msg">
                        {errors[`member_gender_${idx}`]}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: 6 }}>
                    <input
                      type="text"
                      value={m.relation}
                      onChange={(e) =>
                        handleMemberChange(idx, "relation", e.target.value)
                      }
                      required
                      style={{
                        width: "100%",
                        borderRadius: 6,
                        border: "1.2px solid #e0e7ef",
                        padding: "6px 8px",
                        fontSize: 15,
                      }}
                    />
                    {errors[`member_relation_${idx}`] && (
                      <span className="error-msg">
                        {errors[`member_relation_${idx}`]}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: 6 }}>
                    <select
                      value={m.sampleType}
                      onChange={(e) =>
                        handleMemberChange(idx, "sampleType", e.target.value)
                      }
                      style={{
                        width: "100%",
                        borderRadius: 6,
                        border: "1.2px solid #e0e7ef",
                        padding: "6px 8px",
                        fontSize: 15,
                      }}
                      required
                    >
                      <option value="">Chọn loại mẫu</option>
                      <option value="Nước bọt">Nước bọt</option>
                      <option value="Máu">Máu</option>
                      <option value="Tóc">Tóc</option>
                      <option value="Móng">Móng</option>
                      <option value="Niêm mạc">Niêm mạc</option>
                    </select>
                    {errors[`member_sampleType_${idx}`] && (
                      <span className="error-msg">
                        {errors[`member_sampleType_${idx}`]}
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: "center", padding: 8 }}>
                    {form.members.length > 2 && idx >= 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        style={{
                          background: "#ff5757",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 12px",
                          cursor: "pointer",
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
        </div>
        <div
          style={{
            width: "100%",
            margin: "32px 0 0 0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            type="submit"
            style={{
              background: "#00b894",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "12px 32px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Xác nhận lấy mẫu
          </button>
        </div>
      </form>
    </div>
  );
};

export default CivilSampleCollectionForm;
