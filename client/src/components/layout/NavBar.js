// NavBar.js

// This component renders the default navbar for each page
// It contains A link to the home page and login and register buttons

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AuthOptions from '../auth/AuthOptions'

export default class NavBar extends Component {
    render() {
        return (
            <div className="navBar">
                    <div className='navBarTitle'>
                        <Link to='/'><h1 className='title'>inclement</h1></Link>
                    </div>
                    <div className='navBarAuth'>
                        <AuthOptions />
                    </div>           
            </div>
        )
    }
}
