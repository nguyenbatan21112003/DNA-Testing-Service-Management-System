"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Calendar, User, Tag, ChevronRight } from "lucide-react";

const BlogPage = ({ blogData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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

      <div className="container">
        <div className="blog-content">
          {/* Thanh tìm kiếm và lọc */}
          <div className="blog-filters">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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

          {/* Danh sách bài viết */}
          <div className="blog-list">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, idx) => (
                <div className="blog-item" key={post.id} id={`blog-${idx + 1}`}>
                  <div className="blog-item-image">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                    />
                  </div>
                  <div className="blog-item-content">
                    <div className="blog-item-meta">
                      <span className="blog-category">{post.category}</span>
                      <span className="blog-date">
                        <Calendar size={14} />
                        {post.date}
                      </span>
                      <span className="blog-author">
                        <User size={14} />
                        {post.author}
                      </span>
                    </div>
                    <h2
                      className="blog-item-title"
                      onClick={() => navigate(`/tintuc/${post.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {post.title}
                    </h2>
                    <p className="blog-item-excerpt">{post.excerpt}</p>
                    <div className="blog-item-tags">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="blog-tag">
                          <Tag size={14} />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      className="read-more-button"
                      onClick={() => navigate(`/tintuc/${post.id}`)}
                    >
                      Đọc thêm <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>Không tìm thấy bài viết phù hợp với tìm kiếm của bạn.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
