"use client";
import { useState, useEffect } from "react";
import {
  Dna,
  FileText,
  BookOpen,
  DollarSign,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useOrderContext } from "../../context/OrderContext";
import "react-datepicker/dist/react-datepicker.css";


const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState("civil");
  const location = useLocation();
  const { pricingData } = useOrderContext();

  useEffect(() => {
    // Scroll đến phần dịch vụ theo hash trên URL
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      // Nếu là dịch vụ hành chính thì tự động chuyển tab
      if (id === "hanh-chinh") setActiveTab("administrative");
      if (["huyet-thong", "nguon-goc", "suc-khoe"].includes(id))
        setActiveTab("civil");
    } else if (location.state && location.state.scrollToPricing) {
      const section = document.querySelector(".pricing-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="services-page">
      {/* Banner */}
      <div className="services-banner">
        <div className="container">
          <h1>Dịch vụ xét nghiệm ADN</h1>
          <p>
            Chúng tôi cung cấp các dịch vụ xét nghiệm ADN chính xác, bảo mật và
            nhanh chóng
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="services-content">
          {/* Services Section */}
          <section className="services-section">
            <div className="section-header">
              <div className="section-icon">
                <Dna size={24} />
              </div>
              <h2>Dịch vụ xét nghiệm ADN</h2>
            </div>
            <div className="services-tabs">
              <div className="tabs-header">
                <button
                  className={`tab-button ${
                    activeTab === "civil" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("civil")}
                >
                  Xét nghiệm ADN dân sự
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "administrative" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("administrative")}
                >
                  Xét nghiệm ADN hành chính
                </button>
              </div>
              <div className="tabs-content">
                {activeTab === "civil" && (
                  <div className="tab-panel">
                    <div className="service-description">
                      <h3>Xét nghiệm ADN dân sự là gì?</h3>
                      <p>
                        Xét nghiệm ADN dân sự là dịch vụ xét nghiệm ADN được
                        thực hiện cho mục đích cá nhân, không có giá trị pháp
                        lý. Kết quả xét nghiệm ADN dân sự chỉ có giá trị tham
                        khảo và không được sử dụng cho các thủ tục pháp lý.
                      </p>
                      <h3>Các loại xét nghiệm ADN dân sự</h3>
                      <div className="service-types">
                        <div className="service-type-card" id="huyet-thong">
                          <div className="service-type-icon">
                            <CheckCircle size={20} />
                          </div>
                          <div className="service-type-content">
                            <h4>Xét nghiệm huyết thống cha con</h4>
                            <p>
                              Xác định mối quan hệ huyết thống giữa cha và con
                              với độ chính xác lên đến 99.99%.
                            </p>
                          </div>
                        </div>
                        <div className="service-type-card">
                          <div className="service-type-icon">
                            <CheckCircle size={20} />
                          </div>
                          <div className="service-type-content">
                            <h4>Xét nghiệm huyết thống mẹ con</h4>
                            <p>
                              Xác định mối quan hệ huyết thống giữa mẹ và con
                              với độ chính xác cao.
                            </p>
                          </div>
                        </div>
                        <div className="service-type-card">
                          <div className="service-type-icon">
                            <CheckCircle size={20} />
                          </div>
                          <div className="service-type-content">
                            <h4>Xét nghiệm anh chị em ruột</h4>
                            <p>
                              Xác định mối quan hệ huyết thống giữa anh chị em
                              ruột.
                            </p>
                          </div>
                        </div>
                        <div className="service-type-card">
                          <div className="service-type-icon">
                            <CheckCircle size={20} />
                          </div>
                          <div className="service-type-content">
                            <h4>Xét nghiệm họ hàng</h4>
                            <p>
                              Xác định mối quan hệ huyết thống giữa các thành
                              viên trong gia đình.
                            </p>
                          </div>
                        </div>
                        <div className="service-type-card" id="nguon-goc">
                          <div className="service-type-icon">
                            <CheckCircle size={20} />
                          </div>
                          <div className="service-type-content">
                            <h4>Xét nghiệm nguồn gốc</h4>
                            <p>
                              Khám phá nguồn gốc tổ tiên và di truyền dân tộc
                              của bạn
                            </p>
                          </div>
                        </div>
                        <div className="service-type-card" id="suc-khoe">
                          <div className="service-type-icon">
                            <CheckCircle size={20} />
                          </div>
                          <div className="service-type-content">
                            <h4>Xét nghiệm sức khỏe di truyền</h4>
                            <p>
                              Phát hiện nguy cơ bệnh di truyền để có biện pháp
                              phòng ngừa.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="service-features">
                        <h3>Ưu điểm của xét nghiệm ADN dân sự</h3>
                        <ul>
                          <li>
                            Chi phí thấp hơn so với xét nghiệm ADN hành chính
                          </li>
                          <li>
                            Thời gian trả kết quả nhanh (3-5 ngày làm việc)
                          </li>
                          <li>
                            Quy trình đơn giản, không cần giấy tờ tùy thân
                          </li>
                          <li>Bảo mật thông tin tuyệt đối</li>
                          <li>Độ chính xác cao (99.99%)</li>
                        </ul>
                      </div>
                      <div className="service-cta">
                        <Link to="/dangki" className="service-button">
                          Đăng ký xét nghiệm <ChevronRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "administrative" && (
                  <div className="tab-panel">
                    <div className="service-description" id="hanh-chinh">
                      <h3>Xét nghiệm ADN hành chính là gì?</h3>
                      <p>
                        Xét nghiệm ADN hành chính là dịch vụ xét nghiệm ADN được
                        thực hiện theo quy trình chặt chẽ, có giá trị pháp lý và
                        được sử dụng cho các thủ tục hành chính như khai sinh,
                        nhập quốc tịch, xin visa, di trú, thừa kế, tranh chấp
                        quyền nuôi con...
                      </p>
                      <h3>Các loại xét nghiệm ADN hành chính</h3>
                      <div className="service-types">
                        <div className="service-type-card">
                          <div className="service-type-icon">
                            <CheckCircle size={20} />
                          </div>
                          <div className="service-type-content">
                            <h4>Xét nghiệm ADN cho khai sinh</h4>
                            <p>
                              Xác định quan hệ huyết thống phục vụ cho việc đăng
                              ký khai sinh.
                            </p>
                          </div>
                        </div>
                        <div className="service-type-card">
                          <div className="service-type-icon">
                            <CheckCircle size={20} />
                          </div>
                          <div className="service-type-content">
                            <h4>Xét nghiệm ADN cho di trú</h4>
                            <p>
                              Xác định quan hệ huyết thống phục vụ cho thủ tục
                              xin visa, định cư.
                            </p>
                          </div>
                        </div>
                        <div className="service-type-card">
                          <div className="service-type-icon">
                            <CheckCircle size={20} />
                          </div>
                          <div className="service-type-content">
                            <h4>Xét nghiệm ADN cho thừa kế</h4>
                            <p>
                              Xác định quan hệ huyết thống phục vụ cho việc phân
                              chia tài sản thừa kế.
                            </p>
                          </div>
                        </div>
                        <div className="service-type-card">
                          <div className="service-type-icon">
                            <CheckCircle size={20} />
                          </div>
                          <div className="service-type-content">
                            <h4>Xét nghiệm ADN cho tranh chấp</h4>
                            <p>
                              Xác định quan hệ huyết thống phục vụ cho các vụ
                              tranh chấp quyền nuôi con.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="service-features">
                        <h3>Quy trình xét nghiệm ADN hành chính</h3>
                        <ul>
                          <li>Đặt lịch hẹn tại phòng xét nghiệm</li>
                          <li>
                            Mang theo giấy tờ tùy thân (CMND/CCCD/Hộ chiếu)
                          </li>
                          <li>
                            Thu mẫu xét nghiệm dưới sự giám sát của nhân viên y
                            tế
                          </li>
                          <li>Ký xác nhận vào biên bản thu mẫu</li>
                          <li>Nhận kết quả sau 5-7 ngày làm việc</li>
                        </ul>
                      </div>
                      <div className="service-cta">
                        <Link to="/dangki" className="service-button">
                          Đăng ký xét nghiệm <ChevronRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Blog Section */}
          <section className="blog-section">
            <div className="section-header">
              <div className="section-icon">
                <BookOpen size={24} />
              </div>
              <h2>Blog chia sẻ kiến thức</h2>
            </div>
            <div className="blog-description">
              <p>
                Tìm hiểu thêm về xét nghiệm ADN qua các bài viết chia sẻ kinh
                nghiệm, kiến thức và hướng dẫn chi tiết từ đội ngũ chuyên gia
                của chúng tôi.
              </p>
            </div>
            <div className="blog-posts">
              <div className="blog-card">
                <div className="blog-image">
                  <img
                    src="/placeholder.svg?height=200&width=300"
                    alt="Xét nghiệm ADN là gì?"
                  />
                </div>
                <div className="blog-content">
                  <Link to="/tintuc#blog-1">
                    <h3 style={{ color: "black" }}>
                      Xét nghiệm ADN là gì? Các loại xét nghiệm ADN phổ biến
                    </h3>
                  </Link>
                  <p>
                    Tìm hiểu về xét nghiệm ADN, cách thức hoạt động và các loại
                    xét nghiệm ADN phổ biến hiện nay...
                  </p>
                  <Link to="/tintuc#blog-1" className="blog-link">
                    Đọc thêm <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
              <div className="blog-card">
                <div className="blog-image">
                  <img
                    src="/placeholder.svg?height=200&width=300"
                    alt="Hướng dẫn chuẩn bị trước khi xét nghiệm ADN"
                  />
                </div>
                <div className="blog-content">
                  <Link to="/tintuc#blog-2">
                    <h3 style={{ color: "black" }}>
                      Hướng dẫn chuẩn bị trước khi xét nghiệm ADN
                    </h3>
                  </Link>
                  <p>
                    Những điều cần biết và chuẩn bị trước khi thực hiện xét
                    nghiệm ADN để đảm bảo kết quả chính xác...
                  </p>
                  <Link to="/tintuc#blog-2" className="blog-link">
                    Đọc thêm <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
              <div className="blog-card">
                <div className="blog-image">
                  <img
                    src="/placeholder.svg?height=200&width=300"
                    alt="Sự khác biệt giữa xét nghiệm ADN dân sự và hành chính"
                  />
                </div>
                <div className="blog-content">
                  <Link to="/tintuc#blog-3">
                    <h3 style={{ color: "black" }}>
                      Sự khác biệt giữa xét nghiệm ADN dân sự và hành chính
                    </h3>
                  </Link>

                  <p>
                    So sánh chi tiết về quy trình, chi phí, thời gian và giá trị
                    pháp lý giữa hai loại xét nghiệm ADN...
                  </p>
                  <Link to="/tintuc#blog-3" className="blog-link">
                    Đọc thêm <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="blog-cta">
              <Link to="/tintuc" className="view-all-button">
                Xem tất cả bài viết <ChevronRight size={16} />
              </Link>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="pricing-section">
            <div className="section-header">
              <div className="section-icon">
                <DollarSign size={24} />
              </div>
              <h2>Bảng giá dịch vụ</h2>
            </div>
            <div className="pricing-description">
              <p>
                Chúng tôi cung cấp các gói dịch vụ xét nghiệm ADN với mức giá
                cạnh tranh và phù hợp với nhu cầu của khách hàng.
              </p>
            </div>
            <div className="pricing-tables">
              <div className="pricing-table">
                <div className="pricing-header">
                  <h3>Xét nghiệm ADN dân sự</h3>
                </div>
                <div className="pricing-body">
                  <table className="price-table">
                    <thead>
                      <tr>
                        <th>Loại xét nghiệm</th>
                        <th>Giá (VNĐ)</th>
                        <th>Người thứ 3</th>
                        <th>Thời gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingData && pricingData.civil && pricingData.civil.map((service) => (
                        <tr key={service.id}>
                          <td>{service.name}</td>
                          <td>{new Intl.NumberFormat("vi-VN").format(service.price)}</td>
                          <td>{new Intl.NumberFormat("vi-VN").format(service.additionalPrice)}</td>
                          <td>{service.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pricing-note">
                    <p>* Giá trên chưa bao gồm VAT và phí đi lại (nếu có)</p>
                  </div>
                </div>
              </div>
              <div className="pricing-table">
                <div className="pricing-header">
                  <h3>Xét nghiệm ADN hành chính</h3>
                </div>
                <div className="pricing-body">
                  <table className="price-table">
                    <thead>
                      <tr>
                        <th>Loại xét nghiệm</th>
                        <th>Giá (VNĐ)</th>
                        <th>Người thứ 3</th>
                        <th>Thời gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingData && pricingData.admin && pricingData.admin.map((service) => (
                        <tr key={service.id}>
                          <td>{service.name}</td>
                          <td>{new Intl.NumberFormat("vi-VN").format(service.price)}</td>
                          <td>{new Intl.NumberFormat("vi-VN").format(service.additionalPrice)}</td>
                          <td>{service.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pricing-note">
                    <p>* Giá trên đã bao gồm VAT và phí công chứng kết quả</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Registration Form */}
          {/* Đã chuyển form đăng ký sang trang Đăng kí riêng */}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
