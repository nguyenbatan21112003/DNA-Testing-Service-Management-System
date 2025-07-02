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
} from "@ant-design/icons";
import { useOrderContext } from "../../context/OrderContext";

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

const TestingResults = () => {
  const { orders, updateOrder, getAllOrders } = useOrderContext();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [filterStatus, setFilterStatus] = useState("all");
  const [tempFormData, setTempFormData] = useState({});
  const [currentEditOrderId, setCurrentEditOrderId] = useState(null);
  // const [showCustomConclusion, setShowCustomConclusion] = useState(false)
  const [confirmHideOrder, setConfirmHideOrder] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setFilteredOrders(orders.filter((order) => !order.isHidden));
  }, [orders]);

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredOrders(orders.filter((order) => !order.isHidden));
    } else {
      setFilteredOrders(
        orders.filter(
          (order) => !order.isHidden && order.status === filterStatus
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

  useEffect(() => {
    // Lắng nghe sự thay đổi của localStorage để reload orders khi có cập nhật từ manager
    const handleStorageChange = (event) => {
      if (event.key === "dna_orders") {
        getAllOrders();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [getAllOrders]);

  const handleViewResult = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleEditResult = (order) => {
    setSelectedOrder(order);

    // If returning to the same order being edited, use the saved temp data
    if (
      currentEditOrderId === order.id &&
      tempFormData &&
      Object.keys(tempFormData).length > 0
    ) {
      form.setFieldsValue(tempFormData);
    } else {
      // Initialize with default empty row if no data exists
      let initialTableData = [];

      // Try to use existing result data in proper array format
      if (order.resultTableData && Array.isArray(order.resultTableData)) {
        initialTableData = [...order.resultTableData];
      }
      // If no result table data but we have string result, try parsing it
      else if (
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
          // Failed to parse, use empty array with one row
          console.error("Failed to parse result data:", err);
        }
      }

      // Ensure we have at least one row
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

      // Store the initial form state for this order
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
    console.log("Giá trị lưu:", values.resultTableData);
    try {
      // Lấy dữ liệu bảng: ưu tiên từ form, nếu không có thì dùng state tableData
      let dataToSave =
        Array.isArray(values.resultTableData) &&
          values.resultTableData.length > 0
          ? values.resultTableData
          : tableData;

      // Make a deep copy for lưu trữ an toàn
      const resultTableDataCopy = Array.isArray(dataToSave)
        ? JSON.parse(JSON.stringify(dataToSave))
        : null;

      // cập nhật qua context
      updateOrder(selectedOrder.id, {
        status: values.status,
        result: resultTableDataCopy
          ? JSON.stringify(resultTableDataCopy)
          : values.result,
        testingMethod: values.testingMethod,
        testingNotes: values.testingNotes,
        conclusion: values.conclusion,
        resultTableData: resultTableDataCopy,
        completedDate:
          values.status === "Hoàn thành"
            ? new Date().toLocaleDateString("vi-VN")
            : selectedOrder.completedDate,
        updatedAt: new Date().toLocaleString("vi-VN"),
      });

      // Clear the temp form data since we've saved
      setTempFormData({});
      setCurrentEditOrderId(null);
      setEditModalVisible(false);
      message.success("Cập nhật kết quả thành công!");
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
      case "CONFIRMED":
        return "Xác nhận";
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
        if (status === "Xác nhận") return "Xác nhận";
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
      case "CONFIRMED":
        return "#10B981";
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
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
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
      width: 240,
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
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditResult(record)}
          >
            Cập nhật
          </Button>
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
        </Space>
      ),
    },
  ];

  // Thống kê
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Chờ xử lý").length,
    processing: orders.filter((o) => o.status === "Đang xử lý").length,
    waitingApproval: orders.filter((o) => o.status === "Chờ xác thực").length,
    completed: orders.filter((o) => o.status === "Hoàn thành").length,
    rejected: orders.filter((o) => o.status === "Từ chối").length,
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

      {/* Thống kê */}
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
              title="Chờ xử lý"
              value={stats.pending}
              valueStyle={{ color: "#fa8c16" }}
              prefix={<ClockCircleOutlined />}
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
            <Option value="Chờ xử lý">Chờ xử lý</Option>
            <Option value="Đang xử lý">Đang xử lý</Option>
            <Option value="Chờ xác thực">Chờ xác thực</Option>
            <Option value="Hoàn thành">Hoàn thành</Option>
            <Option value="Từ chối">Từ chối</Option>
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
                      order.priority === "Cao" && order.status !== "Hoàn thành"
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
                      !order.isHidden && order.status === "Chờ xác thực"
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

      {/* Modal xem kết quả */}
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
                    selectedOrder.status === "Hoàn thành"
                      ? "green"
                      : selectedOrder.status === "Đang xử lý"
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
                // Check for valid table data
                const hasTableData =
                  selectedOrder.resultTableData &&
                  Array.isArray(selectedOrder.resultTableData) &&
                  selectedOrder.resultTableData.length > 0;

                if (hasTableData) {
                  return (
                    <div
                      style={{
                        background: "#f6ffed",
                        border: "1px solid #b7eb8f",
                        padding: 16,
                        borderRadius: 6,
                      }}
                    >
                      <Table
                        bordered
                        dataSource={
                          Array.isArray(selectedOrder.resultTableData)
                            ? selectedOrder.resultTableData
                            : []
                        }
                        pagination={false}
                        rowKey={(record) => record.key || String(Math.random())}
                        size="small"
                      >
                        <Table.Column
                          title="STT"
                          key="index"
                          render={(text, record, index) => index + 1}
                          width={60}
                        />
                        <Table.Column
                          title="Họ và tên"
                          dataIndex="name"
                          key="name"
                        />
                        <Table.Column
                          title="Năm sinh"
                          dataIndex="birthYear"
                          key="birthYear"
                          width={120}
                        />
                        <Table.Column
                          title="Giới tính"
                          dataIndex="gender"
                          key="gender"
                          width={120}
                        />
                        <Table.Column
                          title="Mối quan hệ"
                          dataIndex="relationship"
                          key="relationship"
                        />
                        <Table.Column
                          title="Loại mẫu"
                          dataIndex="sampleType"
                          key="sampleType"
                        />
                      </Table>

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

      {/* Modal chỉnh sửa kết quả */}
      <Modal
        title={`Cập nhật kết quả - Đơn hàng #${selectedOrder?.id}`}
        open={editModalVisible}
        onCancel={() => {
          // Store the current form values when modal is closed without saving
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
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveResult}
          onValuesChange={handleFormValuesChange}
        >
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="Chờ xử lý">Chờ xử lý</Option>
              <Option value="Đang xử lý">Đang xử lý</Option>
              <Option value="Chờ xác thực">Chờ xác thực</Option>
              <Option value="Hoàn thành">Hoàn thành</Option>
            </Select>
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
              <Table
                bordered
                dataSource={Array.isArray(tableData) ? tableData : []}
                pagination={false}
                rowKey={(record) =>
                  record.key || record.id || String(Math.random())
                }
              >
                <Table.Column
                  title="STT"
                  dataIndex="key"
                  key="key"
                  width={60}
                  render={(text, record, index) => index + 1}
                />
                <Table.Column
                  title="Họ và tên"
                  dataIndex="name"
                  key="name"
                  render={(text, record, index) => (
                    <Input
                      placeholder="Nhập họ và tên"
                      value={text}
                      onChange={(e) => {
                        const newData = [...tableData];
                        if (!newData[index]) newData[index] = {};
                        newData[index].name = e.target.value;
                        form.setFieldsValue({ resultTableData: newData });
                        setTableData(newData);
                        setTempFormData((prev) => ({
                          ...prev,
                          resultTableData: newData,
                        }));
                      }}
                    />
                  )}
                />
                <Table.Column
                  title="Năm sinh"
                  dataIndex="birthYear"
                  key="birthYear"
                  width={120}
                  render={(text, record, index) => (
                    <Input
                      placeholder="Năm sinh"
                      value={text}
                      onChange={(e) => {
                        const newData = [...tableData];
                        if (!newData[index]) newData[index] = {};
                        newData[index].birthYear = e.target.value;
                        form.setFieldsValue({ resultTableData: newData });
                        setTableData(newData);
                        setTempFormData((prev) => ({
                          ...prev,
                          resultTableData: newData,
                        }));
                      }}
                    />
                  )}
                />
                <Table.Column
                  title="Giới tính"
                  dataIndex="gender"
                  key="gender"
                  width={120}
                  render={(text, record, index) => (
                    <Select
                      placeholder="Giới tính"
                      value={text}
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        const newData = [...tableData];
                        if (!newData[index]) newData[index] = {};
                        newData[index].gender = value;
                        form.setFieldsValue({ resultTableData: newData });
                        setTableData(newData);
                        setTempFormData((prev) => ({
                          ...prev,
                          resultTableData: newData,
                        }));
                      }}
                    >
                      <Option value="Nam">Nam</Option>
                      <Option value="Nữ">Nữ</Option>
                    </Select>
                  )}
                />
                <Table.Column
                  title="Mối quan hệ"
                  dataIndex="relationship"
                  key="relationship"
                  render={(text, record, index) => (
                    <Input
                      placeholder="Mối quan hệ"
                      value={text}
                      onChange={(e) => {
                        const newData = [...tableData];
                        if (!newData[index]) newData[index] = {};
                        newData[index].relationship = e.target.value;
                        form.setFieldsValue({ resultTableData: newData });
                        setTableData(newData);
                        setTempFormData((prev) => ({
                          ...prev,
                          resultTableData: newData,
                        }));
                      }}
                    />
                  )}
                />
                <Table.Column
                  title="Loại mẫu"
                  dataIndex="sampleType"
                  key="sampleType"
                  render={(text, record, index) => (
                    <Input
                      placeholder="Loại mẫu"
                      value={text}
                      onChange={(e) => {
                        const newData = [...tableData];
                        if (!newData[index]) newData[index] = {};
                        newData[index].sampleType = e.target.value;
                        form.setFieldsValue({ resultTableData: newData });
                        setTableData(newData);
                        setTempFormData((prev) => ({
                          ...prev,
                          resultTableData: newData,
                        }));
                      }}
                    />
                  )}
                />
                <Table.Column
                  title="Thao tác"
                  key="action"
                  width={90}
                  render={(_, record, index) => (
                    <Button
                      type="link"
                      danger
                      onClick={() => {
                        const newData = [...tableData];
                        if (!newData[index]) newData[index] = {};
                        newData.splice(index, 1);
                        form.setFieldsValue({ resultTableData: newData });
                        setTableData(newData);
                        setTempFormData((prev) => ({
                          ...prev,
                          resultTableData: newData,
                        }));
                      }}
                      disabled={tableData.length <= 1}
                    >
                      Xóa
                    </Button>
                  )}
                />
              </Table>
              <Button
                type="dashed"
                style={{ width: "100%", marginTop: "16px" }}
                onClick={() => {
                  const newData = [...tableData];
                  newData.push({ key: Date.now().toString() });
                  form.setFieldsValue({ resultTableData: newData });
                  setTableData(newData);
                  setTempFormData((prev) => ({
                    ...prev,
                    resultTableData: newData,
                  }));
                }}
              >
                + Thêm dòng
              </Button>
            </div>
          </Form.Item>

          <Form.Item name="conclusion" label="Kết luận">
            <TextArea
              rows={4}
              placeholder="Nhập kết luận từ kết quả xét nghiệm..."
            />
          </Form.Item>

          <Form.Item name="testingNotes" label="Ghi chú kỹ thuật">
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú về quá trình xét nghiệm, chất lượng mẫu..."
            />
          </Form.Item>

          <Form.Item label="Tải lên file kết quả">
            <Upload>
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem báo cáo */}
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
                <Text>{selectedOrder.result}</Text>
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

      {/* Modal xác nhận ẩn đơn hàng */}
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
    </div>
  );
};

export default TestingResults;
