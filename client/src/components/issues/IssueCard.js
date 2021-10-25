// IssueCard.js

// Child of IssueContainer that displays Issue data and allows redirection to its respective IssuePage

import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useQuery } from '@apollo/client';

import QueryResult from '../misc/QueryResult';
import IssueVotes from './IssueVotes';
import { GET_ISSUE_AUTHOR_NAME } from '../graphql/queries/GetIssueAuthorQuery';

const IssueCard = ({ issue }) => {
    const history = useHistory();
    const [author, setAuthor] = useState(undefined); 

    const { loading, error, data } = useQuery(GET_ISSUE_AUTHOR_NAME, {
        variables: { getUserByIdId: issue.author },
        onCompleted: (data) => {
            setAuthor(data.getUserById.username); // set author state to be passed to IssuePage
        }
    });       

    const handleIssueContentClick = async () => {
        history.push('/issues/'+issue._id, { issue: issue, author: author });
    }

    return (
        <div className='issueCard'>
            <IssueVotes issue={issue} />
            <div className='issueContent' onClick={handleIssueContentClick}>
                <h2>{issue.title}</h2>
                <p>{issue.description}</p>
                <div className='issueAuthor'>Posted by{' '} 
                    <QueryResult error={error} loading={loading} data={data}>
                        {data?.getUserById?.username}                        
                    </QueryResult>
                </div>
            </div>
        </div>        
    )
}

export default IssueCard;
