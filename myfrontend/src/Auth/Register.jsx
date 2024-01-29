
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import logo from '../assets/logo.png';
import logo1 from '../assets/logo1.png';
import { useForm } from 'react-hook-form';
import './style.css';


const RegistrationForm = () => {
  const { register, handleSubmit, watch, formState: { errors }, } = useForm();
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const showToast = (severity, summary, detail) => {toast.current.show({ severity, summary, detail, life: 3000 });};

  const handleRegistration = async (formData) => {
    const { firstName, lastName, email, password, contactNumber,} = formData;
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    try {
      setLoading(true);
      const response = await fetch('/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, email, password, first_name: firstName, last_name: lastName, contact_number: contactNumber, }),
      });
  
      if (response.ok) {
        navigate('/login');
      } else {
        const data = await response.json();
        showToast('error', 'Registration Failed', data.detail || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      showToast('error', 'Error', 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = (data) => {
    handleRegistration(data);
  };
  return (
    <div className="registration-container">
      <div className="header-container">
      <div className="logo-container">
        <img src={logo1} alt="Left Logo" height="50" className="p-mr-2" />
      </div>
      <span className="login-label">Register</span>
      <div className="logo-container">
        <img src={logo} alt="Right Logo" height="50" className="p-mr-2" />
      </div>
      </div>
      <form className="registration-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email:</label><br />
          <InputText id="email" type="email" {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,message: 'Invalid email address',},})}/><br />
          {errors.email && (<span style={{ color: 'red' }}>{errors.email.message}</span>)}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <InputText id="password" type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters long',}, pattern: {value: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: 'Password must contain letter and  number',},})}/>
          {errors.password && (<span style={{ color: 'red' }}>{errors.password.message}</span>)}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <InputText id="confirmPassword" type="password" {...register('confirmPassword', { required: 'Confirm password is required', validate: (value) => value === watch('password') || 'Passwords do not match',})}/>
          {errors.confirmPassword && (<span style={{ color: 'red' }}>{errors.confirmPassword.message}</span>)}
        </div>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <InputText id="firstName" type="text" {...register('firstName', { required: 'First name is required' })}/>
          {errors.firstName && (<span style={{ color: 'red' }}>{errors.firstName.message}</span>)}
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <InputText id="lastName" type="text" {...register('lastName', { required: 'Last name is required' })}/>
          {errors.lastName && (<span style={{ color: 'red' }}>{errors.lastName.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="contactNumber">Contact Number:</label>
          <InputText id="contactNumber" type="text" {...register('contactNumber', { required: 'Contact number is required', pattern: { value: /^(09|\+639)\d{9}$/, message: 'Invalid Philippine contact number',},})}/>
          {errors.contactNumber && (<span style={{ color: 'red' }}>{errors.contactNumber.message}</span>)}
        </div>
        <Button label={loading ? 'Registering...' : 'Register'} type="submit" disabled={loading}/>
      </form>
      <Toast ref={toast} />
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <p> Already have an account?{' '} <Link to="/login" style={{ fontWeight: 'bold' }}> Login </Link> </p>
      </div>
    </div>
  );
};

export default RegistrationForm;