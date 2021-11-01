import { gql } from '@apollo/client';

/** DELETE_COMMENT_MUTATION gql mutation to delete current Issue */
export const DELETE_COMMENT_MUTATION = gql`
    mutation Mutation($deleteCommentInput: DeleteInput) {
        deleteComment(input: $deleteCommentInput) {
            ... on Deleted {
                deletedCount
            }
            ... on Error {
                errorMessage
            }
        }
    }
`;