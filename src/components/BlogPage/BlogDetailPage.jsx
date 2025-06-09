"use client";

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, Share2 } from "lucide-react";

const BlogDetailPage = ({ blogData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogData.find((b) => String(b.id) === String(id));

  if (!blog) {
    return (
      <div
        className="container"
        style={{ padding: "4rem 0", textAlign: "center" }}
      >
        <h2>Bài viết không tồn tại!</h2>
        <button className="back-button" onClick={() => navigate("/tintuc")}>
          Quay lại danh sách bài viết
        </button>
      </div>
    );
  }

  // Tìm các bài viết liên quan (cùng danh mục hoặc có cùng tag)
  const relatedPosts = blogData
    .filter(
      (post) =>
        post.id !== blog.id &&
        (post.category === blog.category ||
          post.tags.some((tag) => blog.tags.includes(tag)))
    )
    .slice(0, 3);

  return (
    <div className="blog-detail-page">
      {/* Banner */}
      <div className="blog-detail-banner">
        <div className="container">
          <button className="back-button" onClick={() => navigate("/tintuc")}>
            <ArrowLeft size={20} />
            Quay lại danh sách bài viết
          </button>
          <h1>{blog.title}</h1>
          <div className="blog-detail-meta">
            <span className="blog-category">{blog.category}</span>
            <span className="blog-date">
              <Calendar size={14} />
              {blog.date}
            </span>
            <span className="blog-author">
              <User size={14} />
              {blog.author}
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="blog-detail-content">
          <div className="blog-main-content">
            {/* Hình ảnh chính */}
            <div className="blog-detail-image">
              <img src={blog.image || "/placeholder.svg"} alt={blog.title} />
            </div>

            {/* Nội dung bài viết */}
            <div className="blog-detail-text">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            {/* Tags */}
            <div className="blog-detail-tags">
              <h3>Tags:</h3>
              <div className="tags-list">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="blog-tag">
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Chia sẻ */}
            <div className="blog-share">
              <h3>Chia sẻ bài viết:</h3>
              <div className="share-buttons">
                <button className="share-button facebook">
                  <Share2 size={16} />
                  Facebook
                </button>
                <button className="share-button twitter">
                  <Share2 size={16} />
                  Twitter
                </button>
                <button className="share-button email">
                  <Share2 size={16} />
                  Email
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="blog-sidebar">
            {/* Tác giả */}
            <div className="blog-author-card">
              <h3>Tác giả</h3>
              <div className="author-info">
                <div className="author-avatar">
                  <User size={40} />
                </div>
                <div className="author-details">
                  <h4>{blog.author}</h4>
                  <p>
                    Chuyên gia xét nghiệm ADN với nhiều năm kinh nghiệm trong
                    lĩnh vực di truyền học.
                  </p>
                </div>
              </div>
            </div>

            {/* Bài viết liên quan */}
            <div className="related-posts">
              <h3>Bài viết liên quan</h3>
              <div className="related-posts-list">
                {relatedPosts.map((post) => (
                  <div
                    className="related-post-item"
                    key={post.id}
                    onClick={() => navigate(`/tintuc/${post.id}`)}
                  >
                    <div className="related-post-image">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                      />
                    </div>
                    <div className="related-post-content">
                      <h4>{post.title}</h4>
                      <span className="related-post-date">{post.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
