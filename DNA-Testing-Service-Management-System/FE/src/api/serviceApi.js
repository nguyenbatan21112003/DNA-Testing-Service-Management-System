import axiosInstance from "./axiosInstance"

const serviceApi = {
    getServices: () => axiosInstance.get(`/user/services`),
    getServiceById: (id) => axiosInstance.get(`/user/services/${id}`),
}

export default serviceApi;