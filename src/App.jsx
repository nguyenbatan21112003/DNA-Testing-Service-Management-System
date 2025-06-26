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
import Error404 from './components/Errors/Error404';
import LoginPage from './components/HomePage/LoginPage';
import RegisterPage from './components/HomePage/RegisterPage';
import ManagerDashboard from "./components/Manager/ManagerDashboard";
import ServiceRegister from './components/ServiceRegister/ServiceRegister';
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

function UserInfoBar({ user }) {
  if (!user) return null;
  return (
    <div
      style={{
        width: "100%",
        height: 56,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 40px",
        borderBottom: "1px solid #f0f0f0",
        fontWeight: 600,
        fontSize: 16,
        color: "#009e74",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        gap: 16,
      }}
    >
      {user.avatar || user.image ? (
        <img
          src={user.avatar || user.image}
          alt="avatar"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #00a67e",
            background: "#e6f7f1",
          }}
        />
      ) : (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#e6f7f1",
            color: "#00a67e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 20,
            border: "2px solid #00a67e",
          }}
        >
          {(user.name || user.fullName || user.email || "U")
            .charAt(0)
            .toUpperCase()}
        </div>
      )}
      <span
        style={{
          color: "#009e74",
          fontWeight: 700,
          fontSize: 17,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 180,
          marginLeft: 8,
        }}
      >
        {user.name || user.fullName || user.email}
      </span>
    </div>
  );
}

function App() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isUserPage = location.pathname.startsWith("/taikhoan");
  const isStaffPage = location.pathname.startsWith("/nhanvien");
  const isManagerPage = location.pathname.startsWith("/manager");
  const isAdmin = user && user.role_id === 4;
  const isManager = user && user.role_id === 3;
  const is404 = location.pathname === '/404' || location.pathname === '*' || location.pathname.startsWith('/404');
  const isLoginOrRegister = location.pathname === '/login' || location.pathname === '/register';
  return (
    <div className="app" style={isUserPage ? { paddingTop: 56 } : {}}>
      {isUserPage && !is404 && !isLoginOrRegister && <UserInfoBar user={user} />}
      {!(isAdmin && isAdminPage) && !(isManager && isManagerPage) && !isUserPage && !isStaffPage && !is404 && !isLoginOrRegister && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dichvu" element={<ServicesPage />} />
          <Route path="/dangki" element={<ServiceRegister />} />
          <Route path="/vechungtoi" element={<AboutUsPage />} />
          <Route path="/taikhoan" element={<UserProfile />} />
          <Route path="/nhanvien" element={<StaffOrderManager />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/tintuc" element={<BlogPage blogData={blogData} />} />
          <Route
            path="/tintuc/:id"
            element={<BlogDetailPage blogData={blogData} />}
          />
          <Route path="/lienhe" element={<ContactPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='*' element={<Error404 />} />
        </Routes>
      </main>
      {!(isAdmin && isAdminPage) && !(isManager && isManagerPage) && !isUserPage && !isStaffPage && !is404 && !isLoginOrRegister && <Footer />}
      {!is404 && !isLoginOrRegister && !isStaffPage && !isManagerPage && <ScrollToTop />}
    </div>
  );
}
export default App;
