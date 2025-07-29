"use client";

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import messagesError from "../../constants/messagesError";
import blogApi from "../../api/blogApi";

const BlogDetailPage = ({ blogData }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const fetchBlog = async () => {
    try {
      const response = await blogApi.getBlogBySlug(slug);
      console.log(response);
      setBlog(response.data);
    } catch (error) {
      console.log(messagesError.blogError, error);
    }
  };
  // const blog = blogData.find((b) => b.slug === slug);
  useEffect(() => {
    fetchBlog();
  }, [blog]);

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

  // Tìm các bài viết liên quan
  const relatedPosts = blogData
    .filter((post) => post.slug !== blog.slug)
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
            <span className="blog-date">
              <Calendar size={14} />
              {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
            </span>
            <span className="blog-author">
              <User size={14} /> {blog.authorName || "ADNVietnam"}
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="blog-detail-content">
          <div className="blog-main-content">
            {/* Hình ảnh chính */}
            <div className="blog-detail-image">
              <img
                src={blog.thumbnailURL || "/placeholder.svg"}
                alt={blog.title}
              />
            </div>

            {/* Nội dung bài viết */}
            <div className="blog-detail-text">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            {/* Chia sẻ */}
            <div className="blog-share">
              <h3>Chia sẻ bài viết:</h3>
              <div className="share-buttons">
                <button className="share-button facebook">
                  <Share2 size={16} /> Facebook
                </button>
                <button className="share-button twitter">
                  <Share2 size={16} /> Twitter
                </button>
                <button className="share-button email">
                  <Share2 size={16} /> Email
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
                  <h4>{blog.authorName || "ADNVietnam"}</h4>
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
                    key={post.slug}
                    onClick={() => navigate(`/tintuc/${post.slug}`)}
                  >
                    <div className="related-post-image">
                      <img
                        src={post.thumbnailURL || "/placeholder.svg"}
                        alt={post.title}
                      />
                    </div>
                    <div className="related-post-content">
                      <h4>{post.title}</h4>
                      <span className="related-post-date">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </span>
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
