import axiosInstance from "./axiosInstance";

const managerApi = {
  getTestResults: () => axiosInstance.get("/Manager/all-test-results"),
  getTestRequests: () => axiosInstance.get("/Manager/all-test-requests"),
  getTestProcess: () => axiosInstance.get("/Manager/all-test-process"),
  getTestSamples: () => axiosInstance.get("/Manager/all-test-samples"),
  getFeedbacks: () => axiosInstance.get("/Manager/get-all-feedBack"),
  updateTestResult: (data) =>
    axiosInstance.put("/Manager/update-test-result", data),
  verifyTestResult: (data) => axiosInstance.put("/Manager/verify", data),
  createBlogs: (data) => axiosInstance.post("/Manager/create-BlogPost", data),
  updateTestProcess: (data) =>
    axiosInstance.put(`/Manager/update-test-process`, data),
  getBlogs: () => axiosInstance.get(`/Manager/all-BlogPost`),
  updateBlog: (data) => axiosInstance.put("/Manager/update-blog-post", data),
};

export default managerApi;
