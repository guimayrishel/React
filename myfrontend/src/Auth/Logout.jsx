import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Logout = () => {
  useEffect(() => {
    const logout = async () => {
      // Clear the access token from local storage
      localStorage.removeItem('access_token');

      // Add any additional cleanup or API calls here if needed

      // Redirect to the login page
      window.location.replace('/login');
    };

    logout();
  }, []);

  // You can also show a message or spinner during the logout process
  return <div>Logging out...</div>;
};

export default Logout;
