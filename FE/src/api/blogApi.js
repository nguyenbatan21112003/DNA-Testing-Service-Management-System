import axiosInstance from "./axiosInstance";

const blogApi = {
    getBlogs: () => axiosInstance.get(`/user/blogPost`),
    getBlogBySlug: (slug) => axiosInstance.get(`/user/blogPost/${slug}`),
}

export default blogApi;