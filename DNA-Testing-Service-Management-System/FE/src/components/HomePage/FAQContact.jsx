"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";

const FAQContact = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Xét nghiệm ADN có đau không?",
      answer:
        "Không, xét nghiệm ADN hoàn toàn không gây đau đớn. Quá trình lấy mẫu thường chỉ là lấy tế bào má bằng tăm bông đặc biệt hoặc lấy mẫu tóc, nước bọt.",
    },
    {
      question: "Kết quả xét nghiệm mất bao lâu?",
      answer:
        "Thời gian trả kết quả xét nghiệm ADN thông thường là từ 3-5 ngày làm việc kể từ khi phòng xét nghiệm nhận được mẫu. Đối với các trường hợp khẩn cấp, chúng tôi có dịch vụ xét nghiệm nhanh với thời gian từ 24-48 giờ.",
    },
    {
      question: "Độ chính xác của xét nghiệm ADN là bao nhiêu?",
      answer:
        "Xét nghiệm ADN của chúng tôi có độ chính xác lên đến 99.99% đối với xét nghiệm xác định quan hệ cha con và trên 99.9% đối với các loại xét nghiệm khác.",
    },
  ];

  return (
    <section className="faq-contact">
      <div className="container">
        <div className="faq-contact-wrapper">
          <div className="faq-section">
            <h2>Câu hỏi thường gặp</h2>
            <p className="section-description">
              Tìm hiểu thêm về dịch vụ xét nghiệm ADN của chúng tôi qua các câu
              hỏi thường gặp.
            </p>

            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div
                  className={`faq-item ${openIndex === index ? "open" : ""}`}
                  key={index}
                >
                  <div
                    className="faq-question"
                    onClick={() => toggleQuestion(index)}
                  >
                    <h3>
                      <span className="question-icon">▶</span> {faq.question}
                    </h3>
                    <span className="faq-icon">
                      {openIndex === index ? <ChevronUp /> : <ChevronDown />}
                    </span>
                  </div>
                  {openIndex === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="contact-section">
            <h2>Liên hệ với chúng tôi</h2>
            <p className="section-description">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn.
            </p>

            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <Phone className="contact-icon" />
                </div>
                <div className="contact-details">
                  <h3>Điện thoại</h3>
                  <p>0123 456 789</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <Mail className="contact-icon" />
                </div>
                <div className="contact-details">
                  <h3>Email</h3>
                  <p>info@dnalab.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <MapPin className="contact-icon" />
                </div>
                <div className="contact-details">
                  <h3>Địa chỉ</h3>
                  <p>123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM</p>
                </div>
              </div>
            </div>

            <a href="#contact-form" className="contact-button">
              Liên hệ ngay
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQContact;
