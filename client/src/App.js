// App.js

// Root component of app that sets context and sets up react-router

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import NavBar from './components/layout/NavBar';
import Register from './components/auth/Register';
import Dashboard from './components/pages/Dashboard';
import Login from './components/auth/Login';
import UserContext from './context/userContext';
import IssueContext from './context/issueContext';
import LandingPage from './components/pages/LandingPage';
import IssuePage from './components/issues/IssuePage';
import IssueCreate from './components/issues/IssueCreate';
import Profile from './components/profile/Profile';


function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined
  });
  const [ shouldUpdate, setShouldUpdate] = useState(false);
  

  useEffect(() => {
    const checkLoggedIn = async () => {
      // Get current token stored in local storage
      // NOTE: keeping token in local storage might make it vulnerable to XSS attacks
      // https://www.educative.io/courses/web-security-access-management-jwt-oauth2-openid-connect/x1zlqDMRlol
      // TODO: find way to store it more securely, possibly by storing in memory
      // https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/
      let token = localStorage.getItem('auth-token');

      // Set token to be an empty string in memory if null
      if(token === null) {
        localStorage.setItem('auth-token', '');
        token = '';
      }

      // Validate the current token in memory
      const tokenResponse = await axios.post('/users/validateToken', null, {headers: {'x-auth-token': token}});

      // If user is logged in and token in memory is valid, set user data
      if(tokenResponse.data) {
        const userRes = await axios.get('/users', {headers: {'x-auth-token': token}});

        console.log('App.js userRes.data');
        console.log(userRes.data);
        
        setUserData({
          token,
          user: userRes.data
        });
      }
    }

    checkLoggedIn();
  }, []);
  

  return (
    <div className='App'>
      <BrowserRouter>
        <UserContext.Provider value={{ userData, setUserData }}>
          <IssueContext.Provider value={{ shouldUpdate, setShouldUpdate }}>    
            <NavBar />
            <div className='content'>
              <Switch>
                <Route exact path='/' component={Dashboard} />
                <Route path='/landingPage' component={LandingPage} />
                <Route path='/register' component={Register} />
                <Route path='/login' component={Login} />
                <Route path="/issues/:_id" component={IssuePage} />
                <Route path="/createIssue" component={IssueCreate} />
                <Route path="/profile" component={Profile} />
              </Switch>
            </div>  
          </IssueContext.Provider>        
        </UserContext.Provider>
      </BrowserRouter>    
    </div>    
  );
}

export default App;
