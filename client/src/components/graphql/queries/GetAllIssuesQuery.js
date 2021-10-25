import { gql } from '@apollo/client';

export const GET_ALL_ISSUES = gql`
    query Query {
        getAllIssues {
            title
            description
            timeCreated
            author
            upvotes
            downvotes
            totalVotes
            usersUpvoted
            usersDownvoted
            _id
        }
    }
`;