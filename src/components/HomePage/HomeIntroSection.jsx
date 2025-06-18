import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../../Css/App.css";

const HomeIntroSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`container relative z-10 transition-opacity duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Hành trình hiểu về bản thân qua xét nghiệm ADN
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
            Xét nghiệm ADN không chỉ giúp bạn xác định nguồn gốc, kết nối huyết
            thống mà còn mở ra cánh cửa chăm sóc sức khỏe chủ động. Đội ngũ
            chuyên gia của chúng tôi cam kết đồng hành cùng bạn với dịch vụ tận
            tâm, kết quả chính xác và bảo mật tuyệt đối.
          </p>
        </div>
        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-[var(--primary)] opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--secondary)] opacity-10 rounded-full animate-pulse"></div>
          <img
            src="/Homepage/HomeIntroImg.jpg"
            alt="DNA Testing Professional"
            className="w-full max-w-md h-auto rounded-lg shadow-xl transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeIntroSection;
