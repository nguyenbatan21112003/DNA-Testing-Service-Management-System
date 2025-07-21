"use client";

import { useState, useEffect, useContext } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Modal,
  message,
  Space,
  Badge,
} from "antd";
import {
  EyeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import staffApi from "../../api/staffApi";
import { AuthContext } from "../../context/AuthContext";
import { useServiceContext } from "../../context/ServiceContext";

const ConsultationRequests = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const services = useServiceContext();

  const getServiceName = (id) => {
    const s = services.find((x) => x.id == id);
    return s ? s.serviceName : `Dịch vụ #${id}`;
  };

  const fetchConsultations = async () => {
    try {
      const res = await staffApi.getConsultRequest();
      if (res.status !== 200) throw new Error("Lỗi khi gọi API");

      const mapped = res.data.map((item) => ({
        id: item.consultId,
        customerName: item.fullName,
        phone: item.phone,
        category: item.category,
        serviceId: item.serviceId,
        message: item.message,
        createdAt: new Date(item.createdAt).toLocaleString("vi-VN"),
        status: item.status === "completed" ? "Đã phản hồi" : "Chờ phản hồi",
        reply: item.reply,
        repliedAt: item.repliedAt
          ? new Date(item.repliedAt).toLocaleString("vi-VN")
          : null,
      }));

      setConsultations(mapped);
    } catch (err) {
      console.error("Lỗi khi gọi API tư vấn:", err);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleViewConsultation = (consultation) => {
    setSelectedConsultation(consultation);
    setModalVisible(true);
  };

  const handleMarkCompleted = async (consultation) => {
    try {
      const data = {
        consultId: consultation.id,
        status: "completed",
        staffId: user?.userId,
        repliedAt: new Date().toISOString(),
      };

      const res = await staffApi.handleConsultRequest(data);
      if (res.status !== 200) throw new Error("Gửi phản hồi thất bại!");

      message.success("Đánh dấu hoàn thành thành công!");
      fetchConsultations();
    } catch (err) {
      console.error("Gửi phản hồi thất bại:", err);
      message.error("Gửi phản hồi thất bại!");
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
      title: "Dịch vụ",
      dataIndex: "serviceId",
      key: "serviceId",
      width: 200,
      render: (id) => getServiceName(id),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const color =
          status === "Chờ phản hồi"
            ? "orange"
            : status === "Đang xử lý"
            ? "blue"
            : "green";
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
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewConsultation(record)}
          >
            Xem
          </Button>
          {record.status !== "Đã phản hồi" && (
            <Button size="small" onClick={() => handleMarkCompleted(record)}>
              Xác nhận đã hoàn thành
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
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#00a67e" }}>
          Yêu cầu tư vấn
          <Badge count={pendingCount} style={{ marginLeft: 16 }} />
        </h1>
        <p style={{ color: "#666", fontSize: 16 }}>
          Quản lý và đánh dấu hoàn thành các yêu cầu tư vấn
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

      <Modal
        title={`Chi tiết yêu cầu tư vấn #${selectedConsultation?.id}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedConsultation && (
          <>
            <h3>Thông tin khách hàng:</h3>
            <p>
              <strong>Họ tên:</strong> {selectedConsultation.customerName}
            </p>
            <p>
              <strong>SĐT:</strong> {selectedConsultation.phone}
            </p>
            <p>
              <strong>Danh mục:</strong> {selectedConsultation.category}
            </p>
            <h3>Dịch vụ:</h3>
            <p>{getServiceName(selectedConsultation.serviceId)}</p>
            <h3>Nội dung:</h3>
            <div
              style={{
                background: "#f6f6f6",
                padding: 16,
                borderRadius: 6,
              }}
            >
              {selectedConsultation.message}
            </div>
            {selectedConsultation.reply && (
              <>
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
                <p style={{ fontSize: 12, color: "#666" }}>
                  Phản hồi lúc: {selectedConsultation.repliedAt}
                </p>
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default ConsultationRequests;
