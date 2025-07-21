import React, { useEffect, useState } from "react";
import { Table, Modal, Button, message } from "antd";
import adminApi from "../../api/adminApi";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  // const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAllUser();
      // Lọc roleId === 1 (user thường)
      setUsers(response.data.filter((u) => u.roleId === 1));
    } catch (error) {
      console.log(error);
      message.error("Không thể tải danh sách người dùng");
      setUsers([]);
    }
    setLoading(false);
  };

  // const handleDelete = async (user) => {
  //   if (!window.confirm(`Xác nhận xóa người dùng: ${user.fullName} (ID: ${user.userId})?`)) return;

  //   setDeleting(true);
  //   try {
  //     await adminApi.banUserById(user.userId);
  //     message.success("Xóa người dùng thành công");
  //     fetchUsers();
  //   } catch (error) {
  //     console.log(error)
  //     message.error("Lỗi khi xóa người dùng");
  //   }
  //   setDeleting(false);
  // };

  const columns = [
    { title: "ID", dataIndex: "userId", key: "userId", width: 80 },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: <div className="text-center">Thao tác</div>,
      key: "action",
      align: "center", // ✅ Căn giữa nội dung trong cột
      render: (_, record) => (
        <div style={{ display: "flex",  justifyContent: "center"  }}>
          <Button
            type="link"
            onClick={() => {
              setSelectedUser(record);
              setModalOpen(true);
            }}
            style={{ fontWeight: 500 }}
          >
            Xem chi tiết
          </Button>
          {/* <Button
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
          </Button> */}
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
        <div style={{ fontSize: 15, color: "#888" }}>Tổng số người dùng</div>
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
        rowKey="userId"
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
              <b>ID:</b> {selectedUser.userId}
            </div>
            <div>
              <b>Họ tên:</b> {selectedUser.fullName}
            </div>
            <div>
              <b>Email:</b> {selectedUser.email}
            </div>
            <div>
              <b>Số điện thoại:</b> {selectedUser.phone}
            </div>
            <div>
              <b>Ngày tạo:</b>{" "}
              {new Date(selectedUser.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
