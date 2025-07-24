"use client";

import { useState, useEffect } from "react";
import {
  Building,
  FileText,
  Shield,
  Users,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useLocation } from "react-router-dom";

const AboutUsPage = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const location = useLocation();

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  useEffect(() => {
    // Scroll đến phần theo hash trên URL
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    if (location.state && location.state.scrollToPricing) {
      setTimeout(() => {
        const section = document.querySelector(".pricing-section");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="about-us-page">
      {/* Banner */}
      <div className="about-banner">
        <div className="container">
          <h1>Về chúng tôi</h1>
          <p>Tìm hiểu thêm về DNA Lab và đội ngũ chuyên gia của chúng tôi</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="about-content">
          {/* Clinic Information */}
          <section className="about-section" id="gioi-thieu">
            <div className="section-header">
              <div className="section-icon">
                <Building size={24} />
              </div>
              <h2>Thông tin phòng khám</h2>
            </div>
            <div className="clinic-info">
              <div className="clinic-description">
                <h3>DNA Lab - Trung tâm xét nghiệm ADN hàng đầu Việt Nam</h3>
                <p>
                  DNA Lab được thành lập vào năm 2010, là một trong những trung
                  tâm xét nghiệm ADN đầu tiên tại Việt Nam. Với hơn 13 năm kinh
                  nghiệm, chúng tôi tự hào là đơn vị tiên phong trong lĩnh vực
                  xét nghiệm ADN với công nghệ hiện đại và đội ngũ chuyên gia
                  hàng đầu.
                </p>
                <p>
                  Phòng xét nghiệm của chúng tôi được trang bị các thiết bị hiện
                  đại nhập khẩu từ Mỹ, Đức và Nhật Bản, đảm bảo kết quả xét
                  nghiệm chính xác lên đến 99.99%. Chúng tôi tuân thủ nghiêm
                  ngặt các quy trình kiểm soát chất lượng theo tiêu chuẩn quốc
                  tế ISO 17025 và ISO 9001:2015.
                </p>
                <p>
                  DNA Lab hiện có 5 chi nhánh trên toàn quốc, phục vụ hơn 10,000
                  khách hàng mỗi năm. Chúng tôi cung cấp đa dạng các dịch vụ xét
                  nghiệm ADN từ xác định huyết thống, xét nghiệm di truyền đến
                  các xét nghiệm ADN phục vụ mục đích pháp lý và hành chính.
                </p>
              </div>

              <div className="clinic-stats">
                <div className="stat-item">
                  <div className="stat-number">13+</div>
                  <div className="stat-label">Năm kinh nghiệm</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">5</div>
                  <div className="stat-label">Chi nhánh toàn quốc</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">20+</div>
                  <div className="stat-label">Chuyên gia</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Khách hàng mỗi năm</div>
                </div>
              </div>

              <div className="clinic-facilities" id="phong-xet-nghiem">
                <h3>Cơ sở vật chất</h3>
                <div className="facilities-grid">
                  <div className="facility-item">
                    <img src="/DNA.jpg" alt="Phòng xét nghiệm DNA Lab" />
                    <h4>Phòng xét nghiệm hiện đại</h4>
                  </div>
                  <div className="facility-item">
                    <img
                      src="/lab-equipment.jpg"
                      alt="Thiết bị xét nghiệm hiện đại"
                    />
                    <h4>Thiết bị tiên tiến</h4>
                  </div>
                  <div className="facility-item">
                    <img src="/reception.jpg" alt="Không gian tiếp đón" />
                    <h4>Không gian tiếp đón</h4>
                  </div>
                  <div className="facility-item">
                    <img src="/waiting-room.jpg" alt="Phòng chờ tiện nghi" />
                    <h4>Phòng chờ tiện nghi</h4>
                  </div>
                  <div className="facility-item">
                    <img
                      src="/sample-room.jpg"
                      alt="Phòng lấy mẫu riêng biệt"
                    />
                    <h4>Phòng lấy mẫu riêng biệt</h4>
                  </div>
                  <div className="facility-item">
                    <img
                      src="/consulting-room.jpg"
                      alt="Phòng tư vấn chuyên nghiệp"
                    />
                    <h4>Nhân viên chuyên nghiệp</h4>
                  </div>
                </div>
              </div>

              <div className="clinic-hours">
                <h3>Giờ làm việc</h3>
                <div className="hours-grid">
                  <div className="hours-item">
                    <div className="day">Thứ Hai - Thứ Sáu</div>
                    <div className="time">8:00 - 17:30</div>
                  </div>
                  <div className="hours-item">
                    <div className="day">Thứ Bảy</div>
                    <div className="time">8:00 - 12:00</div>
                  </div>
                  <div className="hours-item">
                    <div className="day">Chủ Nhật</div>
                    <div className="time">Nghỉ</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Terms and Conditions */}
          <section className="about-section" id="dieu-khoan">
            <div className="section-header">
              <div className="section-icon">
                <FileText size={24} />
              </div>
              <h2>Điều khoản và điều kiện</h2>
            </div>
            <div className="terms-content">
              <div className="accordion-container">
                <div
                  className={`accordion-item ${
                    activeAccordion === 0 ? "active" : ""
                  }`}
                >
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion(0)}
                  >
                    <h3>1. Điều khoản sử dụng dịch vụ</h3>
                    <span className="accordion-icon">
                      {activeAccordion === 0 ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </span>
                  </div>
                  {activeAccordion === 0 && (
                    <div className="accordion-content">
                      <p>
                        Bằng việc sử dụng dịch vụ xét nghiệm ADN của DNA Lab,
                        khách hàng đồng ý tuân thủ các điều khoản và điều kiện
                        sau:
                      </p>
                      <ul>
                        <li>
                          Khách hàng cam kết cung cấp thông tin chính xác và đầy
                          đủ khi đăng ký sử dụng dịch vụ. Mọi thông tin sai lệch
                          có thể ảnh hưởng đến kết quả xét nghiệm.
                        </li>
                        <li>
                          Khách hàng đồng ý tuân thủ các hướng dẫn và quy trình
                          lấy mẫu của DNA Lab để đảm bảo kết quả chính xác.
                        </li>
                        <li>
                          DNA Lab có quyền từ chối cung cấp dịch vụ nếu phát
                          hiện khách hàng vi phạm các quy định của pháp luật
                          hoặc đạo đức nghề nghiệp.
                        </li>
                        <li>
                          Khách hàng chịu trách nhiệm về việc sử dụng kết quả
                          xét nghiệm ADN. DNA Lab không chịu trách nhiệm về các
                          hậu quả phát sinh từ việc sử dụng kết quả xét nghiệm.
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div
                  className={`accordion-item ${
                    activeAccordion === 1 ? "active" : ""
                  }`}
                >
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion(1)}
                  >
                    <h3>2. Quy định thanh toán</h3>
                    <span className="accordion-icon">
                      {activeAccordion === 1 ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </span>
                  </div>
                  {activeAccordion === 1 && (
                    <div className="accordion-content">
                      <p>
                        DNA Lab áp dụng các phương thức thanh toán và quy định
                        sau:
                      </p>
                      <ul>
                        <li>
                          Khách hàng phải thanh toán đầy đủ phí dịch vụ trước
                          khi tiến hành xét nghiệm. Đối với một số dịch vụ đặc
                          biệt, khách hàng có thể được yêu cầu đặt cọc trước.
                        </li>
                        <li>
                          Các phương thức thanh toán được chấp nhận: tiền mặt,
                          chuyển khoản ngân hàng, thẻ tín dụng/ghi nợ, và các ví
                          điện tử (MoMo, ZaloPay, VNPay).
                        </li>
                        <li>
                          Trường hợp khách hàng hủy dịch vụ sau khi đã thanh
                          toán, phí hoàn trả sẽ được áp dụng theo quy định cụ
                          thể tùy thuộc vào thời điểm hủy và trạng thái xét
                          nghiệm.
                        </li>
                        <li>
                          Đối với dịch vụ xét nghiệm ADN hành chính, khách hàng
                          cần thanh toán toàn bộ chi phí bao gồm phí công chứng
                          và các chi phí phát sinh khác.
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div
                  className={`accordion-item ${
                    activeAccordion === 2 ? "active" : ""
                  }`}
                >
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion(2)}
                  >
                    <h3>3. Chính sách hoàn tiền và hủy dịch vụ</h3>
                    <span className="accordion-icon">
                      {activeAccordion === 2 ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </span>
                  </div>
                  {activeAccordion === 2 && (
                    <div className="accordion-content">
                      <p>
                        DNA Lab áp dụng chính sách hoàn tiền và hủy dịch vụ như
                        sau:
                      </p>
                      <ul>
                        <li>
                          Khách hàng có thể hủy dịch vụ và được hoàn 100% phí
                          nếu thông báo trước ít nhất 48 giờ trước thời điểm hẹn
                          lấy mẫu.
                        </li>
                        <li>
                          Nếu khách hàng hủy dịch vụ trong vòng 24-48 giờ trước
                          thời điểm hẹn, sẽ được hoàn 50% phí dịch vụ.
                        </li>
                        <li>
                          Nếu khách hàng hủy dịch vụ trong vòng 24 giờ trước
                          thời điểm hẹn hoặc không đến theo lịch hẹn, sẽ không
                          được hoàn phí.
                        </li>
                        <li>
                          Trường hợp DNA Lab không thể cung cấp dịch vụ vì lý do
                          kỹ thuật hoặc bất khả kháng, khách hàng sẽ được hoàn
                          100% phí dịch vụ hoặc được sắp xếp lịch hẹn mới.
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div
                  className={`accordion-item ${
                    activeAccordion === 3 ? "active" : ""
                  }`}
                >
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion(3)}
                  >
                    <h3>4. Giải quyết tranh chấp</h3>
                    <span className="accordion-icon">
                      {activeAccordion === 3 ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </span>
                  </div>
                  {activeAccordion === 3 && (
                    <div className="accordion-content">
                      <p>Quy trình giải quyết tranh chấp của DNA Lab:</p>
                      <ul>
                        <li>
                          Mọi tranh chấp phát sinh liên quan đến dịch vụ xét
                          nghiệm ADN sẽ được giải quyết thông qua thương lượng,
                          hòa giải giữa các bên.
                        </li>
                        <li>
                          Khách hàng có thể gửi khiếu nại bằng văn bản đến địa
                          chỉ email: support@dnalab.com.vn hoặc gọi đến số
                          hotline: 0987 654 321.
                        </li>
                        <li>
                          DNA Lab cam kết phản hồi mọi khiếu nại trong vòng 48
                          giờ làm việc và giải quyết trong thời gian sớm nhất.
                        </li>
                        <li>
                          Trường hợp không thể giải quyết thông qua thương
                          lượng, tranh chấp sẽ được đưa ra cơ quan có thẩm quyền
                          giải quyết theo quy định của pháp luật Việt Nam.
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Policies */}
          <section className="about-section" id="chinh-sach">
            <div className="section-header">
              <div className="section-icon">
                <Shield size={24} />
              </div>
              <h2>Chính sách</h2>
            </div>
            <div className="policies-content">
              <div className="policy-tabs">
                <div className="policy-item">
                  <h3>Chính sách bảo mật thông tin</h3>
                  <div className="policy-description">
                    <p>
                      DNA Lab cam kết bảo vệ thông tin cá nhân và kết quả xét
                      nghiệm của khách hàng theo các nguyên tắc sau:
                    </p>
                    <ul>
                      <li>
                        Mọi thông tin cá nhân và kết quả xét nghiệm của khách
                        hàng được bảo mật tuyệt đối và chỉ được tiết lộ khi có
                        yêu cầu của cơ quan có thẩm quyền hoặc được sự đồng ý
                        của khách hàng.
                      </li>
                      <li>
                        Dữ liệu của khách hàng được lưu trữ trên hệ thống máy
                        chủ an toàn với các biện pháp bảo mật cao cấp, bao gồm
                        mã hóa dữ liệu và hệ thống phòng chống xâm nhập.
                      </li>
                      <li>
                        Nhân viên của DNA Lab được đào tạo về quy trình bảo mật
                        và ký cam kết bảo mật thông tin khách hàng.
                      </li>
                      <li>
                        Kết quả xét nghiệm chỉ được gửi trực tiếp cho khách hàng
                        hoặc người được ủy quyền hợp pháp, và được mã hóa khi
                        gửi qua email.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="policy-item">
                  <h3>Chính sách chất lượng</h3>
                  <div className="policy-description">
                    <p>
                      DNA Lab cam kết duy trì chất lượng dịch vụ xét nghiệm ADN
                      theo tiêu chuẩn quốc tế với các biện pháp sau:
                    </p>
                    <ul>
                      <li>
                        Áp dụng hệ thống quản lý chất lượng theo tiêu chuẩn ISO
                        17025 và ISO 9001:2015 trong toàn bộ quy trình xét
                        nghiệm.
                      </li>
                      <li>
                        Sử dụng thiết bị và công nghệ hiện đại, được kiểm định
                        và bảo trì định kỳ để đảm bảo độ chính xác cao nhất.
                      </li>
                      <li>
                        Thực hiện kiểm soát chất lượng nội bộ và tham gia các
                        chương trình kiểm định chất lượng quốc tế định kỳ.
                      </li>
                      <li>
                        Đào tạo và cập nhật kiến thức thường xuyên cho đội ngũ
                        chuyên gia và kỹ thuật viên để đảm bảo trình độ chuyên
                        môn cao.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="policy-item">
                  <h3>Chính sách bảo hành và tái xét nghiệm</h3>
                  <div className="policy-description">
                    <p>
                      DNA Lab áp dụng chính sách bảo hành và tái xét nghiệm như
                      sau:
                    </p>
                    <ul>
                      <li>
                        Trường hợp kết quả xét nghiệm không rõ ràng hoặc có nghi
                        ngờ về độ chính xác, DNA Lab sẽ tiến hành tái xét nghiệm
                        miễn phí.
                      </li>
                      <li>
                        Nếu khách hàng yêu cầu tái xét nghiệm để xác nhận kết
                        quả, phí tái xét nghiệm sẽ được áp dụng theo quy định
                        hiện hành.
                      </li>
                      <li>
                        Đối với xét nghiệm ADN hành chính, DNA Lab cam kết hỗ
                        trợ khách hàng trong quá trình sử dụng kết quả cho các
                        thủ tục pháp lý.
                      </li>
                      <li>
                        Thời hạn bảo hành kết quả xét nghiệm là 6 tháng kể từ
                        ngày trả kết quả. Trong thời gian này, khách hàng có thể
                        yêu cầu giải thích hoặc tư vấn thêm về kết quả xét
                        nghiệm.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Medical Team */}
          <section className="about-section" id="doi-ngu">
            <div className="section-header">
              <div className="section-icon">
                <Users size={24} />
              </div>
              <h2>Đội ngũ bác sĩ và chuyên gia</h2>
            </div>
            <div className="team-content">
              <div className="team-description">
                <p>
                  DNA Lab tự hào sở hữu đội ngũ bác sĩ, tiến sĩ và chuyên gia
                  hàng đầu trong lĩnh vực di truyền học và sinh học phân tử. Đội
                  ngũ của chúng tôi không chỉ có trình độ chuyên môn cao mà còn
                  giàu kinh nghiệm trong lĩnh vực xét nghiệm ADN.
                </p>
              </div>

              <div className="team-members">
                <div className="team-member">
                  <div className="member-image">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="GS.TS. Nguyễn Văn A"
                    />
                  </div>
                  <div className="member-info">
                    <h3>GS.TS. Nguyễn Văn A</h3>
                    <p className="member-title">Giám đốc khoa học</p>
                    <p className="member-description">
                      GS.TS. Nguyễn Văn A tốt nghiệp Tiến sĩ Di truyền học tại
                      Đại học Harvard (Mỹ), với hơn 20 năm kinh nghiệm trong
                      lĩnh vực nghiên cứu và ứng dụng di truyền học. Ông là tác
                      giả của hơn 50 công trình nghiên cứu được đăng trên các
                      tạp chí quốc tế uy tín.
                    </p>
                    <div className="member-specialties">
                      <h4>Chuyên môn:</h4>
                      <ul>
                        <li>Di truyền học phân tử</li>
                        <li>Xét nghiệm ADN pháp y</li>
                        <li>Nghiên cứu gen di truyền</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="team-member">
                  <div className="member-image">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="PGS.TS. Trần Thị B"
                    />
                  </div>
                  <div className="member-info">
                    <h3>PGS.TS. Trần Thị B</h3>
                    <p className="member-title">Trưởng phòng xét nghiệm</p>
                    <p className="member-description">
                      PGS.TS. Trần Thị B tốt nghiệp Tiến sĩ Sinh học phân tử tại
                      Đại học Tokyo (Nhật Bản), với 15 năm kinh nghiệm trong
                      lĩnh vực xét nghiệm ADN. Bà đã tham gia nhiều dự án nghiên
                      cứu quốc tế và là chuyên gia tư vấn cho nhiều tổ chức y
                      tế.
                    </p>
                    <div className="member-specialties">
                      <h4>Chuyên môn:</h4>
                      <ul>
                        <li>Sinh học phân tử</li>
                        <li>Xét nghiệm huyết thống</li>
                        <li>Phân tích ADN di truyền</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="team-member">
                  <div className="member-image">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="TS.BS. Lê Văn C"
                    />
                  </div>
                  <div className="member-info">
                    <h3>TS.BS. Lê Văn C</h3>
                    <p className="member-title">Trưởng khoa tư vấn di truyền</p>
                    <p className="member-description">
                      TS.BS. Lê Văn C tốt nghiệp Tiến sĩ Y khoa chuyên ngành Di
                      truyền y học tại Đại học Stanford (Mỹ). Ông có 12 năm kinh
                      nghiệm trong lĩnh vực tư vấn di truyền và xét nghiệm ADN.
                      Ông đã giúp hàng nghìn gia đình giải quyết các vấn đề về
                      huyết thống và di truyền.
                    </p>
                    <div className="member-specialties">
                      <h4>Chuyên môn:</h4>
                      <ul>
                        <li>Di truyền y học</li>
                        <li>Tư vấn di truyền gia đình</li>
                        <li>Xét nghiệm ADN tiền hôn nhân</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="team-member">
                  <div className="member-image">
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="ThS. Phạm Thị D"
                    />
                  </div>
                  <div className="member-info">
                    <h3>ThS. Phạm Thị D</h3>
                    <p className="member-title">Chuyên gia phân tích dữ liệu</p>
                    <p className="member-description">
                      ThS. Phạm Thị D tốt nghiệp Thạc sĩ Tin sinh học tại Đại
                      học Melbourne (Úc). Chị có 8 năm kinh nghiệm trong lĩnh
                      vực phân tích dữ liệu di truyền và phát triển các thuật
                      toán phân tích ADN. Chị đã tham gia phát triển nhiều phần
                      mềm phân tích ADN được sử dụng rộng rãi.
                    </p>
                    <div className="member-specialties">
                      <h4>Chuyên môn:</h4>
                      <ul>
                        <li>Tin sinh học</li>
                        <li>Phân tích dữ liệu di truyền</li>
                        <li>Phát triển thuật toán ADN</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="team-certifications">
                <h3>Chứng chỉ và thành tựu</h3>
                <div className="certifications-grid">
                  <div className="certification-item">
                    <img
                      src="/placeholder.svg?height=100&width=200"
                      alt="Chứng nhận ISO 17025"
                    />
                    <p>Chứng nhận ISO 17025</p>
                  </div>
                  <div className="certification-item">
                    <img
                      src="/placeholder.svg?height=100&width=200"
                      alt="Chứng nhận ISO 9001:2015"
                    />
                    <p>Chứng nhận ISO 9001:2015</p>
                  </div>
                  <div className="certification-item">
                    <img
                      src="/placeholder.svg?height=100&width=200"
                      alt="Giải thưởng Chất lượng Quốc gia"
                    />
                    <p>Giải thưởng Chất lượng Quốc gia</p>
                  </div>
                  <div className="certification-item">
                    <img
                      src="/placeholder.svg?height=100&width=200"
                      alt="Thành viên Hiệp hội Di truyền Quốc tế"
                    />
                    <p>Thành viên Hiệp hội Di truyền Quốc tế</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
