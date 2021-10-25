// Login.jsx

// Displays and handles user login

import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import UserContext from '../../context/userContext';
import ErrorNotice from '../../components/misc/ErrorNotice'

export default function Login() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
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
            const loginUser = {username, password};
            const loginResponse = await axios.post('/users/login', loginUser);

            setUserData({
                token: loginResponse.data.token,
                user: loginResponse.data.user
            });

            localStorage.setItem('auth-token', loginResponse.data.token);
            
            history.push('/');
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='login'>
            <h1>Login</h1>

            {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}

            <form onSubmit={handleSubmit}>
                <div className='usernameRow'>
                    <label htmlFor="username">Username: </label>
                    <input type='username' id='username' name='username' onChange={e => setUsername(e.target.value)}/>
                </div>
                <div className='passwordRow'>            
                    <label htmlFor="password">Password: </label>
                    <input type='password' id='password' name='password' onChange={e => setPassword(e.target.value)}/>
                </div>
                <div className='buttonRow'>            
                    <input type="submit" value='Login' className="btn btn-primary"/>
                </div>                
            </form>            
        </div>
    )
}
