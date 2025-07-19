import React, { useState, useMemo, useEffect } from "react";
import {
  Layout,
  Typography,
  Button,
  Table,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  Upload,
  message,
  Tabs,
  Tooltip,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Node } from "slate";
import managerApi from "../../api/managerApi";
import blogApi from "../../api/blogApi";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
// Khóa lưu trữ bài viết đã đăng
const BLOG_STORAGE_KEY = "dna_blog_posts";

const BlogManagement = () => {
  const [form] = Form.useForm();
  const [blogPosts, setBlogPosts] = useState([]);
  const fetchBlogs = async () => {
    try {
      const res = await blogApi.getBlogs();
      setBlogPosts(Array.isArray(res.data)? res.data: [])
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchBlogs()
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const editor = useMemo(() => withReact(createEditor()), []);
  const [content, setContent] = useState([
    { type: "paragraph", children: [{ text: "" }] },
  ]);
  const [activeTab, setActiveTab] = useState("all");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);

  const showModal = (blog = null) => {
    setEditingBlog(blog);
    if (blog) {
     form.setFieldsValue({
  title: blog.title,
  summary: blog.summary || "",
  status: blog.isPublished ? "published" : "draft",  // ✅ SỬA chỗ này
  category: blog.category || "kiến thức",
  author: blog.author || "",
});

      try {
        setContent(
          blog.content
            ? JSON.parse(blog.content)
            : [{ type: "paragraph", children: [{ text: "" }] }]
        );
      } catch {
        setContent([{ type: "paragraph", children: [{ text: "" }] }]);
      }
    } else {
      form.resetFields();
      form.setFieldsValue({
        title: "",
        summary: "",
        status: "draft",
        category: "kiến thức",
        author: "",
      });
      setContent([{ type: "paragraph", children: [{ text: "" }] }]);
    }
    setIsModalVisible(true);
  };
const STATUS_MAP = {
  published: true,
  draft: false,
};

const REVERSE_STATUS = {
  true: "published",
  false: "draft",
};

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingBlog(null);
  };

  const handleSubmit = async (values) => {
  const payload = {
    title: values.title,
    slug: values.title.toLowerCase().replace(/\s+/g, "-"),
    summary: values.summary,
    content: JSON.stringify(content),
    authorId: 1,
    isPublished: values.status === "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    thumbnailUrl: values.thumbnailUrl || "", // cần có
  };

  try {
    await managerApi.createBlogs(payload);
    message.success(editingBlog ? "Cập nhật thành công!" : "Tạo bài viết thành công!");
    setIsModalVisible(false);
    setEditingBlog(null);
    fetchBlogs(); // dùng lại hàm đã định nghĩa
  } catch (err) {
    console.error(err);
    message.error("Không thể tạo bài viết");
  }
};


  const handleDelete = (id) => {
    setBlogPosts(blogPosts.filter((blog) => blog.id !== id));
    // Đồng bộ localStorage
    const stored = JSON.parse(
      localStorage.getItem(BLOG_STORAGE_KEY) || "[]"
    ).filter((p) => p.id !== id);
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(stored));
    message.success("Xóa bài viết thành công!");
  };

  const handlePreview = (blog) => {
    const htmlPreview = Array.isArray(content)
      ? content.map((n) => `<p>${Node.string(n)}</p>`).join("")
      : content || "<p>Nội dung bài viết chưa được cập nhật</p>";
    setPreviewBlog({ ...blog, content: htmlPreview });
    setPreviewVisible(true);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const filteredBlogPosts =
  activeTab === "all"
    ? blogPosts
    : blogPosts.filter((blog) =>
        activeTab === "published" ? blog.isPublished : !blog.isPublished
      );


  const columns = [
  {
    title: "Tiêu đề",
    dataIndex: "title",
    key: "title",
    render: (text, record) => (
      <div>
        <Text strong>{text}</Text>
        <br />
        <Text type="secondary" className="text-xs">
          ID: {record.postId}
        </Text>
      </div>
    ),
  },
  {
    title: "Tác giả",
    dataIndex: "authorName",
    key: "authorName",
  },
  {
  title: "Trạng thái",
  dataIndex: "isPublished",
  key: "isPublished",
  render: (isPublished) => {
    let color = isPublished ? "green" : "orange";
    let icon = isPublished ? <CheckCircleOutlined /> : <ClockCircleOutlined />;
    let text = isPublished ? "Đã đăng" : "Bản nháp";

    return (
      <Tag color={color} icon={icon}>
        {text}
      </Tag>
    );
  },
},

  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Thao tác",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title="Xem trước">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
            size="small"
          />
        </Tooltip>
        <Tooltip title="Chỉnh sửa">
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
          />
        </Tooltip>
        <Tooltip title="Xóa">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.postId)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Tooltip>
      </Space>
    ),
  },
];

  return (
    <Layout className="p-6 bg-gray-100 min-h-[calc(100vh-48px)]">
      <div className="bg-white p-6 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-4">
          <Title level={3} className="!m-0">
            Quản lý Blog
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            style={{ background: "#722ed1", borderColor: "#722ed1" }}
          >
            Tạo bài viết mới
          </Button>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Tìm kiếm bài viết..."
            prefix={<SearchOutlined />}
            className="w-full"
          />
        </div>

        <Tabs defaultActiveKey="all" onChange={handleTabChange}>
          <TabPane tab="Tất cả" key="all" />
          <TabPane tab="Đã đăng" key="published" />
          <TabPane tab="Bản nháp" key="draft" />
        </Tabs>

        <Table
          columns={columns}
          dataSource={filteredBlogPosts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Modal tạo/chỉnh sửa bài viết */}
      <Modal
        title={editingBlog ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Button
            key="preview"
            onClick={() => handlePreview(editingBlog || {})}
          >
            Xem trước
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            style={{ background: "#722ed1", borderColor: "#722ed1" }}
          >
            {editingBlog ? "Cập nhật" : "Tạo mới"}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: "draft",
            category: "kiến thức",
            author: "",
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề bài viết!" },
            ]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <Form.Item
            name="summary"
            label="Tóm tắt"
            rules={[
              { required: true, message: "Vui lòng nhập tóm tắt bài viết!" },
            ]}
          >
            <Input.TextArea
              placeholder="Nhập tóm tắt bài viết (hiển thị ở trang danh sách)"
              rows={3}
            />
          </Form.Item>

          <Form.Item label="Nội dung" required>
            <div className="border border-gray-200 rounded min-h-[300px] p-3">
              <Slate
                editor={editor}
                initialValue={content}
                onChange={setContent}
              >
                <Editable
                  placeholder="Nhập nội dung..."
                  className="min-h-[260px]"
                />
              </Slate>
            </div>
          </Form.Item>

          <Form.Item name="thumbnail" label="Ảnh đại diện">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value="published">Đăng ngay</Option>
              <Option value="draft">Lưu nháp</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="author"
            label="Tác giả"
            rules={[{ required: true, message: "Vui lòng nhập tên tác giả!" }]}
          >
            <Input placeholder="Nhập tên tác giả" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select>
              <Option value="kiến thức">Kiến thức</Option>
              <Option value="công nghệ">Công nghệ</Option>
              <Option value="dịch vụ">Dịch vụ</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem trước bài viết */}
      <Modal
        title={previewBlog?.title || "Xem trước bài viết"}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        footer={[
          <Button key="back" onClick={() => setPreviewVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {previewBlog && (
          <div className="py-4">
            <Title level={2}>{previewBlog.title}</Title>
            <div className="my-4 flex gap-2 items-center">
              <Text type="secondary">Tác giả: {previewBlog.author}</Text>
              <Text type="secondary">Ngày tạo: {previewBlog.createdAt}</Text>
            </div>
            <div
              className="blog-content p-4 border border-gray-200 rounded min-h-[300px]"
              dangerouslySetInnerHTML={{
                __html: (() => {
                  try {
                    const parsed = JSON.parse(previewBlog.content || "[]");
                    if (Array.isArray(parsed)) {
                      return parsed
                        .map((n) => `<p>${Node.string(n)}</p>`)
                        .join("");
                    }
                    return previewBlog.content;
                  } catch {
                    return previewBlog.content;
                  }
                })(),
              }}
            />
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default BlogManagement;
