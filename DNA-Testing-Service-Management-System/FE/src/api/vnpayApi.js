import axiosInstance from "./axiosInstance";

const vnpayApi = {
  paymentRequest: (data) => axiosInstance.post(`/Payment/create-vnpay-url`, data)
};

export default vnpayApi;
