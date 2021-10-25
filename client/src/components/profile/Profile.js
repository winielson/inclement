// Profile.js

// Loads and displays current users Issues within an IssueContainer

import React, { useContext, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import IssueCard from '../issues/IssueCard';
import userContext from '../../context/userContext';
import QueryResult from '../misc/QueryResult';
import { useHistory } from 'react-router-dom';
import { GET_ISSUES_BY_AUTHOR } from '../graphql/queries/GetIssuesByAuthorQuery';

export default function Profile() {
    const { userData } = useContext(userContext);
    const [isLoaded, setIsLoaded] = useState(false);
    const [getIssues, { loading, error, data }] = useLazyQuery(GET_ISSUES_BY_AUTHOR); // Query to get all the issues using GraphQL
    const history = useHistory();

    useEffect(() => {
        const checkIfContextLoaded = async () => {
            await userData.user;

            if(userData.user) {
                setIsLoaded(true);
            }
            else if(!userData.user) {
                history.push('/login');
            }
        }

        checkIfContextLoaded();

        if(isLoaded) {
            getIssues({ variables: {
                getIssuesByAuthorAuthor: userData.user.id
            }})
        }
    }, [userData, isLoaded, getIssues, history]);    

    if(data) {
        // console.log(data);
    }

    return (
        <div className='profileContainer'>
            <h1>Your Issue Posts</h1>
            <QueryResult error={error} loading={loading} data={data}>
                {data?.getIssuesByAuthor?.map((issue, index) => (
                    <IssueCard issue={issue} key={issue._id}/>
                ))}
            </QueryResult>    
        </div>
    )
}
