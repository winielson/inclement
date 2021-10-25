import { gql } from '@apollo/client';

export const CREATE_ISSUE_MUTATION = gql`
    mutation Mutation($createIssueInput: CreateIssueInput) {
        createIssue(input: $createIssueInput) {
            ... on Issue {
                title
                description
            }
            ... on Error {
                errorMessage
            }
        }
    }
`