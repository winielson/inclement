// CommentCard.js

// Handles all comment functionality and is displayed within its parent IssuePage

import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client';

import UserContext from '../../context/userContext';
import QueryResult from '../misc/QueryResult';
import { GET_COMMENT_AUTHOR_NAME } from '../graphql/queries/GetCommentAuthorName';
import IssueDate from '../issues/IssueDate';

const CommentCard = ({ comment }) => {
    const { userData } = useContext(UserContext);
    const [isEditable, setIsEditable] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false)
    
    const { loading, error, data } = useQuery(GET_COMMENT_AUTHOR_NAME, {
        variables: { getUserByIdId: comment.author },
    });       

    useEffect(() => {
        const checkIfContextLoaded = async () => {
            await userData.user;
        
            // If user is logged in and token in memory is valid, set user data
            if(userData.user) {
                setIsLoaded(true);
            }
        }

        checkIfContextLoaded();

        if(isLoaded) {
            if (userData.user.id === comment.author) {
                setIsEditable(true);
            }            
        };    
    }, [userData, comment, isLoaded]);

    const handleEditComment = () => {
        console.log('handleEditComment');
    }

    // Show edit button if current user created the post
    if (isEditable) {
        return (
            <div className='comment'>
                <div><b>
                    <QueryResult error={error} loading={loading} data={data}>
                        {data?.getUserById?.username}
                    </QueryResult>  
                :</b></div>
                <div className='commentDescription'>
                    {comment.message}
                    <div className='commentDescriptionEdit'>
                        <span onClick={handleEditComment}>Edit</span>
                    </div>                    
                </div>
            </div>
        )
    }

    return (
        <div className='comment'>
            <div><b>
                <QueryResult error={error} loading={loading} data={data}>
                     {data?.getUserById?.username}{console.log(comment)}<IssueDate timeCreated={comment.timeCreated}/>
                </QueryResult>  
            :</b></div>
            <p>{comment.message}</p>            
        </div>
    )
}

export default CommentCard;
