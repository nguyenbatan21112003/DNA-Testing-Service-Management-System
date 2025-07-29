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
import "react-datepicker/dist/react-datepicker.css";
import serviceApi from "../../api/serviceApi";
import blogApi from "../../api/blogApi";

const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState("Voluntary");
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Fetch blogs from BE
  const fetchBlogs = async () => {
    try {
      const response = await blogApi.getBlogs();
      // console.log(response);
      setBlogs(Array.isArray(response.data)? response.data : []);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await serviceApi.getServices();
      // console.log(response.data);
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("error fetching services:", error);
    }
  };

  useEffect(() => {
    // Scroll đến phần dịch vụ theo hash trên URL
    fetchBlogs();
    fetchServices();
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      // Nếu là dịch vụ hành chính thì tự động chuyển tab
      if (id === "hanh-chinh") setActiveTab("Administrative");
      if (["huyet-thong", "nguon-goc", "suc-khoe"].includes(id))
        setActiveTab("Voluntary");
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
                    activeTab === "Voluntary" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("Voluntary")}
                >
                  Xét nghiệm ADN dân sự
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "Administrative" ? "active" : ""
                  }`}
                  onClick={() => handleTabChange("Administrative")}
                >
                  Xét nghiệm ADN hành chính
                </button>
              </div>
              <div className="tabs-content">
                {activeTab === "Voluntary" && (
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
                        {services
                          .filter((service) => service.category == "Voluntary")
                          .map((service) => (
                            <div
                              className="service-type-card"
                              id={service.slug}
                              key={service.id}
                            >
                              <div className="service-type-icon">
                                <CheckCircle size={20} />
                              </div>
                              <div className="service-type-content">
                                <h4>{service.serviceName}</h4>
                                <p>{service.description}</p>
                              </div>
                            </div>
                          ))}
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
                {activeTab === "Administrative" && (
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
                        {services
                          .filter(
                            (service) => service.category == "Administrative"
                          )
                          .map((service) => (
                            <div
                              className="service-type-card"
                              id={service.slug}
                              key={service.id}
                            >
                              <div className="service-type-icon">
                                <CheckCircle size={20} />
                              </div>
                              <div className="service-type-content">
                                <h4>{service.serviceName}</h4>
                                <p>{service.description}</p>
                              </div>
                            </div>
                          ))}
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
              {blogs.slice(0, 3).map((blog) => (
                <div className="blog-card" key={blog.postId}>
                  <div className="blog-image">
                    <img
                      src={blog.thumbnailURL || "/Blog.jpg"}
                      alt={blog.title}
                      height={200}
                      width={300}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/Blog.jpg";
                      }}
                    />
                  </div>
                  <div className="blog-content">
                    <Link to={`/tintuc#${blog.slug}`}>
                      <h3 style={{ color: "black" }}>{blog.title}</h3>
                    </Link>
                    <p>{blog.summary}</p>
                    <Link to={`/tintuc#${blog.slug}`} className="blog-link">
                      Đọc thêm <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
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
                      {services &&
                        services
                          .filter((service) => service.category == "Voluntary")
                          .map((service) => (
                            <tr key={service.id}>
                              <td>{service.serviceName}</td>
                              <td>
                                {new Intl.NumberFormat("vi-VN").format(
                                  service.price2Samples
                                )}
                              </td>
                              <td>
                                {new Intl.NumberFormat("vi-VN").format(
                                  service.price3Samples
                                )}
                              </td>
                              <td>{service.timeToResult}</td>
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
                      {services &&
                        services
                          .filter(
                            (service) => service.category == "Administrative"
                          )
                          .map((service) => (
                            <tr key={service.id}>
                              <td>{service.serviceName}</td>
                              <td>
                                {new Intl.NumberFormat("vi-VN").format(
                                  service.price2Samples
                                )}
                              </td>
                              <td>
                                {new Intl.NumberFormat("vi-VN").format(
                                  service.price3Samples
                                )}
                              </td>
                              <td>{service.timeToResult}</td>
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
