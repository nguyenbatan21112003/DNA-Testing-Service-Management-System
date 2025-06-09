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

const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState("civil");
  const location = useLocation();
  const [category, setCategory] = useState("civil");
  const [serviceType, setServiceType] = useState("");
  const [sampleMethod, setSampleMethod] = useState("");
  const { addOrder } = useOrderContext();
  const [showToast, setShowToast] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [readGuide, setReadGuide] = useState(false);

  const serviceOptions = {
    civil: [
      { value: "civil-paternity", label: "Xét nghiệm ADN dân sự - Cha con" },
      { value: "civil-maternity", label: "Xét nghiệm ADN dân sự - Mẹ con" },
      { value: "civil-siblings", label: "Xét nghiệm ADN dân sự - Anh chị em" },
      { value: "civil-relatives", label: "Xét nghiệm ADN dân sự - Họ hàng" },
      { value: "civil-ancestry", label: "Xét nghiệm ADN dân sự - Nguồn gốc" },
      {
        value: "civil-health",
        label: "Xét nghiệm ADN dân sự - Sức khỏe di truyền",
      },
      { value: "civil-express", label: "Xét nghiệm ADN dân sự - Nhanh" },
    ],
    admin: [
      { value: "admin-birth", label: "Xét nghiệm ADN hành chính - Khai sinh" },
      {
        value: "admin-immigration",
        label: "Xét nghiệm ADN hành chính - Di trú",
      },
      {
        value: "admin-inheritance",
        label: "Xét nghiệm ADN hành chính - Thừa kế",
      },
      {
        value: "admin-dispute",
        label: "Xét nghiệm ADN hành chính - Tranh chấp",
      },
      { value: "admin-express", label: "Xét nghiệm ADN hành chính - Nhanh" },
    ],
  };

  const sampleMethodOptions = {
    civil: [
      { value: "center", label: "Tại trung tâm" },
      {
        value: "home",
        label: `Tự nguyện Thu mẫu tại nhà
        (gửi bộ kit về nhà)`,
      },
    ],
    admin: [{ value: "center", label: "Tại trung tâm" }],
  };

  // Lấy ngày hôm nay theo định dạng yyyy-mm-dd
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (category === "civil" && sampleMethod === "home" && !readGuide) {
      alert("Bạn cần xác nhận đã đọc và hiểu quy trình tự thu mẫu tại nhà.");
      return;
    }
    if (!agreed) {
      alert("Bạn cần xác nhận cam kết pháp lý và tự nguyện để tiếp tục.");
      return;
    }
    const form = e.target;
    const newOrder = {
      id: "DNA" + Date.now(),
      type: form.serviceType.options[form.serviceType.selectedIndex].text,
      date: new Date().toLocaleDateString("vi-VN"),
      price: 0, // Có thể lấy giá từ bảng giá nếu muốn
      status: "Chờ xử lý",
      name: form.fullName.value,
      phone: form.phone.value,
      email: form.email.value,
      address: form.address.value,
      appointmentDate: form.appointmentDate.value,
      category: form.category.value,
      sampleMethod: form.sampleMethod.value,
      note: form.message.value,
    };
    addOrder(newOrder);
    form.reset();
    setAgreed(false);
    setShowToast(true);
    setReadGuide(false);
    setTimeout(() => setShowToast(false), 2500);
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
                  className={`tab-button ${activeTab === "civil" ? "active" : ""
                    }`}
                  onClick={() => handleTabChange("civil")}
                >
                  Xét nghiệm ADN dân sự
                </button>
                <button
                  className={`tab-button ${activeTab === "administrative" ? "active" : ""
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
                        <a href="#registration" className="service-button">
                          Đăng ký xét nghiệm <ChevronRight size={16} />
                        </a>
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
                        <a href="#registration" className="service-button">
                          Đăng ký xét nghiệm <ChevronRight size={16} />
                        </a>
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
                      <tr>
                        <td>Xét nghiệm cha con</td>
                        <td>4.500.000</td>
                        <td>1.800.000</td>
                        <td>3-5 ngày</td>
                      </tr>
                      <tr>
                        <td>Xét nghiệm mẹ con</td>
                        <td>4.500.000</td>
                        <td>1.800.000</td>
                        <td>3-5 ngày</td>
                      </tr>
                      <tr>
                        <td>Xét nghiệm anh chị em ruột</td>
                        <td>6.000.000</td>
                        <td>2.000.000</td>
                        <td>5-7 ngày</td>
                      </tr>
                      <tr>
                        <td>Xét nghiệm họ hàng</td>
                        <td>7.500.000</td>
                        <td>2.000.000</td>
                        <td>7-10 ngày</td>
                      </tr>
                      <tr>
                        <td>Xét nghiệm nguồn gốc</td>
                        <td>4.500.000</td>
                        <td>2.000.000</td>
                        <td>3-5 ngày</td>
                      </tr>
                      <tr>
                        <td>Xét nghiệm sức khỏe di truyền</td>
                        <td>6.000.000</td>
                        <td>2.000.000</td>
                        <td>4-6 ngày</td>
                      </tr>
                      <tr>
                        <td>Xét nghiệm nhanh</td>
                        <td>6.500.000</td>
                        <td>3.000.000</td>
                        <td>24-48 giờ</td>
                      </tr>
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
                      <tr>
                        <td>Xét nghiệm ADN khai sinh</td>
                        <td>6.500.000</td>
                        <td>2.000.000</td>
                        <td>5-7 ngày</td>
                      </tr>
                      <tr>
                        <td>Xét nghiệm ADN di trú</td>
                        <td>8.500.000</td>
                        <td>2.000.000</td>
                        <td>7-10 ngày</td>
                      </tr>
                      <tr>
                        <td>Xét nghiệm ADN thừa kế</td>
                        <td>7.500.000</td>
                        <td>2.000.000</td>
                        <td>5-7 ngày</td>
                      </tr>
                      <tr>
                        <td>Xét nghiệm ADN tranh chấp</td>
                        <td>8.000.000</td>
                        <td>2.000.000</td>
                        <td>5-7 ngày</td>
                      </tr>
                      <tr>
                        <td>Xét nghiệm hành chính nhanh</td>
                        <td>10.000.000</td>
                        <td>3.000.000</td>
                        <td>48-72 giờ</td>
                      </tr>
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
          <section className="service-registration" id="registration">
            <div className="section-header">
              <div className="section-icon">
                <FileText size={24} />
              </div>
              <h2>Đăng ký dịch vụ xét nghiệm</h2>
            </div>
            <div className="registration-description">
              <p>
                Vui lòng điền đầy đủ thông tin vào form dưới đây để đăng ký dịch
                vụ xét nghiệm ADN. Chúng tôi sẽ liên hệ với bạn trong thời gian
                sớm nhất.
              </p>
            </div>
            <div className="service-form-container">
              {showToast && (
                <div
                  style={{
                    position: "fixed",
                    top: 24,
                    right: 24,
                    zIndex: 9999,
                    background: "#009e74",
                    color: "#fff",
                    padding: "16px 32px",
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 18,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                    transition: "opacity 0.3s",
                  }}
                >
                  🎉 Đăng ký dịch vụ thành công!
                </div>
              )}
              <form className="service-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Họ và tên</label>
                    <input type="text" id="fullName" name="fullName" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input type="tel" id="phone" name="phone" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Địa chỉ</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Càng chi tiết càng tốt"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Thể loại xét nghiệm</label>
                    <select
                      id="category"
                      name="category"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setServiceType("");
                        setSampleMethod("");
                      }}
                      required
                    >
                      <option value="civil">Dân sự</option>
                      <option value="admin">Hành chính</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="serviceType">Loại dịch vụ</label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      required
                    >
                      <option value="">Chọn loại dịch vụ</option>
                      {serviceOptions[category].map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="sampleMethod"
                      style={{
                        display: "block",
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      Chọn hình thức thu mẫu
                    </label>
                    <div
                      style={{
                        display: "flex",
                        gap: 32,
                        alignItems: "center",
                        flexWrap: "nowrap",
                      }}
                    >
                      {sampleMethodOptions[category].map((opt) => (
                        <label
                          key={opt.value}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <input
                            type="radio"
                            id={`sampleMethod-${opt.value}`}
                            name="sampleMethod"
                            value={opt.value}
                            checked={sampleMethod === opt.value}
                            onChange={(e) => setSampleMethod(e.target.value)}
                            required
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="appointmentDate">Ngày xét nghiệm</label>
                    <input
                      type="date"
                      id="appointmentDate"
                      name="appointmentDate"
                      required
                      min={minDate}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Ghi chú thêm</label>
                  <textarea id="message" name="message" rows="4"></textarea>
                </div>
                {/* Link tải Đơn Yêu Cầu Xét Nghiệm luôn hiển thị */}
                <div
                  style={{
                    margin: "18px 0 10px 0",
                    background: "#f6f8fa",
                    border: "1px solid #cce3d3",
                    borderRadius: 8,
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#009e74",
                      marginBottom: 8,
                    }}
                  >
                    Tải Đơn Yêu Cầu Xét Nghiệm và hướng dẫn:
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <a
                      href="/DonYeuCauXetNghiem.docx"
                      download
                      style={{
                        color: "#0a7cff",
                        textDecoration: "underline",
                        fontWeight: 500,
                      }}
                    >
                      Tải Đơn Yêu Cầu Xét Nghiệm
                    </a>
                  </div>
                </div>
                {/* Hướng dẫn tự thu mẫu tại nhà */}
                {category === "civil" && sampleMethod === "home" && (
                  <div
                    style={{
                      background: "#f6f8fa",
                      border: "1px solid #cce3d3",
                      borderRadius: 8,
                      padding: 20,
                      margin: "18px 0 10px 0",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#009e74",
                        marginBottom: 8,
                      }}
                    >
                      Quy trình tự thu mẫu tại nhà:
                    </div>
                    <ul
                      style={{
                        marginLeft: 18,
                        marginBottom: 10,
                        paddingLeft: 18,
                      }}
                    >
                      <li>
                        Nhận bộ kit gồm hướng dẫn thu mẫu và Đơn Yêu Cầu Xét
                        Nghiệm.
                      </li>
                      <li>
                        Tự thu mẫu theo hướng dẫn, điền đầy đủ Đơn Yêu Cầu Xét
                        Nghiệm.
                      </li>
                      <li>
                        Gửi lại bộ kit đã sử dụng (gồm mẫu và đơn) về trung tâm
                        theo hướng dẫn kèm trong kit.
                      </li>
                    </ul>
                    <div style={{ marginBottom: 6 }}>
                      <a
                        href="/Giấy%20xác%20nhận%20là%20sinh%20viên%20.docx"
                        download
                        style={{
                          color: "#0a7cff",
                          textDecoration: "underline",
                          fontWeight: 500,
                          marginRight: 18,
                        }}
                      >
                        Tải hướng dẫn thu mẫu
                      </a>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 15,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={readGuide}
                          onChange={(e) => setReadGuide(e.target.checked)}
                          required
                        />
                        <span>
                          Tôi đã đọc và hiểu quy trình tự thu mẫu tại nhà.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 15,
                      fontWeight: 400,
                      color: "#333",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      required
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: "#009e74",
                        marginRight: 8,
                      }}
                    />
                    <span style={{ lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 500, color: "#009e74" }}>
                        Tôi cam kết và tự nguyện
                      </span>{" "}
                      đăng ký dịch vụ, đồng ý với các
                      <a
                        href="/vechungtoi#dieu-khoan"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#009e74",
                          textDecoration: "underline",
                          marginLeft: 4,
                        }}
                      >
                        điều khoản pháp lý
                      </a>
                      <span> của trung tâm.</span>
                    </span>
                  </label>
                </div>
                <div className="form-group">
                  <button type="submit" className="submit-button">
                    Đăng ký dịch vụ
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
