import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../service/api';
import './register.css';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        username: '',  email: '', password: ''
    });

    const onChangeInput = (e) => {
        const { name, value } = e.target;
		setUserInfo({ ...userInfo, [name]: value });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const newUser = {
            username: userInfo.username,
            email: userInfo.email,
            password: userInfo.password
        }
        registerUser(newUser, dispatch, navigate);
    };

	return (
		<section className='register-container'>
			<div className='register-title'> Sign up </div>
			<form onSubmit={handleRegister}>
                <label>USERNAME</label>
				<input type='text' name='username' placeholder='Enter your username' onChange={onChangeInput}/>
				<label>EMAIL</label>
				<input type='text' name='email' placeholder='Enter your email' onChange={onChangeInput}/>
				<label>PASSWORD</label>
				<input type='password' name='password' placeholder='Enter your password' onChange={onChangeInput}/>
				<button type='submit'>Create account</button>
			</form>
		</section>
	);
};

export default Register;
