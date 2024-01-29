// Navbar.js

import React, { useRef, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Link, useNavigate } from 'react-router-dom';
import { OverlayPanel } from 'primereact/overlaypanel';
import logo from '../assets/logo.png';


const Navbar = () => {
    const overlayPanelRef = useRef(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const navigate = useNavigate();

    // Retrieve user information from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || { full_name: 'Guest' };

    const profileMenu = [
        {
            label: 'Profile',
            icon: 'pi pi-user-edit',
            command: () => {
                // Handle the profile click action
                setMenuVisible(false);
                // Add logic to navigate to the profile page or show a profile modal
            },
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
                // Handle the logout click action
                setMenuVisible(false);
                // Add logic to perform logout, e.g., clearing authentication tokens
                localStorage.removeItem('access_token'); // Clear access token
                localStorage.removeItem('user'); // Clear user information
                navigate('/logout'); // Navigate to the logout page
            },
        },
    ];

    const items = [
        {
          label: (
            <span onClick={() => navigate('/')}>
              <i className="pi pi-home"></i>
              <span> Home</span>
            </span>
          ),
        },
        {
          label: (
            <span onClick={() => navigate('/cars')}>
              <i className="pi pi-car"></i>
              <span> Car</span>
            </span>
          ),
        },
        {
          label: (
            <span onClick={() => navigate('/patients')}>
              <i className="pi pi-user"></i>
              <span> Patients</span>
            </span>
          ),
        },
        {
          label: (
            <span onClick={() => navigate('/wards')}>
              <i className="pi pi-user"></i>
              <span> Ward</span>
            </span>
          ),
        },
        {
          label: (
            <span onClick={() => navigate('/wards1')}>
              <i className="pi pi-user"></i>
              <span> redux_sample</span>
            </span>
          ),
        },
      ];
    

    const start = (
        <img alt="logo" src={logo} height="40" className="p-mr-2"></img>
    );

    const end = (
        <div>
            <span
                style={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={(e) => {
                    setMenuVisible(!menuVisible);
                    overlayPanelRef.current.toggle(e);
                }}
            >
                {user.full_name} <i className="pi pi-chevron-down" style={{ fontSize: '1em' }}></i>
            </span>
            <OverlayPanel ref={overlayPanelRef} dismissable={true} showCloseIcon={true}>
                {profileMenu.map((item) => (
                    <div key={item.label} onClick={item.command}>
                        <i className={item.icon} style={{ marginRight: '5px' }}></i>
                        {item.label}
                    </div>
                ))}
            </OverlayPanel>
        </div>
    );

    return (
        <div>
            <Menubar model={items} start={start} end={end} />
        </div>
    );
};

export default Navbar;
