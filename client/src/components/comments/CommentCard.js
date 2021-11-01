// CommentCard.js

// Handles all comment functionality and is displayed within its parent IssuePage

import React, { useContext, useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client';

import UserContext from '../../context/userContext';
import QueryResult from '../misc/QueryResult';
import { GET_COMMENT_AUTHOR_NAME } from '../graphql/queries/GetCommentAuthorName';
import IssueDate from '../issues/IssueDate';
import { UPDATE_COMMENT_MUTATION } from '../graphql/mutations/UpdateCommentMutation';
import { confirmAlert } from 'react-confirm-alert';
import { DELETE_COMMENT_MUTATION } from '../graphql/mutations/DeleteCommentMutation';

const CommentCard = ({ comment }) => {
    const { userData } = useContext(UserContext);
    const [isEditable, setIsEditable] = useState(false);
    const [inEditMode, setInEditMode] = useState(false); // Used to indicate if user clicked edit
    const [isLoaded, setIsLoaded] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [commentData, setCommentData] = useState({
        data: {
            message: '',
            _id: ''
        }
    });
    
    const { loading, error, data } = useQuery(GET_COMMENT_AUTHOR_NAME, {
        variables: { getUserByIdId: comment.author },
    });       

    // Initialize useMutation for updating a comment
    const [updateComment, updateCommentArgs] = useMutation(UPDATE_COMMENT_MUTATION);

    // useMutation for deleting a comment
    const [deleteComment, deleteCommentArgs] = useMutation(DELETE_COMMENT_MUTATION);

    useEffect(() => {
        const checkIfContextLoaded = async () => {
            await userData.user;
        
            // If user is logged in and token in memory is valid, set user data
            if(userData.user) {
                setIsLoaded(true);
            }
        }

        checkIfContextLoaded();

        if(isLoaded && !isUpdated) {
            setCommentData({data: {
                message: comment.message,
                _id: comment._id
            }})

            if (userData.user.id === comment.author) {
                setIsEditable(true);
            }            
        };    
    }, [userData, comment, isLoaded, inEditMode, isUpdated]);


    const handleEditComment = () => {
        setInEditMode(true);
        console.log({inEditMode});
    }

    const handleEditCommentChange = (e) => {
        e.preventDefault();

        const name = e.target.name;
        const value = e.target.value;
        let commentInfo = commentData;

        // Handle text inputs
        if (commentInfo.data.hasOwnProperty(name)) {
            commentInfo.data[name] = value;
            setCommentData({ data: commentInfo.data });
       }
    }

    const handleEditSubmit = () => {
        // make mutation call to api
        if(updateCommentArgs.error) { // catch GraphQL api errors
            console.log(updateCommentArgs.error);
        }

        console.log({data: commentData.data})

        const updateCommentMutation = updateComment({ variables: { 
            editCommentInput: {
                "_id": commentData.data._id,
                "message": commentData.data.message
            }
        }});

        console.log(updateCommentMutation);

        // switch edit mode off and refresh data
        setInEditMode(false);

        // prevents useEffect from resetting commentData
        setIsUpdated(true);
    }

    
    const handleEditCancel = () => {
        // switch edit mode off
        setInEditMode(false);
    }

    
    const handleEditDeleteConfirm = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className='custom-alert-ui'>
                  <h1>Confirm to submit</h1>
                  <p>Are you sure to delete this Issue?</p><br/>
                  <button onClick={onClose}>No</button>
                  <button
                    onClick={() => {
                      handleEditDelete();
                      onClose();
                    }}
                  >
                    Yes, Delete it!
                  </button>
                </div>
              );
            }
          });
    }

    const handleEditDelete = () => {
        console.log('in handleEditDelete')

        // make mutation call to api
        if(deleteCommentArgs.error) { // catch GraphQL api errors
            console.log(deleteCommentArgs.error);
        }

        // Call mutation
        const deleteCommentMutation = deleteComment({ variables: { 
            deleteCommentInput: {
                "currentUser": userData.user.id,
                "_id": comment._id
            } 
        }});

        console.log(deleteCommentMutation);     

        // Make clear that Issue is deleted
        setCommentData({data: {message: "[deleted]"}});

        // switch editing flags off
        setInEditMode(false);

        setIsUpdated(true);
    }

    
    if(inEditMode) {
        return (
            <div className='comment'>
                <div><b>
                    <QueryResult error={error} loading={loading} data={data}>
                        {data?.getUserById?.username}
                    </QueryResult>  
                :</b></div>
                {/* <div className='commentDescription'> */}
                <div className='commentPageForm'>
                    <form onSubmit={handleEditSubmit}>
                        <textarea name="message" cols="60" rows="5" value={commentData.data.message} onChange={handleEditCommentChange}></textarea>  
                        <div className='commentFormBtns'>
                            <div className='commentFormUpdateBtns'>
                                <button type='submit'>Update</button>
                                <button type='button' onClick={handleEditCancel}>Cancel</button>
                            </div>
                            <div className='commentFormDeleteBtn'>
                                <button type='button' onClick={handleEditDeleteConfirm}>Delete</button>
                            </div>                                
                        </div>  
                    </form>     
                </div>                    
                {/* </div> */}
                <div className='commentDate'><IssueDate timeCreated={comment.timeCreated}/></div>      
            </div>
        )
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
                    {commentData.data.message}
                    <div className='commentDescriptionEdit'>
                        <span onClick={handleEditComment}>Edit</span>
                    </div>                    
                </div>
                <div className='commentDate'><IssueDate timeCreated={comment.timeCreated}/></div>      
            </div>
        )
    }

    return (
        <div className='comment'>
            <div><b>
                <QueryResult error={error} loading={loading} data={data}>
                     {data?.getUserById?.username}
                </QueryResult>  
            :</b></div>
            <div>{commentData.data.message}</div>   
            <div className='commentDate'><IssueDate timeCreated={comment.timeCreated}/></div>         
        </div>
    )
}

export default CommentCard;
