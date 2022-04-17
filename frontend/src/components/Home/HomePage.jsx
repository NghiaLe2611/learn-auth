import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { loginSuccess } from '../../redux/authSlice';
import { deleteUser, getAllUsers } from '../../service/api';
import { createAxios } from '../../service/axiosClient';
import './home.css';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.login?.currentUser);
    const userList = useSelector(state => state.user?.users.allUser);
    const msg = useSelector(state => state.user?.message);
	
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    useEffect(() => {
        if(user?.accessToken) {
            getAllUsers(user?.accessToken, dispatch, axiosJWT);
        }
    }, [user]);

    const handleDelete = (id) => {
        deleteUser(user?.accessToken, dispatch, id, axiosJWT);
    };

    if (!user) {
        return <Navigate to = '/login' />;
    } else {
        return (
            <main className='home-container'>
                <div className='home-title'>User List</div>
                <div className='home-role'>{`Role: ${user?.admin ? 'Admin' : 'User'}`}</div>
                <div className='home-userlist'>
                    {/* optional chaining */}
                    {userList?.map((user) => {
                        return (
                            <div className='user-container' key={user.username}>
                                <div className='home-user'>{user.username}</div>
                                <div className='delete-user' onClick={() => handleDelete(user._id)}>Delete</div>
                            </div>
                        );
                    })}
                </div>
                <div className='errorMsg'><strong>{msg && msg}</strong></div>
            </main>
        );
    }
};

export default HomePage;
