"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Tabs,
  Statistic,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  FileTextOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UndoOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useOrderContext } from "../../context/OrderContext";
const { Search } = Input;
const { TabPane } = Tabs;

const OrderManagement = () => {
  const { getAllOrders, updateOrder } = useOrderContext();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [confirmHideOrder, setConfirmHideOrder] = useState(null);

  // Lấy dữ liệu đơn hàng từ context
  const loadOrders = () => {
    const allOrders = getAllOrders();
    setOrders(allOrders);
    setFilteredOrders(allOrders.filter((order) => !order.isHidden));
  };

  useEffect(() => {
    // Load orders khi component mount
    loadOrders();
  }, []);

  // Lắng nghe sự kiện storage để tự động cập nhật khi manager thay đổi trạng thái
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "dna_orders") {
        // Force re-render bằng cách reload data
        loadOrders();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Lọc theo tab
    if (activeTab !== "all" && activeTab !== "hidden") {
      filtered = filtered.filter(
        (order) => order.status === activeTab && !order.isHidden
      );
    } else if (activeTab === "hidden") {
      filtered = filtered.filter((order) => order.isHidden);
    } else {
      filtered = filtered.filter((order) => !order.isHidden);
    }

    // Tìm kiếm
    if (searchText) {
      filtered = filtered.filter(
        (order) =>
          order.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          order.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          order.id?.toString().includes(searchText)
      );
    }

    setFilteredOrders(filtered);
  }, [activeTab, searchText, orders]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    form.setFieldsValue({
      status: order.status,
      priority: order.priority,
      notes: order.notes || "",
    });
  };

  const handleDeleteOrder = (order) => {
    setConfirmHideOrder(order);
  };

  const handleConfirmHide = async () => {
    if (confirmHideOrder) {
      await updateOrder(confirmHideOrder.id, { isHidden: true });
      message.success("Đơn hàng đã được ẩn khỏi giao diện nhân viên!");
      setConfirmHideOrder(null);
      loadOrders();
      setActiveTab("hidden");
    }
  };

  const handleCancelHide = () => {
    setConfirmHideOrder(null);
  };

  const handleUnhideOrder = (order) => {
    updateOrder(order.id, { isHidden: false });
    message.success("Đơn hàng đã được hiện lại cho nhân viên!");
    loadOrders();
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
      case "PENDING_CONFIRM":
        return "Chờ xử lý";
      case "PROCESSING":
        return "Đang xử lý";
      case "WAITING_APPROVAL":
        return "Chờ xác thực";
      case "COMPLETED":
        return "Hoàn thành";
      case "REJECTED":
        return "Từ chối";
      case "KIT_SENT":
        return "Đã gửi kit";
      case "SAMPLE_RECEIVED":
        return "Đã nhận mẫu";
      case "CANCELLED":
        return "Đã hủy";
      default:
        if (status === "Chờ xử lý") return "Chờ xử lý";
        if (status === "Đang xử lý") return "Đang xử lý";
        if (status === "Hoàn thành") return "Hoàn thành";
        if (status === "Chờ xác thực") return "Chờ xác thực";
        if (status === "Từ chối") return "Từ chối";
        if (status === "Đã gửi kit") return "Đã gửi kit";
        if (status === "Đã nhận mẫu") return "Đã nhận mẫu";
        if (status === "Đã hủy") return "Đã hủy";
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
      case "PENDING_CONFIRM":
      case "Chờ xử lý":
        return "orange";
      case "PROCESSING":
      case "Đang xử lý":
        return "blue";
      case "WAITING_APPROVAL":
      case "Chờ xác thực":
        return "purple";
      case "COMPLETED":
      case "Hoàn thành":
        return "green";
      case "REJECTED":
      case "Từ chối":
        return "red";
      case "KIT_SENT":
        return "#2563EB";
      case "SAMPLE_RECEIVED":
        return "#22C55E";
      case "CANCELLED":
        return "#EF4444";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => `#${id}`,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Loại xét nghiệm",
      dataIndex: "type",
      key: "type",
      width: 180,
    },
    {
      title: "Phương thức lấy mẫu",
      dataIndex: "sampleMethod",
      key: "sampleMethod",
      width: 140,
      render: (method) => (
        <Tag color={method === "home" ? "blue" : "green"}>
          {method === "home" ? "Tại nhà" : "Tại trung tâm"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
      width: 120,
      sorter: (a, b) =>
        new Date(a.date.split("/").reverse().join("-")) -
        new Date(b.date.split("/").reverse().join("-")),
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
            onClick={() => handleViewOrder(record)}
            style={{ background: "#1890ff", color: "#fff" }}
          >
            Xem
          </Button>
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditOrder(record)}
          >
            Sửa
          </Button>
          {record.isHidden ? (
            <Button
              size="small"
              type="primary"
              onClick={() => handleUnhideOrder(record)}
              style={{ background: "#52c41a", color: "#fff" }}
            >
              Hiện lại
            </Button>
          ) : (
            <Tooltip title="Ẩn đơn hàng khỏi giao diện nhân viên">
              <Button
                icon={<EyeInvisibleOutlined style={{ color: "#595959" }} />}
                onClick={() => handleDeleteOrder(record)}
                size="small"
                style={{
                  marginLeft: 8,
                  borderColor: "#bfbfbf",
                  color: "#595959",
                  background: "#f5f5f5",
                  fontWeight: 600,
                }}
              >
                Ẩn
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const stats = {
    total: orders.filter((order) => !order.isHidden).length,
    pending: orders.filter(
      (order) => order.status === "Chờ xử lý" && !order.isHidden
    ).length,
    processing: orders.filter(
      (order) => order.status === "Đang xử lý" && !order.isHidden
    ).length,
    completed: orders.filter(
      (order) => order.status === "Hoàn thành" && !order.isHidden
    ).length,
    waitingApproval: orders.filter(
      (order) => order.status === "Chờ xác thực" && !order.isHidden
    ).length,
    rejected: orders.filter(
      (order) => order.status === "Từ chối" && !order.isHidden
    ).length,
    hidden: orders.filter((order) => order.isHidden).length,
  };

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}
        >
          Quản lý đơn hàng
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
          Quản lý tất cả đơn hàng xét nghiệm ADN
        </p>
      </div>

      {/* Thống kê tổng quan */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: "#00a67e" }} />}
              valueStyle={{ color: "#00a67e" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={stats.pending}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={stats.processing}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Search
              placeholder="Tìm kiếm theo tên, email hoặc mã đơn"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
          </div>
          {/* Đã loại bỏ nút Xuất Excel và Tạo đơn mới */}
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`Tất cả (${stats.total})`} key="all" />
          <TabPane tab={`Chờ xử lý (${stats.pending})`} key="PENDING" />
          <TabPane tab={`Đang xử lý (${stats.processing})`} key="PROCESSING" />
          <TabPane
            tab={`Chờ xác thực (${stats.waitingApproval || 0})`}
            key="WAITING_APPROVAL"
          />
          <TabPane tab={`Hoàn thành (${stats.completed})`} key="COMPLETED" />
          <TabPane tab={`Từ chối (${stats.rejected || 0})`} key="REJECTED" />
          <TabPane tab={`Đơn đã ẩn (${stats.hidden})`} key="hidden" />
        </Tabs>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đơn hàng`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Modal xem chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {/* Modal content */}
      </Modal>

      <Modal
        open={!!confirmHideOrder}
        title={`Xác nhận ẩn đơn hàng #${confirmHideOrder?.id}`}
        onOk={handleConfirmHide}
        onCancel={handleCancelHide}
        okText="Ẩn"
        cancelText="Huỷ"
        okButtonProps={{ danger: true }}
      >
        Bạn có chắc chắn muốn ẩn thông tin đơn hàng này không?
      </Modal>
    </div>
  );
};

export default OrderManagement;
