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
  const [filterType, setFilterType] = useState("all"); // "all", "staff", "manager"


  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      
      // Lọc staff (role_id === 2) và manager (role_id === 4)
      setStaffs(res.data.filter((u) => u.role_id === 2 || u.role_id === 4));
    } catch {
      setStaffs([]);
    }
    setLoading(false);
  };

  // Lọc dữ liệu theo filterType
  const filteredStaffs = React.useMemo(() => {
    switch (filterType) {
      case "staff":
        return staffs.filter(s => s.role_id === 2);
      case "manager":
        return staffs.filter(s => s.role_id === 4);
      default:
        return staffs;
    }
  }, [staffs, filterType]);

  // Xử lý khi nhấn vào thẻ
  const handleFilterClick = (type) => {
    setFilterType(type === filterType ? "all" : type);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Họ tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { 
      title: "Vai trò", 
      key: "role", 
      render: (_, record) => (
        <span style={{ 
          color: record.role_id === 4 ? "#ff6b01" : "#2196f3",
          fontWeight: 600 
        }}>
          {record.role_id === 4 ? "Quản lý" : "Nhân viên"}
        </span>
      )
    },
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


  const getModalTitle = (roleId) => {
    return roleId === 4 ? "Chỉnh sửa thông tin quản lý" : "Chỉnh sửa thông tin nhân viên";
  };

  const getDetailTitle = (roleId) => {
    return roleId === 4 ? "Chi tiết quản lý" : "Chi tiết nhân viên";
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
    const roleText = staff.role_id === 4 ? "quản lý" : "nhân viên";
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa tài khoản ${roleText}: ${staff.name} (ID: ${staff.id})?`
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

  const styles = {
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    statsContainer: {
      display: "flex",
      gap: 16,
    },
    countCard: {
      width: 140,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 8px #0000001a",
      padding: "12px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
      position: "relative",
    },
    activeCard: {
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      transform: "translateY(-2px)",
    },
    filterIndicator: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 4,
      borderRadius: "0 0 12px 12px",
    },
    totalNumber: {
      fontSize: 28,
      fontWeight: 700,
      marginTop: 4,
    },
    staffNumber: {
      fontSize: 28,
      color: "#2196f3",
      fontWeight: 700,
      marginTop: 4,
    },
    managerNumber: {
      fontSize: 28,
      color: "#ff6b01",
      fontWeight: 700,
      marginTop: 4,
    },
    countLabel: {
      fontSize: 14,
      color: "#666",
    },
    addButton: {
      fontWeight: 700,
      fontSize: 16,
      background: "#1677ff",
      borderRadius: 8,
    },
    roleTag: {
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 4,
      fontWeight: 600,
      fontSize: 12,
    },
    filterBadge: {
      position: "absolute",
      top: -6,
      right: -6,
      background: "#52c41a",
      color: "#fff",
      borderRadius: "50%",
      width: 20,
      height: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: "bold",
    },
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>
        Quản lý nhân viên & quản lý
        {filterType !== "all" && (
          <span style={{ fontSize: 16, fontWeight: 400, color: "#666", marginLeft: 12 }}>
            (Đang lọc: {filterType === "staff" ? "Nhân viên" : "Quản lý"})
          </span>
        )}
      </h2>
      <div style={styles.topBar}>
        <div style={styles.statsContainer}>
          <div 
            style={{
              ...styles.countCard,
              ...(filterType === "all" ? styles.activeCard : {}),
            }}
            onClick={() => handleFilterClick("all")}
          >
            <div style={styles.countLabel}>Tổng số</div>
            <div style={styles.totalNumber}>
              {staffs.length}
            </div>
            {filterType === "all" && (
              <div 
                style={{
                  ...styles.filterIndicator,
                  background: "#888",
                }}
              />
            )}
          </div>
          
          <div 
            style={{
              ...styles.countCard,
              ...(filterType === "staff" ? styles.activeCard : {}),
            }}
            onClick={() => handleFilterClick("staff")}
          >
            <div style={styles.countLabel}>Nhân viên</div>
            <div style={styles.staffNumber}>
              {staffs.filter(s => s.role_id === 2).length}
            </div>
            {filterType === "staff" && (
              <div 
                style={{
                  ...styles.filterIndicator,
                  background: "#2196f3",
                }}
              />
            )}
          </div>
          
          <div 
            style={{
              ...styles.countCard,
              ...(filterType === "manager" ? styles.activeCard : {}),
            }}
            onClick={() => handleFilterClick("manager")}
          >
            <div style={styles.countLabel}>Quản lý</div>
            <div style={styles.managerNumber}>
              {staffs.filter(s => s.role_id === 4).length}
            </div>
            {filterType === "manager" && (
              <div 
                style={{
                  ...styles.filterIndicator,
                  background: "#ff6b01",
                }}
              />
            )}
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={styles.addButton}
        >
          Thêm nhân viên/quản lý
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredStaffs}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        title={selectedStaff ? getDetailTitle(selectedStaff.role_id) : "Chi tiết"}

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
            <div>
              <b>Vai trò:</b>{" "}
              <span style={{ 
                color: selectedStaff.role_id === 4 ? "#ff6b01" : "#2196f3",
                fontWeight: 600 
              }}>
                {selectedStaff.role_id === 4 ? "Quản lý" : "Nhân viên"}
              </span>
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
        title="Tạo tài khoản nhân viên/quản lý"
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
        title={getModalTitle(editForm.role_id)}

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
