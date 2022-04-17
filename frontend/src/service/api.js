import axios from 'axios';
import { loginFailed, loginStart, loginSuccess,
    registerStart, registerSuccess, registerFailed,
    logoutStart, logoutSuccess, logoutFailed } from '../redux/authSlice';
import { getUserStart, getUserSuccess, getUserFailed,
    deleteUserStart, deleteUserSuccess, deleteUserFailed } from '../redux/userSlice';

export const loginUser = async(user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const result = await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/login`, user
        // , {
        //     withCredentials: true
        // }
        );
        dispatch(loginSuccess(result.data.user));
        navigate('/');
    } catch (err) {
        dispatch(loginFailed());
    }
};

export const registerUser = async(user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/register`, user);
        dispatch(registerSuccess());
        navigate('/login');
    } catch (err) {
        dispatch(registerFailed());
    }
};

export const getAllUsers = async(accessToken, dispatch, axiosJWT) => {
    dispatch(getUserStart());
    try {
        const result = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/v1/user`, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        });
        dispatch(getUserSuccess(result.data));
    } catch(err) {
        dispatch(getUserFailed());
    }
};

export const deleteUser = async(accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
        const result = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/v1/user/${id}`, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        });
        console.log('DELETE', result);
        dispatch(deleteUserSuccess(result.data));
    } catch(err) {
        console.log(123, err);
        dispatch(deleteUserFailed(err.response.data));
    }
};

export const logoutUser = async(dispatch, id, navigate, accessToken, axios) => {
    dispatch(logoutStart());
    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/v1/auth/logout`, id, {
            headers: {
                token: `Bearer ${accessToken}`
            }
        });
        dispatch(logoutSuccess());
        navigate('/login');
    } catch {
        dispatch(logoutFailed());
    }
};
