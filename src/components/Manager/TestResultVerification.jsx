import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  message,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Descriptions,
  Divider,
  Input,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useOrderContext } from "../../context/OrderContext";

const { Title, Text } = Typography;

const TestResultVerification = () => {
  const { getOrdersNeedingApproval, updateOrder, getAllOrders } = useOrderContext();
  const [ordersNeedingApproval, setOrdersNeedingApproval] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [pendingApproveOrder, setPendingApproveOrder] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [pendingRejectOrder, setPendingRejectOrder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    loadOrdersNeedingApproval();
  }, []);

  // Lắng nghe sự kiện storage để tự động reload orders khi localStorage thay đổi
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "dna_orders") {
        loadOrdersNeedingApproval(); // Chỉ reload dữ liệu thay vì reload cả trang
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const allOrders = getAllOrders();
    setFilteredOrders(allOrders.filter(order => getStatusText(order.status) === "Chờ xác thực"));
  }, [ordersNeedingApproval, getAllOrders]);

  const loadOrdersNeedingApproval = () => {
    const orders = getOrdersNeedingApproval();
    setOrdersNeedingApproval(orders);
  };

  const handleViewResult = (order) => {
    setSelectedOrder(order);
    setViewModalVisible(true);
  };

  const handleApprove = (order) => {
    setPendingApproveOrder(order);
    setApproveConfirmVisible(true);
  };

  const handleReject = (order) => {
    setPendingRejectOrder(order);
    setRejectModalVisible(true);
  };

  const confirmApprove = async () => {
    if (!pendingApproveOrder) return;
    await updateOrder(pendingApproveOrder.id, {
      managerConfirm: true,
      status: "Hoàn thành",
      approvedAt: new Date().toISOString(),
      managerNote: ""
    });
    setApproveConfirmVisible(false);
    setPendingApproveOrder(null);
    message.success("Đã phê duyệt kết quả xét nghiệm thành công!");
    setFilteredOrders(prev => prev.filter(order => order.id !== pendingApproveOrder.id));
  };

  const confirmReject = async () => {
    if (!pendingRejectOrder) return;
    await updateOrder(pendingRejectOrder.id, {
      managerConfirm: false,
      status: "Từ chối",
      approvedAt: new Date().toISOString(),
      managerNote: rejectNote
    });
    setRejectModalVisible(false);
    setRejectNote("");
    setPendingRejectOrder(null);
    message.success("Đã từ chối kết quả xét nghiệm!");
    setFilteredOrders(prev => prev.filter(order => order.id !== pendingRejectOrder.id));
  };

  // Hàm chuẩn hóa chuỗi: bỏ dấu tiếng Việt, chuyển thường, loại bỏ khoảng trắng thừa
  function normalizeStatus(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '')
      .trim();
  }
  const getStatusText = (status) => {
    const s = normalizeStatus(status);
    if (["choxacthuc", "waitingapproval"].includes(s)) return "Chờ xác thực";
    if (["dangxuly", "processing"].includes(s)) return "Đang xử lý";
    if (["hoanthanh", "completed"].includes(s)) return "Hoàn thành";
    if (["tuchoi", "rejected"].includes(s)) return "Từ chối";
    return "Đang xử lý";
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (id) => `#${id}`,
      width: 100,
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Loại xét nghiệm",
      dataIndex: "type",
      key: "type",
      width: 200,
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Thời gian chờ",
      key: "waitingTime",
      width: 150,
      render: (_, record) => {
        const createdDate = new Date(record.createdAt || record.date);
        const now = new Date();
        const diffInHours = Math.floor((now - createdDate) / (1000 * 60 * 60));

        if (diffInHours < 24) {
          return <Tag color="green">{diffInHours} giờ</Tag>;
        } else {
          const diffInDays = Math.floor(diffInHours / 24);
          return <Tag color="orange">{diffInDays} ngày</Tag>;
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewResult(record)}
            style={{
              background: '#1677ff',
              borderColor: '#1677ff',
              fontWeight: 600,
              borderRadius: 20,
              boxShadow: '0 2px 8px rgba(22,119,255,0.12)',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#0958d9';
              e.currentTarget.style.borderColor = '#0958d9';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(9,88,217,0.18)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#1677ff';
              e.currentTarget.style.borderColor = '#1677ff';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(22,119,255,0.12)';
            }}
          >
            Xem
          </Button>
          <Button
            type="default"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(record)}
            style={{ color: "#52c41a", borderColor: "#52c41a" }}
          >
            Phê duyệt
          </Button>
          <Button
            type="default"
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={() => handleReject(record)}
            danger
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  const stats = {
    total: getAllOrders().filter(o => getStatusText(o.status) === "Chờ xác thực").length,
    approved: getAllOrders().filter(o => getStatusText(o.status) === "Hoàn thành").length,
    rejected: getAllOrders().filter(o => getStatusText(o.status) === "Từ chối").length,
    waiting: getAllOrders().filter(o => getStatusText(o.status) === "Đang xử lý").length,
  };

  return (
    <div style={{ padding: "0" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#722ed1", margin: 0 }}>
          Xác thực kết quả xét nghiệm
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0 0" }}>
          Phê duyệt và xác thực kết quả xét nghiệm trước khi gửi cho khách hàng
        </p>
      </div>

      {/* Thống kê */}
      <div style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #f0f0f0",
        marginBottom: "24px",
      }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Tổng đơn chờ xác thực"
                value={stats.total}
                prefix={<SafetyCertificateOutlined style={{ color: "#722ed1" }} />}
                valueStyle={{ color: "#722ed1", fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Đã phê duyệt"
                value={stats.approved}
                prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a", fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Đã từ chối"
                value={stats.rejected}
                prefix={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
                valueStyle={{ color: "#ff4d4f", fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Đang chờ xử lý"
                value={stats.waiting}
                prefix={<ClockCircleOutlined style={{ color: "#fa8c16" }} />}
                valueStyle={{ color: "#fa8c16", fontWeight: 600 }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Bảng đơn hàng */}
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #f0f0f0",
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm theo tên khách hàng, mã đơn, loại xét nghiệm..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onSearch={v => setSearchText(v)}
            allowClear
            style={{ width: 320 }}
          />
        </div>
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
            <SafetyCertificateOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <Title level={4} style={{ color: "#999" }}>
              Không có đơn hàng nào cần xác thực
            </Title>
            <Text>Tất cả kết quả xét nghiệm đã được xác thực hoặc chưa có kết quả cần xác thực.</Text>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey={(record) => record.id}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
            }}
            scroll={{ x: 1000 }}
          />
        )}
      </div>

      {/* Modal xem kết quả */}
      <Modal
        title={null}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="approve"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              setViewModalVisible(false);
              handleApprove(selectedOrder);
            }}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          >
            Phê duyệt
          </Button>,
          <Button
            key="reject"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => {
              setViewModalVisible(false);
              handleReject(selectedOrder);
            }}
          >
            Từ chối
          </Button>,
        ]}
        width={700}
        style={{ top: 32 }}
      >
        {selectedOrder && (
          <div>
            {/* Tiêu đề mới */}
            <div style={{ fontSize: 28, fontWeight: 800, color: '#722ed1', marginBottom: 24, textAlign: 'center' }}>
              Đơn cần xác thực
            </div>
            {/* Thêm dòng tiêu đề thông tin khách hàng */}
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Thông tin khách hàng</div>
            {/* Thông tin khách hàng trong khung đơn giản */}
            <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}><b>Mã đơn:</b> #{selectedOrder.id}</div>
              <div style={{ fontSize: 18, marginBottom: 6 }}><b>Khách hàng:</b> {selectedOrder.name}</div>
              <div style={{ fontSize: 18, marginBottom: 6 }}><b>Loại xét nghiệm:</b> {selectedOrder.type}</div>
              <div style={{ fontSize: 18 }}><b>Ngày tạo:</b> {selectedOrder.date}</div>
            </div>

            {/* Dữ liệu đơn hàng (bảng mẫu khách hàng) */}
            {selectedOrder.result ? (
              (() => {
                let parsed = null;
                try {
                  parsed = JSON.parse(selectedOrder.result);
                } catch {
                  // Không parse được, giữ nguyên parsed = null
                }
                if (Array.isArray(parsed) && parsed.length > 0) {
                  return (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Dữ liệu đơn hàng</div>
                      <Table
                        dataSource={parsed}
                        columns={[
                          { title: "Họ và tên", dataIndex: "name", key: "name" },
                          { title: "Ngày sinh", dataIndex: "birth", key: "birth", render: (text, record) => text || record.birthYear || record.namSinh || record.namsinh || "" },
                          { title: "Giới tính", dataIndex: "gender", key: "gender" },
                          { title: "Mối quan hệ", dataIndex: "relationship", key: "relationship" },
                          { title: "Loại mẫu", dataIndex: "sampleType", key: "sampleType" },
                        ]}
                        pagination={false}
                        size="small"
                        rowKey={(row, idx) => row.key || idx}
                        style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4 }}
                      />
                    </div>
                  );
                }
                return null;
              })()
            ) : null}

            {/* Kết luận */}
            {selectedOrder.conclusion && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Kết luận</div>
                <div style={{ padding: 12, background: "#f0f5ff", border: "1px solid #d6e4ff", borderRadius: 4 }}>
                  <Text>{selectedOrder.conclusion}</Text>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal xác nhận phê duyệt */}
      <Modal
        title="Xác nhận phê duyệt"
        open={approveConfirmVisible}
        onCancel={() => setApproveConfirmVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setApproveConfirmVisible(false)}>
            Huỷ
          </Button>,
          <Button
            key="approve"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={confirmApprove}
            style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
          >
            Phê duyệt
          </Button>,
        ]}
        width={400}
      >
        <Text>Bạn có chắc chắn thông tin xét nghiệm chính xác?</Text>
      </Modal>

      {/* Modal từ chối */}
      <Modal
        title="Từ chối kết quả xét nghiệm"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRejectModalVisible(false)}>
            Huỷ
          </Button>,
          <Button
            key="reject"
            danger
            icon={<CloseCircleOutlined />}
            onClick={confirmReject}
            disabled={!rejectNote.trim()}
          >
            Từ chối
          </Button>,
        ]}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>Lý do từ chối:</Text>
          <textarea
            value={rejectNote}
            onChange={e => setRejectNote(e.target.value)}
            placeholder="Nhập lý do từ chối..."
            style={{ width: "100%", minHeight: 80, padding: 8, border: '1px solid #d9d9d9', borderRadius: 4, marginTop: 8 }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default TestResultVerification; 