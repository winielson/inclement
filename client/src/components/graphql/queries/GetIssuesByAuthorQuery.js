import { gql } from '@apollo/client';

/** GET_ISSUES_BY_AUTHOR gql query to retrieve all issues given current user */
export const GET_ISSUES_BY_AUTHOR = gql`
    query Query($getIssuesByAuthorAuthor: String!) {
        getIssuesByAuthor(author: $getIssuesByAuthorAuthor) {
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