// LandingPage.js

// Default page user is directed to when they are not logged in
// Displays info about the site

import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import UserContext from '../../context/userContext';

export default function LandingPage() {
    const { userData } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        // Redirect to dashboard page if already signed in
        if(userData.user) {
            history.push('/'); 
        }
    });

    return (
        <div className='landingPage'>
            <h1>What is Inclement?</h1>
            <p>
                <span>A place where you can explore the latest news about Climate Issues and discuss with others.</span><br/>
                <br/>
                <span>Interact with our active community by reading, creating, and commenting on posts.</span>
            </p>
            <Link to='/register'>Join the Community</Link>            
        </div>
    )
}
