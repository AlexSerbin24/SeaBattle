import axios from "axios"
const axiosInstance = axios.create({
    baseURL:"http://sea-battle4308.eu-north-1.elasticbeanstalk.com",
    withCredentials:true
})

export default axiosInstance;