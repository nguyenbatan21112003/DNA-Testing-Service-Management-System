import axiosInstance from "./axiosInstance";

const customerApi = {
  getTestRequest: () => axiosInstance.get("test-requests"),
  getDeclarantByRequestId: (requestId) =>
    axiosInstance.get(`/Customer/request-declarants/${requestId}`),
  getTestProcessByRequestId: (requestId) =>
    axiosInstance.get(`/Customer/test-process/${requestId}`),
  getTestRequestHistory: (userId) =>
    axiosInstance.get(`/user/test-results/history?userId=${userId}`),
  getSamplesByRequestId: (requestId) =>
    axiosInstance.get(`/Customer/test-sample/${requestId}`),
  getResultByRequestId: (requestId) =>
    axiosInstance.get(`/Customer/test-result/${requestId}`),
  getSampleCollection: (processId) =>
    axiosInstance.get(`/Customer/sample-collection/${processId}`),
  sendFeedback: (data) => axiosInstance.post(`/send-FeedBack`, data),
  getAllFeedback: () => axiosInstance.get(`/Customer/feedback`),
};

export default customerApi;
