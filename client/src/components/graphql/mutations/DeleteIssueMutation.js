import { gql } from '@apollo/client';

/** DELETE_ISSUE_MUTATION gql mutation to delete current Issue */
export const DELETE_ISSUE_MUTATION = gql`
    mutation Mutation($deleteIssueInput: DeleteInput) {
        deleteIssue(input: $deleteIssueInput) {
            ... on Deleted {
                deletedCount
            }
            ... on Error {
                errorMessage
            }
        }
    }
`;