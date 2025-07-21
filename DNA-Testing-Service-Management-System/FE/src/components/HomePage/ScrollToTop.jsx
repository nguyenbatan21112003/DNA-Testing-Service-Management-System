"use client";

import React from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
  // const [isVisible, setIsVisible] = useState(false);

  // // Hiển thị nút khi cuộn xuống 300px
  // const toggleVisibility = () => {
  //   if (window.scrollY > 300) {
  //     setIsVisible(true);
  //   } else {
  //     setIsVisible(false);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", toggleVisibility);
  //   return () => window.removeEventListener("scroll", toggleVisibility);
  // }, []);

  // Cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTo({ top: 0, behavior: "smooth" });
    const app = document.querySelector(".app");
    if (app) app.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className="scroll-to-top visible"
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
    >
      <ChevronUp size={24} />
      <span>ĐẦU TRANG</span>
    </button>
  );
};

export default ScrollToTop;
