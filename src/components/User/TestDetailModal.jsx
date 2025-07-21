import React from 'react';
import { Modal, Tag } from 'antd';

/**
 * Hiển thị chi tiết một đơn đăng ký (order) trong modal.
 * Tách ra từ UserProfile.jsx để dễ bảo trì, tái sử dụng.
 */
const TestDetailModal = ({ isOpen, order, onClose }) => {
  if (!isOpen || !order) return null;

  // Helper: chuyển đổi mã địa điểm thu mẫu sang nhãn thân thiện
  const getSampleMethodLabel = (val) => {
    if (val === 'home') return 'Tại nhà';
    if (val === 'center') return 'Tại trung tâm';
    if (val === 'self') return 'Tự thu và gửi mẫu';
    return val;
  };

  // Helper: chuẩn hóa status hiển thị
  const getStatusText = (status) => {
    if (status === 'Đang lấy mẫu' || status === 'SAMPLE_COLLECTING') return 'Đang xử lý';
    switch (status) {
      case 'PENDING_CONFIRM':
        return 'Chờ xác nhận';
      case 'KIT_NOT_SENT':
        return 'Chưa gửi kit';
      case 'KIT_SENT':
        return 'Đã gửi kit';
      case 'SAMPLE_RECEIVED':
        return 'Đã gửi mẫu';
      case 'PROCESSING':
        return 'Đang xử lý';
      case 'COMPLETED':
        return 'Đã có kết quả';
      case 'WAITING_APPROVAL':
      case 'CHO_XAC_THUC':
      case 'Chờ xác thực':
      case 'REJECTED':
      case 'Từ chối':
        return 'Đang xử lý';
      default:
        return status;
    }
  };

  const getDisplayStatus = (o) => {
    return o.status || o.samplingStatus || o.kitStatus || 'PENDING_CONFIRM';
  };

  /**
   * Trả về màu cho Tag dựa trên statusText.
   */
  const getStatusColor = (statusText) => {
    switch (statusText) {
      case 'Chờ xác nhận':
        return '#1890ff';
      case 'Chưa gửi kit':
        return '#a259ec';
      case 'Đã gửi kit':
        return '#00b894';
      case 'Đã gửi mẫu':
        return '#13c2c2';
      case 'Đang xử lý':
        return '#faad14';
      case 'Đã hẹn':
        return '#40a9ff';
      case 'Đã đến':
        return '#006d75';
      case 'Đã có kết quả':
      case 'Hoàn thành':
        return '#52c41a';
      case 'Từ chối':
        return '#ff4d4f';
      default:
        return '#bfbfbf';
    }
  };

  const statusText = getStatusText(getDisplayStatus(order));

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
      closeIcon={<span style={{ fontSize: 26, color: '#888' }}>&times;</span>}
      bodyStyle={{ padding: 32, borderRadius: 18 }}
    >
      <h3
        style={{
          fontWeight: 800,
          fontSize: 26,
          marginBottom: 18,
          color: '#009e74',
          letterSpacing: -1,
          textAlign: 'center',
        }}
      >
        Chi tiết đơn đăng ký
      </h3>
      <div style={{ borderTop: '1px solid #e6e6e6', marginBottom: 18 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <span style={{ fontWeight: 700, color: '#009e74' }}>Mã đơn:</span>{' '}
          <span style={{ color: '#009e74', fontWeight: 700 }}>#{order.id}</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 8,
          }}
        >
          <span style={{ fontWeight: 600, color: '#888', marginRight: 2 }}>Trạng thái:</span>
          <Tag
            style={{
              fontWeight: 600,
              fontSize: 15,
              background: getStatusColor(statusText),
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              marginLeft: 12,
              minWidth: 90,
              padding: '3px 12px',
              textAlign: 'center',
              display: 'inline-block',
            }}
          >
            {statusText}
          </Tag>
          <span style={{ fontWeight: 600, color: '#888', marginLeft: 8 }}>Thể loại:</span>
          <Tag
            color={order.category === 'civil' ? '#722ed1' : '#36cfc9'}
            style={{ fontWeight: 600, fontSize: 15 }}
          >
            {order.category === 'civil'
              ? 'Dân sự'
              : order.category === 'admin'
              ? 'Hành chính'
              : order.category}
          </Tag>
        </div>
        <div>
          <span style={{ fontWeight: 600 }}>Họ tên:</span> <span>{order.name}</span>
        </div>
        <div>
          <span style={{ fontWeight: 600 }}>Số điện thoại:</span>{' '}
          <span>{order.phone}</span>
        </div>
        <div>
          <span style={{ fontWeight: 600 }}>Email:</span> <span>{order.email}</span>
        </div>
        <div>
          <span style={{ fontWeight: 600 }}>Địa chỉ:</span> <span>{order.address}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 2, flexWrap: 'nowrap' }}>
          <span style={{ fontWeight: 600, minWidth: 120, flexShrink: 0 }}>Loại xét nghiệm:</span>
          <span style={{ whiteSpace: 'nowrap', overflowWrap: 'anywhere', width: '100%', display: 'inline-block', marginLeft: 8 }}>
            {order.type || ''}
          </span>
        </div>
        <div style={{ borderTop: '1px solid #e6e6e6', margin: '12px 0' }} />
        <div>
          <span style={{ fontWeight: 600 }}>Địa điểm thu mẫu:</span>{' '}
          <span>{getSampleMethodLabel(order.sampleMethod)}</span>
        </div>
        <div>
          <span style={{ fontWeight: 600 }}>Ngày đăng ký:</span>{' '}
          <span>{order.date}</span>
        </div>
        {order.appointmentDate && order.sampleMethod === 'center' && (
          <div
            style={{
              background: '#e0edff',
              color: '#2563eb',
              fontWeight: 700,
              border: '1.5px solid #1d4ed8',
              borderRadius: 8,
              padding: '8px 18px',
              margin: '10px 0 0 0',
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: 17,
              gap: 8,
              boxShadow: '0 2px 8px #2563eb22',
            }}
          >
            <span style={{ fontSize: 20, marginRight: 6 }}>
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 2v2m10-2v2M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Ngày lấy mẫu: {order.appointmentDate}
          </div>
        )}
        <div>
          <span style={{ fontWeight: 600 }}>Ghi chú:</span>{' '}
          <span>{order.note}</span>
        </div>
      </div>
    </Modal>
  );
};

export default TestDetailModal;
