import axiosInstance from "./axiosInstance";

const managerApi = {
  getTestResults: () => axiosInstance.get("/Manager/all-test-results"),
  getTestRequests: () => axiosInstance.get("/Manager/all-test-requests"),
  getTestSamples: () => axiosInstance.get("/Manager/all-test-samples"),
  getFeedbacks: () => axiosInstance.get("/Manager/all-test-feedback"),
  updateTestResult: (data) =>  axiosInstance.put("/Manager/update-test-result", data),
  verifyTestResult: (data) => axiosInstance.put("/Manager/verify", data),
  createBlogs: (data) => axiosInstance.post("/Manager/create-BlogPost", data),
};

export default managerApi;
