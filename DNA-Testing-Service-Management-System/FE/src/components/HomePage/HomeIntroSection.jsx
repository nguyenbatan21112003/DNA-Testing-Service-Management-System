import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../../Css/App.css";

const HomeIntroSection = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`home-intro-section ${visible ? "visible" : ""}`}
    >
      <div className="container home-intro-wrapper">
        <div className="home-intro-content">
          <h2>Hành trình hiểu về bản thân qua xét nghiệm ADN</h2>
          <p>
            Xét nghiệm ADN không chỉ giúp bạn xác định nguồn gốc, kết nối huyết
            thống mà còn mở ra cánh cửa chăm sóc sức khỏe chủ động. Đội ngũ
            chuyên gia của chúng tôi cam kết đồng hành cùng bạn với dịch vụ tận
            tâm, kết quả chính xác và bảo mật tuyệt đối.
          </p>
          <Link
            to="/dichvu"
            className="inline-block mt-6 px-7 py-3 bg-gradient-to-r from-[#00a67e] to-[#19c7a1] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition"
          >
            Khám phá dịch vụ
          </Link>
        </div>

        <div className="home-intro-image">
          <img
            src="/Homepage/HomeIntroImg.jpg"
            alt="DNA double helix"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeIntroSection;
