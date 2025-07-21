import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🧬</span>
              <span className="logo-text">DNA Lab</span>
            </div>
            <p className="footer-description">
              Cung cấp dịch vụ xét nghiệm ADN chính xác và bảo mật cao nhất.
            </p>
          </div>

          <div className="footer-section">
            <h3>Dịch vụ</h3>
            <ul className="footer-links">
              <li>
                <Link to="/dichvu#huyet-thong">Xét nghiệm huyết thống</Link>
              </li>
              <li>
                <Link to="/dichvu#nguon-goc">Xét nghiệm nguồn gốc</Link>
              </li>
              <li>
                <Link to="/dichvu#suc-khoe">Xét nghiệm sức khỏe di truyền</Link>
              </li>
              <li>
                <Link to="/dichvu#hanh-chinh">Xét nghiệm ADN hành chính</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Công ty</h3>
            <ul className="footer-links">
              <li>
                <Link to="/vechungtoi#gioi-thieu">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/vechungtoi#doi-ngu">Đội ngũ chuyên gia</Link>
              </li>
              <li>
                <Link to="/vechungtoi#phong-xet-nghiem">Phòng xét nghiệm</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Liên hệ</h3>
            <ul className="footer-contact">
              <li>
                <Phone size={16} />
                <span>0123 456 789</span>
              </li>
              <li>
                <Mail size={16} />
                <span>info@dnalab.com.vn</span>
              </li>
              <li>
                <MapPin size={16} />
                <span>123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} DNA Lab. Tất cả các quyền được bảo
            lưu.
          </p>
          <div className="footer-legal">
            <a href="/vechungtoi#dieu-khoan">Điều khoản sử dụng</a>
            <span>|</span>
            <a href="/vechungtoi#chinh-sach">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
