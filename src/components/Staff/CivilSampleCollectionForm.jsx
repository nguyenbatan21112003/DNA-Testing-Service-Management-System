import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserMinus, UserPlus } from "lucide-react";

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
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [prefill, setPrefill] = useState({});

    useEffect(() => {
        const data = localStorage.getItem("dna_sample_collection_prefill");
        if (data) setPrefill(JSON.parse(data));
    }, []);

    const validate = () => {
        const newErrors = {};
        if (!form.fullName.trim()) newErrors.fullName = "Bắt buộc";
        if (!form.phone.match(/^0\d{9}$/)) newErrors.phone = "SĐT không hợp lệ";
        if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) newErrors.email = "Email không hợp lệ";
        if (!form.address.trim()) newErrors.address = "Bắt buộc";
        if (!form.serviceType) newErrors.serviceType = "Bắt buộc";
        if (!form.sampleMethod) newErrors.sampleMethod = "Bắt buộc";
        if (!form.cccd.match(/^\d{9,12}$/)) newErrors.cccd = "CCCD không hợp lệ";
        if (!form.testDate) newErrors.testDate = "Bắt buộc";
        form.members.forEach((m, i) => {
            if (!m.name.trim()) newErrors[`member_name_${i}`] = "Bắt buộc";
            if (!m.birth.trim()) newErrors[`member_birth_${i}`] = "Bắt buộc";
            if (!m.gender) newErrors[`member_gender_${i}`] = "Bắt buộc";
            if (!m.relation.trim()) newErrors[`member_relation_${i}`] = "Bắt buộc";
            if (!m.sampleType.trim()) newErrors[`member_sampleType_${i}`] = "Bắt buộc";
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleMemberChange = (idx, field, value) => {
        setForm((prev) => ({
            ...prev,
            members: prev.members.map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
        }));
    };

    const handleAddMember = () => {
        setForm((prev) => ({
            ...prev,
            members: [
                ...prev.members,
                { name: "", birth: "", gender: "Nam", relation: "", sampleType: "" },
            ],
        }));
    };

    const handleRemoveMember = (idx) => {
        if (form.members.length > 2) {
            setForm((prev) => ({
                ...prev,
                members: prev.members.filter((_, i) => i !== idx),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        const data = { ...form, testDate: form.testDate?.toLocaleDateString("vi-VN") };
        const saved = JSON.parse(localStorage.getItem("civil_sample_collections") || "[]");
        localStorage.setItem("civil_sample_collections", JSON.stringify([...saved, data]));
        setSuccess("Lưu thông tin thu mẫu dân sự thành công!");
        setTimeout(() => setSuccess(""), 2000);
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

    const textFieldStyle = {
        height: 44,
        display: 'flex',
        alignItems: 'center',
        background: '#f9f9f9',
        borderRadius: 10,
        border: '1.5px solid #e0e7ef',
        fontSize: 16,
        fontWeight: 500,
        paddingLeft: 12,
        color: '#222',
        marginBottom: 8
    };

    return (
        <div style={{ maxWidth: 1200, margin: "32px auto", background: "#fff", borderRadius: 18, boxShadow: "0 8px 32px #0002", padding: 36 }}>
            <h2 style={{ textAlign: "center", color: "#009e74", fontWeight: 800, fontSize: 32, marginBottom: 18 }}>Lấy mẫu dân sự</h2>
            <form onSubmit={handleSubmit}>
                {/* Nhóm thông tin khách hàng */}
                <div style={{ marginBottom: 36, background: '#f4fafe', borderRadius: 18, border: '2px solid #b6e4e0', boxShadow: '0 4px 16px #b6e4e033', padding: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                        <svg width="26" height="26" fill="#00b894" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg>
                        <span style={{ fontWeight: 800, color: '#00b894', fontSize: 22, letterSpacing: 0.5 }}>Thông tin khách hàng</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Họ và tên</label>
                            <div style={textFieldStyle}>{prefill.fullName || ""}</div>
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Số điện thoại</label>
                            <div style={textFieldStyle}>{prefill.phone || ""}</div>
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Email</label>
                            <div style={textFieldStyle}>{prefill.email || ""}</div>
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Địa chỉ</label>
                            <div style={textFieldStyle}>{prefill.address || ""}</div>
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Số CCCD</label>
                            <div style={textFieldStyle}>{prefill.cccd || ""}</div>
                        </div>
                    </div>
                </div>
                {/* Nhóm thông tin xét nghiệm */}
                <div style={{ marginBottom: 36, background: '#f4fafe', borderRadius: 18, border: '2px solid #b6e4e0', boxShadow: '0 4px 16px #b6e4e033', padding: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                        <svg width="26" height="26" fill="#0984e3" viewBox="0 0 24 24"><path d="M7 2v2h10V2h2v2h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8H4A1 1 0 0 1 3 7V5a1 1 0 0 1 1-1h1V2h2zm0 4v13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6H7zm2 2h6v2H9V8zm0 4h6v2H9v-2z" /></svg>
                        <span style={{ fontWeight: 800, color: '#0984e3', fontSize: 22, letterSpacing: 0.5 }}>Thông tin xét nghiệm</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Thể loại xét nghiệm</label>
                            <select
                                name="serviceType"
                                value={form.serviceType || ''}
                                onChange={handleChange}
                                style={{
                                    height: 48,
                                    background: '#fff',
                                    borderRadius: 8,
                                    border: '1.5px solid #0984e3',
                                    fontSize: 16,
                                    fontWeight: 500,
                                    paddingLeft: 16,
                                    marginBottom: 8,
                                    width: '100%',
                                    boxShadow: '0 1px 4px #e0e7ef22'
                                }}
                                required
                            >
                                <option value="" disabled style={{ color: '#888', fontWeight: 500, background: '#fff' }}>Chọn thể loại xét nghiệm</option>
                                <option value="Xét nghiệm ADN dân sự - Cha con">Xét nghiệm ADN dân sự - Cha con</option>
                                <option value="Xét nghiệm ADN dân sự - Mẹ con">Xét nghiệm ADN dân sự - Mẹ con</option>
                                <option value="Xét nghiệm ADN dân sự - Anh chị em">Xét nghiệm ADN dân sự - Anh chị em</option>
                                <option value="Xét nghiệm ADN dân sự - Họ hàng">Xét nghiệm ADN dân sự - Họ hàng</option>
                                <option value="Xét nghiệm ADN dân sự - Nguồn gốc">Xét nghiệm ADN dân sự - Nguồn gốc</option>
                                <option value="Xét nghiệm ADN dân sự - Sức khỏe di truyền">Xét nghiệm ADN dân sự - Sức khỏe di truyền</option>
                                <option value="Xét nghiệm ADN dân sự - Nhanh">Xét nghiệm ADN dân sự - Nhanh</option>
                            </select>
                            {errors.serviceType && <span className="error-msg">{errors.serviceType}</span>}
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Địa điểm thu mẫu</label>
                            <div style={{
                                height: 44,
                                display: 'flex',
                                alignItems: 'center',
                                background: '#f9f9f9',
                                borderRadius: 10,
                                border: '1.5px solid #e0e7ef',
                                fontSize: 16,
                                fontWeight: 500,
                                paddingLeft: 12,
                                color: '#222',
                                marginBottom: 8,
                                width: '100%'
                            }}>Tại trung tâm</div>
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, marginBottom: 4, display: 'block' }}>Ngày xét nghiệm</label>
                            <DatePicker
                                selected={form.testDate || (prefill.appointmentDate ? new Date(prefill.appointmentDate) : appointmentDate ? new Date(appointmentDate) : null)}
                                onChange={date => setForm(prev => ({ ...prev, testDate: date }))}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Chọn ngày xét nghiệm"
                                className="form-control"
                                style={{ ...textFieldStyle, width: '100%' }}
                                required
                                minDate={new Date()}
                                filterDate={date => date.getDay() !== 0}
                            />
                            {errors.testDate && <span className="error-msg">{errors.testDate}</span>}
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%', margin: '32px 0 0 0' }}>
                    <label style={{ fontWeight: 600, color: '#009e74', marginBottom: 8, display: 'block' }}>Bảng thông tin thành viên cung cấp mẫu:</label>
                    <table style={{
                        width: "100%",
                        marginBottom: 12,
                        borderCollapse: "separate",
                        borderSpacing: 0,
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 2px 12px #e6f7ff55",
                        border: "1.5px solid #e6f7ff"
                    }}>
                        <thead>
                            <tr style={{ background: "#e6f7ff" }}>
                                <th style={{ padding: 10, fontWeight: 700, color: "#009e74", border: "none" }}>STT</th>
                                <th style={{ padding: 10, fontWeight: 700, color: "#009e74", border: "none" }}>Họ và tên</th>
                                <th style={{ padding: 10, fontWeight: 700, color: "#009e74", border: "none" }}>Năm sinh</th>
                                <th style={{ padding: 10, fontWeight: 700, color: "#009e74", border: "none" }}>Giới tính</th>
                                <th style={{ padding: 10, fontWeight: 700, color: "#009e74", border: "none" }}>Mối quan hệ</th>
                                <th style={{ padding: 10, fontWeight: 700, color: "#009e74", border: "none" }}>Loại mẫu</th>
                                <th style={{ padding: 10, border: "none" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {form.members.map((m, idx) => (
                                <tr key={idx} style={{ background: idx % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                                    <td style={{ textAlign: "center", padding: 8 }}>{idx + 1}</td>
                                    <td style={{ padding: 6 }}>
                                        <input type="text" value={m.name} onChange={e => handleMemberChange(idx, "name", e.target.value)} required style={{ width: "100%", borderRadius: 6, border: "1.2px solid #e0e7ef", padding: "6px 8px", fontSize: 15 }} />
                                        {errors[`member_name_${idx}`] && <span className="error-msg">{errors[`member_name_${idx}`]}</span>}
                                    </td>
                                    <td style={{ padding: 6 }}>
                                        <input type="text" value={m.birth} onChange={e => handleMemberChange(idx, "birth", e.target.value)} required style={{ width: "100%", borderRadius: 6, border: "1.2px solid #e0e7ef", padding: "6px 8px", fontSize: 15 }} />
                                        {errors[`member_birth_${idx}`] && <span className="error-msg">{errors[`member_birth_${idx}`]}</span>}
                                    </td>
                                    <td style={{ padding: 6 }}>
                                        <select value={m.gender} onChange={e => handleMemberChange(idx, "gender", e.target.value)} style={{ width: "100%", borderRadius: 6, border: "1.2px solid #e0e7ef", padding: "6px 8px", fontSize: 15 }} required>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                            <option value="Khác">Khác</option>
                                        </select>
                                        {errors[`member_gender_${idx}`] && <span className="error-msg">{errors[`member_gender_${idx}`]}</span>}
                                    </td>
                                    <td style={{ padding: 6 }}>
                                        <input type="text" value={m.relation} onChange={e => handleMemberChange(idx, "relation", e.target.value)} required style={{ width: "100%", borderRadius: 6, border: "1.2px solid #e0e7ef", padding: "6px 8px", fontSize: 15 }} />
                                        {errors[`member_relation_${idx}`] && <span className="error-msg">{errors[`member_relation_${idx}`]}</span>}
                                    </td>
                                    <td style={{ padding: 6 }}>
                                        <select value={m.sampleType} onChange={e => handleMemberChange(idx, "sampleType", e.target.value)} style={{ width: "100%", borderRadius: 6, border: "1.2px solid #e0e7ef", padding: "6px 8px", fontSize: 15 }} required>
                                            <option value="">Chọn loại mẫu</option>
                                            <option value="Nước bọt">Nước bọt</option>
                                            <option value="Máu">Máu</option>
                                            <option value="Tóc">Tóc</option>
                                            <option value="Móng">Móng</option>
                                            <option value="Niêm mạc">Niêm mạc</option>
                                        </select>
                                        {errors[`member_sampleType_${idx}`] && <span className="error-msg">{errors[`member_sampleType_${idx}`]}</span>}
                                    </td>
                                    <td style={{ textAlign: "center", padding: 8 }}>
                                        {form.members.length > 2 && idx >= 2 && (
                                            <button type="button" onClick={() => handleRemoveMember(idx)} style={{ background: "#ff5757", color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer" }}>Xóa</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                        <button type="button" onClick={handleAddMember} style={{ display: 'flex', alignItems: 'center', gap: 8, background: "#00b894", color: "#fff", border: "none", borderRadius: 6, padding: "10px 20px", cursor: "pointer", fontWeight: 600, fontSize: 15 }}>
                            <UserPlus size={18} /> Thêm thành viên
                        </button>
                    </div>
                </div>
                <div style={{ width: '100%', margin: '32px 0 0 0' }}>
                    <button type="submit" style={{ background: "#00b894", color: "#fff", border: "none", borderRadius: 6, padding: "12px 24px", cursor: "pointer" }}>Lưu thông tin</button>
                </div>
            </form>
        </div>
    );
};

export default CivilSampleCollectionForm;