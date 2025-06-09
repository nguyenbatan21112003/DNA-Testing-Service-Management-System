import "./Css/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/HomePage/Header";
import Banner from "./components/HomePage/Banner";
import HomeIntroSection from "./components/HomePage/HomeIntroSection";
import Hero from "./components/HomePage/Hero";
import TestingTypes from "./components/HomePage/TestingTypes";
import TestingProcess from "./components/HomePage/TestingProcess";
import RegistrationForm from "./components/HomePage/RegistrationForm";
import FAQContact from "./components/HomePage/FAQContact";
import Footer from "./components/HomePage/Footer";
import ScrollToTop from "./components/HomePage/ScrollToTop";
import ServicesPage from "./components/Services/ServicesPage";
import AboutUsPage from "./components/AboutUs/AboutUsPage";
import BlogPage from "./components/BlogPage/BlogPage";
import BlogDetailPage from "./components/BlogPage/BlogDetailPage";
import ContactPage from "./components/Contact/ContactPage";
import UserProfile from "./components/User/UserProfile";
import StaffOrderManager from "./components/Staff/StaffOrderManager";
import AdminDashboard from "./components/Admin/AdminDashboard";
/*-----------------------------------------------------*/
import "./Css/Services-page.css";
import "./Css/About-us-page.css";
import "./Css/Blog.css";
import "./Css/Contact.css";
/*-----------------------------------------------------*/
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { useLocation } from "react-router-dom";

const blogData = [
  {
    id: 1,
    title: "Xét nghiệm ADN là gì? Các loại xét nghiệm ADN phổ biến",
    excerpt:
      "Tìm hiểu về xét nghiệm ADN, cách thức hoạt động và các loại xét nghiệm ADN phổ biến hiện nay...",
    content: `<h2>Xét nghiệm ADN là gì?</h2><p>Xét nghiệm ADN (Axit Deoxyribonucleic) là quá trình phân tích các mẫu sinh học để xác định cấu trúc di truyền của một cá nhân...</p>`,
    category: "kiến thức",
    date: "15/05/2023",
    author: "TS. Nguyễn Văn A",
    tags: ["ADN", "Xét nghiệm", "Di truyền"],
    image: "./DNA2.jpg",
  },
  {
    id: 2,
    title: "Hướng dẫn chuẩn bị trước khi xét nghiệm ADN",
    excerpt:
      "Tìm hiểu về xét nghiệm ADN, cách thức hoạt động và các loại xét nghiệm ADN phổ biến hiện nay...",
    content: `<h2>Xét nghiệm ADN là gì?</h2><p>Xét nghiệm ADN (Axit Deoxyribonucleic) là quá trình phân tích các mẫu sinh học để xác định cấu trúc di truyền của một cá nhân...</p>`,
    category: "kiến thức",
    date: "01/10/2024",
    author: "TS. Nguyễn Văn A",
    tags: ["ADN", "Xét nghiệm", "Di truyền"],
    image: "./DNA.jpg",
  },
  {
    id: 3,
    title: "Sự khác biệt giữa xét nghiệm ADN dân sự và hành chính",
    excerpt:
      "Tìm hiểu về xét nghiệm ADN, cách thức hoạt động và các loại xét nghiệm ADN phổ biến hiện nay...",
    content: `<h2>Xét nghiệm ADN là gì?</h2><p>Xét nghiệm ADN (Axit Deoxyribonucleic) là quá trình phân tích các mẫu sinh học để xác định cấu trúc di truyền của một cá nhân...</p>`,
    category: "kiến thức",
    date: "01/10/2024",
    author: "TS. Nguyễn Văn A",
    tags: ["ADN", "Xét nghiệm", "Di truyền"],
    image: "./DNA.jpg",
  },
];

function HomePage() {
  return (
    <>
      <Banner />
      <HomeIntroSection />
      <Hero />
      <TestingTypes />
      <TestingProcess />
      <RegistrationForm />
      <FAQContact />
    </>
  );
}

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAdmin = user && user.role_id === 5;
  return (
    <div className="app">
      {!(isAdmin && isAdminPage) && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dichvu" element={<ServicesPage />} />
          <Route path="/vechungtoi" element={<AboutUsPage />} />
          <Route path="/taikhoan" element={<UserProfile />} />
          <Route path="/nhanvien" element={<StaffOrderManager />} />
          <Route path="/tintuc" element={<BlogPage blogData={blogData} />} />
          <Route
            path="/tintuc/:id"
            element={<BlogDetailPage blogData={blogData} />}
          />
          <Route path="/lienhe" element={<ContactPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          {/* Thêm các route khác nếu cần */}
        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
