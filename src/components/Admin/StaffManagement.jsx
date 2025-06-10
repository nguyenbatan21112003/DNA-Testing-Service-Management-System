import React, { useEffect, useState } from "react";
import { Table, Modal, Button } from "antd";
import axios from "axios";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";

const API_URL = "https://682d53164fae188947559003.mockapi.io/usersSWP";

function randomPassword(length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  let pw = "";
  for (let i = 0; i < length; i++)
    pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
}

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    phone: "",
    role_id: 2,
  });
  const [addPw, setAddPw] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      // Lọc staff (role_id === 2)
      setStaffs(res.data.filter((u) => u.role_id === 2));
    } catch {
      setStaffs([]);
    }
    setLoading(false);
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
            style={{
              color: "#1677ff",
              fontWeight: 600,
              textDecoration: "underline",
            }}
            onClick={() => {
              setSelectedStaff(record);
              setModalOpen(true);
            }}
          >
            Xem chi tiết
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{
              background: "#52c41a",
              borderColor: "#52c41a",
              color: "#fff",
              fontWeight: 600,
            }}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Sửa
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
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setAddForm({ name: "", email: "", phone: "", role_id: 2 });
    setAddPw(randomPassword());
    setAddError("");
    setAddModal(true);
  };

  const handleAddSubmit = async () => {
    setAddLoading(true);
    setAddError("");
    try {
      await axios.post(API_URL, {
        ...addForm,
        password: addPw,
        status: 1,
      });
      setAddModal(false);
      fetchStaffs();
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setAddError("Lỗi tạo tài khoản hoặc email đã tồn tại!");
    }
    setAddLoading(false);
  };

  const handleEdit = (staff) => {
    setEditForm({ ...staff });
    setEditError("");
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    setEditLoading(true);
    setEditError("");
    try {
      await axios.put(`${API_URL}/${editForm.id}`, editForm);
      setEditModal(false);
      fetchStaffs();
    } catch {
      setEditError("Lỗi cập nhật thông tin!");
    }
    setEditLoading(false);
  };

  const handleDelete = async (staff) => {
    console.log("Staff to delete:", staff); // debug
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa tài khoản nhân viên/manager: ${staff.name} (ID: ${staff.id})?`
      )
    )
      return;
    try {
      const id = String(staff.id); // Đảm bảo id là string
      await axios.delete(`${API_URL}/${id}`);
      await fetchStaffs(); // Đảm bảo fetch lại sau khi xóa
    } catch (err) {
      alert("Lỗi xóa tài khoản: " + (err?.message || "Không xác định"));
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý nhân viên</h2>
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
        <div style={{ fontSize: 15, color: "#888" }}>Tổng số nhân viên</div>
        <div
          style={{
            fontSize: 32,
            color: "#2196f3",
            fontWeight: 800,
            marginTop: 4,
          }}
        >
          {staffs.length}
        </div>
      </div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{
          marginBottom: 16,
          fontWeight: 700,
          fontSize: 16,
          background: "#1677ff",
        }}
      >
        Thêm nhân viên/manager
      </Button>
      <Table
        columns={columns}
        dataSource={staffs}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        title="Chi tiết nhân viên"
      >
        {selectedStaff && (
          <div style={{ lineHeight: 2 }}>
            <div>
              <b>ID:</b> {selectedStaff.id}
            </div>
            <div>
              <b>Họ tên:</b> {selectedStaff.name}
            </div>
            <div>
              <b>Email:</b> {selectedStaff.email}
            </div>
            <div>
              <b>Số điện thoại:</b> {selectedStaff.phone}
            </div>
            {/* Thêm các trường khác nếu có */}
          </div>
        )}
      </Modal>
      <Modal
        open={addModal}
        onCancel={() => setAddModal(false)}
        onOk={handleAddSubmit}
        okText="Tạo mới"
        confirmLoading={addLoading}
        title="Tạo tài khoản nhân viên/manager"
        okButtonProps={{
          style: {
            background: "#1677ff",
            borderRadius: 8,
            fontWeight: 700,
            minWidth: 110,
          },
          className: "custom-modal-ok-btn",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            placeholder="Họ tên"
            value={addForm.name}
            onChange={(e) =>
              setAddForm((f) => ({ ...f, name: e.target.value }))
            }
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <input
            placeholder="Email"
            value={addForm.email}
            onChange={(e) =>
              setAddForm((f) => ({ ...f, email: e.target.value }))
            }
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            type="email"
          />
          <input
            placeholder="Số điện thoại"
            value={addForm.phone}
            onChange={(e) =>
              setAddForm((f) => ({ ...f, phone: e.target.value }))
            }
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            type="tel"
          />
          <select
            value={addForm.role_id}
            onChange={(e) =>
              setAddForm((f) => ({ ...f, role_id: Number(e.target.value) }))
            }
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          >
            <option value={2}>Nhân viên (Staff)</option>
            <option value={4}>Quản lý (Manager)</option>
          </select>
          <div>
            <b>Mật khẩu tự sinh:</b>{" "}
            <span
              style={{
                background: "#f5f5f5",
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              {addPw}
            </span>
          </div>
          {addError && <div style={{ color: "red" }}>{addError}</div>}
        </div>
      </Modal>
      <Modal
        open={editModal}
        onCancel={() => setEditModal(false)}
        onOk={handleEditSubmit}
        okText="Lưu thay đổi"
        confirmLoading={editLoading}
        title="Chỉnh sửa thông tin nhân viên/manager"
        okButtonProps={{
          style: {
            background: "#1677ff",
            borderRadius: 8,
            fontWeight: 700,
            minWidth: 110,
          },
          className: "custom-modal-ok-btn",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            placeholder="Họ tên"
            value={editForm.name || ""}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, name: e.target.value }))
            }
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <input
            placeholder="Số điện thoại"
            value={editForm.phone || ""}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, phone: e.target.value }))
            }
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            type="tel"
          />
          <select
            value={editForm.role_id}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, role_id: Number(e.target.value) }))
            }
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          >
            <option value={2}>Nhân viên (Staff)</option>
            <option value={4}>Quản lý (Manager)</option>
          </select>
          <div>
            <b>Email:</b> {editForm.email}
          </div>
          {editError && <div style={{ color: "red" }}>{editError}</div>}
        </div>
      </Modal>
    </div>
  );
};

export default StaffManagement;
