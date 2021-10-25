import { gql } from '@apollo/client';

export const UPDATE_ISSUE_VOTES = gql`
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