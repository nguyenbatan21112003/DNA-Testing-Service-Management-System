import axiosInstance from "./axiosInstance";

const userApi = {
  getUserProfileByProfileId: (profileId) =>
    axiosInstance.get(`/user/GetProfile/${profileId}`),
  submitFormRequest: (data) => axiosInstance.post(`/user/submit`, data),
  createProfile: (data) =>
    axiosInstance.post(`/user/create-userProfile`, data),
  getUserProfileByGmail: (email) =>
    axiosInstance.post(`/user/get-userProfile-ByEmail/${email}`),
  registerAccount: (data) =>
    axiosInstance.post(`/user/register`, data),
  login: (data) => axiosInstance.post(`/user/login`, data),
  changePassword: (data) =>
    axiosInstance.put(`/user/change-password`, data),
  sendConsultRequest: (data) =>
    axiosInstance.post(`/user/send-consult-request`, data),
  updateUserProfileByUserId:  (id, data) =>
    axiosInstance.put(`/user/UpdateUserProfile/${id}`, data),
};

export default userApi;
