"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Map,
  Heart,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TestingTypes = () => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const navigate = useNavigate();

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      // Check initial state
      handleScroll();
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleLearnMore = () => {
    navigate("/dichvu", { state: { scrollToPricing: true } });
  };

  const testingTypes = [
    {
      id: 1,
      title: "Xét nghiệm huyết thống",
      description:
        "Xác định mối quan hệ cha con, mẹ con hoặc các mối quan hệ huyết thống khác với độ chính xác lên đến 99.99%.",
      icon: <Users className="service-icon" />,
      features: [
        "Kết quả trong 3-5 ngày",
        "Độ chính xác 99.99%",
        "Bảo mật thông tin",
      ],
    },
    {
      id: 2,
      title: "Xét nghiệm nguồn gốc",
      description: "Khám phá nguồn gốc tổ tiên và di truyền dân tộc của bạn.",
      icon: <Map className="service-icon" />,
      features: [
        "Phân tích 54 nhóm",
        "Bản đồ di truyền chi tiết",
        "Cập nhật liên tục",
      ],
    },
    {
      id: 3,
      title: "Xét nghiệm sức khỏe di truyền",
      description: "Phát hiện nguy cơ mắc bệnh di truyền và tư vấn phòng ngừa.",
      icon: <Heart className="service-icon" />,
      features: [
        "Phân tích hơn 100 gen",
        "Tư vấn y khoa chuyên sâu",
        "Kế hoạch phòng ngừa cá nhân hóa",
      ],
    },
    {
      id: 4,
      title: "Xét nghiệm ADN hành chính",
      description: "Phục vụ mục đích pháp lý, thủ tục hành chính và giấy tờ.",
      icon: <FileText className="service-icon" />,
      features: [
        "Được công nhận pháp lý",
        "Quy trình chuẩn quốc tế",
        "Hỗ trợ thủ tục hành chính",
      ],
    },
  ];

  return (
    <section className="testing-types">
      <div className="container">
        <h2>Các loại xét nghiệm ADN</h2>
        <p className="section-description">
          Chúng tôi cung cấp nhiều loại xét nghiệm ADN khác nhau để đáp ứng nhu
          cầu của bạn.
        </p>

        <div className="services-scroll-container">
          {showLeftArrow && (
            <button
              className="scroll-arrow scroll-left"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft />
            </button>
          )}

          <div className="services-wrapper" ref={scrollRef}>
            {testingTypes.map((type) => (
              <div className="service-card" key={type.id}>
                <div className="service-icon-wrapper">{type.icon}</div>
                <h3>{type.title}</h3>
                <p>{type.description}</p>
                <ul className="service-features">
                  {type.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <a href="#" className="service-link" onClick={handleLearnMore}>
                  Tìm hiểu thêm
                </a>
              </div>
            ))}
          </div>

          {showRightArrow && (
            <button
              className="scroll-arrow scroll-right"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestingTypes;
