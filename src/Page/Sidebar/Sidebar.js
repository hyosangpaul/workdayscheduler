import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../../style/sidebar/sidebar.css';

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
    };

    return (
    <div className="container">
            <button onClick={handleSidebarToggle} className="toggle-button">
            메뉴
            </button>
        <div className={isSidebarOpen ? 'sidebar open' : 'sidebar'}>
            <ul className='menu'>
                <NavLink to = "/workdayscheduler"><li>정직원</li></NavLink>
                <NavLink to = "/parttime"><li>계약직</li></NavLink>
            </ul>
        </div>
    </div>
    );
};

export default Sidebar;