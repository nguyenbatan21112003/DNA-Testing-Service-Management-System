import React, { useState, useEffect } from "react";
import { Tabs, Table, Button, Modal, Form, Input, InputNumber, message } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useOrderContext } from "../../context/OrderContext";

const { TabPane } = Tabs;

const PricingManagement = () => {
  const { pricingData, updatePricingData } = useOrderContext();
  const [activeTab, setActiveTab] = useState("civil");
  const [editingService, setEditingService] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [localPricingData, setLocalPricingData] = useState({ civil: [], admin: [] });

  useEffect(() => {
    if (pricingData) {
      setLocalPricingData(pricingData);
    }
  }, [pricingData]);

  const handleEdit = (record) => {
    setEditingService(record);
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      additionalPrice: record.additionalPrice,
      time: record.time,
    });
    setIsModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const updatedServices = localPricingData[activeTab].map((service) => {
        if (service.id === editingService.id) {
          return {
            ...service,
            name: values.name,
            price: values.price,
            additionalPrice: values.additionalPrice,
            time: values.time,
          };
        }
        return service;
      });

      // Cập nhật state local và context
      setLocalPricingData({
        ...localPricingData,
        [activeTab]: updatedServices,
      });
      updatePricingData(activeTab, updatedServices);

      setIsModalVisible(false);
      message.success("Cập nhật thành công!");
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const columns = [
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      render: (text) => formatCurrency(text),
    },
    {
      title: "Giá người thứ 3 (VNĐ)",
      dataIndex: "additionalPrice",
      key: "additionalPrice",
      render: (text) => formatCurrency(text),
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => handleEdit(record)}
          style={{ background: "#52c41a", borderColor: "#52c41a" }}
        >
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 700 }}>
        Quản lý thời gian & chi phí
      </h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Xét nghiệm ADN dân sự" key="civil">
          <Table
            columns={columns}
            dataSource={localPricingData.civil}
            rowKey="id"
            pagination={false}
          />
        </TabPane>
        <TabPane tab="Xét nghiệm ADN hành chính" key="admin">
          <Table
            columns={columns}
            dataSource={localPricingData.admin}
            rowKey="id"
            pagination={false}
          />
        </TabPane>
      </Tabs>

      <Modal
        title="Chỉnh sửa dịch vụ"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
          >
            Lưu thay đổi
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá dịch vụ!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
              step={100000}
            />
          </Form.Item>
          <Form.Item
            name="additionalPrice"
            label="Giá người thứ 3 (VNĐ)"
            rules={[{ required: true, message: "Vui lòng nhập giá người thứ 3!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
              step={100000}
            />
          </Form.Item>
          <Form.Item
            name="time"
            label="Thời gian"
            rules={[{ required: true, message: "Vui lòng nhập thời gian!" }]}
          >
            <Input placeholder="Ví dụ: 3-5 ngày" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PricingManagement;