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
  const [reportModalVisible, setReportModalVisible] = useState(false);
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
    if (["dangxuly", "processing"].includes(s)) return "Đang xử lý";
    if (["choxacthuc", "waitingapproval"].includes(s)) return "Chờ xác thực";
    if (["hoanthanh", "completed"].includes(s)) return "Hoàn thành";
    if (["tuchoi", "rejected"].includes(s)) return "Từ chối";
    return "Đang xử lý";
  };

  useEffect(() => {
    setFilteredOrders(orders.filter((order) => !order.isHidden && [
      'Đang xử lý', 'Hoàn thành', 'Chờ xác thực', 'Từ chối'
    ].includes(getStatusText(order.status))));
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

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredOrders(orders.filter((order) => !order.isHidden && [
        'Đang xử lý', 'Hoàn thành', 'Chờ xác thực', 'Từ chối'
      ].includes(getStatusText(order.status))));
    } else {
      setFilteredOrders(
        orders.filter(
          (order) => !order.isHidden && [
            'Đang xử lý', 'Hoàn thành', 'Chờ xác thực', 'Từ chối'
          ].includes(getStatusText(order.status)) && getStatusText(order.status) === filterStatus
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
          birthYear: mem.birthYear || mem.namSinh || mem.namsinh || mem.birth || "",
          gender: mem.gender || mem.gioiTinh || mem.gioitinh || "",
          relationship: mem.relationship || mem.moiQuanHe || mem.moiquanhe || mem.relation || "",
          sampleType: mem.sampleType || mem.loaiMau || mem.loaimau || ""
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

  const handleViewReport = (order) => {
    setSelectedOrder(order);
    setReportModalVisible(true);
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
        console.log('[DEBUG][handleSaveResult] updateOrder called with (error sample):', {
          id: selectedOrder.id,
          status: selectedOrder.status,
          result: resultTableDataCopy ? JSON.stringify(resultTableDataCopy) : values.result,
          testingMethod: values.testingMethod,
          testingNotes: values.conclusion,
          conclusion: values.conclusion,
          resultTableData: resultTableDataCopy,
          updatedAt: new Date().toLocaleString("vi-VN"),
        });
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
      // Trường hợp bình thường: luôn chuyển trạng thái sang 'Chờ xác thực'
      console.log('[DEBUG][handleSaveResult] updateOrder called with:', {
        id: selectedOrder.id,
        status: "Chờ xác thực",
        result: resultTableDataCopy ? JSON.stringify(resultTableDataCopy) : values.result,
        testingMethod: values.testingMethod,
        testingNotes: values.conclusion,
        conclusion: values.conclusion,
        resultTableData: resultTableDataCopy,
        updatedAt: new Date().toLocaleString("vi-VN"),
      });
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
      message.success("Đã gửi yêu cầu xác thực cho quản lý!");
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
      case "Đang xử lý":
        return "#00b894";
      case "Chờ xác thực":
        return "#722ed1";
      case "Hoàn thành":
        return "#52c41a";
      case "Từ chối":
        return "#d63031";
      default:
        return "#00b894";
    }
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
          fontSize: 15,
          padding: '4px 0',
          boxShadow: '0 2px 8px #0001',
          width: 120,
          textAlign: 'center',
          display: 'inline-block',
        }}>{getStatusText(status)}</Tag>
      ),
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
              Cập nhật
            </Button>
          )}
          {record.result && (
            <Button
              type="default"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleViewReport(record)}
            >
              Báo cáo
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
          <Space>
            <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            <Button icon={<PrinterOutlined />}>In báo cáo</Button>
          </Space>
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
              key: "urgent",
              label: "Cần xử lý gấp",
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredOrders.filter(
                    (order) =>
                      order.priority === "Cao" && order.status !== STATUS_COMPLETED
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
                    (order) =>
                      !order.isHidden && order.status === STATUS_WAITING_APPROVAL
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
        title="Xem kết quả xét nghiệm"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>Thông tin khách hàng:</h3>
              <p>
                <strong>Họ tên:</strong> {selectedOrder.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong>Loại xét nghiệm:</strong> {selectedOrder.type}
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>Thông tin xét nghiệm:</h3>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <Tag
                  color={
                    selectedOrder.status === STATUS_COMPLETED
                      ? "green"
                      : selectedOrder.status === STATUS_PROCESSING
                        ? "blue"
                        : "orange"
                  }
                >
                  {selectedOrder.status}
                </Tag>
              </p>
              {selectedOrder.testingMethod && (
                <p>
                  <strong>Phương pháp xét nghiệm:</strong>{" "}
                  {selectedOrder.testingMethod}
                </p>
              )}
              {selectedOrder.completedDate && (
                <p>
                  <strong>Ngày hoàn thành:</strong>{" "}
                  {selectedOrder.completedDate}
                </p>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>Kết quả xét nghiệm:</h3>
              {(() => {
                const hasTableData =
                  selectedOrder.resultTableData &&
                  Array.isArray(selectedOrder.resultTableData) &&
                  selectedOrder.resultTableData.length > 0;

                if (hasTableData) {
                  return (
                    <div style={{ background: '#f8fff3', border: '2px solid #b6e4b6', borderRadius: 12, padding: 16, margin: '16px 0' }}>
                      <table className="result-table" style={{ minWidth: '100%', tableLayout: 'auto', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>STT</th>
                            <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Họ và tên</th>
                            <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Năm sinh</th>
                            <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Giới tính</th>
                            <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Mối quan hệ</th>
                            <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Loại mẫu</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(selectedOrder.resultTableData)
                            ? selectedOrder.resultTableData.map((data, index) => (
                              <tr key={data.key}>
                                <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{index + 1}</td>
                                <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.name}</td>
                                <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.birthYear}</td>
                                <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.gender}</td>
                                <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.relationship}</td>
                                <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.sampleType}</td>
                              </tr>
                            ))
                            : null}
                        </tbody>
                      </table>

                      {selectedOrder.conclusion && (
                        <div style={{ marginTop: 16 }}>
                          <h4>Kết luận:</h4>
                          <div>{selectedOrder.conclusion}</div>
                        </div>
                      )}
                    </div>
                  );
                }

                if (selectedOrder.result) {
                  return (
                    <div
                      style={{
                        background: "#f6ffed",
                        border: "1px solid #b7eb8f",
                        padding: 16,
                        borderRadius: 6,
                      }}
                    >
                      {selectedOrder.result}
                    </div>
                  );
                }

                return (
                  <div
                    style={{
                      background: "#fff7e6",
                      border: "1px solid #ffd591",
                      padding: 16,
                      borderRadius: 6,
                    }}
                  >
                    Kết quả chưa có sẵn
                  </div>
                );
              })()}
            </div>

            {selectedOrder.testingNotes && (
              <div>
                <h3>Ghi chú kỹ thuật:</h3>
                <div
                  style={{
                    background: "#f6f6f6",
                    padding: 12,
                    borderRadius: 4,
                  }}
                >
                  {selectedOrder.testingNotes}
                </div>
              </div>
            )}

            {selectedOrder.sampleInfo && (
              <div style={{ marginTop: 16 }}>
                <h3>Thông tin mẫu xét nghiệm:</h3>
                <div
                  style={{
                    background: "#f0f5ff",
                    border: "1px solid #d6e4ff",
                    padding: 12,
                    borderRadius: 4,
                  }}
                >
                  <p>
                    <strong>Ngày lấy mẫu:</strong>{" "}
                    {selectedOrder.sampleInfo.collectionDate}
                  </p>
                  <p>
                    <strong>Nhân viên thu mẫu:</strong>{" "}
                    {selectedOrder.sampleInfo.collector}
                  </p>
                  <p>
                    <strong>Số lượng người cho mẫu:</strong>{" "}
                    {selectedOrder.sampleInfo.donors.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title={`Cập nhật kết quả - Đơn hàng #${selectedOrder?.id}`}
        open={editModalVisible}
        onCancel={() => {
          const currentValues = form.getFieldsValue();
          setTempFormData(currentValues);
          setEditModalVisible(false);
        }}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        width={1000}
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveResult}
          onValuesChange={handleFormValuesChange}
        >
          <Form.Item label="Trạng thái">
            <Tag style={{ background: getStatusColor(selectedOrder?.status), color: '#fff', fontWeight: 700, border: 'none', fontSize: 15, padding: '4px 0', boxShadow: '0 2px 8px #0001' }}>
              {getStatusText(selectedOrder?.status)}
            </Tag>
          </Form.Item>

          <Form.Item
            name="testingMethod"
            label="Phương pháp xét nghiệm"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn phương pháp xét nghiệm!",
              },
            ]}
          >
            <Select placeholder="Chọn phương pháp">
              <Option value="STR">STR (Short Tandem Repeat)</Option>
              <Option value="SNP">SNP (Single Nucleotide Polymorphism)</Option>
              <Option value="CODIS">CODIS (Combined DNA Index System)</Option>
              <Option value="Y-STR">Y-STR (Y-chromosome STR)</Option>
              <Option value="mtDNA">mtDNA (Mitochondrial DNA)</Option>
            </Select>
          </Form.Item>

          <Form.Item name="resultTableData" label="Kết quả xét nghiệm">
            <div
              style={{
                border: "1px solid #d9d9d9",
                borderRadius: "2px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <div style={{ background: '#f8fff3', border: '2px solid #b6e4b6', borderRadius: 12, padding: 16, margin: '16px 0' }}>
                <table className="result-table" style={{ minWidth: '100%', tableLayout: 'auto', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>STT</th>
                      <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Họ và tên</th>
                      <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Năm sinh</th>
                      <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Giới tính</th>
                      <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Mối quan hệ</th>
                      <th style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>Loại mẫu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(tableData) ? tableData.map((data, index) => (
                      <tr key={data.key}>
                        <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{index + 1}</td>
                        <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.name}</td>
                        <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.birthYear}</td>
                        <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.gender}</td>
                        <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.relationship}</td>
                        <td style={{ padding: '8px 12px', fontSize: 16, wordBreak: 'break-word', whiteSpace: 'normal', textAlign: 'center' }}>{data.sampleType}</td>
                      </tr>
                    )) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name="conclusion"
            label="Kết luận"
            rules={[{ required: true, message: "Vui lòng nhập kết luận!" }]}
          >
            <TextArea rows={3} placeholder="Nhập kết luận và ghi chú kỹ thuật..." />
          </Form.Item>

          <Form.Item label="Tải lên file kết quả">
            <Upload>
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Báo cáo kết quả xét nghiệm"
        open={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={2}>BÁO CÁO KẾT QUẢ XÉT NGHIỆM ADN</Title>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Mã đơn hàng: </Text>
              <Text>#{selectedOrder.id}</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Khách hàng: </Text>
              <Text>{selectedOrder.name}</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Loại xét nghiệm: </Text>
              <Text>{selectedOrder.type}</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Ngày xét nghiệm: </Text>
              <Text>{selectedOrder.date}</Text>
            </div>

            <Divider />

            <div style={{ marginBottom: 16 }}>
              <Title level={4}>Kết quả xét nghiệm</Title>
              <div
                style={{ padding: 12, background: "#f5f5f5", borderRadius: 4 }}
              >
                {(() => {
                  let tableData = [];
                  try {
                    const parsed = JSON.parse(selectedOrder.result);
                    if (Array.isArray(parsed)) tableData = parsed;
                  } catch {
                    // Không phải JSON, hiển thị dạng text
                  }
                  if (tableData.length > 0) {
                    return (
                      <Table
                        bordered
                        dataSource={tableData}
                        pagination={false}
                        rowKey={(record) => record.key || String(Math.random())}
                        size="small"
                      >
                        <Table.Column title="STT" key="index" render={(text, record, index) => index + 1} width={60} />
                        <Table.Column title="Họ và tên" dataIndex="name" key="name" />
                        <Table.Column title="Năm sinh" dataIndex="birthYear" key="birthYear" width={120} />
                        <Table.Column title="Giới tính" dataIndex="gender" key="gender" width={120} />
                        <Table.Column title="Mối quan hệ" dataIndex="relationship" key="relationship" />
                        <Table.Column title="Loại mẫu" dataIndex="sampleType" key="sampleType" />
                      </Table>
                    );
                  }
                  // Nếu không phải JSON array, hiển thị text
                  return <Text>{selectedOrder.result}</Text>;
                })()}
              </div>
            </div>

            {selectedOrder.conclusion && (
              <div style={{ marginBottom: 16 }}>
                <Title level={4}>Kết luận</Title>
                <div
                  style={{
                    padding: 12,
                    background: "#f5f5f5",
                    borderRadius: 4,
                  }}
                >
                  <Text>{selectedOrder.conclusion}</Text>
                </div>
              </div>
            )}

            <Divider />

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Text>Báo cáo được tạo tự động bởi hệ thống DNA Lab</Text>
            </div>
          </div>
        )}
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
