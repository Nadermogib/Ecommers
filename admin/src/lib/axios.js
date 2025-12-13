import axios from 'axios'

const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true,//by addening this field browser will send  the cockies to the server automatically, on evry singl req
    
})

export default axiosInstance