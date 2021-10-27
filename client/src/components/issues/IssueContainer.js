// IssueContainer.js

// Sorts issues by totalVotes (descending) and displays issues in the form of IssueCards

import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import QueryResult from '../misc/QueryResult';
import IssueCard from './IssueCard';
import { GET_ALL_ISSUES } from '../graphql/queries/GetAllIssuesQuery';
import { useState, useEffect, useContext } from 'react'
import IssueContext from '../../context/issueContext';
import IssueCreate from './IssueCreate';

export default function IssueContainer() {
    const { loading, error, data, refetch } = useQuery(GET_ALL_ISSUES); // Query to get all the issues using GraphQL
    const { shouldUpdate, setShouldUpdate } = useContext(IssueContext);
    const [ sortedData, setSortedData ] = useState([]);

    const history = useHistory(); 

    useEffect(() => {
        if(data) {
            setSortedData(data?.getAllIssues.slice(0).sort(compare));
            //setSortedData(sortedData.sort(compare));
        }
    }, [data]);

    useEffect(() => {
        if(shouldUpdate) {
            setShouldUpdate(false);
            refetch();
        }
        console.log({msg: 'issuecontainer', shouldUpdate});
    }, [shouldUpdate, setShouldUpdate, refetch]);

    const handleIssueCreation = () => {
        history.push('/createIssue');
    }

    const compare = (a, b) => {
        if (a.totalVotes < b.totalVotes){
            return 1;
        }
        if (a.totalVotes > b.totalVotes){
            return -1;
        }

        return 0;
    }

    return (
        <div>
            <div className='createIssueDiv'>
                <span className='createIssueBtn' onClick={handleIssueCreation}>Create a new Issue</span>
            </div>                    
            <QueryResult error={error} loading={loading} data={data}>
                {sortedData.map((issue, index) => (
                    <IssueCard issue={issue} key={issue._id}/>
                ))}

                {console.log({data})}
            </QueryResult>            
        </div>
    )
}
