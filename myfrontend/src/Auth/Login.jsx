import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import logo from '../assets/logo.png';
import logo1 from '../assets/logo1.png';
import { useNavigate, Link } from 'react-router-dom';
import './style.css';


const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const toast = useRef(null);

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    const onSubmit = async (data) => {
        try {
            const response = await fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = await response.json();
                const user = {
                    full_name: responseData.full_name,
                };

                localStorage.setItem('access_token', responseData.access);
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/');
            } else {
                showToast('error', 'Login Failed', 'Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Login failed', error);
            showToast('error', 'Error', 'An error occurred during login. Please try again.');
        }
    };
    return (
        <div  className="registration-container">
            <div className="header-container">
                <div className="logo-container">
                <img src={logo1} alt="Left Logo" height="50" className="p-mr-2" />
                </div>
                <span className="login-label">Login</span>
                <div className="logo-container">
                <img src={logo} alt="Right Logo" height="50" className="p-mr-2" />
                </div>
            </div>
            <form  className="registration-form" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="email">Email:</label><br />
                    <InputText id="email" type="email" {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address',}, })} /><br />
                    {errors.email && (<span style={{ color: 'red' }}>{errors.email.message}</span>)}
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <InputText id="password" type="password" {...register('password', { required: 'Password is required' })}/>
                    {errors.password && <span  style={{ color: 'red' }}>{errors.password.message}</span>}
                </div>
                <Button label="Login" type="submit" />
                <Toast ref={toast} />
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <p>Does not have an account?{' '}<Link to="/register" style={{ fontWeight: 'bold' }}> Register </Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
