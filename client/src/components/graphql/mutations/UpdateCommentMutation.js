import { gql } from '@apollo/client';

/** UPDATE_COMMENT_MUTATION gql mutation to update current Issue given user input */
export const UPDATE_COMMENT_MUTATION = gql`
    mutation Mutation($editCommentInput: EditCommentInput) {
        editComment(input: $editCommentInput) {
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