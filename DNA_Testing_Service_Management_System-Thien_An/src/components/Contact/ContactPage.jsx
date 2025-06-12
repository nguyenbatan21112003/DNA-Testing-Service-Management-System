import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="contact-page">
      {/* Banner */}
      <div className="contact-banner">
        <div className="container">
          <h1>Liên hệ với chúng tôi</h1>
          <p>
            Hãy để lại thông tin, chúng tôi sẽ liên hệ với bạn sớm nhất có thể
          </p>
        </div>
      </div>

      <div className="contact-content container">
        <div className="contact-info-grid">
          {/* Thông tin liên hệ */}
          <div className="contact-info-section">
            <h2>Thông tin liên hệ</h2>
            <p className="contact-description">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ với chúng tôi
              qua các kênh sau:
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-icon">
                  <Phone size={24} />
                </div>
                <div className="contact-details">
                  <h3>Điện thoại</h3>
                  <p>0123 456 789</p>
                  <p>0987 654 321 (Hotline 24/7)</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">
                  <Mail size={24} />
                </div>
                <div className="contact-details">
                  <h3>Email</h3>
                  <p>info@dnalab.com.vn</p>
                  <p>support@dnalab.com.vn</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">
                  <MapPin size={24} />
                </div>
                <div className="contact-details">
                  <h3>Địa chỉ</h3>
                  <p>Trụ sở: 7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">
                  <Clock size={24} />
                </div>
                <div className="contact-details">
                  <h3>Giờ làm việc</h3>
                  <p>Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                  <p>Thứ 7: 8:00 - 12:00</p>
                  <p>Chủ nhật: Nghỉ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form liên hệ */}
          <div className="contact-form-section">
            <h2>Liên hệ qua Zalo</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "2rem 0",
              }}
            >
              <p style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                Quét mã QR bên dưới để liên hệ, tư vấn và nhận hỗ trợ trực tiếp
                từ đội ngũ của chúng tôi qua Zalo.
              </p>
              <img
                src="https://chart.googleapis.com/chart?chs=220x220&cht=qr&chl=https://zalo.me/g/wdeibl702"
                alt="QR Zalo nhóm hỗ trợ DNA Lab"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 4px 24px 0 rgba(30,144,255,0.10)",
                  marginBottom: "1rem",
                }}
                width={220}
                height={220}
                loading="lazy"
              />
              <a
                href="https://zalo.me/g/wdeibl702"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#1e90ff",
                  fontWeight: 600,
                  textDecoration: "underline",
                  marginTop: "0.5rem",
                }}
              >
                Hoặc bấm vào đây để mở Zalo nhóm hỗ trợ
              </a>
            </div>
          </div>
        </div>

        {/* Bản đồ */}
        <div className="contact-map">
          <h2>Vị trí của chúng tôi</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps?q=7+Đ.+D1,+Long+Thạnh+Mỹ,+Thủ+Đức,+Hồ+Chí+Minh&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
