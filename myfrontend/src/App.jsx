import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CarComponent from './components/CarComponent';
import StudentForm from './components/StudentForm';
import Dashboard from './components/Dashboard';
import Ward from './components/Ward';
import Ward1 from './redux/Ward';
import Navbar from './components/Navbar';
import Patients from './components/Patients';
import Login from './Auth/Login';
import Register from './Auth/Register';
import Logout from './Auth/Logout';

// Higher-order component to check authentication status
// function ProtectedRoute ({ element }){

const ProtectedRoute = ({ element }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const isAuthenticated = localStorage.getItem('access_token') !== null;
      if (isAuthenticated) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    // Loading state, you can display a loading spinner or message
    return <div>Loading...</div>;
  }

  return user ? (
    React.cloneElement(element, { user }) // Pass user details as props
  ) : (
    <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  );
};

const App = () => {
  return (
    <Router>
      <div>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/patients" element={<ProtectedRoute element={<Patients />} />} />
          <Route path="/cars" element={<ProtectedRoute element={<CarComponent />} />} />
          <Route path="/wards" element={<ProtectedRoute element={<Ward />} />} />
          <Route path="/wards1" element={<ProtectedRoute element={<Ward1 />} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


// // src/components/Navbar.js

// import React from 'react';

// const Navbar = () => {
//   return (
//     <nav>
//       <div className="container">
//         <div className="logo"></div>
//         <ul className="nav-links">
//           <li><a href="/">Home</a></li>
//           <li><a href="/about">About</a></li>
//           <li><a href="/contact">Contact</a></li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
