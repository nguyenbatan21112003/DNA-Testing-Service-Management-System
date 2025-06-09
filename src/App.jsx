import "./Css/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
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

// Staff Components
import TestResultsEntry from "./components/Staff/TestResultsEntry";
import ConsultationRequests from "./components/Staff/ConsultationRequests";
import AssignedTasks from "./components/Staff/AssignedTasks";
import CustomerFeedback from "./components/Staff/CustomerFeedback";
import HomeCollectionSamples from "./components/Staff/HomeCollectionSamples";
import OnSiteCollectionReport from "./components/Staff/OnSiteCollectionReport";
import StaffDashboard from "./components/Staff/StaffDashboard";
import StaffLayout from "./components/Staff/StaffLayout";

/*-----------------------------------------------------*/
import "./Css/Services-page.css";
import "./Css/About-us-page.css";
import "./Css/Blog.css";
import "./Css/Contact.css";
/*-----------------------------------------------------*/
import { AuthProvider } from "./context/AuthContext";

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

function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

function StaffApp() {
  return (
    <Routes>
      <Route path="/" element={<StaffLayout />}>
        <Route index element={<StaffDashboard />} />
        <Route path="ketqua-xetnghiem" element={<TestResultsEntry />} />
        <Route path="tuvan-khachhang" element={<ConsultationRequests />} />
        <Route path="congviec-phancong" element={<AssignedTasks />} />
        <Route path="phanhoi-khachhang" element={<CustomerFeedback />} />
        <Route path="mau-laytainha" element={<HomeCollectionSamples />} />
        <Route path="bienban-laymau" element={<OnSiteCollectionReport />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            {/* Staff Routes - No Header/Footer */}
            <Route path="/staff/*" element={<StaffApp />} />
            
            {/* Main Public Routes - With Header/Footer */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <HomePage />
                </MainLayout>
              }
            />
            <Route
              path="/dichvu"
              element={
                <MainLayout>
                  <ServicesPage />
                </MainLayout>
              }
            />
            <Route
              path="/vechungtoi"
              element={
                <MainLayout>
                  <AboutUsPage />
                </MainLayout>
              }
            />
            <Route
              path="/taikhoan"
              element={
                <MainLayout>
                  <UserProfile />
                </MainLayout>
              }
            />
            <Route
              path="/tintuc"
              element={
                <MainLayout>
                  <BlogPage blogData={blogData} />
                </MainLayout>
              }
            />
            <Route
              path="/tintuc/:id"
              element={
                <MainLayout>
                  <BlogDetailPage blogData={blogData} />
                </MainLayout>
              }
            />
            <Route
              path="/lienhe"
              element={
                <MainLayout>
                  <ContactPage />
                </MainLayout>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;