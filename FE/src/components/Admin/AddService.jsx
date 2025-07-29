import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Switch,
} from "antd";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import adminApi from "../../api/adminApi";

const { Option } = Select;

const AddService = ({ defaultCategory = "Voluntary", onServiceCreated }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    form.resetFields();
    form.setFieldsValue({
      category:
        defaultCategory === "Voluntary" ? "Voluntary" : "Administrative",
      isPublished: true,
      includeVAT: true,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const generateSlug = (name) => {
    return name
      ?.toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        serviceName: values.name,
        slug: generateSlug(values.name),
        description: values.description || "",
        category: values.category,
        numberSample: 2, // mặc định
        isPublished: values.isPublished,
        price2Samples: values.price,
        price3Samples: values.additionalPrice,
        includeVAT: values.includeVAT,
        timeToResult: values.timeToResult,
      };

      const response = await adminApi.createService(payload);
      if (response.status !== 200) throw new Error();
      alert("Thêm dịch vụ thành công!");
      setIsModalVisible(false);
      form.resetFields();
      // Gọi lại API để cập nhật danh sách dịch vụ ở trang chính
      onServiceCreated?.(); // <- gọi nếu có truyền props
    } catch (err) {
      console.log(err.status);
      alert("Thêm dịch vụ thất bại!");
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showModal}
        style={{ marginBottom: 16 }}
      >
        Thêm dịch vụ
      </Button>

      <Modal
        title="Thêm dịch vụ mới"
        open={isModalVisible}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
          >
            Lưu
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Thể loại"
                rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
              >
                <Select>
                  <Option value="Voluntary">Xét nghiệm ADN dân sự</Option>
                  <Option value="Administrative">
                    Xét nghiệm ADN hành chính
                  </Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên dịch vụ"
                rules={[
                  { required: true, message: "Vui lòng nhập tên dịch vụ!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá 2 người (VNĐ)"
                rules={[
                  { required: true, message: "Vui lòng nhập giá!" },
                  {
                    type: "number",
                    min: 1000000,
                    max: 10000000,
                    message: "Giá phải từ 1 triệu đến 10 triệu.",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
                  min={1000000}
                  max={10000000}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="additionalPrice"
                label="Giá người thứ 3 (VNĐ)"
                rules={[
                  { required: true, message: "Vui lòng nhập giá người thứ 3!" },
                  {
                    type: "number",
                    min: 1000000,
                    max: 10000000,
                    message: "Giá phải từ 1 triệu đến 10 triệu.",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
                  min={2500000}
                  max={10000000}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="description" label="Mô tả (tùy chọn)">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="timeToResult"
                label="Thời gian trả kết quả"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian trả kết quả!",
                  },
                ]}
              >
                <Select placeholder="Chọn thời gian">
                  <Option value="3-5 ngày">3-5 ngày</Option>
                  <Option value="5-7 ngày">5-7 ngày</Option>
                  <Option value="7-10 ngày">7-10 ngày</Option>
                  <Option value="24-48 giờ">24-48 giờ</Option>
                  <Option value="48-72 giờ">48-72 giờ</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="isPublished"
                label="Hiển thị công khai"
                valuePropName="checked"
              >
                <Switch defaultChecked />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="includeVAT"
                label="Đã bao gồm VAT"
                valuePropName="checked"
              >
                <Switch defaultChecked />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default AddService;
