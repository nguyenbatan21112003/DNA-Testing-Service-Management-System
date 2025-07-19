import axiosInstance from "./axiosInstance";

const adminApi = {
    getAllService: () => axiosInstance.get('/Service/all-services'),
    updateService: (data) => axiosInstance.put('/Service/update-service', data),
    deleteServiceById: (serviceId) => axiosInstance.delete(`/Service/delete-service/${serviceId}`),
    createService: (data) => axiosInstance.post('/Service/create-service', data),
    getAllUser: () => axiosInstance.get('/Admin/getAllUser'),
    banUserById: (userId) => axiosInstance.put(`/Admin/ban-user/${userId}`),
    updateRoleUserById: (data) => axiosInstance.put(`/Admin/update-role-status`, data),
    createStaff: (data) => axiosInstance.post('/Admin/create-staff', data),
    createManager: (data) => axiosInstance.post('/Admin/create-manager', data),
};

export default adminApi;
