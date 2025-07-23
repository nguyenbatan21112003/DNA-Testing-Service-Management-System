import axiosInstance from "./axiosInstance";

const customerApi = {
  getTestRequest: () => axiosInstance.get("test-requests"),
  getDeclarantByRequestId: (requestId) =>
    axiosInstance.get(`/Customer/request-declarants/${requestId}`),
  getTestProcessByRequestId: (requestId) => axiosInstance.get(`/Customer/test-process/${requestId}`),
  getTestRequestHistory: (userId) => axiosInstance.get(`/user/test-results/history?userId=${userId}`),
  getSamplesByRequestId: (requestId) => axiosInstance.get(`/Customer/test-sample/${requestId}`),

};

export default customerApi;
