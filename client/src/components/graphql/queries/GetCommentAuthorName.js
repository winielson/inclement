import { gql } from '@apollo/client'

/** GET_COMMENT_AUTHOR_NAME gql query to retreive all issues */
export const GET_COMMENT_AUTHOR_NAME = gql`
    query Query($getUserByIdId: String!) {
        getUserById(_id: $getUserByIdId) {
            ... on User {
                username
            }
            ... on Error {
                errorMessage
            }
        }
    }
`;