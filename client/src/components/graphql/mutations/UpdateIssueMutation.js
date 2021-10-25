import { gql } from '@apollo/client';

/** UPDATE_ISSUE_MUTATION gql mutation to update current Issue given user input */
export const UPDATE_ISSUE_MUTATION = gql`
    mutation Mutation($editIssueInput: EditIssueInput) {
        editIssue(input: $editIssueInput) {
            ... on Edited {
                acknowledged
                modifiedCount
                upsertedId
                upsertedCount
                matchedCount
            }
            ... on Error {
                errorMessage
            }
        }
    }
`;