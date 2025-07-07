import React, { useState, useMemo } from 'react';
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
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Node } from 'slate';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const BlogManagement = () => {
  const [form] = Form.useForm();
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: 'Tìm hiểu về xét nghiệm ADN',
      category: 'Kiến thức',
      author: 'Nguyễn Văn Quản',
      status: 'published',
      createdAt: '2023-07-01',
      views: 1245
    },
    {
      id: 2,
      title: 'Các phương pháp xét nghiệm ADN hiện đại',
      category: 'Công nghệ',
      author: 'Nguyễn Văn Quản',
      status: 'draft',
      createdAt: '2023-07-05',
      views: 0
    },
    {
      id: 3,
      title: 'Quy trình xét nghiệm ADN tại DNA Lab',
      category: 'Dịch vụ',
      author: 'Nguyễn Văn Quản',
      status: 'published',
      createdAt: '2023-06-28',
      views: 856
    },
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const editor = useMemo(() => withReact(createEditor()), []);
  const [content, setContent] = useState([
    { type: 'paragraph', children: [{ text: '' }] },
  ]);
  const [activeTab, setActiveTab] = useState('all');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);

  const showModal = (blog = null) => {
    setEditingBlog(blog);
    if (blog) {
      form.setFieldsValue({
        title: blog.title,
        summary: blog.summary || '',
        status: blog.status,
      });
      try {
        setContent(blog.content ? JSON.parse(blog.content) : [{ type: 'paragraph', children: [{ text: '' }] }]);
      } catch {
        setContent([{ type: 'paragraph', children: [{ text: '' }] }]);
      }
    } else {
      form.resetFields();
      setContent([{ type: 'paragraph', children: [{ text: '' }] }]);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingBlog(null);
  };

  const handleSubmit = (values) => {
    const newBlog = {
      ...values,
      content: JSON.stringify(content),
      id: editingBlog ? editingBlog.id : Date.now(),
      author: 'Nguyễn Văn Quản',
      createdAt: editingBlog ? editingBlog.createdAt : new Date().toISOString().split('T')[0],
      views: editingBlog ? editingBlog.views : 0
    };

    if (editingBlog) {
      setBlogPosts(blogPosts.map(blog => blog.id === editingBlog.id ? newBlog : blog));
      message.success('Cập nhật bài viết thành công!');
    } else {
      setBlogPosts([...blogPosts, newBlog]);
      message.success('Tạo bài viết mới thành công!');
    }
    
    setIsModalVisible(false);
    setEditingBlog(null);
  };

  const handleDelete = (id) => {
    setBlogPosts(blogPosts.filter(blog => blog.id !== id));
    message.success('Xóa bài viết thành công!');
  };

  const handlePreview = (blog) => {
    setPreviewBlog({...blog, content: content || '<p>Nội dung bài viết chưa được cập nhật</p>'});
    setPreviewVisible(true);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const filteredBlogPosts = activeTab === 'all' 
    ? blogPosts 
    : blogPosts.filter(blog => blog.status === activeTab);

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" className="text-xs">ID: {record.id}</Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'published' ? 'green' : 'orange';
        let icon = status === 'published' ? <CheckCircleOutlined /> : <ClockCircleOutlined />;
        let text = status === 'published' ? 'Đã đăng' : 'Bản nháp';
        
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: 'Thao tác',
      key: 'action',
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
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button 
                icon={<DeleteOutlined />} 
                danger 
                size="small"
              />
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
          <Title level={3} className="!m-0">Quản lý Blog</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
            style={{ background: '#722ed1', borderColor: '#722ed1' }}
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
          <Button key="preview" onClick={() => handlePreview(editingBlog || {})}>
            Xem trước
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={() => form.submit()}
            style={{ background: '#722ed1', borderColor: '#722ed1' }}
          >
            {editingBlog ? 'Cập nhật' : 'Tạo mới'}
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'draft',
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>
          
          <Form.Item
            name="summary"
            label="Tóm tắt"
            rules={[{ required: true, message: 'Vui lòng nhập tóm tắt bài viết!' }]}
          >
            <Input.TextArea 
              placeholder="Nhập tóm tắt bài viết (hiển thị ở trang danh sách)" 
              rows={3} 
            />
          </Form.Item>
          
          <Form.Item label="Nội dung" required>
            <div className="border border-gray-200 rounded min-h-[300px] p-3">
              <Slate editor={editor} value={content} onChange={setContent}>
                <Editable placeholder="Nhập nội dung..." className="min-h-[260px]" />
              </Slate>
            </div>
          </Form.Item>
          
          <Form.Item
            name="thumbnail"
            label="Ảnh đại diện"
          >
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
          
          <Form.Item
            name="status"
            label="Trạng thái"
          >
            <Select>
              <Option value="published">Đăng ngay</Option>
              <Option value="draft">Lưu nháp</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem trước bài viết */}
      <Modal
        title={previewBlog?.title || 'Xem trước bài viết'}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        footer={[
          <Button key="back" onClick={() => setPreviewVisible(false)}>
            Đóng
          </Button>
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
              dangerouslySetInnerHTML={{ __html: (Array.isArray(JSON.parse(previewBlog.content || '[]')) ? JSON.parse(previewBlog.content).map((n)=>`<p>${Node.string(n)}</p>`).join('') : previewBlog.content) }}
            />
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default BlogManagement;

