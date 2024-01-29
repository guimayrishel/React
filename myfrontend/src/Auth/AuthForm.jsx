// src/components/AuthForm.jsx
import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate, Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';

const AuthForm = ({ isLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const toast = useRef(null);

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    const handleSubmit = async () => {
        // Basic client-side validation
        if (!email || !password) {
            showToast('error', 'Validation Error', 'Please enter both email and password.');
            return;
        }

        // Implement login or registration logic here (make API request to Django backend)
        try {
            const endpoint = isLogin ? 'login' : 'register';
            const response = await fetch(`http://localhost:8000/api/${endpoint}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                // Redirect to a dashboard or home page after successful login or registration
                navigate('/dashboard');
                showToast('success', `${isLogin ? 'Login' : 'Registration'} Successful`, 'Welcome!');
            } else {
                // Handle login or registration failure
                const errorMessage = isLogin
                    ? 'Invalid email or password. Please try again.'
                    : 'Registration failed. Please try again.';
                showToast('error', `${isLogin ? 'Login' : 'Registration'} Failed`, errorMessage);
            }
        } catch (error) {
            console.error(`${isLogin ? 'Login' : 'Registration'} failed`, error);
            showToast('error', 'Error', `An error occurred during ${isLogin ? 'login' : 'registration'}. Please try again.`);
        }
    };

    return (
        <div>
            <div>
                <label htmlFor="email">Email:</label>
                <InputText
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <InputText
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <Button label={isLogin ? 'Login' : 'Register'} onClick={handleSubmit} />
            {!isLogin && (
                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            )}
            <Toast ref={toast} />
        </div>
    );
};

export default AuthForm;
