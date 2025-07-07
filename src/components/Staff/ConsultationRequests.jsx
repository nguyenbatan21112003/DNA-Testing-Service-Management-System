"use client";

import { useState, useEffect, useCallback } from "react";
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
  Badge,
} from "antd";
import {
  EyeOutlined,
  MessageOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const ConsultationRequests = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Hàm tải yêu cầu tư vấn từ localStorage (nếu không có thì để trống)
  const loadConsultations = useCallback(() => {
    const consultationsKey = "dna_consultations";
    const saved = JSON.parse(localStorage.getItem(consultationsKey) || "[]");
    let list = Array.isArray(saved) ? saved : [];
    // Lọc bỏ các bản ghi mẫu cũ (id nhỏ hơn 1e12 hoặc có email "@gmail.com" như dữ liệu demo)
    const cleaned = list.filter((c) => Number(c.id) > 1e12);
    if (cleaned.length !== list.length) {
      // Cập nhật localStorage nếu có thay đổi
      localStorage.setItem(consultationsKey, JSON.stringify(cleaned));
    }
    setConsultations(cleaned);
  }, []);

  // Tải dữ liệu khi component mount và khi localStorage thay đổi (từ tab khác)
  useEffect(() => {
    loadConsultations();

    const handleStorage = (e) => {
      if (e.key === "dna_consultations") {
        loadConsultations();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [loadConsultations]);

  const handleViewConsultation = (consultation) => {
    setSelectedConsultation(consultation);
    setModalVisible(true);
  };

  const handleReply = (consultation) => {
    setSelectedConsultation(consultation);
    form.resetFields();
    setReplyModalVisible(true);
  };

  const handleSendReply = async (values) => {
    try {
      const updatedConsultations = consultations.map((consultation) =>
        consultation.id === selectedConsultation.id
          ? {
            ...consultation,
            status: "Đã phản hồi",
            reply: values.reply,
            repliedAt: new Date().toLocaleString("vi-VN"),
          }
          : consultation
      );
      // Cập nhật state và localStorage
      setConsultations(updatedConsultations);
      localStorage.setItem("dna_consultations", JSON.stringify(updatedConsultations));
      setReplyModalVisible(false);
      message.success("Gửi phản hồi thành công!");
    } catch {
      message.error("Có lỗi xảy ra khi gửi phản hồi!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (id) => `#${id}`,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: 150,
    },
    {
      title: "Chủ đề",
      dataIndex: "subject",
      key: "subject",
      width: 200,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        let color = "default";
        if (status === "Chờ phản hồi") color = "orange";
        if (status === "Đang xử lý") color = "blue";
        if (status === "Đã phản hồi") color = "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (time) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {time}
        </span>
      ),
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
            onClick={() => handleViewConsultation(record)}
            style={{
              background: "#1890ff",
              color: "#fff",
              borderRadius: 6,
              border: "none",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(24,144,255,0.08)",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#1765ad")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#1890ff")}
          >
            Xem
          </Button>
          {record.status !== "Đã phản hồi" && (
            <Button
              type="default"
              size="small"
              icon={<MessageOutlined />}
              onClick={() => handleReply(record)}
            >
              Phản hồi
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const pendingCount = consultations.filter(
    (c) => c.status === "Chờ phản hồi"
  ).length;

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}
        >
          Yêu cầu tư vấn
          <Badge count={pendingCount} style={{ marginLeft: 16 }} />
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
          Quản lý và phản hồi các yêu cầu tư vấn từ khách hàng
        </p>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={consultations}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} yêu cầu`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Modal xem chi tiết */}
      <Modal
        title={`Chi tiết yêu cầu tư vấn #${selectedConsultation?.id}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
          selectedConsultation?.status !== "Đã phản hồi" && (
            <Button
              key="reply"
              type="primary"
              icon={<MessageOutlined />}
              onClick={() => {
                setModalVisible(false);
                handleReply(selectedConsultation);
              }}
            >
              Phản hồi
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedConsultation && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>Thông tin khách hàng:</h3>
              <p>
                <strong>Họ tên:</strong> {selectedConsultation.customerName}
              </p>
              <p>
                <strong>Email:</strong>
                <Button
                  type="link"
                  icon={<MailOutlined />}
                  style={{ padding: 0, marginLeft: 8 }}
                >
                  {selectedConsultation.email}
                </Button>
              </p>
              <p>
                <strong>Số điện thoại:</strong>
                <Button
                  type="link"
                  icon={<PhoneOutlined />}
                  style={{ padding: 0, marginLeft: 8 }}
                >
                  {selectedConsultation.phone}
                </Button>
              </p>
              <p>
                <strong>Danh mục:</strong>{" "}
                <Tag color="blue">{selectedConsultation.category}</Tag>
              </p>
              <p>
                <strong>Độ ưu tiên:</strong>{" "}
                <Tag
                  color={
                    selectedConsultation.priority === "Cao"
                      ? "red"
                      : selectedConsultation.priority === "Trung bình"
                        ? "orange"
                        : "green"
                  }
                >
                  {selectedConsultation.priority}
                </Tag>
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>Chủ đề:</h3>
              <p>{selectedConsultation.subject}</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>Nội dung:</h3>
              <div
                style={{ background: "#f6f6f6", padding: 16, borderRadius: 6 }}
              >
                {selectedConsultation.message}
              </div>
            </div>

            {selectedConsultation.reply && (
              <div>
                <h3>Phản hồi:</h3>
                <div
                  style={{
                    background: "#f6ffed",
                    border: "1px solid #b7eb8f",
                    padding: 16,
                    borderRadius: 6,
                  }}
                >
                  {selectedConsultation.reply}
                </div>
                <p style={{ color: "#666", fontSize: 12, marginTop: 8 }}>
                  Phản hồi lúc: {selectedConsultation.repliedAt}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal phản hồi */}
      <Modal
        title={`Phản hồi yêu cầu tư vấn #${selectedConsultation?.id}`}
        open={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        onOk={() => form.submit()}
        okText="Gửi phản hồi"
        cancelText="Hủy"
        width={800}
        okButtonProps={{
          style: {
            background: "#1890ff",
            color: "#fff",
            borderRadius: 6,
            border: "none",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(24,144,255,0.08)",
            transition: "background 0.2s",
          },
          onMouseOver: (e) => (e.target.style.background = "#1765ad"),
          onMouseOut: (e) => (e.target.style.background = "#1890ff"),
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSendReply}>
          <div
            style={{
              marginBottom: 16,
              background: "#f6f6f6",
              padding: 16,
              borderRadius: 6,
            }}
          >
            <h4>Câu hỏi của khách hàng:</h4>
            <p>{selectedConsultation?.message}</p>
          </div>

          <Form.Item
            name="reply"
            label="Nội dung phản hồi"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung phản hồi!" },
            ]}
          >
            <TextArea
              rows={8}
              placeholder="Nhập nội dung phản hồi chi tiết cho khách hàng..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConsultationRequests;
