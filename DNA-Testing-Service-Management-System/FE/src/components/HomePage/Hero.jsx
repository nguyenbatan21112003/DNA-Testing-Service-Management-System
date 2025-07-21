import { Info, Clock, Shield, Award, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-badge">Dịch vụ xét nghiệm ADN hàng đầu FPT</div>

        <h1 className="hero-title">
          Khám phá bí mật di truyền <br />
          của bạn
        </h1>

        <p className="hero-description">
          Chúng tôi cung cấp dịch vụ xét nghiệm ADN với độ chính xác cao, bảo
          mật thông tin và kết quả nhanh chóng.
        </p>

        <div className="hero-buttons">
          <a href="#registration" className="hero-button primary">
            Đăng ký tư vấn xét nghiệm <span className="button-arrow">→</span>
          </a>
          <a href="#about" className="hero-button secondary">
            <Info size={18} /> Tìm hiểu thêm
          </a>
        </div>

        <div className="hero-features">
          <div className="feature-card">
            <div className="feature-icon green">
              <CheckCircle size={24} />
            </div>
            <div className="feature-content">
              <h3>Độ chính xác cao</h3>
              <p>Kết quả chính xác đến 99.99%</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon blue">
              <Clock size={24} />
            </div>
            <div className="feature-content">
              <h3>Kết quả nhanh chóng</h3>
              <p>Chỉ từ 3-5 ngày làm việc</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">
              <Shield size={24} />
            </div>
            <div className="feature-content">
              <h3>Bảo mật thông tin</h3>
              <p>Bảo mật tuyệt đối dữ liệu</p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon yellow">
              <Award size={24} />
            </div>
            <div className="feature-content">
              <h3>Được công nhận</h3>
              <p>Đạt chuẩn quốc tế ISO 17025</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
