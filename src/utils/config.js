import axios from "axios";


export const HOST_URL = "http://103.12.1.132:8156/api/";
export const ContentHOST_URL = "http://103.12.1.132:8156/";
export const ChatBot_URL = "http://103.12.1.132:8184/project1/";
export const ChatBot_URL_Onload = "http://103.12.1.132:8184/";
export const previewpath = "https://adhyalibdoc.mssplonline.com:8130/";
export const previewpaththeme = "https://adhyalibdoc.mssplonline.com:8130";

const uniqueID =  localStorage.getItem('unqiueId');
//console.log("🚀 ~ uniqueID:", uniqueID)

const api = axios.create({
    baseURL: HOST_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {

        const removeQuotes = (str) => {
            if (typeof str === 'string') {
                return str.replace(/^"(.*)"$/, '$1');
            }
            return str;
        };

        const cleanedUniqueId = removeQuotes(uniqueID);

        if (cleanedUniqueId) {
            config.headers['UniqueId'] = cleanedUniqueId;
            config.headers['Accept'] = '*/*';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        //   if (error.response && error.response.status === 401) {
        //     performLogout();
        //   }
        //   return Promise.reject(error);
    }
);

export default api;