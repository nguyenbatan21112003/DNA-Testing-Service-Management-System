"use client";

import { useState, useEffect, useContext } from "react";

import staffApi from "../../api/staffApi";
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Tabs,
  Statistic,
  Row,
  Col,
  Typography,
  Tooltip,
} from "antd";
import {
  FileTextOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ClockCircleOutlined,
  UserSwitchOutlined,
  HourglassOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
// import { useOrderContext } from "../../context/OrderContext";
import { AuthContext } from "../../context/AuthContext";

const { Search } = Input;
const { TabPane } = Tabs;
const { Title } = Typography;

const OrderManagement = () => {
  // const { getAllOrders, updateOrder } = useOrderContext();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  // const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  // const [acceptingOrder, setAcceptingOrder] = useState(null);
  // const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [confirmHideOrder, setConfirmHideOrder] = useState(null);
  const { user } = useContext(AuthContext);

  const handleConfirmHide = () => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === confirmHideOrder.id ? { ...o, isHidden: true } : o
      )
    );
    message.success("Đơn đã được ẩn");
    setConfirmHideOrder(null);
  };

  const handleUnhideOrder = (order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, isHidden: false } : o))
    );
    message.success("Đã hiện lại đơn hàng");
  };

  const confirmTestRequest = async (id, data) => {
    const res = await staffApi.updateRequest(id, data);
    if (res.status !== 200) throw new Error("Error confirm request");
    return res.data;
  };

  const handleAcceptOrder = async (order) => {
    try {
      // Bước 1: Fetch lại toàn bộ đơn
      const latestOrders = await loadAllSamplingRequests();


      // Bước 2: Tìm lại đơn cần xử lý
      const latestOrder = latestOrders?.find(o => o.id === order.id);

      // console.log("order đã load nè", latestOrder);
      // if (!latestOrder) {
      //   alert("Không tìm thấy đơn hàng!");
      //   return;
      // }

      if (!latestOrder) {
        alert("Không tìm thấy đơn hàng hoặc đơn đã được xử lý bởi người khác!");
        await loadAllSamplingRequests();
        return;
      }
      const payload = {
        processId: 0,
        requestId: order.id,
        staffId: user.userId,
        kitCode: "", // bỏ luôn generateKitCode
        collectionType:
          order.sampleMethod === "center" ? "At Center" : "At Home",
        notes: "",
      };

      const res = await staffApi.assignRequest(payload);
      if (res.status !== 200) throw new Error();

      const resConfirmed = {
        newStatus: "confirmed",
        requestId: payload.requestId,
      };

      await confirmTestRequest(payload.requestId, resConfirmed);

      message.success(
        order.sampleMethod === "center"
          ? "✅ Đã nhận đơn tại trung tâm!"
          : "✅ Đã nhận đơn tại nhà!"
      );
      alert("✅Nhận đơn thành công");
      await loadAllSamplingRequests();
    } catch (error) {
      console.log(error.status);
      message.error("Lỗi khi nhận đơn!");
    }
  };

  const loadAllSamplingRequests = async () => {
    try {
      const [homeRes, centerRes] = await Promise.all([
        staffApi.getRequestHome(),
        staffApi.getRequestCenter(),
      ]);
      const mapData = (data) =>
        data
          .filter((item) => item.status == "pending")
          .map((item) => {
            const declarant = item.declarant || {};
            const methodLabel = item.collectionType
              ?.toLowerCase()
              .includes("at home")
              ? "home"
              : "center";
            // console.log(item);
            return {
              id: item.requestId,
              name: declarant.fullName,
              phone: declarant.phone,
              address: declarant.address,
              email: declarant.email,
              identityNumber: declarant.identityNumber,
              type: item.serviceName,
              category:
                item.serviceCategory === "Administrative"
                  ? "Hành chính"
                  : "Dân sự",
              sampleMethod: methodLabel,
              status: item.status?.toUpperCase() || "PENDING",
              createdAt: item.createdAt,
              date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
              scheduledDate: item.scheduleDate
                ? new Date(item.scheduleDate).toLocaleString("vi-VN")
                : null,
              isHidden: item.isHidden ?? false,
              sampleInfo: {
                donors: (item.sample || []).map((s) => ({
                  name: s.ownerName,
                  gender: s.gender,
                  relationship: s.relationship,
                  yob: s.yob,
                  sampleType: s.sampleType,
                })),
              },
            };
          });

      const allOrders = [
        ...mapData(Array.isArray(homeRes.data) ? homeRes.data : []),
        ...mapData(Array.isArray(centerRes.data) ? centerRes.data : []),
      ];
      // ✅ Sắp xếp: PENDING lên đầu, các trạng thái khác giữ nguyên
      const sortedOrders = allOrders.sort((a, b) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;
        return 0; // giữ nguyên thứ tự nếu cùng trạng thái
      });
      setOrders(sortedOrders);
      return sortedOrders;
    } catch (error) {
      console.error("Lỗi khi load đơn:", error.status);
    }
  };

  useEffect(() => {
    loadAllSamplingRequests();
  }, []);

  useEffect(() => {
    let filtered = orders;
    if (activeTab !== "all")
      filtered = filtered.filter((o) => o.status === activeTab && !o.isHidden);
    else filtered = filtered.filter((o) => !o.isHidden);
    if (searchText)
      filtered = filtered.filter(
        (o) =>
          o.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          o.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          o.id?.toString().includes(searchText)
      );
    setFilteredOrders(filtered);
  }, [activeTab, searchText, orders]);

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "CONFIRMED":
        return "Đơn đã được nhận";
      case "COMPLETED":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#ffc107"; // vàng đậm
      case "CONFIRMED":
        return "#17a2b8"; // xanh cyan
      case "COMPLETED":
        return "#28a745"; // xanh lá đậm
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      render: (id) => `#DNA${id}`,
    },
    { title: "Khách hàng", dataIndex: "name" },

    { title: "SĐT", dataIndex: "phone" },
    { title: "Loại xét nghiệm", dataIndex: "type" },
    {
      title: "Phương thức lấy mẫu",
      dataIndex: "sampleMethod",
      render: (m) => (
        <Tag color={m === "home" ? "blue" : "green"}>
          {m === "home" ? "Tại nhà" : "Tại trung tâm"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === "PENDING" && "⏳ "}
          {status === "CONFIRMED" && "🔄 "}
          {status === "COMPLETED" && "✅ "}
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setModalVisible(true);
            }}
          >
            Thông tin
          </Button>
          {record.status === "PENDING" && !record.isHidden && (
            <Button onClick={() => handleAcceptOrder(record)}>Nhận đơn</Button>
          )}
          {record.isHidden ? (
            <Button onClick={() => handleUnhideOrder(record)}>Hiện lại</Button>
          ) : (
            <Tooltip title="Ẩn đơn">
              <Button
                icon={<EyeInvisibleOutlined />}
                onClick={() => setConfirmHideOrder(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const stats = {
    total: orders.filter((o) => !o.isHidden).length,
    pending: orders.filter((o) => o.status === "PENDING" && !o.isHidden).length,
    processing: orders.filter((o) => o.status === "CONFIRMED" && !o.isHidden)
      .length, // CHỖ NÀY
    completed: orders.filter((o) => o.status === "COMPLETED" && !o.isHidden)
      .length,
  };

  return (
    <div style={{ padding: 24 }}>
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
              title="Đơn chờ xác nhận"
              value={stats.pending}
              valueStyle={{ color: "#faad14", fontWeight: 700 }}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={stats.processing}
              prefix={<HourglassOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              valueStyle={{ color: "#52c41a", fontWeight: 700 }}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Search
          placeholder="Tìm kiếm..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
        />
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`Tất cả (${stats.total})`} key="all" />
          <TabPane tab={`Chờ xử lý (${stats.pending})`} key="PENDING" />
          <TabPane
            tab={`Đơn đã được nhận (${stats.processing})`}
            key="CONFIRMED"
          />
          <TabPane tab={`Hoàn thành (${stats.completed})`} key="COMPLETED" />
        </Tabs>
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        open={modalVisible}
        title={
          <Title level={3} style={{ color: "#059669", margin: 0 }}>
            Chi tiết yêu cầu lấy mẫu #{selectedOrder?.id}
          </Title>
        }
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <div>
          <p>
            <strong>Mã đơn:</strong> #{selectedOrder?.id}
          </p>
          <p>
            <strong>Họ tên:</strong> {selectedOrder?.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedOrder?.email}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {selectedOrder?.phone}
          </p>

          <p>
            <strong>Địa chỉ:</strong> {selectedOrder?.address}
          </p>
          <p>
            <strong>Loại dịch vụ:</strong> {selectedOrder?.type} (
            {selectedOrder?.category})
          </p>
          <p>
            <strong>Phương thức lấy mẫu:</strong>{" "}
            {selectedOrder?.sampleMethod === "home"
              ? "Tại nhà"
              : "Tại trung tâm"}
          </p>
          <p>
            <strong>Trạng thái:</strong> {getStatusText(selectedOrder?.status)}
          </p>
          <p>
            <strong>Ngày tạo:</strong> {selectedOrder?.date}
          </p>
          {selectedOrder?.scheduledDate && (
            <p>
              <strong>Lịch hẹn:</strong> {selectedOrder?.scheduledDate}
            </p>
          )}
          <div style={{ marginTop: 16 }}>
            <strong style={{ fontSize: 16 }}>Thông tin mẫu:</strong>
            {selectedOrder?.sampleInfo?.donors?.length > 0 ? (
              <div style={{ marginTop: 12 }}>
                {selectedOrder.sampleInfo.donors.map((donor, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#fafafa",
                      padding: "16px",
                      borderRadius: 8,
                      marginBottom: 16,
                      border: "1px solid #eee",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    <p style={{ marginBottom: 8 }}>
                      <strong>👤 Họ tên:</strong> {donor.name}
                    </p>
                    <p style={{ marginBottom: 8 }}>
                      <strong>⚥ Giới tính:</strong> {donor.gender} &nbsp;|&nbsp;{" "}
                      <strong>🎂 Năm sinh:</strong> {donor.yob ? donor.yob : ""}
                    </p>
                    <p style={{ marginBottom: 0 }}>
                      <strong>🔗 Quan hệ:</strong> {donor.relationship}{" "}
                      &nbsp;|&nbsp; <strong>🧪 Loại mẫu:</strong>{" "}
                      {donor.sampleType}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ marginTop: 8 }}>Không có thông tin mẫu</p>
            )}
          </div>
        </div>
      </Modal>

      {/* <Modal
        open={acceptModalVisible}
        title={`Nhận đơn #${acceptingOrder?.id}`}
        onCancel={() => setAcceptModalVisible(false)}
        onOk={() => form.submit()}
        okText="Xác nhận"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitAcceptOrder}>
          <Form.Item label="Mã kit" name="kitCode">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Ghi chú" name="notes">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal> */}

      <Modal
        open={!!confirmHideOrder}
        title={`Xác nhận ẩn đơn hàng #${confirmHideOrder?.id}`}
        onOk={handleConfirmHide}
        onCancel={() => setConfirmHideOrder(null)}
        okText="Ẩn"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        Bạn có chắc muốn ẩn đơn hàng này không?
      </Modal>
    </div>
  );
};

export default OrderManagement;
