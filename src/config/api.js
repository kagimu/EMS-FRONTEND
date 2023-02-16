import axios from "axios"
import router from "@/config/router.js";
// import { useAuthStore } from "@/stores/auth"
// import { useCommonsStore } from "@/stores/commons"
// import router from "@/router"

const api = axios.create({
    baseURL: `${import.meta.env.VITE_APP_BASE_URL}`,
    withCredentials: true,
})

/*api.interceptors.request.use((config) => {
    const auth = useAuthStore()

    if (auth.token !== null) {
        config.headers.Authorization = `Bearer ${auth.token}`
    }

    return config
})*/

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            // const commons = useCommonsStore()
            // router.push({ name: "Login" })
            router.push({ name: "Login" })
            // commons.toggleLoading(false)
            sessionStorage.clear()
        }

        return Promise.reject(error)
    }
)
export default api