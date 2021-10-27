import { gql } from '@apollo/client';

/** GET_ISSUE_COMMENTS gql query to retrieve all issues and issue author name */
export const GET_ISSUE_COMMENTS = gql`
    query Query($getCommentsByIssueIssue: String!) {
        getCommentsByIssue(issue: $getCommentsByIssueIssue) {
            message
            issue
            author
            timeCreated
            _id
        }
    }
`;