import React, { useState } from "react";
import { Button, Modal, Form, Input, InputNumber, Select, message } from "antd";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { useOrderContext } from "../../context/OrderContext";

const { Option } = Select;

// Component hiển thị nút "Thêm dịch vụ" và form nhập thông tin dịch vụ mới
const AddService = ({ defaultCategory = "civil" }) => {
  const { pricingData, updatePricingData } = useOrderContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  // State category no longer needed; we rely on form values directly

  const showModal = () => {
    form.resetFields();
    // Giữ nguyên category tab hiện tại khi mở form
    form.setFieldsValue({ category: defaultCategory });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const { name, price, additionalPrice, time, category: cat } = values;
      const newService = {
        id: `${cat}-${Date.now()}`,
        name,
        price,
        additionalPrice,
        time,
      };

      const updatedServices = [...(pricingData?.[cat] || []), newService];
      updatePricingData(cat, updatedServices);
      message.success("Thêm dịch vụ thành công!");
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModal}
        style={{ marginBottom: 16, background: "#1677ff", borderColor: "#1677ff" }}
      >
        Thêm dịch vụ
      </Button>

      <Modal
        title="Thêm dịch vụ mới"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            style={{ background: "#1677ff", borderColor: "#1677ff" }}
          >
            Lưu
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ category: defaultCategory }}
        >
          <Form.Item
            name="category"
            label="Thể loại"
            rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
          >
            <Select>
              <Option value="civil">Xét nghiệm ADN dân sự</Option>
              <Option value="admin">Xét nghiệm ADN hành chính</Option>
            </Select>
          </Form.Item>
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
            <Input placeholder="Ví dụ: 3 ngày" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddService;
