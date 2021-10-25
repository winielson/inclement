// Register.jsx

// Displays and handles user registration

import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import UserContext from '../../context/userContext';
import ErrorNotice from '../../components/misc/ErrorNotice'

export default function Register() {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [error, setError] = useState();
    const { userData, setUserData } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        // Redirect to dashboard page if already signed in
        if(userData.user) {
            history.push('/'); 
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newUser = {username, email, password, passwordCheck};

            // Register new user
            await axios.post('/users/register', newUser);

            // Login new user
            const loginResponse = await axios.post('/users/login', { username, password });

            // Set the site's user data
            setUserData({
                token: loginResponse.data.token,
                user: loginResponse.data.user
            });

            localStorage.setItem('auth-token', loginResponse.data.token);

            history.push('/'); // Redirect to dashboard
        }
        catch (err) {
            err.response.data.msg && setError(err.response.data.msg);
        }
    }

    return (
        <div className='register'>
            <h1>Register</h1>
            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
            
            <form onSubmit={handleSubmit}>
                <div className='usernameRow'>
                    <label htmlFor="username">Username: </label>
                    <input type='username' id='username' name='username' onChange={e => setUsername(e.target.value)}/>
                </div>
                <div className='emailRow'>
                    <label htmlFor="email">Email: </label>
                    <input type='email' id='email' name='email' onChange={e => setEmail(e.target.value)}/>
                </div>
                <div className='passwordRow'>
                    <label htmlFor="password">Password: </label>
                    <input type='password' id='password' name='password' onChange={e => setPassword(e.target.value)}/>
                    <input type="password" id='passwordCheck' placeholder="Confirm password" name='passwordCheck' onChange={e => setPasswordCheck(e.target.value)}/>
                </div>
                <input type="submit" value="Register" className="btn btn-primary" />
            </form>
        </div>
    )
}
