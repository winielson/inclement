// AuthOptions.jsx

// This function component displays the authentication buttons on the header

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../context/userContext'

export default function AuthOptions() {
    const { userData, setUserData } = useContext(UserContext);

    const handleLogout = () => {
        // Reset userData and localStorage on logout
        setUserData({
            token: undefined,
            user: undefined
        });

        localStorage.setItem("auth-token", "");
    }

    return (
        <nav className='authOptions'>
            {userData.user ? ( // Links are to profile and logout instead of register and login when there is a user logged in
                <>
                    <Link to="/profile">{userData.user.username}</Link>
                    <Link onClick={handleLogout} to="/login">Logout</Link>
                </>
            ) : (
                <>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                </>
            )}
        </nav>
    )
}
