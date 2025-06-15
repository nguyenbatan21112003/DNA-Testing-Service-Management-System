import React, { useState } from 'react';

const inputStyle = {
  width: '100%',
  border: '1px solid #bbb',
  borderRadius: 6,
  padding: 8,
  fontSize: 16,
  marginBottom: 4,
  background: '#fff',
  outline: 'none',
};
const labelStyle = {
  fontWeight: 600,
  marginBottom: 4,
  display: 'block',
};

const RequestFormModal = ({ open, onClose, category }) => {
  const [commitChecked, setCommitChecked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  if (!open) return null;
  const handleSave = () => {
    if (!commitChecked) return;
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.18)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          minWidth: 600,
          maxWidth: 1000,
          maxHeight: "90vh",
          padding: 32,
          boxShadow: "0 8px 32px #0002",
          position: "relative",
          fontSize: 17,
          overflowY: "auto",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 18,
            background: "none",
            border: "none",
            fontSize: 26,
            color: "#888",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <h2 style={{ textAlign: "center", color: "#009e74", fontWeight: 800, fontSize: 32, marginBottom: 18 }}>ĐƠN YÊU CẦU PHÂN TÍCH ADN</h2>
        <form>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Họ và tên</label>
              <input style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Giới tính</label>
              <select style={inputStyle}>
                <option>Nam</option>
                <option>Nữ</option>
                <option>Không xác định</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Địa chỉ</label>
            <input style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>CMND/CCCD</label>
              <input style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Ngày cấp</label>
              <input type="date" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Nơi cấp</label>
              <input style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Số điện thoại</label>
              <input style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} />
            </div>
          </div>
          <div style={{ margin: '18px 0 10px 0', fontWeight: 600, color: '#009e74' }}>
            Bảng thông tin thành viên cung cấp mẫu:
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 18 }}>
            <thead>
              <tr style={{ background: '#f6f8fa' }}>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>STT</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>Họ và tên</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>Năm sinh</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>Giới tính</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>Mối quan hệ</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>Loại mẫu</th>
                <th style={{ border: '1px solid #ccc', padding: 6 }}>Ngày thu mẫu</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map((i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #ccc', padding: 6 }}>{i}</td>
                  <td style={{ border: '1px solid #ccc', padding: 6 }}><input style={inputStyle} /></td>
                  <td style={{ border: '1px solid #ccc', padding: 6 }}><input style={inputStyle} /></td>
                  <td style={{ border: '1px solid #ccc', padding: 6 }}>
                    <select style={inputStyle}>
                      <option>Nam</option>
                      <option>Nữ</option>
                    </select>
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: 6 }}><input style={inputStyle} /></td>
                  <td style={{ border: '1px solid #ccc', padding: 6 }}><input style={inputStyle} /></td>
                  <td style={{ border: '1px solid #ccc', padding: 6 }}><input type="date" style={inputStyle} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Nếu là hành chính thì hiện thêm form biên bản lấy mẫu */}
          {category === 'admin' && (
            <div style={{ marginTop: 32, borderTop: '2px dashed #bbb', paddingTop: 24 }}>
              <h3 style={{ textAlign: 'center', color: '#e74c3c', fontWeight: 900, fontSize: 28, marginBottom: 18, letterSpacing: 1 }}>BIÊN BẢN LẤY MẪU XÉT NGHIỆM</h3>
              <div style={{ marginBottom: 16, fontWeight: 600, fontSize: 17, display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                <span style={{ whiteSpace: 'nowrap' }}>Hôm nay, ngày</span>
                <input style={{ width: 38, ...inputStyle, textAlign: 'center', color: '#e91e63', fontWeight: 700, margin: '0 2px' }} maxLength={2} />
                <span style={{ margin: '0 2px', whiteSpace: 'nowrap' }}>tháng</span>
                <input style={{ width: 38, ...inputStyle, textAlign: 'center', color: '#e91e63', fontWeight: 700, margin: '0 2px' }} maxLength={2} />
                <span style={{ margin: '0 2px', whiteSpace: 'nowrap' }}>năm</span>
                <input style={{ width: 54, ...inputStyle, textAlign: 'center', color: '#e91e63', fontWeight: 700, margin: '0 2px' }} maxLength={4} />
                <span style={{ margin: '0 2px', whiteSpace: 'nowrap' }}>, tại</span>
                <input style={{ width: 180, ...inputStyle, margin: '0 2px' }} />
              </div>
              <div style={{ marginBottom: 16, fontWeight: 600 }}>
                <span>Chúng tôi gồm có:</span>
                <div style={{ marginTop: 6, marginLeft: 18 }}>
                  1. Nhân viên thu mẫu: <input style={{ width: 220, ...inputStyle, border: '1.5px solid #e67e22' }} />
                </div>
                <div style={{ marginTop: 6, marginLeft: 18 }}>
                  2. Người yêu cầu xét nghiệm: <input style={{ width: 220, ...inputStyle, border: '1.5px solid #e67e22' }} />
                  <span style={{ marginLeft: 12 }}>Địa chỉ hiện tại: <input style={{ width: 320, ...inputStyle, border: '1.5px solid #e67e22' }} /></span>
                </div>
              </div>
              <div style={{ marginBottom: 18, fontWeight: 600 }}>
                Chúng tôi tiến hành lấy mẫu của những người đề nghị xét nghiệm ADN. Các mẫu của từng người được lấy riêng rẽ như sau:
              </div>
              {[1,2,3].map(i => (
                <div key={i} style={{ border: '1.5px solid #e67e22', borderRadius: 10, padding: 14, marginBottom: 18, background: '#fffbe6', boxShadow: '0 2px 8px #e67e2211' }}>
                  <div style={{ display: 'flex', gap: 18, marginBottom: 8 }}>
                    <div style={{ flex: 2, fontSize: 16 }}>
                      <div style={{ marginBottom: 4 }}>Họ và tên: <input style={{ width: 180, ...inputStyle, border: '1.5px solid #bbb' }} /></div>
                      <div style={{ marginBottom: 4 }}>Ngày sinh: <input style={{ width: 120, ...inputStyle, border: '1.5px solid #bbb' }} /></div>
                      <div style={{ marginBottom: 4 }}>Loại giấy tờ: <input style={{ width: 120, ...inputStyle, border: '1.5px solid #bbb' }} /> Số: <input style={{ width: 120, ...inputStyle, border: '1.5px solid #bbb' }} /> Ngày cấp: <input style={{ width: 120, ...inputStyle, border: '1.5px solid #bbb' }} /></div>
                      <div style={{ marginBottom: 4 }}>Ngày hết hạn: <input style={{ width: 120, ...inputStyle, border: '1.5px solid #bbb' }} /> Nơi cấp: <input style={{ width: 120, ...inputStyle, border: '1.5px solid #bbb' }} /> Quốc tịch: <input style={{ width: 120, ...inputStyle, border: '1.5px solid #bbb' }} /></div>
                      <div style={{ marginBottom: 4 }}>Địa chỉ: <input style={{ width: 320, ...inputStyle, border: '1.5px solid #bbb' }} /></div>
                      <div style={{ marginBottom: 4 }}>Loại mẫu: <input style={{ width: 80, ...inputStyle, border: '1.5px solid #bbb' }} /> Số lượng mẫu: <input style={{ width: 60, ...inputStyle, border: '1.5px solid #bbb' }} /> Mối quan hệ: <input style={{ width: 120, ...inputStyle, border: '1.5px solid #bbb' }} /></div>
                      <div style={{ marginBottom: 4 }}>Người cho mẫu hoặc giám hộ (ký tên): <input style={{ width: 180, ...inputStyle, border: '1.5px solid #bbb' }} /></div>
                      <div style={{ marginBottom: 4 }}>Tiểu sử bệnh về máu, truyền máu hoặc ghép tủy trong 6 tháng: <input style={{ width: 180, ...inputStyle, border: '1.5px solid #bbb' }} /></div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontWeight: 700, marginBottom: 8, color: '#e67e22', fontSize: 16 }}>Người cho mẫu thứ {i}</div>
                      <div style={{ border: '1.5px solid #bbb', borderRadius: 8, width: 100, height: 120, margin: '0 auto', background: '#fff' }}>
                        <span style={{ color: '#bbb', fontSize: 13, lineHeight: '120px' }}>[Dấu vân tay]</span>
                      </div>
                      <div style={{ fontSize: 13, marginTop: 4, color: '#888' }}>Vân tay ngón trỏ phải</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Nút cam kết và Lưu chuyển xuống cuối cùng */}
          <div style={{ marginTop: 18, marginBottom: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={commitChecked} onChange={e => setCommitChecked(e.target.checked)} />
              <span style={{ fontSize: 16 }}>
                Tôi xin cam kết chịu trách nhiệm về thông tin đã cung cấp và đồng ý với các điều khoản của dịch vụ.
              </span>
            </label>
          </div>
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <button
              type="button"
              style={{
                padding: '10px 32px',
                borderRadius: 8,
                background: commitChecked ? '#009e74' : '#ccc',
                color: '#fff',
                fontWeight: 700,
                fontSize: 18,
                border: 'none',
                cursor: commitChecked ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
              }}
              onClick={handleSave}
              disabled={!commitChecked}
            >
              Lưu
            </button>
          </div>
          {showSuccess && (
            <div style={{ textAlign: 'center', color: '#009e74', fontWeight: 600, fontSize: 18, marginTop: 8 }}>
              Gửi form thành công!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RequestFormModal; 