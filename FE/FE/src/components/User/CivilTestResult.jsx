import React from 'react';
// Note: only dùng cho đơn loại "dân sự".
// Nếu order không phải dân sự, component sẽ return null.

/**
 * Modal hiển thị kết quả xét nghiệm.
 * Được tách ra từ UserProfile.jsx để dễ bảo trì.
 * - Hỗ trợ 3 trường hợp: loại dân sự, category === 'admin', và các trường hợp khác.
 * - Sử dụng overlay div thuần (không dùng antd Modal) như implementation cũ.
 */
const CivilTestResult = ({ isOpen, order, onClose }) => {
  // Chỉ hiển thị khi được mở và là đơn dân sự
if (!isOpen || !order || order.category !== "Voluntary") return null;

  // Helper: nhãn địa điểm thu mẫu
  console.log(order.resultTableData)
  const _getSampleMethodLabel = (val) => {
    if (val === 'home') return 'Tại nhà';
    if (val === 'center') return 'Tại trung tâm';
    if (val === 'self') return 'Tự thu và gửi mẫu';
    return val;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.18)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          minWidth: 340,
          maxWidth: 800,
          maxHeight: '90vh',
          padding: 32,
          boxShadow: '0 8px 32px #0002',
          position: 'relative',
          fontSize: 17,
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 18,
            background: 'none',
            border: 'none',
            fontSize: 26,
            color: '#888',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>

        {/* ===== Kết quả dân sự ===== */}
          <h2 style={{ textAlign: 'center', color: '#00c853', fontWeight: 800, fontSize: 32, marginBottom: 18 }}>
            Kết Quả Xét Nghiệm
          </h2>

          {/* Thông tin người cho mẫu */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontWeight: 800, fontSize: 20, margin: '0 0 12px 0' }}>Thông tin người cho mẫu</h3>
            <div
              style={{
                background: '#f8fff3',
                border: '2px solid #b6e4b6',
                borderRadius: 14,
                padding: 20,
                overflowX: 'auto',
              }}
            >
             {Array.isArray(order.resultTableData || []) && (order.resultTableData || []).length > 0 ? (

                <table
                  className="result-table"
                  style={{ minWidth: 600, tableLayout: 'auto', borderCollapse: 'collapse', width: '100%' }}
                >
                  <thead>
                    <tr style={{ background: '#e6f7ff' }}>
                      <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>STT</th>
                      <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Họ và tên</th>
                      <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Năm sinh</th>
                      <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Giới tính</th>
                      <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Mối quan hệ</th>
                      <th style={{ padding: '10px 14px', fontSize: 16, fontWeight: 700, textAlign: 'center', borderBottom: '1.5px solid #b6e4b6' }}>Loại mẫu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.resultTableData.map((data, index) => (

                      <tr key={data.key} style={{ background: index % 2 === 0 ? '#fff' : '#f4f8ff' }}>
                        <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{index + 1}</td>
                        <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.name}</td>
                        <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{
                         order.yob || data.birth || ''
                        }</td>
                        <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.gender}</td>
                        <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.relationship}</td>
                        <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.sampleType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ color: '#faad14', fontWeight: 600 }}>Chưa có thông tin mẫu</div>
              )}
            </div>
          </div>

          {/* Kết luận */}
          <div
            style={{
              margin: '0 0 12px 0',
              padding: 20,
              background: '#e6f7ff',
              border: '1.5px solid #91d5ff',
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 18,
              color: '#005c3c',
            }}
          >
            <div style={{ marginBottom: 6, fontWeight: 800, fontSize: 20 }}>Kết luận</div>
            <div style={{ fontSize: 18 }}>{order.conclusion}</div>
          </div>
      </div>
    </div>
  );
};

export default CivilTestResult;
