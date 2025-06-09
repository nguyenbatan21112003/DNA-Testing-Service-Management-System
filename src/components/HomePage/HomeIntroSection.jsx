import React, { useEffect, useRef, useState } from "react";
import "../../Css/App.css";

const HomeIntroSection = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`home-intro-section${visible ? " visible" : ""}`}
      ref={sectionRef}
    >
      <div className="container home-intro-wrapper">
        <div className={`home-intro-image${visible ? " visible" : ""}`}>
          <img src="/test.jpg" alt="Giới thiệu dịch vụ ADN" loading="lazy" />
        </div>
        <div className={`home-intro-content${visible ? " visible" : ""}`}>
          <h2>Giá trị bên trong cơ thể của bạn</h2>
          <p>
            ADN là chìa khóa mở ra bí mật về nguồn gốc, sức khỏe và tương lai
            của mỗi người. <b>DNA Lab</b> mang đến dịch vụ xét nghiệm ADN hiện
            đại, bảo mật, giúp bạn hiểu rõ hơn về bản thân, kết nối gia đình và
            chủ động chăm sóc sức khỏe. Hãy để chúng tôi đồng hành cùng bạn trên
            hành trình khám phá di truyền!
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeIntroSection;
