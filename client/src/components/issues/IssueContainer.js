// IssueContainer.js

// Sorts issues by totalVotes (descending) and displays issues in the form of IssueCards

import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import QueryResult from '../misc/QueryResult';
import IssueCard from './IssueCard';
import { GET_ALL_ISSUES } from '../graphql/queries/GetAllIssuesQuery';

export default function IssueContainer() {
    const { loading, error, data } = useQuery(GET_ALL_ISSUES); // Query to get all the issues using GraphQL
    const history = useHistory(); 

    let sortedData = []; // Used to sort issue query data

    const handleIssueCreation = () => {
        history.push('/createIssue');
    }

    const compare = (a, b) => {
        // console.log(a)
        if ( a.totalVotes < b.totalVotes ){
            return 1;
        }
        if ( a.totalVotes > b.totalVotes ){
            return -1;
        }
        return 0;
    }

    if(data) {
        sortedData = data?.getAllIssues.slice(0);
        sortedData = sortedData.sort(compare);
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
            </QueryResult>    
        </div>
    )
}
