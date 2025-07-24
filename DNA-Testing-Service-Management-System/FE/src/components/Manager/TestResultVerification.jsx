import { useState, useEffect, useContext } from "react";
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
  Input,
  Tabs,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  EyeInvisibleOutlined, // Thêm icon này
} from "@ant-design/icons";
import { useOrderContext } from "../../context/OrderContext";
import managerApi from "../../api/managerApi";
import { AuthContext } from "../../context/AuthContext";
import serviceApi from "../../api/serviceApi";

const { Title, Text } = Typography;

const TestResultVerification = () => {
  const { user } = useContext(AuthContext);
  // const { getOrdersNeedingApproval, updateOrder, getAllOrders } =
  useOrderContext();
  // const [ordersNeedingApproval, setOrdersNeedingApproval] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [approveConfirmVisible, setApproveConfirmVisible] = useState(false);
  const [pendingApproveOrder, setPendingApproveOrder] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [pendingRejectOrder, setPendingRejectOrder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [hideModalVisible, setHideModalVisible] = useState(false);
  const [orderToHide, setOrderToHide] = useState(null);
  const [results, setResult] = useState([]);

  // useEffect(() => {
  //   loadOrdersNeedingApproval();
  // }, []);

  // Lắng nghe sự kiện storage để tự động reload orders khi localStorage thay đổi
  useEffect(() => {
    fetchResults();

    // const handleStorageChange = (event) => {
    //   if (event.key === "dna_orders") {
    //     loadOrdersNeedingApproval(); // Chỉ reload dữ liệu thay vì reload cả trang
    //   }
    // };
    // window.addEventListener("storage", handleStorageChange);
    // return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchResults = async () => {
    try {
      const [resResults, resRequests, resServices] = await Promise.all([
        managerApi.getTestResults(),
        managerApi.getTestRequests(),
        serviceApi.getServices(),
      ]);

      const results = Array.isArray(resResults.data) ? resResults.data : [];
      const requests = Array.isArray(resRequests.data) ? resRequests.data : [];
      const services = Array.isArray(resServices.data) ? resServices.data : [];

      // console.log("data", results, requests, services);
      const hiddenIds = JSON.parse(localStorage.getItem("dna_hidden") || "[]");

      const mapped = results?.map((result) => {
        const req = requests?.find((r) => r.requestId === result.requestId);
        const service = services?.find((s) => s.id === req?.serviceId);

        return {
          id: result.requestId,
          resultId: result.resultId,
          result: result.resultData,
          type: service?.serviceName || "Chưa rõ",
          category:
            req?.category === "Voluntary"
              ? "Dân sự"
              : req?.category === "Administrative"
              ? "Hành chính"
              : "Không rõ",

          sampleMethod: req?.typeId === 1 ? "center" : "home",
          name: "Ẩn danh",
          status: result.status,
          date: result.enteredAt?.split("T")[0],
          isHiddenByManager: hiddenIds.includes(result.resultId),
          conclusion: result.resultData || "Không có",
        };
      });

      setResult(mapped);
      setFilteredOrders(mapped);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu kết quả xét nghiệm:", error);
    }
  };

  const confirmApprove = async () => {
    if (!pendingApproveOrder) return;
    try {
  
      const resUpdate = await managerApi.updateTestProcess({
        requestId: pendingApproveOrder.id,
        currentStatus: "completed",
        updatedAt: new Date().toISOString(), // ✅ chuẩn ISO 8601
      });
      const res = await managerApi.verifyTestResult({
        resultID: pendingApproveOrder.resultId,
        managerID: user?.userId, // bạn cần truyền vào từ context hoặc localStorage
      });

      console.log(res, resUpdate);
      alert("Phê duyệt thành công!");
      message.success("Phê duyệt thành công!");
      fetchResults();
    } catch (err) {
      console.log(err);
      message.error("Phê duyệt thất bại");
    }
    setApproveConfirmVisible(false);
  };

  const confirmReject = async () => {
    if (!pendingRejectOrder) return;
    try {
      const res = await managerApi.updateTestResult({
        resultID: pendingRejectOrder.resultId,
        status: "rejected", // hoặc enum tương ứng nếu cần
      });
      // console.log(res);
      if(res.status !== 200) throw new Error
      alert("Đã từ chối kết quả!");
      message.success("Đã từ chối kết quả!");
      fetchResults();
    } catch (err) {
      console.log(err);
      message.error("Từ chối thất bại");
    }
    setRejectModalVisible(false);
    setRejectNote("");
  };

  // const fetchRequestInfo = async () => {
  //   const res = await managerApi.getTestRequests();
  //   return Array.isArray(res.data) ? res.data : [];
  // };

  // useEffect(() => {
  // const allOrders = getAllOrders();
  // Chỉ lấy các đơn có trạng thái 'Chờ xác thực', 'Hoàn thành', hoặc 'Từ chối'
  //   setFilteredOrders(
  //     allOrders.filter((order) => {
  //       const status = getStatusText(order.status);
  //       return (
  //         status === "Chờ xác thực" ||
  //         status === "Hoàn thành" ||
  //         status === "Từ chối"
  //       );
  //     })
  //   );
  // }, [ordersNeedingApproval, getAllOrders]);

  // const loadOrdersNeedingApproval = () => {
  //   const orders = getOrdersNeedingApproval();
  //   setOrdersNeedingApproval(orders);
  // };

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

  const handleHideOrder = (order) => {
    setOrderToHide(order);
    setHideModalVisible(true);
  };
  // const confirmHideOrder = () => {
  //   if (!orderToHide) return;
  //   const orders = getAllOrders();
  //   const updatedOrders = orders.map((o) =>
  //     o.id === orderToHide.id ? { ...o, isHiddenByManager: true } : o
  //   );
  //   localStorage.setItem("dna_orders", JSON.stringify(updatedOrders));
  //   window.dispatchEvent(new Event("dna_orders_updated"));
  //   setFilteredOrders((prev) => prev.filter((o) => o.id !== orderToHide.id));
  //   setHideModalVisible(false);
  //   setOrderToHide(null);
  //   message.success("Đã ẩn đơn hàng khỏi danh sách!");
  // };
  const confirmHideOrder = () => {
    const hiddenIds = JSON.parse(localStorage.getItem("dna_hidden") || "[]");
    localStorage.setItem(
      "dna_hidden",
      JSON.stringify([...hiddenIds, orderToHide.resultId])
    );
    setResult((prev) =>
      prev.map((o) =>
        o.resultId === orderToHide.resultId
          ? { ...o, isHiddenByManager: true }
          : o
      )
    );
    setHideModalVisible(false); // 👈 thêm dòng này
    setOrderToHide(null); // 👈 thêm dòng này
  };

  const cancelHideOrder = () => {
    setHideModalVisible(false);
    setOrderToHide(null);
  };

  // const confirmApprove = async () => {
  //   if (!pendingApproveOrder) return;
  //   await updateOrder(pendingApproveOrder.id, {
  //     managerConfirm: true,
  //     status: "Hoàn thành",
  //     approvedAt: new Date().toISOString(),
  //     managerNote: "",
  //   });
  //   setApproveConfirmVisible(false);
  //   setPendingApproveOrder(null);
  //   message.success("Đã phê duyệt kết quả xét nghiệm thành công!");
  //   // Đơn KHÔNG bị ẩn khỏi danh sách, chỉ cập nhật trạng thái
  // };

  // const confirmReject = async () => {
  //   if (!pendingRejectOrder) return;
  //   await updateOrder(pendingRejectOrder.id, {
  //     managerConfirm: false,
  //     status: "Từ chối",
  //     approvedAt: new Date().toISOString(),
  //     managerNote: rejectNote,
  //   });
  //   setRejectModalVisible(false);
  //   setRejectNote("");
  //   setPendingRejectOrder(null);
  //   message.success("Đã từ chối kết quả xét nghiệm!");
  //   // Đơn KHÔNG bị ẩn khỏi danh sách, chỉ cập nhật trạng thái
  // };

  // Hàm chuẩn hóa chuỗi: bỏ dấu tiếng Việt, chuyển thường, loại bỏ khoảng trắng thừa
  function normalizeStatus(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, "")
      .trim();
  }
  const getStatusText = (status) => {
    const s = normalizeStatus(status);
    if (["pending", "waitingapproval"].includes(s)) return "Chờ xác thực";
    if (["verified", "completed"].includes(s)) return "Hoàn thành";
    if (["rejected"].includes(s)) return "Từ chối";
    return "Khác";
  };

  // Hàm lọc theo trạng thái
  const filterByStatus = (orders, status) => {
    if (status === "all") return orders;
    if (status === "waitingApproval")
      return orders.filter(
        (order) => getStatusText(order.status) === "Chờ xác thực"
      );
    if (status === "processing")
      return orders.filter(
        (order) => getStatusText(order.status) === "Đang xử lý"
      );
    if (status === "completed")
      return orders.filter(
        (order) => getStatusText(order.status) === "Hoàn thành"
      );
    if (status === "rejected")
      return orders.filter(
        (order) => getStatusText(order.status) === "Từ chối"
      );
    return orders;
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (id) => `#${id}`,
      width: 100,
    },
    // {
    //   title: "Khách hàng",
    //   dataIndex: "name",
    //   key: "name",
    //   width: 150,
    // },
    {
      title: "Loại xét nghiệm",
      dataIndex: "type",
      key: "type",
      width: 200,
    },
    {
      title: "Phân loại",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag color="blue" style={{ fontWeight: 600 }}>
          {category}
        </Tag>
      ),
      width: 140,
    },

    {
      title: "Nơi lấy mẫu",
      key: "location",
      width: 180,
      render: (_, record) => {
        if (record.sampleMethod === "home")
          return (
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
          );
        if (record.sampleMethod === "center")
          return (
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
          );
        return <Tag>-</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_, record) => {
        const status = getStatusText(record.status);
        let color = "#b2bec3";
        if (status === "Chờ xác thực") color = "#722ed1";
        else if (status === "Hoàn thành") color = "#52c41a";
        else if (status === "Từ chối") color = "#ff4d4f";
        return (
          <Tag
            style={{
              background: color,
              color: "#fff",
              fontWeight: 700,
              border: "none",
              fontSize: 16,
              padding: "6px 18px",
              boxShadow: "0 2px 8px #0001",
              borderRadius: 8,
              minWidth: 110,
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_, record) => {
        const status = getStatusText(record.status);
        return (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewResult(record)}
              style={{
                background: "#1677ff",
                borderColor: "#1677ff",
                fontWeight: 600,
                borderRadius: 20,
                boxShadow: "0 2px 8px rgba(22,119,255,0.12)",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#0958d9";
                e.currentTarget.style.borderColor = "#0958d9";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(9,88,217,0.18)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#1677ff";
                e.currentTarget.style.borderColor = "#1677ff";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(22,119,255,0.12)";
              }}
            >
              Xem
            </Button>
            {status === "Chờ xác thực" && (
              <>
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
              </>
            )}
            {status === "Hoàn thành" && (
              <Button
                size="small"
                type="default"
                danger
                icon={<EyeInvisibleOutlined style={{ color: "#888" }} />} // Thêm icon
                onClick={() => handleHideOrder(record)}
                style={{
                  borderRadius: 20,
                  fontWeight: 600,
                  borderColor: "#bfbfbf",
                  color: "#888",
                }}
              >
                Ẩn
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  const stats = {
    total: results.filter((o) => getStatusText(o.status) === "Chờ xác thực")
      .length,
    approved: results.filter((o) => getStatusText(o.status) === "Hoàn thành")
      .length,
    rejected: results.filter((o) => getStatusText(o.status) === "Từ chối")
      .length,
    hidden: results.filter((o) => o.isHiddenByManager).length,
  };

  // const handleUnhideOrder = (order) => {
  //   const orders = getAllOrders();
  //   const updatedOrders = orders.map((o) =>
  //     o.id === order.id ? { ...o, isHiddenByManager: false } : o
  //   );
  //   localStorage.setItem("dna_orders", JSON.stringify(updatedOrders));
  //   window.dispatchEvent(new Event("dna_orders_updated"));
  //   message.success("Đã hiện lại đơn hàng!");
  // };

  const handleUnhideOrder = (order) => {
    const hiddenIds = JSON.parse(
      localStorage.getItem("dna_hidden") || "[]"
    ).filter((id) => id !== order.resultId);
    localStorage.setItem("dna_hidden", JSON.stringify(hiddenIds));
    setResult((prev) =>
      prev.map((o) =>
        o.resultId === order.resultId ? { ...o, isHiddenByManager: false } : o
      )
    );
  };

  return (
    <div style={{ padding: "0" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#722ed1",
            margin: 0,
          }}
        >
          Xác thực kết quả xét nghiệm
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0 0" }}>
          Phê duyệt và xác thực kết quả xét nghiệm trước khi gửi cho khách hàng
        </p>
      </div>

      {/* Thống kê */}
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid #f0f0f0",
          marginBottom: "24px",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card>
              <Statistic
                title="Tổng đơn chờ xác thực"
                value={stats.total}
                prefix={
                  <SafetyCertificateOutlined style={{ color: "#722ed1" }} />
                }
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
                title="Đơn đã ẩn"
                value={stats.hidden}
                prefix={<EyeInvisibleOutlined style={{ color: "#888" }} />}
                valueStyle={{ color: "#888", fontWeight: 600 }}
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
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginBottom: 16 }}
          items={[
            { key: "all", label: "Tất cả" },
            { key: "waitingApproval", label: "Chờ xác thực" },
            { key: "completed", label: "Hoàn thành" },
            { key: "rejected", label: "Từ chối" },
            { key: "hidden", label: "Đơn đã ẩn" },
          ]}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: 16,
          }}
        >
          <Input.Search
            placeholder="Tìm kiếm theo tên khách hàng, mã đơn, loại xét nghiệm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(v) => setSearchText(v)}
            allowClear
            style={{ width: 320 }}
          />
        </div>
        {activeTab === "hidden" ? (
          <Table
            columns={[
              ...columns.filter((col) => col.key !== "action"),
              {
                title: "Thao tác",
                key: "action-unhide",
                width: 120,
                render: (_, record) => (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => handleUnhideOrder(record)}
                    style={{ background: "#52c41a", color: "#fff" }}
                  >
                    Hiện lại
                  </Button>
                ),
              },
            ]}
            dataSource={filteredOrders.filter(
              (order) => order.isHiddenByManager
            )}
            rowKey={(record) => record.id}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} đơn đã ẩn`,
            }}
            scroll={{ x: 1000 }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filterByStatus(results, activeTab).filter(
              (order) => !order.isHiddenByManager
            )}
            rowKey={(record) => record.id}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} đơn hàng`,
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
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#722ed1",
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Đơn cần xác thực
            </div>
            {/* Thêm dòng tiêu đề thông tin khách hàng */}
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              Thông tin khách hàng
            </div>
            {/* Thông tin khách hàng trong khung đơn giản */}
            <div
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                padding: 20,
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 18, marginBottom: 6 }}>
                <b>Mã đơn:</b> #{selectedOrder.id}
              </div>
              {/* <div style={{ fontSize: 18, marginBottom: 6 }}>
                <b>Khách hàng:</b> {selectedOrder.name}
              </div> */}
              <div style={{ fontSize: 18, marginBottom: 6 }}>
                <b>Loại xét nghiệm:</b> {selectedOrder.type}
              </div>
              <div style={{ fontSize: 18 }}>
                <b>Ngày tạo:</b> {selectedOrder.date}
              </div>
            </div>

            {/* Dữ liệu đơn hàng (bảng mẫu khách hàng) */}
            {selectedOrder.result
              ? (() => {
                  let parsed = null;
                  try {
                    parsed = JSON.parse(selectedOrder.result);
                  } catch {
                    // Không parse được, giữ nguyên parsed = null
                    parsed = [];
                  }
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    return (
                      <div style={{ marginBottom: 24 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 18,
                            marginBottom: 8,
                          }}
                        >
                          Dữ liệu đơn hàng
                        </div>
                        <Table
                          dataSource={parsed}
                          columns={[
                            {
                              title: "Họ và tên",
                              dataIndex: "name",
                              key: "name",
                            },
                            {
                              title: "Năm sinh",
                              dataIndex: "birthYear",
                              key: "birthYear",
                            },
                            {
                              title: "Giới tính",
                              dataIndex: "gender",
                              key: "gender",
                            },
                            {
                              title: "Mối quan hệ",
                              dataIndex: "relationship",
                              key: "relationship",
                            },
                            {
                              title: "Loại mẫu",
                              dataIndex: "sampleType",
                              key: "sampleType",
                            },
                          ]}
                          pagination={false}
                          size="small"
                          rowKey={(row, idx) => row.key || idx}
                          style={{
                            background: "#f6ffed",
                            border: "1px solid #b7eb8f",
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    );
                  }
                  return null;
                })()
              : null}

            {/* Kết luận */}
            {selectedOrder.conclusion && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                  Kết luận
                </div>
                <div
                  style={{
                    padding: 12,
                    background: "#f0f5ff",
                    border: "1px solid #d6e4ff",
                    borderRadius: 4,
                  }}
                >
                  <Text>{selectedOrder.conclusion || "Không có"}</Text>
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
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="Nhập lý do từ chối..."
            style={{
              width: "100%",
              minHeight: 80,
              padding: 8,
              border: "1px solid #d9d9d9",
              borderRadius: 4,
              marginTop: 8,
            }}
          />
        </div>
      </Modal>

      {/* Modal xác nhận ẩn đơn hàng */}
      <Modal
        open={hideModalVisible}
        onCancel={cancelHideOrder}
        onOk={confirmHideOrder}
        okText="Ẩn"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        title={
          orderToHide
            ? `Xác nhận ẩn đơn hàng #${orderToHide.id}`
            : "Xác nhận ẩn đơn hàng"
        }
      >
        <p>Bạn có chắc chắn muốn ẩn thông tin đơn hàng này không?</p>
      </Modal>
    </div>
  );
};

export default TestResultVerification;
