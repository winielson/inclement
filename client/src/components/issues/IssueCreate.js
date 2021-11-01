// IssueCreate.js

// This component displays and lets user edit a form to create a new issue

import React, { useState, useContext } from 'react'
import UserContext from '../../context/userContext'
import IssueContext from '../../context/issueContext';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { CREATE_ISSUE_MUTATION } from '../graphql/mutations/CreateIssueMutation';

export default function IssueCreate() {
    const { userData } = useContext(UserContext);
    const { shouldUpdate, setShouldUpdate } = useContext(IssueContext);
    const [issueData, setIssueData] = useState({data: {
        title: "",
        description: ""
    }}); 

    const history = useHistory();

    // Init useMutation hook that creates a new Issue
    const [createIssue, { error }] = useMutation(CREATE_ISSUE_MUTATION);
    
    const handleInputChange = (e) => {
        e.preventDefault();

        const name = e.target.name;
        const value = e.target.value;
        let issueInfo = issueData;
    
        // Handle text inputs
        if (issueInfo.data.hasOwnProperty(name)) {
            issueInfo.data[name] = value;
            setIssueData({ data: issueInfo.data });
       }
    }

    const handleIssueCreationSubmit = (e) => {
        e.preventDefault();

        // Call useMutation to create new Issue
        createIssue({ variables: { 
            createIssueInput: {
                "title": issueData.data.title, 
                "description": issueData.data.description,
                "currentUser": userData.user.id,
                "totalVotes": 1
            }
        } })

        if(error) {
            console.log(error);
        }

        // alert the user that the new Issue has been created
        // alert('New Issue has successfully been created!')

        // set update issue flag to true
        setShouldUpdate(true);

        // route them back to dashboard
        history.push('/');
    }

    const handleCancelClick = (e) => {
        e.preventDefault();
        history.push('/'); // return to dashboard
    }

    return (
        <div className='issueCreate'>
            <h1>Create a New Issue</h1>
            <div className='issueCreateForm'>
                <form onSubmit={handleIssueCreationSubmit}>
                    <div className='issueCreateInputs'>
                        <label htmlFor="title" >Title: </label>
                        <input type="text" name='title' value={issueData.data.title} onChange={handleInputChange}/><br/><br/>
                        <label htmlFor="description">Description: </label><br/>
                        {/* <input type="text" name='description' value={issueData.data.description} onChange={handleInputChange}/><br/> */}
                        <textarea name='description' value={issueData.data.description} onChange={handleInputChange}/><br/>
                    </div>    
                    <div className='issueCreateButtons'>
                        <button type='submit'>Create</button>
                        <button type='button' onClick={handleCancelClick}>Cancel</button>
                    </div>        
                    
                </form>
            </div>            
        </div>
    )
}
