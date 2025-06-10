import React, { useEffect, useState } from "react";
import { Table, Modal, Button } from "antd";
import axios from "axios";

const API_URL = "https://682d53164fae188947559003.mockapi.io/usersSWP";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      // Lọc user thường (role_id === 1)
      setUsers(res.data.filter((u) => u.role_id === 1));
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  const handleDelete = async (user) => {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa tài khoản user: ${user.name} (ID: ${user.id})?`
      )
    )
      return;
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/${user.id}`); // mockAPI dùng id
      await fetchUsers();
    } catch (err) {
      alert("Lỗi xóa tài khoản: " + (err?.message || "Không xác định"));
    }
    setDeleting(false);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Họ tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Chi tiết",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="link"
            onClick={() => {
              setSelectedUser(record);
              setModalOpen(true);
            }}
          >
            Xem chi tiết
          </Button>
          <Button
            danger
            style={{
              borderRadius: 20,
              fontWeight: 600,
              background: "#ff4d4f",
              borderColor: "#ff4d4f",
              color: "#fff",
              minWidth: 90,
            }}
            onClick={() => handleDelete(record)}
            size="small"
            loading={deleting}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý tài khoản người dùng</h2>
      <div
        style={{
          width: 220,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 12px #e6e6e6",
          padding: "18px 0",
          textAlign: "center",
          margin: "0 auto 24px auto",
        }}
      >
        <div style={{ fontSize: 15, color: "#888" }}>Tổng số user</div>
        <div
          style={{
            fontSize: 32,
            color: "#00a67e",
            fontWeight: 800,
            marginTop: 4,
          }}
        >
          {users.length}
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="user_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        title="Chi tiết người dùng"
      >
        {selectedUser && (
          <div style={{ lineHeight: 2 }}>
            <div>
              <b>ID:</b> {selectedUser.user_id}
            </div>
            <div>
              <b>Họ tên:</b> {selectedUser.name}
            </div>
            <div>
              <b>Email:</b> {selectedUser.email}
            </div>
            <div>
              <b>Số điện thoại:</b> {selectedUser.phone}
            </div>
            {/* Thêm các trường khác nếu có */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
