import axios, {type AxiosRequestConfig} from "axios";

axios.defaults.baseURL = "api_service"
axios.defaults.timeout = 20 * 1000;
axios.defaults.maxBodyLength = 5 * 1024 * 1024;
axios.defaults.withCredentials = true



axios.interceptors.request.use(
    (config: AxiosRequestConfig | any) => {
        config.params = {
            ...config.params,
            // time: Date.now(),
        }

        config.headers.Accept='*/*'
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);


// 添加响应拦截器
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);



interface Http {
    get<T>(url: string, params?: any): Promise<T>;

    post<T>(url: string, params?: any): Promise<T>;

    // upload<T>(url: string, params: unknown): Promise<T>;
    //
    // put<T>(url: string, params: unknown): Promise<T>;
    //
    // delete<T>(url: string, params: unknown): Promise<T>;
    //
    // download(url: string): void;
}



const http: Http = {
    get(url, params) {
        return new Promise((resolve, reject) => {
            axios
                .get(url, params)
                .then((res) => {
                    if (res){
                        resolve(res.data);
                    }else {
                        throw new Error()
                    }
                })
                .catch((err) => {
                    reject(err.data);
                });
        });
    },

    post(url, params) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, params)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
}

export default http