import React from "react";
import dayjs from "dayjs";

/**
 * Modal hiển thị kết quả xét nghiệm cho đơn THỂ LOẠI HÀNH CHÍNH (category === 'admin').
 * Được tách ra từ UserProfile.jsx để dễ bảo trì.
 */
const AdminTestResult = ({ isOpen, order, onClose }) => {
  if (!isOpen || !order || order.category !== "Administrative") return null;

  // const getSampleMethodLabel = (val) => {
  //   if (val === "home") return "Tại nhà";
  //   if (val === "center") return "Tại trung tâm";
  //   if (val === "self") return "Tự thu và gửi mẫu";
  //   return val;
  // };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.18)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          minWidth: 340,
          maxWidth: 800,
          maxHeight: "90vh",
          padding: 32,
          boxShadow: "0 8px 32px #0002",
          position: "relative",
          fontSize: 17,
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 18,
            background: "none",
            border: "none",
            fontSize: 26,
            color: "#888",
            cursor: "pointer",
          }}
        >
          &times;
        </button>

        <h2
          style={{
            textAlign: "center",
            color: "#00c853",
            fontWeight: 800,
            fontSize: 32,
            marginBottom: 18,
          }}
        >
          Kết Quả Xét Nghiệm
        </h2>

        {/* Thông tin chung */}
        <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div>
              Ngày lấy mẫu xét nghiệm:{" "}
              <b>
                {order.scheduleDate
                  ? new Date(order.scheduleDate).toLocaleDateString("vi-VN")
                  : "-"}
              </b>
            </div>
            {/* <div>Nhân viên lấy mẫu: <b>{order.sampleInfo?.collector || order.staffAssigned || ''}</b></div> */}
            <div>
              Người yêu cầu xét nghiệm: <b>{order.name || ""}</b>
            </div>
            <div>
              Địa chỉ hiện tại: <b>{order.address || ""}</b>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 2,
                flexWrap: "nowrap",
              }}
            >
              <span style={{ fontWeight: 600, minWidth: 120, flexShrink: 0 }}>
                Loại xét nghiệm:
              </span>
              <span
                style={{
                  whiteSpace: "nowrap",
                  overflowWrap: "anywhere",
                  width: "100%",
                  display: "inline-block",
                  marginLeft: 8,
                }}
              >
                {order.serviceName || ""}
              </span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div>
              Địa điểm lấy mẫu:{" "}
              <b>
                2A Phan Chu Trinh, Hiệp Phú, Thủ Đức, Hồ Chí Minh 71300, Vietnam
              </b>
            </div>
            <div>
              Mã đơn hàng: <b>#{order.requestId}</b>
            </div>
          </div>
        </div>

        {/* Thông tin người cho mẫu */}
        <div
          style={{
            fontWeight: 700,
            fontSize: 22,
            textAlign: "center",
            margin: "18px 0 8px 0",
          }}
        >
          Thông tin người cho mẫu
        </div>
        {Array.isArray(order.sampleInfo?.donors) &&
          order.sampleInfo.donors.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              {order.sampleInfo.donors.map((donor, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 16,
                    marginBottom: 12,
                    background: "#fafbfc",
                  }}
                >
                  <div style={{ display: "flex", gap: 0, marginBottom: 4 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b>Họ và tên:</b>{" "}
                      <span style={{ fontWeight: 400 }}>
                        {donor.name || ""}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b>Giới tính:</b>{" "}
                      <span style={{ fontWeight: 400 }}>
                        {donor.gender || ""}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 0, marginBottom: 4 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b>Năm sinh:</b>{" "}
                      <span style={{ fontWeight: 400 }}>
                        {donor.birth || ""}
                      </span>
                    </div>
                    {/* <div style={{ flex: 1, minWidth: 0 }}>
                      <b>Quốc tịch:</b>{" "}
                      <span style={{ fontWeight: 400 }}>
                        {donor.nationality || ""}
                      </span>
                    </div> */}
                    {donor.fingerprintImage && (
                      <div style={{ marginTop: 8 }}>
                        <b>Vân tay:</b>
                        <br />
                        <img
                          src={
                            donor.fingerprintImage.startsWith("data:")
                              ? donor.fingerprintImage
                              : `data:image/png;base64,${donor.fingerprintImage}`
                          }
                          alt="Vân tay"
                          style={{ maxHeight: 120, marginTop: 6 }}
                        />
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 0, marginBottom: 4 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b>Loại giấy tờ:</b>{" "}
                      <span style={{ fontWeight: 400 }}>
                        {donor.idType || ""}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b>Số giấy tờ:</b>{" "}
                      <span style={{ fontWeight: 400 }}>
                        {donor.idNumber || ""}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: 0, marginBottom: 4 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b>Ngày cấp:</b>{" "}
                      <span style={{ fontWeight: 400 }}>
                        {donor.idIssueDate
                          ? dayjs(donor.idIssueDate).isValid()
                            ? dayjs(donor.idIssueDate).format("DD/MM/YYYY")
                            : donor.idIssueDate
                          : ""}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b>Nơi cấp:</b>{" "}
                      <span style={{ fontWeight: 400 }}>
                        {donor.idIssuePlace || ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Bảng kết quả xét nghiệm */}
        {Array.isArray(order.resultTableData) &&
          order.resultTableData.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3
                style={{ fontWeight: 600, fontSize: 20, margin: "16px 0 12px" }}
              >
                Kết quả xét nghiệm
              </h3>
              {/* <div
                style={{
                  background: "#f8fff3",
                  border: "2px solid #b6e4b6",
                  borderRadius: 14,
                  padding: 20,
                  overflowX: "auto",
                }}
              >
                <table
                  className="result-table"
                  style={{
                    minWidth: 600,
                    tableLayout: "auto",
                    borderCollapse: "collapse",
                    width: "100%",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#e6f7ff" }}>
                      <th
                        style={{
                          padding: "10px 14px",
                          fontSize: 16,
                          fontWeight: 700,
                          textAlign: "center",
                          borderBottom: "1.5px solid #b6e4b6",
                        }}
                      >
                        STT
                      </th>
                      <th
                        style={{
                          padding: "10px 14px",
                          fontSize: 16,
                          fontWeight: 700,
                          textAlign: "center",
                          borderBottom: "1.5px solid #b6e4b6",
                        }}
                      >
                        Họ và tên
                      </th>
                      <th
                        style={{
                          padding: "10px 14px",
                          fontSize: 16,
                          fontWeight: 700,
                          textAlign: "center",
                          borderBottom: "1.5px solid #b6e4b6",
                        }}
                      >
                        Ngày sinh
                      </th>
                      <th
                        style={{
                          padding: "10px 14px",
                          fontSize: 16,
                          fontWeight: 700,
                          textAlign: "center",
                          borderBottom: "1.5px solid #b6e4b6",
                        }}
                      >
                        Giới tính
                      </th>
                      <th
                        style={{
                          padding: "10px 14px",
                          fontSize: 16,
                          fontWeight: 700,
                          textAlign: "center",
                          borderBottom: "1.5px solid #b6e4b6",
                        }}
                      >
                        Mối quan hệ
                      </th>
                      <th
                        style={{
                          padding: "10px 14px",
                          fontSize: 16,
                          fontWeight: 700,
                          textAlign: "center",
                          borderBottom: "1.5px solid #b6e4b6",
                        }}
                      >
                        Loại mẫu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.resultTableData.map((data, idx) => (
                      <tr
                        key={data.key}
                        style={{
                          background: idx % 2 === 0 ? "#fff" : "#f4f8ff",
                        }}
                      >
                        <td
                          style={{
                            padding: "10px 14px",
                            fontSize: 16,
                            textAlign: "center",
                          }}
                        >
                          {idx + 1}
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            fontSize: 16,
                            textAlign: "center",
                          }}
                        >
                          {data.name}
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            fontSize: 16,
                            textAlign: "center",
                          }}
                        >
                          {data.birth || ""}
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            fontSize: 16,
                            textAlign: "center",
                          }}
                        >
                          {data.gender}
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            fontSize: 16,
                            textAlign: "center",
                          }}
                        >
                          {data.relationship}
                        </td>
                        <td
                          style={{
                            padding: "10px 14px",
                            fontSize: 16,
                            textAlign: "center",
                          }}
                        >
                          {data.sampleType}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}
            </div>
          )}
        {/* Kết luận */}
        <div
          style={{
            margin: "0 0 12px 0",
            padding: 20,
            background: "#e6f7ff",
            border: "1.5px solid #91d5ff",
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 18,
            color: "#005c3c",
          }}
        >
          <div style={{ marginBottom: 6, fontWeight: 800, fontSize: 20 }}>
            Kết luận
          </div>
          <div style={{ fontSize: 18 }}>{order.conclusion}</div>
        </div>

        {/* Giấy xác nhận / dấu mộc */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 32,
          }}
        >
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              HỘI ĐỒNG KHOA HỌC
            </div>
            <img
              src="/Stamp/da_xac_nhan.png"
              alt="Đã xác nhận"
              style={{ height: 48, margin: "0 auto" }}
            />
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              TRUNG TÂM XÉT NGHIỆM
            </div>
            <img
              src="/Stamp/dau_moc.png"
              alt="Dấu mộc"
              style={{ height: 90, margin: "0 auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTestResult;
