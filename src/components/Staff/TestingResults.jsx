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
  Upload,
  Tabs,
  Row,
  Col,
  Statistic,
  Divider,
  Typography,
  Tooltip,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  UploadOutlined,
  DownloadOutlined,
  PrinterOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
  DeleteOutlined,
  UndoOutlined,
  EyeInvisibleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useOrderContext } from "../../context/OrderContext";

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

const TestingResults = () => {
  const { orders, updateOrder } = useOrderContext();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState("all");
  const [tempFormData, setTempFormData] = useState({});
  const [currentEditOrderId, setCurrentEditOrderId] = useState(null);
  const [confirmHideOrder, setConfirmHideOrder] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [reasonText, setReasonText] = useState("");

  const STATUS_PROCESSING = "Đang xử lý";
  const STATUS_WAITING_APPROVAL = "Chờ xác thực";
  const STATUS_REJECTED = "Từ chối";
  const STATUS_COMPLETED = "Hoàn thành";

  // Đưa getStatusText ra ngoài component để không bị thay đổi reference mỗi lần render
  const getStatusText = (status) => {
    const s = normalizeStatus(status);
    if (["choxacthuc", "waitingapproval"].includes(s)) return "Chờ xác thực";
    if (["hoanthanh", "completed"].includes(s)) return "Hoàn thành";
    if (["tuchoi", "rejected"].includes(s)) return "Từ chối";
    // Mặc định mọi trạng thái khác đều là Đang xử lý
    return "Đang xử lý";
  };

  useEffect(() => {
    setFilteredOrders(
      orders.filter(
        (order) =>
          !order.isHidden &&
          getStatusText(order.status) === "Đang xử lý" &&
          (
            (Array.isArray(order.resultTableData) && order.resultTableData.length > 0) ||
            (Array.isArray(order.members) && order.members.length > 0)
          )
      )
    );
  }, [orders]);

  // Lắng nghe sự kiện storage để tự động cập nhật khi manager thay đổi trạng thái
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "dna_orders") {
        // Force re-render bằng cách trigger một state change
        setFilteredOrders(prev => [...prev]);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // SỬA LOGIC FILTER ĐỂ HIỂN THỊ TOÀN BỘ ĐƠN HÀNG
  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredOrders(
        orders.filter((order) => !order.isHidden)
      );
    } else {
      setFilteredOrders(
        orders.filter(
          (order) =>
            !order.isHidden &&
            getStatusText(order.status) === filterStatus
        )
      );
    }
  }, [filterStatus, orders]);

  useEffect(() => {
    if (editModalVisible) {
      const currentData = form.getFieldValue("resultTableData");
      if (currentData) {
        setTableData(currentData);
      }
    }
  }, [editModalVisible, form]);

  const handleViewResult = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleEditResult = (order) => {
    setSelectedOrder(order);

    if (
      currentEditOrderId === order.id &&
      tempFormData &&
      Object.keys(tempFormData).length > 0
    ) {
      form.setFieldsValue(tempFormData);
    } else {
      let initialTableData = [];

      if (order.resultTableData && Array.isArray(order.resultTableData)) {
        initialTableData = [...order.resultTableData];
      } else if (
        !order.resultTableData &&
        order.result &&
        typeof order.result === "string"
      ) {
        try {
          const parsedData = JSON.parse(order.result);
          if (Array.isArray(parsedData)) {
            initialTableData = parsedData;
          }
        } catch (err) {
          console.error("Failed to parse result data:", err);
        }
      }

      if (
        initialTableData.length === 0 &&
        Array.isArray(order.members) && order.members.length > 0
      ) {
        initialTableData = order.members.map((mem, idx) => ({
          key: `${Date.now()}-${idx}`,
          name: mem.name || mem.hoTen || mem.hovaten || "",
          birth: mem.birth || mem.birthYear || mem.namSinh || mem.namsinh || "",
          gender: mem.gender || mem.gioiTinh || mem.gioitinh || "",
          relationship: mem.relationship || mem.moiQuanHe || mem.moiquanhe || mem.relation || "",
          sampleType: mem.sampleType || mem.loaiMau || mem.loaimau || ""
        }));
      } else if (
        initialTableData.length === 0 &&
        order.sampleInfo && Array.isArray(order.sampleInfo.donors) && order.sampleInfo.donors.length > 0
      ) {
        initialTableData = order.sampleInfo.donors.map((donor, idx) => ({
          key: `${Date.now()}-${idx}`,
          name: donor.name || "",
          birth: donor.birth || donor.birthYear || donor.namSinh || donor.namsinh || "",
          gender: donor.gender || "",
          relationship: donor.relationship || donor.relation || "",
          sampleType: donor.sampleType || ""
        }));
      }

      if (initialTableData.length === 0) {
        initialTableData = [{ key: Date.now().toString() }];
      }

      const formValues = {
        status: order.status,
        result: order.result || "",
        testingMethod: order.testingMethod || "STR",
        testingNotes: order.testingNotes || "",
        resultTableData: initialTableData,
        conclusion: order.conclusion || "",
      };

      form.setFieldsValue(formValues);
      setTempFormData(formValues);
    }

    setCurrentEditOrderId(order.id);
    setEditModalVisible(true);
  };

  const handleSaveResult = async (values) => {
    try {
      let dataToSave =
        Array.isArray(values.resultTableData) &&
          values.resultTableData.length > 0
          ? values.resultTableData
          : tableData;
      const resultTableDataCopy = Array.isArray(dataToSave)
        ? JSON.parse(JSON.stringify(dataToSave))
        : null;
      // Kiểm tra nếu là lỗi mẫu
      const isErrorSample = (values.conclusion || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim() === 'loi mau';
      if (isErrorSample) {
      updateOrder(selectedOrder.id, {
          // Không đổi trạng thái, chỉ update kết quả và các trường khác
        result: resultTableDataCopy
          ? JSON.stringify(resultTableDataCopy)
          : values.result,
        testingMethod: values.testingMethod,
          testingNotes: values.conclusion,
        conclusion: values.conclusion,
        resultTableData: resultTableDataCopy,
        updatedAt: new Date().toLocaleString("vi-VN"),
      });
      setTempFormData({});
      setCurrentEditOrderId(null);
      setEditModalVisible(false);
        message.warning("Mẫu bị lỗi. Đã gửi thông báo cho khách hàng yêu cầu gửi lại mẫu!");
        return;
      }
      // Khi staff lưu kết quả, chuyển trạng thái sang 'Chờ xác thực'
      updateOrder(selectedOrder.id, {
        status: "Chờ xác thực",
        result: resultTableDataCopy
          ? JSON.stringify(resultTableDataCopy)
          : values.result,
        testingMethod: values.testingMethod,
        testingNotes: values.conclusion,
        conclusion: values.conclusion,
        resultTableData: resultTableDataCopy,
        updatedAt: new Date().toLocaleString("vi-VN"),
      });
      setTempFormData({});
      setCurrentEditOrderId(null);
      setEditModalVisible(false);
      message.success("Đã lưu kết quả và chuyển trạng thái sang Chờ xác thực!");
    } catch (error) {
      console.error("Error updating result:", error);
      message.error("Có lỗi xảy ra khi cập nhật kết quả!");
    }
  };

  const handleFormValuesChange = (changedValues, allValues) => {
    setTempFormData(allValues);
  };

  const handleDeleteOrder = (order) => {
    setConfirmHideOrder(order);
  };

  const handleConfirmHide = () => {
    if (confirmHideOrder) {
      updateOrder(confirmHideOrder.id, { isHidden: true });
      message.success("Đơn hàng đã được ẩn khỏi giao diện nhân viên!");
      setConfirmHideOrder(null);
    }
  };

  const handleCancelHide = () => {
    setConfirmHideOrder(null);
  };

  const handleUnhideOrder = (order) => {
    updateOrder(order.id, { isHidden: false });
    message.success("Đơn hàng đã được hiện lại cho nhân viên!");
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

  const getStatusColor = (status) => {
    switch (getStatusText(status)) {
      case "Chờ xác thực": return "#722ed1"; // tím
      case "Đang xử lý": return "#1890ff"; // xanh dương
      case "Hoàn thành": return "#52c41a"; // xanh lá
      case "Từ chối": return "#ff4d4f"; // đỏ
      default: return "#b2bec3"; // xám nhạt
    }
  };

  const getCaseType = (type) => {
    if (!type) return null;
    if (type.toLowerCase().includes('hành chính')) return 'Hành chính';
    if (type.toLowerCase().includes('dân sự')) return 'Dân sự';
    return 'Khác';
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
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 220,
      render: (address) => address || '-',
    },
    {
      title: "Loại xét nghiệm",
      dataIndex: "type",
      key: "type",
      width: 200,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag style={{
          background: getStatusColor(status),
          color: '#fff',
          fontWeight: 700,
          border: 'none',
          fontSize: 16,
          padding: '6px 18px',
          boxShadow: '0 2px 8px #0001',
          borderRadius: 8,
          minWidth: 110,
          textAlign: 'center',
          display: 'inline-block',
        }}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Địa điểm lấy mẫu",
      dataIndex: "sampleMethod",
      key: "sampleMethod",
      width: 140,
      render: (method) =>
        method === 'home' ? (
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
        ) : method === 'center' ? (
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
        ) : (
          <Tag>-</Tag>
        )
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewResult(record)}
            style={{ background: "#1890ff", color: "#fff" }}
          >
            Xem
          </Button>
          {getStatusText(record.status) !== "Hoàn thành" && (
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditResult(record)}
            >
              Nhập kết quả
            </Button>
          )}
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
          {record.status === STATUS_REJECTED && record.managerNote && (
            <Button
              size="small"
              icon={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
              onClick={() => {
                setReasonText(record.managerNote);
                setReasonModalVisible(true);
              }}
              style={{ background: '#fffbe6', borderColor: '#faad14', color: '#faad14', fontWeight: 600 }}
            >
              Lý Do
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const stats = {
    total: orders.length,
    processing: orders.filter((o) => getStatusText(o.status) === STATUS_PROCESSING).length,
    waitingApproval: orders.filter((o) => getStatusText(o.status) === STATUS_WAITING_APPROVAL).length,
    completed: orders.filter((o) => getStatusText(o.status) === STATUS_COMPLETED).length,
    rejected: orders.filter((o) => getStatusText(o.status) === STATUS_REJECTED).length,
    withResults: orders.filter((o) => o.result).length,
  };

  // Ưu tiên lấy từ resultTableData, nếu không có thì lấy từ sampleInfo.donors, nếu không có thì lấy từ members
  const sampleData =
    Array.isArray(selectedOrder?.resultTableData) && selectedOrder.resultTableData.length > 0
      ? selectedOrder.resultTableData
      : Array.isArray(selectedOrder?.sampleInfo?.donors) && selectedOrder.sampleInfo.donors.length > 0
        ? selectedOrder.sampleInfo.donors
        : Array.isArray(selectedOrder?.members) && selectedOrder.members.length > 0
          ? selectedOrder.members
          : [];

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}
        >
          Xét nghiệm & Kết quả
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
          Quản lý kết quả xét nghiệm và cập nhật trạng thái
        </p>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.total}
              valueStyle={{ color: "#00a67e" }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={stats.processing}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Chờ xác thực"
              value={stats.waitingApproval}
              valueStyle={{ color: "#722ed1" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Từ chối"
              value={stats.rejected}
              valueStyle={{ color: "#ff4d4f" }}
              prefix={<FileTextOutlined />}
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
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 200 }}
            placeholder="Lọc theo trạng thái"
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value={STATUS_PROCESSING}>{STATUS_PROCESSING}</Option>
            <Option value={STATUS_WAITING_APPROVAL}>{STATUS_WAITING_APPROVAL}</Option>
            <Option value={STATUS_COMPLETED}>{STATUS_COMPLETED}</Option>
            <Option value={STATUS_REJECTED}>{STATUS_REJECTED}</Option>
          </Select>
        </div>

        <Tabs
          defaultActiveKey="all"
          items={[
            {
              key: "all",
              label: "Tất cả đơn hàng",
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredOrders}
                  rowKey={(record) => record.id || String(Math.random())}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} đơn hàng`,
                  }}
                  scroll={{ x: 1000 }}
                />
              ),
            },
            {
              key: "processing",
              label: "Đang xử lý",
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredOrders.filter(
                    (order) => getStatusText(order.status) === "Đang xử lý"
                  )}
                  rowKey={(record) => record.id || String(Math.random())}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} đơn hàng`,
                  }}
                  scroll={{ x: 1000 }}
                />
              ),
            },
            {
              key: "waitingApproval",
              label: "Chờ xác thực",
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredOrders.filter(
                    (order) => getStatusText(order.status) === "Chờ xác thực"
                  )}
                  rowKey={(record) => record.id || String(Math.random())}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} đơn hàng`,
                  }}
                  scroll={{ x: 1000 }}
                />
              ),
            },
            {
              key: "completed",
              label: "Hoàn thành",
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredOrders.filter(
                    (order) => getStatusText(order.status) === "Hoàn thành"
                  )}
                  rowKey={(record) => record.id || String(Math.random())}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} đơn hàng`,
                  }}
                  scroll={{ x: 1000 }}
                />
              ),
            },
            {
              key: "rejected",
              label: "Từ chối",
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredOrders.filter(
                    (order) => getStatusText(order.status) === "Từ chối"
                  )}
                  rowKey={(record) => record.id || String(Math.random())}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} đơn hàng`,
                  }}
                  scroll={{ x: 1000 }}
                />
              ),
            },
            {
              key: "hidden",
              label: "Đơn đã ẩn",
              children: (
                <Table
                  columns={[
                    ...columns,
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
                  dataSource={orders.filter((order) => order.isHidden)}
                  rowKey={(record) => record.id || String(Math.random())}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} đơn đã ẩn`,
                  }}
                  scroll={{ x: 1000 }}
                />
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={null}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div style={{ padding: 8 }}>
            {/* Tiêu đề lớn */}
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 32, fontWeight: 900, letterSpacing: 1 }}>
                Kết quả xét nghiệm - #{selectedOrder.id}
              </h2>
            </div>
            {/* Tag trạng thái và phân loại */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, justifyContent: 'center', alignItems: 'center' }}>
              <Tag style={{
                background: getStatusColor(getStatusText(selectedOrder?.status)),
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
                {getStatusText(selectedOrder?.status)}
              </Tag>
              {selectedOrder.type && (
                <Tag style={{
                  background: selectedOrder.type.toLowerCase().includes('hành chính') ? '#36cfc9' : '#722ed1',
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
                  {selectedOrder.type.toLowerCase().includes('hành chính') ? 'Hành chính' : (selectedOrder.type.toLowerCase().includes('dân sự') ? 'Dân sự' : 'Khác')}
                </Tag>
              )}
            </div>
            {/* 1. Thông tin khách hàng */}
            <div style={{ marginBottom: 24, background: '#f4f8ff', border: '1.5px solid #b6c8e4', borderRadius: 14, padding: 20 }}>
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20, marginBottom: 12 }}>Thông tin khách hàng</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 16 }}>
                <div><strong>Họ tên:</strong> {selectedOrder.name}</div>
                <div><strong>Số điện thoại:</strong> {selectedOrder.phone}</div>
                <div><strong>Email:</strong> {selectedOrder.email}</div>
                {selectedOrder.address && <div><strong>Địa chỉ:</strong> {selectedOrder.address}</div>}
              </div>
            </div>
            {/* 2. Thông tin đơn hàng & bảng mẫu */}
            <div style={{ marginBottom: 24, background: '#e6f7ff', border: '1.5px solid #91d5ff', borderRadius: 14, padding: 20 }}>
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20, marginBottom: 12 }}>Thông tin đơn hàng & mẫu xét nghiệm</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 16 }}>
                <div><strong>Loại xét nghiệm:</strong> {selectedOrder.type}</div>
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
              {selectedOrder.conclusion ? (
                <div style={{ fontSize: 18, color: '#005c3c', fontWeight: 700 }}>{selectedOrder.conclusion}</div>
              ) : (
                <div style={{ color: '#faad14', fontWeight: 600 }}>Chưa có kết quả</div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={editModalVisible}
        onCancel={() => {
          const currentValues = form.getFieldsValue();
          setTempFormData(currentValues);
          setEditModalVisible(false);
        }}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        width={800}
        destroyOnHidden={false}
        okButtonProps={{
          style: {
            background: '#1890ff',
            borderColor: '#1890ff',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            padding: '7px 32px',
            borderRadius: 6,
            transition: 'background 0.2s, color 0.2s',
          },
          onMouseOver: e => {
            e.target.style.background = '#1765ad';
            e.target.style.color = '#fff';
            e.target.style.borderColor = '#1765ad';
          },
          onMouseOut: e => {
            e.target.style.background = '#1890ff';
            e.target.style.color = '#fff';
            e.target.style.borderColor = '#1890ff';
          },
          disabled: getStatusText(selectedOrder?.status) === STATUS_COMPLETED
        }}
      >
        <div style={{ textAlign: 'center', fontWeight: 800, fontSize: 22, marginBottom: 16 }}>
          {`Cập nhật kết quả - Đơn hàng #${selectedOrder?.id}`}
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveResult}
          onValuesChange={handleFormValuesChange}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Tag color={getStatusColor(getStatusText(selectedOrder?.status))} style={{ fontWeight: 700, fontSize: 16, padding: '4px 18px' }}>{getStatusText(selectedOrder?.status)}</Tag>
            {(() => {
              const caseType = getCaseType(selectedOrder?.type);
              if (!caseType) return null;
              return (
                <Tag color={caseType === 'Dân sự' ? '#722ed1' : '#36cfc9'} style={{ fontWeight: 700, fontSize: 16, padding: '4px 18px' }}>{caseType}</Tag>
              );
            })()}
          </div>

          <Form.Item
            name="resultTableData"
            label={<span style={{ fontWeight: 800, fontSize: 20, letterSpacing: 1 }}>Mẫu xét nghiệm</span>}
          >
            <div>
              <table className="result-table" style={{ minWidth: '100%', tableLayout: 'auto', borderCollapse: 'collapse', width: '100%', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px #0001' }}>
                  <thead>
                    <tr style={{ background: '#e6f7ff', fontWeight: 700, color: '#1890ff', fontSize: 16, borderBottom: '2px solid #91d5ff', textAlign: 'center', padding: '10px 12px' }}>
                      <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>STT</th>
                      <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Họ và tên</th>
                      <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Ngày sinh</th>
                      <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Giới tính</th>
                      <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Mối quan hệ</th>
                      <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Loại mẫu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(tableData) ? tableData.map((data, index) => (
                      <tr key={data.key || index} style={{ background: index % 2 === 0 ? '#fff' : '#f4f8ff' }}>
                        <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{index + 1}</td>
                        <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.name}</td>
                        <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.birth || data.birthYear || data.namSinh || data.namsinh || ''}</td>
                        <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.gender}</td>
                        <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.relationship}</td>
                        <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.sampleType}</td>
                      </tr>
                    )) : null}
                  </tbody>
                </table>
              </div>
          </Form.Item>

          <Form.Item
            name="conclusion"
            label={<span style={{ fontWeight: 800, fontSize: 20, letterSpacing: 1 }}>Kết luận</span>}
            rules={[{ required: true, message: "Vui lòng nhập kết luận!" }]}
          >
            <TextArea rows={3} placeholder="Nhập kết luận và ghi chú kỹ thuật..." style={{ background: '#fff7e6', borderRadius: 8, fontSize: 16 }} />
          </Form.Item>

        </Form>
      </Modal>

      <Modal
        open={!!confirmHideOrder}
        onCancel={handleCancelHide}
        onOk={handleConfirmHide}
        okText="Ẩn"
        cancelText="Huỷ"
        title={`Xác nhận ẩn đơn hàng #${confirmHideOrder?.id}`}
        okButtonProps={{ danger: true, type: "primary" }}
      >
        <p>Bạn có chắc chắn muốn ẩn thông tin đơn hàng này không? </p>
      </Modal>

      <Modal
        title="Lý do từ chối của quản lý"
        open={reasonModalVisible}
        onCancel={() => setReasonModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setReasonModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        <div style={{ whiteSpace: 'pre-line', color: '#fa541c', fontWeight: 500 }}>
          {reasonText}
        </div>
      </Modal>
    </div>
  );
};

export default TestingResults;
