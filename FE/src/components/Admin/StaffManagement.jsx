import React, { useEffect, useState } from "react";
import { Table, Modal, Button } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import adminApi from "../../api/adminApi";

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
  // const [selectedStaff, setSelectedStaff] = useState(null);
  // const [modalOpen, setModalOpen] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    roleId: 2,
  });
  const [addPw, setAddPw] = useState("");
  // const [addLoading, setAddLoading] = useState(false);
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
      const response = await adminApi.getAllUser();
      // console.log(response.data);
      // Lọc staff (role_id === 2) và manager (role_id === 4)
      setStaffs(response.data.filter((u) => u.roleId === 2 || u.roleId === 3)); // 2: staff, 3: manager
      // console.log(staffs);
    } catch {
      setStaffs([]);
    }
    setLoading(false);
  };

  // Lọc dữ liệu theo filterType
  const filteredStaffs = React.useMemo(() => {
    switch (filterType) {
      case "staff":
        return staffs.filter((s) => s.roleId === 2);
      case "manager":
        return staffs.filter((s) => s.roleId === 3);
      default:
        return staffs;
    }
  }, [staffs, filterType]);

  // Xử lý khi nhấn vào thẻ
  const handleFilterClick = (type) => {
    setFilterType(type === filterType ? "all" : type);
  };

  const columns = [
    { title: "ID", dataIndex: "userId", key: "userId", width: 80 },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    {
      title: "Vai trò",
      key: "role",
      render: (_, record) => (
        <span
          style={{
            color: record.roleId === 3 ? "#ff6b01" : "#2196f3",
            fontWeight: 600,
          }}
        >
          {record.roleId === 3 ? "Quản lý" : "Nhân viên"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
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
          >
            Xóa
          </Button> */}
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setAddForm({ fullName: "", email: "", phone: "", roleId: 2 });

    setAddPw(randomPassword());
    setAddError("");
    setAddModal(true);
  };

  const handleAddSubmit = async () => {
    // setAddLoading(true);
    setAddError("");

    const payload = {
      emailAddress: addForm.email,
      password: addPw,
      fullName: addForm.fullName,
      phoneNumber: addForm.phone,
      status: 0,
    };

    try {
      let response = null;
      if (addForm.roleId === 2) {
        // Tạo nhân viên
        response = await adminApi.createStaff(payload);
      } else if (addForm.roleId === 3) {
        // Tạo quản lý
        response = await adminApi.createManager(payload);
      }
      if (!response || response.status != 200) {
        throw new Error("Không nhận được phản hồi từ server");
      }
      alert("Tạo tài khoản thành công!");
      setAddModal(false);
      fetchStaffs();
    } catch (err) {
      console.error("Tạo tài khoản lỗi:", err.status);
      setAddError("Lỗi tạo tài khoản hoặc phone, email đã tồn tại!");
    }

    // setAddLoading(false);
  };

  const inputStyle = {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    backgroundColor: "#f5f5f5",
    color: "#333",
    fontSize: 14,
  };

  const handleEdit = (staff) => {
    setEditForm({ ...staff });
    setEditError("");
    setEditModal(true);
  };

  const getModalTitle = (roleId) => {
    return roleId === 3
      ? "Chỉnh sửa thông tin quản lý"
      : "Chỉnh sửa thông tin nhân viên";
  };

  // const getDetailTitle = (roleId) => {
  //   return roleId === 3 ? "Chi tiết quản lý" : "Chi tiết nhân viên";
  // };

  const handleEditSubmit = async () => {
    setEditLoading(true);
    setEditError("");

    const payloadRole = {
      id: editForm.userId,
      role: editForm.roleId,
      status: editForm.status,
    };
    const payloadInfo = {
      userId: editForm.userId,
      fullName: editForm.fullName,
      phoneNumber: editForm.phone,
      status: editForm.status,
    };
    // console.log(payloadRole, payloadInfo);
    try {
      const [res1, res2] = await Promise.all([
        adminApi.updateRoleUserById(payloadRole), // PUT /Admin/update-role-status
        adminApi.updateUserInfo(payloadInfo), // PUT /Admin/update-phone-number-name-status
      ]);
      if (res1.status !== 200 || res2.status !== 200) {
        throw new Error("Một trong các yêu cầu cập nhật thất bại");
      }
      // const response = await adminApi.updateRoleUserById(payload);
      // // console.log("Update thành công:", response);
      // if (response.status !== 200) {
      //   throw new Error("Cập nhật không thành công");
      // }
      setEditModal(false);
      fetchStaffs(); // làm mới danh sách
      alert("Cập nhật dịch vụ thành công");
    } catch (error) {
      console.error("Update lỗi:", error.status);
      setEditError("Lỗi cập nhật thông tin!");
    }

    setEditLoading(false);
  };

  // const handleDelete = async (staff) => {
  //   console.log("Staff to delete:", staff); // debug
  //   const roleText = staff.roleId === 3 ? "quản lý" : "nhân viên";
  //   if (
  //     !window.confirm(
  //       `Bạn có chắc muốn xóa tài khoản ${roleText}: ${staff.fullName} (ID: ${staff.userId}) ?`
  //     )
  //   )
  //     return;
  //   try {
  //     const id = String(staff.userId); // Đảm bảo id là string
  //     const response = await adminApi.banUserById(`${id}`);
  //     console.log(response);
  //     await fetchStaffs(); // Đảm bảo fetch lại sau khi xóa
  //   } catch (err) {
  //     alert("Lỗi xóa tài khoản: " + (err?.message || "Không xác định"));
  //     console.error("Delete error:", err);
  //   }
  // };

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
          <span
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "#666",
              marginLeft: 12,
            }}
          >
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
            <div style={styles.totalNumber}>{staffs.length}</div>
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
              {staffs.filter((s) => s.roleId === 2).length}
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
              {staffs.filter((s) => s.roleId === 3).length}
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
      {/* <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        title={
          selectedStaff ? getDetailTitle(selectedStaff.roleId) : "Chi tiết"
        }
      >
        {selectedStaff && (
          <div style={{ lineHeight: 2 }}>
            <div>
              <b>ID:</b> {selectedStaff.userId}
            </div>
            <div>
              <b>Họ tên:</b> {selectedStaff.fullName}
            </div>
            <div>
              <b>Email:</b> {selectedStaff.email}
            </div>
            <div>
              <b>Số điện thoại:</b> {selectedStaff.phone}
            </div>
            <div>
              <b>Vai trò:</b>{" "}
              <span
                style={{
                  color: selectedStaff.roleId === 3 ? "#ff6b01" : "#2196f3",
                  fontWeight: 600,
                }}
              >
                {selectedStaff.roleId === 3 ? "Quản lý" : "Nhân viên"}
              </span>
            </div>

            {/* Thêm các trường khác nếu có */}
      {/* </div> */}
      {/* )} */}
      {/* // </Modal> */}
      <Modal
        open={addModal}
        onCancel={() => setAddModal(false)}
        footer={null}
        title="Tạo tài khoản nhân viên/quản lý"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target;
            if (!form.checkValidity()) {
              form.reportValidity();
              return;
            }
            handleAddSubmit();
          }}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {/* Họ tên */}
          <label>
            Họ tên:
            <input
              placeholder="Nhập họ tên"
              value={addForm.fullName || ""}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, fullName: e.target.value }))
              }
              style={{
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                width: "100%",
              }}
              required
            />
          </label>

          {/* Email */}
          <label>
            Email:
            <input
              placeholder="Nhập địa chỉ email"
              value={addForm.email}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, email: e.target.value }))
              }
              style={{
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                width: "100%",
              }}
              type="email"
              required
              onInvalid={(e) =>
                e.target.setCustomValidity(
                  "Vui lòng nhập đúng định dạng email (có ký tự @)."
                )
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </label>

          {/* Số điện thoại */}
          <label>
            Số điện thoại:
            <input
              placeholder="Nhập số điện thoại"
              value={addForm.phone || ""}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, phone: e.target.value }))
              }
              style={{
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                width: "100%",
              }}
              type="tel"
              pattern="(03|05|07|08|09)[0-9]{8}"
              required
              onInvalid={(e) =>
                e.target.setCustomValidity(
                  "Vui lòng nhập đúng định dạng số điện thoại."
                )
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </label>

          {/* Vai trò */}
          <label>
            Vai trò:
            <select
              value={addForm.roleId}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, roleId: Number(e.target.value) }))
              }
              style={{
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
                width: "100%",
              }}
              required
            >
              <option value={2}>Nhân viên (Staff)</option>
              <option value={3}>Quản lý (Manager)</option>
            </select>
          </label>

          {/* Mật khẩu tự sinh */}
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

          {/* Thông báo lỗi */}
          {addError && <div style={{ color: "red" }}>{addError}</div>}

          {/* Nút thao tác */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 12,
            }}
          >
            <button
              type="button"
              onClick={() => setAddModal(false)}
              style={{
                padding: "6px 16px",
                borderRadius: 6,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                background: "#1677ff",
                color: "#fff",
                padding: "6px 16px",
                border: "none",
                borderRadius: 6,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Tạo mới
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={editModal}
        onCancel={() => setEditModal(false)}
        onOk={handleEditSubmit}
        okText="Lưu thay đổi"
        confirmLoading={editLoading}
        title={getModalTitle(editForm.roleId)}
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
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontWeight: 600 }}>Mã nhân viên (ID)</div>
          <input value={editForm.userId || ""} readOnly style={inputStyle} />

          <div style={{ fontWeight: 600, backgroundColor: "#fff" }}>Họ tên</div>
          <input
            value={editForm.fullName || ""}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, fullName: e.target.value }))
            }
            style={{
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
              backgroundColor: "#fff", // NỀN TRẮNG
              color: "#333",
              fontSize: 14,
            }}
          />

          <div style={{ fontWeight: 600 }}>Email</div>
          <input value={editForm.email || ""} readOnly style={inputStyle} />

          <div style={{ fontWeight: 600 }}>Số điện thoại</div>
          <input
            value={editForm.phone || ""}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, phone: e.target.value }))
            }
            style={{
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
              backgroundColor: "#fff", // NỀN TRẮNG
              color: "#333",
              fontSize: 14,
            }}
            pattern="(03|05|07|08|09)[0-9]{8}"
            required
            onInvalid={(e) =>
              e.target.setCustomValidity(
                "SĐT phải bắt đầu bằng 03/05/07/08/09 và đủ 10 số"
              )
            }
            onInput={(e) => e.target.setCustomValidity("")}
          />

          <div style={{ fontWeight: 600 }}>Vai trò</div>
          <select
            value={editForm.roleId}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, roleId: Number(e.target.value) }))
            }
            style={{
              ...inputStyle,
              cursor: "pointer",
              backgroundColor: "#fff",
            }}
          >
            <option value={2}>Nhân viên (Staff)</option>
            <option value={3}>Quản lý (Manager)</option>
          </select>
          <div style={{ fontWeight: 600 }}>Trạng thái</div>
          <select
            value={editForm.status}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, status: Number(e.target.value) }))
            }
            style={{
              ...inputStyle,
              cursor: "pointer",
              backgroundColor: "#fff",
            }}
          >
            <option value={0}>Hoạt động</option>
            <option value={-1}>Đã bị khóa</option>
          </select>

          <div style={{ fontWeight: 600 }}>Ngày tạo</div>
          <input
            value={
              editForm.createdAt
                ? new Date(editForm.createdAt).toLocaleDateString("vi-VN")
                : ""
            }
            readOnly
            style={inputStyle}
          />

          {editError && <div style={{ color: "red" }}>{editError}</div>}
        </div>
      </Modal>
    </div>
  );
};

export default StaffManagement;
