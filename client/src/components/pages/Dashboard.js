// Dashboard.js

// App's origin path that contains IssueContainer and redirects user if not allowed

import React, { useContext, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import UserContext from '../../context/userContext';
import IssueContainer from '../issues/IssueContainer';

export default function Dashboard() {
    const { userData } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        // Redirect to landing page if not signed in
        if(!userData.user) {
            history.push('/landingPage'); 
        }
    }, [history, userData]);

    return (
        <div>
            {/* Check if userData is set */}
            {userData.user ? (
                <>
                    {/* <h1>Welcome {userData.user.username}</h1> */}
                    <IssueContainer />                    
                </>
            ) : (
                <>
                    <h2>You are not logged in</h2>
                    <Link to='/login'>Login</Link>
                </>
            )}
        </div>
    )
}
