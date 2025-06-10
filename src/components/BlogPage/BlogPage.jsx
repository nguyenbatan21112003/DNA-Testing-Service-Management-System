"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Calendar, User, Tag, ChevronRight } from "lucide-react";
import "../../Css/Blog.css";

const POSTS_PER_PAGE = 6;

const BlogPage = ({ blogData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Optionally: el.classList.add('highlight');
      }
    }
  }, [location]);

  // Lọc bài viết theo tìm kiếm và danh mục
  const filteredPosts = blogData.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Lấy danh sách các danh mục duy nhất
  const categories = ["all", ...new Set(blogData.map((post) => post.category))];

  // Phân trang
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  return (
    <div className="blog-page">
      {/* Banner */}
      <div className="blog-banner">
        <div className="container">
          <h1>Tin tức & Kiến thức</h1>
          <p>
            Cập nhật thông tin mới nhất về xét nghiệm ADN và chia sẻ kiến thức
            từ đội ngũ chuyên gia
          </p>
        </div>
      </div>

      {/* Thanh tìm kiếm căn giữa */}
      <div className="blog-search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm bài viết"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="blog-search-input"
        />
        <Search size={22} className="blog-search-icon" />
      </div>

      {/* Tiêu đề lớn và phụ đề */}
      <div className="blog-header">
        <h1 className="blog-title">Tin tức & Kiến thức</h1>
        <div className="blog-subtitle">
          Cập nhật thông tin mới nhất về xét nghiệm ADN và chia sẻ kiến thức từ
          đội ngũ chuyên gia
        </div>
      </div>

      <div className="container">
        <div className="blog-content">
          {/* Thanh tìm kiếm và lọc */}
          <div className="blog-filters">
            <div className="category-filters">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`category-button ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "all"
                    ? "Tất cả"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Danh sách bài viết dạng lưới */}
          <div className="blog-list">
            {paginatedPosts.length > 0 ? (
              paginatedPosts.map((post) => (
                <div
                  key={post.id}
                  className="blog-card"
                  onClick={() => navigate(`/tintuc/${post.id}`)}
                >
                  <div className="blog-card-image">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                    />
                  </div>
                  <div className="blog-card-title">{post.title}</div>
                  <div className="blog-card-excerpt">{post.excerpt}</div>
                </div>
              ))
            ) : (
              <div className="blog-no-results">
                Không tìm thấy bài viết phù hợp với tìm kiếm của bạn.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="blog-pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="blog-pagination-btn"
          >
            ← Previous
          </button>
          {Array.from({ length: totalPages }).map((_, idx) =>
            idx + 1 === 1 ||
            idx + 1 === totalPages ||
            Math.abs(idx + 1 - page) <= 1 ? (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={
                  "blog-pagination-btn" +
                  (idx + 1 === page ? " blog-pagination-btn-active" : "")
                }
              >
                {idx + 1}
              </button>
            ) : (
              (idx === page - 3 || idx === page + 1) && (
                <span key={idx} className="blog-pagination-ellipsis">
                  ...
                </span>
              )
            )
          )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="blog-pagination-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
