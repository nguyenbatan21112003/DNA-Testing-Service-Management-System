import React, { useState, 
  // useMemo,
   useEffect, useContext } from "react";
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
// import { Slate, Editable, withReact } from "slate-react";
// import { createEditor, Node } from "slate";
import managerApi from "../../api/managerApi";

import { AuthContext } from "../../context/AuthContext";

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
      const res = await managerApi.getBlogs();
      const blogs = res.data?.data || [];
      // console.log(blogs);
      setBlogPosts(blogs);
    } catch (error) {
      console.error(error.status);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // const editor = useMemo(() => withReact(createEditor()), []);
  // const [content, setContent] = useState([
  //   { type: "paragraph", children: [{ text: "" }] },
  // ]);
  const [thumbnailBase64, setThumbnailBase64] = useState("");

  const [activeTab, setActiveTab] = useState("all");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);
  const { user } = useContext(AuthContext);

  const showModal = (blog = null) => {
    setEditingBlog(blog);
    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        summary: blog.summary || "",
        content: blog.content || "", // ✅ CHỖ NÀY
        status: blog.isPublished ? "published" : "draft",
        category: blog.category || "kiến thức",
        author: blog.author || "",
      });

      // try {
      //   setContent(
      //     blog.content
      //       ? JSON.parse(blog.content)
      //       : [{ type: "paragraph", children: [{ text: "" }] }]
      //   );
      // } catch {
      //   setContent([{ type: "paragraph", children: [{ text: "" }] }]);
      // }
    } else {
      form.resetFields();
      form.setFieldsValue({
        title: "",
        summary: "",
        status: "draft",
        // category: "kiến thức",
        // author: "",
      });
      // setContent([{ type: "paragraph", children: [{ text: "" }] }]);
    }
    setIsModalVisible(true);
  };
  // const STATUS_MAP = {
  //   published: true,
  //   draft: false,
  // };

  // const REVERSE_STATUS = {
  //   true: "published",
  //   false: "draft",
  // };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingBlog(null);
  };
  function removeVietnameseTones(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }

  const handleSubmit = async (values) => {
    const payload = {
      blogId: editingBlog?.postId || 0,
      title: values.title,
      slug: removeVietnameseTones(values.title)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""),
      summary: values.summary,
      content: values.content,
      isPublished: values.status === "published",
      updatedAt: new Date().toISOString(),
      thumbnailUrl: thumbnailBase64 || editingBlog?.thumbnailUrl || "",
    };

    try {
      if (editingBlog) {
        await managerApi.updateBlog(payload); // Gọi API PUT
        message.success("Cập nhật bài viết thành công!");
      } else {
        await managerApi.createBlogs({
          ...payload,
          authorId: user ? user.userId : 1,
          createdAt: new Date().toISOString(),
        });
        message.success("Tạo bài viết thành công!");
      }
      setIsModalVisible(false);
      setEditingBlog(null);
      fetchBlogs();
    } catch (err) {
      console.error(err.status);
      message.error(
        editingBlog ? "Cập nhật thất bại!" : "Tạo bài viết thất bại!"
      );
    }
  };



  const handlePreview = (blog) => {
    const plainText = blog.content || "Nội dung bài viết chưa được cập nhật";

    const htmlPreview = `<p>${plainText}</p>`; // hoặc format thêm nếu cần

    setPreviewBlog({ ...blog, content: htmlPreview });
    setPreviewVisible(true);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const filteredBlogPosts = blogPosts.filter((blog) => {
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "published"
        ? blog.isPublished
        : !blog.isPublished;

    const matchesSearch = blog.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

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
      title: "Trạng thái",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (isPublished) => {
        const color = isPublished ? "green" : "orange";
        const icon = isPublished ? (
          <CheckCircleOutlined />
        ) : (
          <ClockCircleOutlined />
        );
        const text = isPublished ? "Đã đăng" : "Bản nháp";
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
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          rowKey="postId"
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Modal tạo/chỉnh sửa bài viết */}
      <Modal
        title={
          <div
            style={{ textAlign: "center", fontWeight: 600, fontSize: "20px" }}
          >
            {editingBlog ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        width={1000}
        footer={[
          // <Button
          //   key="preview"
          //   onClick={() => handlePreview(editingBlog || {})}
          // >
          //   Xem trước
          // </Button>,
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

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Input.TextArea placeholder="Nhập nội dung bài viết" rows={8} />
          </Form.Item>

          <Form.Item name="thumbnail" label="Ảnh đại diện">
            {/* <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload> */}
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setThumbnailBase64(e.target.result); // lưu base64
                };
                reader.readAsDataURL(file);
                return false; // không upload tự động
              }}
              showUploadList={true}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value="published">Đăng Bài</Option>
              <Option value="draft">Lưu nháp</Option>
            </Select>
          </Form.Item>

          {/* <Form.Item
            name="author"
            label="Tác giả"
            rules={[{ required: true, message: "Vui lòng nhập tên tác giả!" }]}
          >
            <Input placeholder="Nhập tên tác giả" />
          </Form.Item> */}

          {/* <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select>
              <Option value="kiến thức">Kiến thức</Option>
              <Option value="công nghệ">Công nghệ</Option>
              <Option value="dịch vụ">Dịch vụ</Option>
            </Select>
          </Form.Item> */}
        </Form>
      </Modal>

      {/* Modal xem trước bài viết */}
      <Modal
        title={
          <div className="text-lg font-semibold">
            {previewBlog?.title || "Xem trước bài viết"}
          </div>
        }
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
          <div className="py-4 space-y-6">
            {/* Tiêu đề */}
            <Title level={3} className="text-center">
              {previewBlog.title}
            </Title>

            {/* Thông tin metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded border border-gray-200">
              <div>
                <Text strong>Slug:</Text>
                <div className="text-gray-700">{previewBlog.slug || "—"}</div>
              </div>

              <div>
                <Text strong>Trạng thái:</Text>
                <div className="text-gray-700">
                  {previewBlog.isPublished ? "Đã đăng" : "Bản nháp"}
                </div>
              </div>

              <div>
                <Text strong>Ngày tạo:</Text>
                <div className="text-gray-700">
                  {previewBlog.createdAt
                    ? new Date(previewBlog.createdAt).toLocaleDateString(
                        "vi-VN"
                      )
                    : "—"}
                </div>
              </div>

              <div>
                <Text strong>Tóm tắt:</Text>
                <div className="text-gray-700">
                  {previewBlog.summary || "Không có tóm tắt"}
                </div>
              </div>
            </div>

            {/* Nội dung bài viết */}
            <div className="blog-content p-4 border border-gray-200 rounded min-h-[300px]">
              <div
                dangerouslySetInnerHTML={{
                  __html: previewBlog.content || "<p>Nội dung chưa có</p>",
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default BlogManagement;
