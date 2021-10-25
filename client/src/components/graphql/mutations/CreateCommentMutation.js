import { gql } from '@apollo/client';

/** CREATE_COMMENT_MUTATION gql mutation to create new comment on current Issue */
export const CREATE_COMMENT_MUTATION = gql`
    mutation Mutation($createCommentInput: CreateCommentInput) {
        createComment(input: $createCommentInput) {
            ... on Comment {
                message
                issue
                author
                _id
            }
            ... on Error {
                errorMessage
            }
        }
    }
`;  