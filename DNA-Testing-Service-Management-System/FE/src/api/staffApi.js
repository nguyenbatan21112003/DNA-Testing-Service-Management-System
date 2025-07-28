import axiosInstance from "./axiosInstance";

const staffApi = {
  getRequestHome: () => axiosInstance.get(`/staff/at-home`),
  getRequestPending: () => axiosInstance.get(`/staff/pending`),
  getConsultRequest: () => axiosInstance.get(`/staff/pending-consults`),
  handleConsultRequest: (data) =>
    axiosInstance.put("/staff/consults/complete", data),
  assignRequest: (data) =>
    axiosInstance.post("/staff/assign-test-process", data),
  getTestProccesses: () => axiosInstance.get("/staff/test-processes"),
  getRequestCenter: () => axiosInstance.get("/staff/at-center"),
  getSamplesByRequestId: (requestId) =>
    axiosInstance.get(`/staff/samples?requestId=${requestId}`),
  getFeedbacks: () => axiosInstance.get(`/staff/get-staff-feedback`),
  updateRequest: (requestId, data) =>
    axiosInstance.put(`/staff/update-status/${requestId}`, data),
  sendKit: (data) => axiosInstance.put(`/staff/update-test-process`, data),
  receiveSample: (data) =>
    axiosInstance.put(`/staff/mark-sample-received`, data),
  updateCenterSampleVoluntary: (data) =>
    axiosInstance.put(`/staff/update-multiple-test-sample`, data),
  createSampleAdministration: (data) =>
    axiosInstance.post(`/staff/post-SampleCollection`, data),
  createTestResult: (data) =>
    axiosInstance.post(`staff/test-results/create`, data),
  getTestResultByRequestId: (requestId) =>
    axiosInstance.get(`/staff/test-results/${requestId}`),
  getFeedbackByResultId: (resultId) => axiosInstance.get(`/Staff/feedback/${resultId}`),
  updateTestResult: (data) => axiosInstance.put(`/Staff/update-test-result`,data)
};

export default staffApi;
