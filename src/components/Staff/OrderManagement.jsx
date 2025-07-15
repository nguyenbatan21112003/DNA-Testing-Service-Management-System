import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Tag, Card, Statistic, Row, Col, Tabs, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
import { useOrderContext } from "../../context/OrderContext";

const { TabPane } = Tabs;

const OrderManagement = () => {
  const { user } = useContext(AuthContext);
  const { getAllOrders } = useOrderContext();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("waiting");

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
    if (s === 'completed' || s === 'hoàn thành') return 'Hoàn thành';
    return status;
  };

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

  // Cột cho tab đơn của tôi
  const myColumns = [
    ...columns
    // Bỏ cột Thao tác ở tab Đơn của tôi
  ];

  // Cột cho tab đơn chờ xác nhận
  const waitingColumns = [
    ...columns,
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleAcceptOrder(record.id)}>
          Nhận đơn
        </Button>
      ),
    },
  ];

  // Nhận đơn (chỉ dùng cho tab Đơn chờ xác nhận)
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
    // Thêm log để debug
    console.log("Orders after accept:", updatedOrders);
  };

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#00a67e" }}>Quản lý đơn hàng</h1>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}><Card><Statistic title="Đơn chờ xác nhận" value={stats.waiting} /></Card></Col>
        <Col span={8}><Card><Statistic title="Đơn đã nhận" value={stats.my} /></Card></Col>
        <Col span={8}><Card><Statistic title="Đơn hoàn thành" value={stats.completed} /></Card></Col>
      </Row>
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`Đơn chờ xác nhận (${stats.waiting})`} key="waiting">
            <Table columns={waitingColumns} dataSource={waitingOrders} rowKey="id" pagination={{ pageSize: 10 }} />
          </TabPane>
          <TabPane tab={`Đơn của tôi (${stats.my})`} key="my">
            <Table columns={myColumns} dataSource={myOrders} rowKey="id" pagination={{ pageSize: 10 }} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default OrderManagement;
