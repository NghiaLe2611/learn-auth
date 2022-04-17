import axios from 'axios';
import jwt_decode from 'jwt-decode';

axios.defaults.withCredentials = true; 

const refreshToken = async () => {
    // const refreshTokenCookie = Cookies.get('refreshToken');

    try {
        const result = await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/refreshToken`);
        return result.data;
    } catch (err) {
        console.log(err);
    }
};

export const createAxios = (user, dispatch, stateSuccess) => {
    const axiosClient = axios.create();
    axiosClient.interceptors.request.use(async(config) => {
        let date = new Date();
        // Giải mã accessToken
        const decodedToken = jwt_decode(user?.accessToken);
        if (decodedToken.exp < date.getTime() / 1000) {
            const data = await refreshToken();
           
            const refreshUser = {
                ...user,
                accessToken: data.accessToken
                // refreshToken: data.refreshToken
            };
            dispatch(stateSuccess(refreshUser));
            config.headers['token'] = `Bearer ${data.accessToken}`;
            console.log(111, data.accessToken);
        }

        return config;
    }, (err) => {
        return Promise.reject(err);
    });

    return axiosClient;
}