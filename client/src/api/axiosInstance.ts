import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_server_url,
    timeout: 5000,
    headers: {
        "Content-Type": 'application/json'
    }
})


axiosInstance.interceptors.request.use(
    (config) => {
        const credential = localStorage.getItem('postivibecred')
        if (credential) {
            config.headers['Authorization'] = `Bearer ${credential}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default axiosInstance;