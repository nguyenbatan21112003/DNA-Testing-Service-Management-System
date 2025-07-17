import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Tag, Card, Statistic, Row, Col, Tabs, Space, Modal, Descriptions } from "antd";
import { EyeOutlined, ClockCircleOutlined, UserSwitchOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
import { useOrderContext } from "../../context/OrderContext";

const { TabPane } = Tabs;

const OrderManagement = () => {
  const { user } = useContext(AuthContext);
  const { getAllOrders } = useOrderContext();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("waiting");
  const [viewOrder, setViewOrder] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  useEffect(() => {
    setOrders(getAllOrders());
    // Listen for storage changes (multi-tab sync)
    const handleStorage = (e) => {
      if (e.key === "dna_orders") setOrders(getAllOrders());
    };
    window.addEventListener("storage", handleStorage);
    // Reload khi tab được focus
    const handleFocus = () => {
      setOrders(getAllOrders());
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, [getAllOrders]);

  // Chuẩn hóa trạng thái để so sánh
  const getStatusText = (status) => {
    if (!status) return '';
    const s = status.toString().trim().toLowerCase();
    if (
      s === 'waiting_approval' ||
      s === 'chờ xác nhận' ||
      s === 'pending_confirm' ||
      s === 'pending' ||
      s === 'choxacnhan'
    ) return 'Chờ xác nhận';
    if (
      s === 'completed' ||
      s === 'hoàn thành'
    ) return 'Hoàn thành';
    if (
      s === 'đã nhận' ||
      s === 'received' ||
      s === 'processing' ||
      s === 'in_progress' ||
      s === 'đang xử lý' ||
      s === 'đã hẹn' ||
      s === 'chưa gửi kit'
    ) return 'Đã nhận';
    return status;
  };

  const getStatusColor = (status) => {
    switch (getStatusText(status)) {
      case 'Chờ xác nhận': return '#faad14';
      case 'Đã nhận': return '#1890ff';
      case 'Hoàn thành': return '#52c41a';
      default: return '#bfbfbf';
    }
  };

  const renderResultDetailModal = (order) => {
    // Lấy bảng mẫu
    let sampleData = [];
    if (Array.isArray(order?.resultTableData) && order.resultTableData.length > 0) {
      sampleData = order.resultTableData;
    } else if (Array.isArray(order?.members) && order.members.length > 0) {
      sampleData = order.members;
    } else if (order?.sampleInfo && Array.isArray(order.sampleInfo.donors) && order.sampleInfo.donors.length > 0) {
      sampleData = order.sampleInfo.donors;
    }
    return (
      <div style={{ padding: 8 }}>
        {/* Tiêu đề lớn */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 32, fontWeight: 900, letterSpacing: 1 }}>
            Kết quả xét nghiệm - #{order.id}
          </h2>
        </div>
        {/* Tag trạng thái và phân loại */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, justifyContent: 'center', alignItems: 'center' }}>
          <Tag style={{
            background: getStatusColor(order.status),
            color: '#fff',
            fontWeight: 700,
            border: 'none',
            fontSize: 16,
            padding: '6px 18px',
            borderRadius: 8,
            minWidth: 110,
            textAlign: 'center',
            display: 'inline-block',
          }}>
            {getStatusText(order.status)}
          </Tag>
          {order.type && (
            <Tag style={{
              background: order.type.toLowerCase().includes('hành chính') ? '#36cfc9' : '#722ed1',
              color: '#fff',
              fontWeight: 700,
              border: 'none',
              fontSize: 15,
              padding: '6px 18px',
              borderRadius: 8,
              textAlign: 'center',
              display: 'inline-block',
              letterSpacing: 1,
            }}>
              {order.type.toLowerCase().includes('hành chính') ? 'Hành chính' : (order.type.toLowerCase().includes('dân sự') ? 'Dân sự' : 'Khác')}
            </Tag>
          )}
        </div>
        {/* 1. Thông tin khách hàng */}
        <div style={{ marginBottom: 24, background: '#f4f8ff', border: '1.5px solid #b6c8e4', borderRadius: 14, padding: 20 }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20, marginBottom: 12 }}>Thông tin khách hàng</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 16 }}>
            <div><strong>Họ tên:</strong> {order.name}</div>
            <div><strong>Số điện thoại:</strong> {order.phone}</div>
            <div><strong>Email:</strong> {order.email}</div>
            {order.address && <div><strong>Địa chỉ:</strong> {order.address}</div>}
          </div>
        </div>
        {/* 2. Thông tin đơn hàng & bảng mẫu */}
        <div style={{ marginBottom: 24, background: '#e6f7ff', border: '1.5px solid #91d5ff', borderRadius: 14, padding: 20 }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20, marginBottom: 12 }}>Thông tin đơn hàng & mẫu xét nghiệm</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 16 }}>
            <div><strong>Loại xét nghiệm:</strong> {order.type}</div>
          </div>
          {/* Bảng mẫu xét nghiệm */}
          <div style={{ marginTop: 16, background: '#f8fff3', border: '2px solid #b6e4b6', borderRadius: 14, padding: 20, overflowX: 'auto' }}>
            <h4 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>Bảng thông tin thành viên cung cấp mẫu</h4>
            {Array.isArray(sampleData) && sampleData.length > 0 ? (
              <table className="result-table" style={{ minWidth: 600, tableLayout: 'auto', borderCollapse: 'collapse', width: '100%' }}>
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
                  {sampleData.map((data, index) => (
                    <tr key={data.key || index} style={{ background: index % 2 === 0 ? '#fff' : '#f4f8ff' }}>
                      <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.name || data.hoTen || data.hovaten || ''}</td>
                      <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.birth || data.birthYear || data.namSinh || data.namsinh || ''}</td>
                      <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.gender || data.gioiTinh || data.gioitinh || ''}</td>
                      <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.relationship || data.moiQuanHe || data.moiquanhe || data.relation || ''}</td>
                      <td style={{ padding: '10px 14px', fontSize: 16, textAlign: 'center' }}>{data.sampleType || data.loaiMau || data.loaimau || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: '#faad14', fontWeight: 600 }}>Chưa có thông tin mẫu</div>
            )}
          </div>
        </div>
        {/* 3. Kết quả */}
        <div style={{ marginBottom: 24, background: '#fffbe6', border: '1.5px solid #ffe58f', borderRadius: 14, padding: 20 }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20, marginBottom: 12 }}>Kết quả</h3>
          {order.conclusion ? (
            <div style={{ fontSize: 18, color: '#005c3c', fontWeight: 700 }}>{order.conclusion}</div>
          ) : (
            <div style={{ color: '#faad14', fontWeight: 600 }}>Chưa có kết quả</div>
          )}
        </div>
      </div>
    );
  };

  const renderSimpleDetailModal = (order) => (
    <div style={{ padding: 8 }}>
      {/* Tiêu đề lớn */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, letterSpacing: 1, color: '#13a87a' }}>
          Thông tin đơn hàng - #{order.id}
        </h2>
      </div>
      {/* Phân loại & Trạng thái */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18, justifyContent: 'center', alignItems: 'center' }}>
        {/* Phân loại */}
        {order.type && (
          <Tag style={{
            background: order.type.toLowerCase().includes('hành chính') ? '#36cfc9' : '#722ed1',
            color: '#fff',
            fontWeight: 700,
            border: 'none',
            fontSize: 15,
            padding: '6px 18px',
            borderRadius: 8,
            textAlign: 'center',
            display: 'inline-block',
            letterSpacing: 1,
          }}>
            {order.type.toLowerCase().includes('hành chính') ? 'Hành chính' : (order.type.toLowerCase().includes('dân sự') ? 'Dân sự' : 'Khác')}
          </Tag>
        )}
        {/* Trạng thái */}
        <Tag style={{
          background: getStatusColor(order.status),
          color: '#fff',
          fontWeight: 700,
          border: 'none',
          fontSize: 16,
          padding: '6px 18px',
          borderRadius: 8,
          minWidth: 110,
          textAlign: 'center',
          display: 'inline-block',
        }}>
          {getStatusText(order.status)}
        </Tag>
      </div>
      {/* Thông tin khách hàng */}
      <div style={{ marginBottom: 12, background: '#f8fdfa', borderRadius: 12, padding: 18, boxShadow: '0 1px 4px #0001' }}>
        <div style={{ color: '#13a87a', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Thông tin khách hàng</div>
        <div style={{ fontSize: 16 }}><b>Họ tên:</b> {order.name}</div>
        <div style={{ fontSize: 16 }}><b>Email:</b> {order.email}</div>
        <div style={{ fontSize: 16 }}><b>Số điện thoại:</b> {order.phone}</div>
      </div>
      {/* Thông tin lịch hẹn */}
      <div style={{ background: '#f4faff', borderRadius: 12, padding: 18, boxShadow: '0 1px 4px #0001', marginBottom: 8 }}>
        <div style={{ color: '#1890ff', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Thông tin lịch hẹn</div>
        <div style={{ fontSize: 16 }}><b>Loại xét nghiệm:</b> {order.type}</div>
        {order.date && <div style={{ fontSize: 16 }}><b>Ngày hẹn:</b> {order.date}</div>}
      </div>
    </div>
  );

  // Đơn staff này đã nhận
  const myOrders = orders.filter((o) => {
    const staffAssigned = (o.staffAssigned || "").toString().trim().toLowerCase();
    const userIds = [user?.user_id, user?.id, user?.email]
      .filter(Boolean)
      .map((u) => u.toString().trim().toLowerCase());
    // Chỉ cần staffAssigned là user hiện tại, không cần check trạng thái
    return userIds.includes(staffAssigned);
  });

  // Đơn chờ xác nhận
  const waitingOrders = orders.filter(
    (o) => getStatusText(o.status) === "Chờ xác nhận"
  );

  // Thống kê
  const stats = {
    waiting: orders.filter(o => getStatusText(o.status) === "Chờ xác nhận").length,
    my: myOrders.length,
    completed: orders.filter((o) => getStatusText(o.status) === "Hoàn thành").length,
  };

  // Cột chung
  const columns = [
    { title: "Mã đơn", dataIndex: "id", key: "id", render: (id) => `#${id}` },
    { title: "Khách hàng", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Loại xét nghiệm", dataIndex: "type", key: "type" },
    // Thêm cột phân loại
    { title: "Phân loại", key: "category", render: (_, record) => {
      let label = "";
      if (record.type && record.type.toLowerCase().includes("hành chính")) label = "Hành chính";
      else if (record.type && record.type.toLowerCase().includes("dân sự")) label = "Dân sự";
      return label ? <Tag color={label === "Dân sự" ? "#722ed1" : "#36cfc9"}>{label}</Tag> : null;
    } },
    { title: "Phương thức lấy mẫu", dataIndex: "sampleMethod", key: "sampleMethod", render: (m) =>
      m === "home" ? (
        <Tag
          style={{
            background: "#e6f7ff",
            color: "#1890ff",
            border: "1px solid #91d5ff",
            borderRadius: 8,
            fontWeight: 600,
            padding: "2px 14px",
            fontSize: 15,
          }}
        >
          Tại nhà
        </Tag>
      ) : (
        <Tag
          style={{
            background: "#f6ffed",
            color: "#52c41a",
            border: "1px solid #b7eb8f",
            borderRadius: 8,
            fontWeight: 600,
            padding: "2px 14px",
            fontSize: 15,
          }}
        >
          Tại cơ sở
        </Tag>
      )
    },
    { title: "Trạng thái", dataIndex: "status", key: "status", render: (s, record) => {
      if (getStatusText(s) === "Hoàn thành") return <Tag color="green">Hoàn thành</Tag>;
      // Nếu là tab "Đơn của tôi", luôn hiển thị "Đã nhận"
      if (activeTab === "my") return <Tag color="#1890ff">Đã nhận</Tag>;
      // Tab khác giữ logic cũ
      if (record.staffAssigned) return <Tag color="#1890ff">Đã nhận</Tag>;
      return <Tag color="#faad14">Chờ xác nhận</Tag>;
    } },
  ];

  // Đảm bảo hàm handleAcceptOrder tồn tại
  const handleAcceptOrder = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        let nextStatus = "Đã nhận";
        if (order.sampleMethod === "center") nextStatus = "Đã hẹn";
        if (order.sampleMethod === "home") nextStatus = "Chưa gửi kit";
        return {
          ...order,
          status: nextStatus,
          staffAssigned: user?.user_id || user?.id || user?.email,
        };
      }
      return order;
    });
    setOrders(updatedOrders);
    localStorage.setItem("dna_orders", JSON.stringify(updatedOrders));
  };

  const handleViewOrder = (order) => {
    setViewOrder(order);
    setViewModalVisible(true);
  };

  // Cột thao tác cho tab Đơn chờ xác nhận
  const columnsWithActionWaiting = [
    ...columns,
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleAcceptOrder(record.id)}
            style={{ fontWeight: 600 }}
          >
            Nhận đơn
          </Button>
          <Button
            icon={<EyeOutlined />}
            type="default"
            size="small"
            onClick={() => handleViewOrder(record)}
            style={{ fontWeight: 600 }}
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  // Cột thao tác cho tab Đơn của tôi
  const columnsWithAction = [
    ...columns,
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          type="primary"
          size="small"
          onClick={() => handleViewOrder(record)}
          style={{ fontWeight: 600 }}
        >
          Xem
        </Button>
      ),
    },
  ];

  // Các trạng thái coi là modal đơn giản bên quản lý đơn hàng
  const SIMPLE_DETAIL_STATUSES = ['Chờ xác nhận', 'Đã nhận'];

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#00a67e" }}>Quản lý đơn hàng</h1>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đơn chờ xác nhận"
              value={stats.waiting}
              valueStyle={{ color: '#faad14', fontWeight: 700 }}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đơn đã nhận"
              value={stats.my}
              valueStyle={{ color: '#1890ff', fontWeight: 700 }}
              prefix={<UserSwitchOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đơn hoàn thành"
              value={stats.completed}
              valueStyle={{ color: '#52c41a', fontWeight: 700 }}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`Đơn chờ xác nhận (${stats.waiting})`} key="waiting">
            <Table columns={columnsWithActionWaiting} dataSource={waitingOrders} rowKey="id" pagination={{ pageSize: 10 }} />
          </TabPane>
          <TabPane tab={`Đơn của tôi (${stats.my})`} key="my">
            <Table columns={columnsWithAction} dataSource={myOrders} rowKey="id" pagination={{ pageSize: 10 }} />
          </TabPane>
        </Tabs>
        <Modal
          title={viewOrder ? (
            getStatusText(viewOrder.status) === 'Hoàn thành'
              ? null
              : (SIMPLE_DETAIL_STATUSES.includes(getStatusText(viewOrder.status))
                ? null
                : `Chi tiết đơn hàng #${viewOrder.id}`)
          ) : "Chi tiết đơn hàng"}
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setViewModalVisible(false)}>
              Đóng
            </Button>,
          ]}
          width={
            getStatusText(viewOrder?.status) === 'Hoàn thành'
              ? 900
              : (SIMPLE_DETAIL_STATUSES.includes(getStatusText(viewOrder?.status)) ? 500 : 700)
          }
        >
          {viewOrder && (
            getStatusText(viewOrder.status) === 'Hoàn thành'
              ? renderResultDetailModal(viewOrder)
              : (SIMPLE_DETAIL_STATUSES.includes(getStatusText(viewOrder.status))
                ? renderSimpleDetailModal(viewOrder)
                : (
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="Mã đơn">{viewOrder.id}</Descriptions.Item>
                    <Descriptions.Item label="Khách hàng">{viewOrder.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{viewOrder.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{viewOrder.phone}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">{viewOrder.address || '-'}</Descriptions.Item>
                    <Descriptions.Item label="Loại xét nghiệm">{viewOrder.type}</Descriptions.Item>
                    <Descriptions.Item label="Phân loại">{viewOrder.type && viewOrder.type.toLowerCase().includes('hành chính') ? 'Hành chính' : (viewOrder.type && viewOrder.type.toLowerCase().includes('dân sự') ? 'Dân sự' : 'Khác')}</Descriptions.Item>
                    <Descriptions.Item label="Phương thức lấy mẫu">{viewOrder.sampleMethod === 'home' ? 'Tại nhà' : 'Tại cơ sở'}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{getStatusText(viewOrder.status)}</Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">{viewOrder.date || '-'}</Descriptions.Item>
                  </Descriptions>
                )
              )
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default OrderManagement;
