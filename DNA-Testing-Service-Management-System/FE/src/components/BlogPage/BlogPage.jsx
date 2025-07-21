"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, User, ChevronRight } from "lucide-react";
import "../../Css/Blog.css";
import blogApi from "../../api/blogApi";
import messagesError from "../../constants/messagesError";

const POSTS_PER_PAGE = 6;

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch blogs from BE
  const fetchBlogs = async () => {
    try {
      const response = await blogApi.getBlogs();
      // console.log(response);
      setBlogs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(messagesError.blogsError, err);
      setError(`${messagesError.blogsError}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    fetchBlogs();
  }, [location]);

  // Lọc bài viết theo tìm kiếm và danh mục
  const filteredPosts = blogs.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Lấy danh sách các danh mục duy nhất
  const categories = [
    "all",
    ...new Set(blogs.map((post) => post.category || "uncategorized")),
  ];

  // Phân trang
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  // Render loading, error
  if (loading) return <div>Loading blogs...</div>;
  if (error) return <div>{error}</div>;

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
        <div className="category-filters">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-button ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory(category);
                setPage(1);
              }}
            >
              {category === "all"
                ? "Tất cả"
                : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="blog-content">
          <div className="blog-list">
            {paginatedPosts.length > 0 ? (
              paginatedPosts.map((post) => (
                <div
                  key={post.postId}
                  className="blog-card"
                  onClick={() => navigate(`/tintuc/${post.slug}`)}
                >
                  <div className="blog-card-image">
                    <img
                      src={post.thumbnailURL || "/placeholder.svg"}
                      alt={post.title}
                    />
                  </div>

                  <div className="blog-item-content">
                    <h2 className="blog-item-title">{post.title}</h2>
                    <p className="blog-item-excerpt">{post.summary}</p>
                    <div className="blog-item-meta">
                      <span className="blog-author">
                        <User size={14} /> {post.authorName}
                      </span>
                    </div>
                    <button
                      className="read-more-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tintuc/${post.slug}`);
                      }}
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
