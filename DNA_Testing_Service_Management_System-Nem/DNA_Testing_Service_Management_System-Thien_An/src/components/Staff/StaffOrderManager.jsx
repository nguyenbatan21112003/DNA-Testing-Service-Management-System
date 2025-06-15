import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useOrderContext } from "../../context/OrderContext";
import { CheckCircle } from "lucide-react";

const STATUS_OPTIONS = ["Chờ xử lý", "Đang xử lý", "Hoàn thành", "Đã hủy"];

const StaffOrderManager = () => {
  const { user } = useContext(AuthContext);
  const { getAllOrders, setOrders, updateOrder } = useOrderContext();
  const [orders, setOrdersState] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [resultInput, setResultInput] = useState("");
  const [resultFileInput, setResultFileInput] = useState("");
  const [staffNameInput, setStaffNameInput] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const navigate = useNavigate();

  // Đảm bảo chỉ render khi user đã xác định
  useEffect(() => {
    if (user === null) return;
    if (!user || user.role_id !== 2) {
      navigate("/taikhoan", { replace: true });
    }
  }, [user, navigate]);

  // Load all orders for staff (chỉ khi user là staff)
  useEffect(() => {
    if (user && user.role_id === 2) {
      const all = getAllOrders();
      setOrdersState(all);
    }
  }, [user, getAllOrders]);

  useEffect(() => {
    let data = [...orders];
    if (filterStatus !== "Tất cả") {
      data = data.filter((o) => (o.status || "Chờ xử lý") === filterStatus);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(
        (o) =>
          (o.id && o.id.toString().toLowerCase().includes(s)) ||
          (o.name && o.name.toLowerCase().includes(s)) ||
          (o.email && o.email.toLowerCase().includes(s)) ||
          (o.phone && o.phone.toLowerCase().includes(s)) ||
          (o.type && o.type.toLowerCase().includes(s))
      );
    }
    data.sort((a, b) => {
      let vA = a[sortField] || "";
      let vB = b[sortField] || "";
      if (sortField === "date") {
        vA = new Date(vA.split("/").reverse().join("-"));
        vB = new Date(vB.split("/").reverse().join("-"));
      }
      if (vA < vB) return sortAsc ? -1 : 1;
      if (vA > vB) return sortAsc ? 1 : -1;
      return 0;
    });
    setFilteredOrders(data);
  }, [orders, filterStatus, search, sortField, sortAsc]);

  useEffect(() => {
    if (selectedOrder) {
      setNoteInput(selectedOrder.staffNote || "");
    }
  }, [selectedOrder]);

  if (user === null) {
    return <div style={{ padding: 32, fontSize: 20 }}>Đang tải...</div>;
  }
  if (!user || user.role_id !== 2) {
    return null;
  }

  // Cập nhật trạng thái đơn trên bảng
  const handleStatusChange = (orderId, newStatus) => {
    const all = getAllOrders();
    const idx = all.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      all[idx] = {
        ...all[idx],
        status: newStatus,
      };
      localStorage.setItem("dna_orders", JSON.stringify(all));
      setOrders(all);
      setOrdersState(all);
      setToastMsg("Cập nhật trạng thái thành công!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1800);
    }
  };

  // Cập nhật ghi chú nội bộ
  const handleUpdateNote = () => {
    if (!selectedOrder) return;
    const all = getAllOrders();
    const idx = all.findIndex((o) => o.id === selectedOrder.id);
    if (idx !== -1) {
      all[idx] = {
        ...all[idx],
        staffNote: noteInput,
      };
      localStorage.setItem("dna_orders", JSON.stringify(all));
      setOrders(all);
      setOrdersState(all);
      setSelectedOrder({ ...all[idx] });
      setToastMsg("Đã lưu ghi chú!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1500);
    }
  };

  // Sắp xếp toggle
  const handleSort = (field) => {
    if (sortField === field) setSortAsc((asc) => !asc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div style={{ padding: 32, minHeight: "100vh", background: "#f7fafd" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>
        Quản lý đơn đăng ký xét nghiệm ADN
      </h1>
      {/* Toast thông báo */}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            background: "#00a67e",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: 8,
            boxShadow: "0 2px 12px #0002",
            zIndex: 2000,
            fontWeight: 500,
            fontSize: 16,
          }}
        >
          {toastMsg}
        </div>
      )}
      {/* Bộ lọc, tìm kiếm, sắp xếp */}
      <div
        style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}
      >
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="Tất cả">Tất cả</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email, SĐT, mã đơn, dịch vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 260,
          }}
        />
      </div>
      {filteredOrders.length === 0 ? (
        <div style={{ color: "#888", fontSize: 20 }}>
          Không tìm thấy đơn phù hợp.
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 12px #e6e6e6",
            padding: 32,
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f0f4f8" }}>
                <th
                  style={{
                    padding: 12,
                    border: "1px solid #eee",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("id")}
                >
                  Mã đơn {sortField === "id" && (sortAsc ? "▲" : "▼")}
                </th>
                <th
                  style={{
                    padding: 12,
                    border: "1px solid #eee",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("name")}
                >
                  Tên người đăng ký{" "}
                  {sortField === "name" && (sortAsc ? "▲" : "▼")}
                </th>
                <th
                  style={{
                    padding: 12,
                    border: "1px solid #eee",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("email")}
                >
                  Email {sortField === "email" && (sortAsc ? "▲" : "▼")}
                </th>
                <th
                  style={{
                    padding: 12,
                    border: "1px solid #eee",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("phone")}
                >
                  Số điện thoại {sortField === "phone" && (sortAsc ? "▲" : "▼")}
                </th>
                <th
                  style={{
                    padding: 12,
                    border: "1px solid #eee",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("type")}
                >
                  Loại dịch vụ {sortField === "type" && (sortAsc ? "▲" : "▼")}
                </th>
                <th
                  style={{
                    padding: 12,
                    border: "1px solid #eee",
                  }}
                >
                  Hình thức thu mẫu
                </th>
                <th
                  style={{
                    padding: 12,
                    border: "1px solid #eee",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("status")}
                >
                  Trạng thái {sortField === "status" && (sortAsc ? "▲" : "▼")}
                </th>
                <th
                  style={{
                    padding: 12,
                    border: "1px solid #eee",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("date")}
                >
                  Ngày đăng ký {sortField === "date" && (sortAsc ? "▲" : "▼")}
                </th>
                <th style={{ padding: 12, border: "1px solid #eee" }}>
                  Chi tiết
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td
                    style={{
                      padding: 10,
                      border: "1px solid #eee",
                      textAlign: "center",
                    }}
                  >
                    #{order.id}
                  </td>
                  <td style={{ padding: 10, border: "1px solid #eee" }}>
                    {order.name}
                  </td>
                  <td style={{ padding: 10, border: "1px solid #eee" }}>
                    {order.email}
                  </td>
                  <td style={{ padding: 10, border: "1px solid #eee" }}>
                    {order.phone}
                  </td>
                  <td style={{ padding: 10, border: "1px solid #eee" }}>
                    {order.type}
                  </td>
                  <td style={{ padding: 10, border: "1px solid #eee" }}>
                    {order.sampleMethod === "home"
                      ? "Tại nhà"
                      : order.sampleMethod === "center"
                      ? "Tại trung tâm"
                      : order.sampleMethod || ""}
                  </td>
                  <td style={{ padding: 10, border: "1px solid #eee" }}>
                    <select
                      value={order.status || "Chờ xử lý"}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      style={{ padding: 4, borderRadius: 4, minWidth: 110 }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: 10, border: "1px solid #eee" }}>
                    {order.date}
                  </td>
                  <td
                    style={{
                      padding: 10,
                      border: "1px solid #eee",
                      textAlign: "center",
                    }}
                  >
                    <button
                      style={{
                        background: "#009e74",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "6px 16px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal chi tiết đơn */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.25)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              minWidth: 400,
              maxWidth: 520,
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "none",
                border: "none",
                fontSize: 22,
                color: "#888",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 18 }}>
              Chi tiết đơn đăng ký
            </h2>
            {/* Thông tin cơ bản */}
            <div style={{ marginBottom: 10 }}>
              <b>Mã đơn:</b>{" "}
              <span style={{ color: "#009e74" }}>#{selectedOrder.id}</span>
            </div>
            <div style={{ marginBottom: 10 }}>
              <b>Trạng thái:</b> {selectedOrder.status || "Chờ xử lý"}
            </div>
            <div style={{ marginBottom: 10 }}>
              <b>Loại dịch vụ:</b> {selectedOrder.type}
            </div>
            <div style={{ marginBottom: 10 }}>
              <b>Ngày đăng ký:</b> {selectedOrder.date}
            </div>
            <div style={{ marginBottom: 10 }}>
              <b>Họ tên người đăng ký:</b> {selectedOrder.name}
            </div>
            <div style={{ marginBottom: 10 }}>
              <b>Số điện thoại:</b> {selectedOrder.phone}
            </div>
            <div style={{ marginBottom: 10 }}>
              <b>Email:</b> {selectedOrder.email}
            </div>
            {selectedOrder.address && (
              <div style={{ marginBottom: 10 }}>
                <b>Địa chỉ:</b> {selectedOrder.address}
              </div>
            )}
            {selectedOrder.appointmentDate && (
              <div style={{ marginBottom: 10 }}>
                <b>Ngày xét nghiệm:</b> {selectedOrder.appointmentDate}
              </div>
            )}
            {/* Thông báo đã nhận file Đơn Yêu Cầu Xét Nghiệm */}
            {selectedOrder.requestFormFile && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#e6f7f1",
                  color: "#009e74",
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: 14,
                  margin: "10px 0 18px 0",
                  border: "1.5px solid #b2e2d6",
                  fontSize: 17,
                  gap: 10,
                }}
              >
                <CheckCircle
                  size={22}
                  color="#00a67e"
                  style={{ minWidth: 22 }}
                />
                Đã nhận file Đơn Yêu Cầu Xét Nghiệm từ khách hàng
              </div>
            )}
            {/* Gửi kit workflow */}
            {selectedOrder.sampleMethod === "home" && (
              <div
                style={{
                  margin: "18px 0",
                  padding: 14,
                  background: "#f6f8fa",
                  borderRadius: 8,
                  border: "1px solid #cce3d3",
                }}
              >
                {selectedOrder.kitStatus === "chua_gui" && (
                  <button
                    style={{
                      background: "#009e74",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "8px 24px",
                      fontWeight: 700,
                      cursor: "pointer",
                      marginBottom: 8,
                    }}
                    onClick={() => {
                      // Sinh mã kitId duy nhất
                      const kitId = `KIT-${new Date().getFullYear()}${(
                        "0" +
                        (new Date().getMonth() + 1)
                      ).slice(-2)}${("0" + new Date().getDate()).slice(
                        -2
                      )}-${Math.floor(1000 + Math.random() * 9000)}`;
                      updateOrder(selectedOrder.id, {
                        kitStatus: "da_gui",
                        status: "Đã gửi kit",
                        kitId,
                      });
                      setSelectedOrder({
                        ...selectedOrder,
                        kitStatus: "da_gui",
                        status: "Đã gửi kit",
                        kitId,
                      });
                      setToastMsg(
                        `Đã gửi kit xét nghiệm cho khách hàng!\nMã kit: ${kitId}`
                      );
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 1800);
                    }}
                  >
                    Gửi kit xét nghiệm
                  </button>
                )}
                {/* Hiển thị xác nhận nhận kit với style đồng bộ */}
                {selectedOrder.kitStatus === "da_nhan" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      background: "#e6f7f1",
                      borderRadius: 10,
                      border: "1.5px solid #b2e2d6",
                      padding: 14,
                      color: "#009e74",
                      fontWeight: 700,
                      fontSize: 17,
                      marginBottom: 6,
                      marginTop: 0,
                    }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <CheckCircle
                        size={22}
                        color="#00a67e"
                        style={{ minWidth: 22 }}
                      />
                      Khách hàng đã xác nhận đã nhận kit.
                    </span>
                    <span
                      style={{ marginLeft: 30, marginTop: 4, fontWeight: 700 }}
                    >
                      Mã kit: {selectedOrder.kitId}
                    </span>
                  </div>
                )}
                {/* Hiển thị mã kit nếu đã gửi kit nhưng chưa xác nhận nhận kit */}
                {selectedOrder.kitStatus === "da_gui" &&
                  selectedOrder.kitId && (
                    <div
                      style={{
                        background: "#f6f8fa",
                        color: "#009e74",
                        fontWeight: 700,
                        borderRadius: 8,
                        padding: 10,
                        border: "1.5px solid #b2e2d6",
                        marginTop: 10,
                        fontSize: 16,
                      }}
                    >
                      Mã kit: {selectedOrder.kitId}
                    </div>
                  )}
                {selectedOrder.kitStatus === "da_gui" && (
                  <div
                    style={{ color: "#b88900", fontWeight: 600, marginTop: 10 }}
                  >
                    Đã gửi kit. Đang chờ khách hàng xác nhận đã nhận kit...
                  </div>
                )}
              </div>
            )}
            {/* Kiểm tra điều kiện cho phép cập nhật tiến trình */}
            {selectedOrder.sampleMethod === "home" && (
              <>
                {selectedOrder.kitStatus !== "da_nhan" && (
                  <div
                    style={{ color: "#e67e22", fontWeight: 600, marginTop: 10 }}
                  >
                    Bạn chỉ có thể cập nhật tiến trình sau khi khách hàng xác
                    nhận đã nhận kit.
                  </div>
                )}
                {(!selectedOrder.requestFormFile ||
                  selectedOrder.requestFormFile === "") && (
                  <div
                    style={{ color: "#e67e22", fontWeight: 600, marginTop: 10 }}
                  >
                    Bạn chỉ có thể cập nhật tiến trình sau khi nhận được file
                    Đơn Yêu Cầu Xét Nghiệm từ khách hàng.
                  </div>
                )}
              </>
            )}
            {/* Form cập nhật tiến trình, kết quả, xác nhận */}
            {/* Chỉ cho phép cập nhật nếu đủ điều kiện */}
            {!(
              selectedOrder.sampleMethod === "home" &&
              (selectedOrder.kitStatus !== "da_nhan" ||
                !selectedOrder.requestFormFile ||
                selectedOrder.requestFormFile === "")
            ) && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateOrder(selectedOrder.id, {
                    result: resultInput,
                    resultFile: resultFileInput,
                    staffName: staffNameInput,
                  });
                  setUpdateSuccess("Cập nhật thành công!");
                  setTimeout(() => setUpdateSuccess(""), 2000);
                }}
                style={{
                  marginTop: 18,
                  background: "#f6f8fa",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <div style={{ marginBottom: 10 }}>
                  <b>Kết quả xét nghiệm (bảng HTML):</b>
                  <textarea
                    rows={4}
                    value={resultInput}
                    onChange={(e) => setResultInput(e.target.value)}
                    placeholder="Nhập bảng kết quả HTML hoặc text..."
                    style={{
                      width: "100%",
                      borderRadius: 6,
                      marginTop: 6,
                      padding: 8,
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <b>File kết quả (tải lên):</b>
                  {selectedOrder.resultFile ? (
                    <a
                      href={
                        selectedOrder.resultFile.startsWith("data:")
                          ? selectedOrder.resultFile
                          : selectedOrder.resultFile
                      }
                      download={
                        selectedOrder.resultFileName || "KetQuaXetNghiem"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#0a7cff",
                        textDecoration: "underline",
                        fontWeight: 500,
                        marginLeft: 8,
                      }}
                    >
                      Tải file kết quả đã nộp
                    </a>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xlsx,.xls,.txt"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = function (evt) {
                            const base64 = evt.target.result;
                            // Lưu vào localStorage (update order)
                            const allOrders = JSON.parse(
                              localStorage.getItem("dna_orders") || "[]"
                            );
                            const idx = allOrders.findIndex(
                              (o) => o.id === selectedOrder.id
                            );
                            if (idx !== -1) {
                              allOrders[idx] = {
                                ...allOrders[idx],
                                resultFile: base64,
                                resultFileName: file.name,
                              };
                              localStorage.setItem(
                                "dna_orders",
                                JSON.stringify(allOrders)
                              );
                            }
                            setResultFileInput(base64);
                          };
                          reader.readAsDataURL(file);
                        }}
                        style={{ marginLeft: 8, fontSize: 13, padding: 2 }}
                      />
                      <span
                        style={{ color: "#888", marginLeft: 8, fontSize: 13 }}
                      >
                        (PDF, DOC, DOCX, XLSX, XLS, TXT)
                      </span>
                    </>
                  )}
                </div>
                <div style={{ marginBottom: 10 }}>
                  <b>Tên nhân viên thực hiện:</b>
                  <input
                    type="text"
                    value={staffNameInput}
                    onChange={(e) => setStaffNameInput(e.target.value)}
                    placeholder="Nhập tên nhân viên thực hiện"
                    style={{
                      width: "100%",
                      borderRadius: 6,
                      marginTop: 6,
                      padding: 8,
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: "#009e74",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 24px",
                    fontWeight: 700,
                    cursor: "pointer",
                    marginTop: 8,
                  }}
                >
                  Lưu cập nhật
                </button>
                {updateSuccess && (
                  <div style={{ color: "#009e74", marginTop: 8 }}>
                    {updateSuccess}
                  </div>
                )}
              </form>
            )}
            {/* Ghi chú nội bộ */}
            <div style={{ marginTop: 18 }}>
              <b>Ghi chú nội bộ (staff):</b>
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  borderRadius: 6,
                  marginTop: 4,
                  padding: 6,
                  border: "1px solid #ccc",
                }}
                placeholder="Thêm ghi chú cho đơn này..."
              />
              <button
                onClick={handleUpdateNote}
                style={{
                  background: "#009e74",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 24px",
                  fontWeight: 700,
                  marginTop: 12,
                  cursor: "pointer",
                }}
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffOrderManager;
