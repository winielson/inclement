// IssuePage.js

// Displays an Issue with its comments 
// Allows Issues to be voted on, edited, and deleted
// Allows Comments to be added to Issue

import React, { useState, useContext, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import QueryResult from '../misc/QueryResult';
import CommentCard from '../comments/CommentCard';
import UserContext from '../../context/userContext';
import IssueVotes from './IssueVotes';
import IssueContext from '../../context/issueContext';
import IssueDate from './IssueDate';

// Import graphql queries and mutations
import { GET_ISSUE_COMMENTS } from '../graphql/queries/GetIssueComments';
import { UPDATE_ISSUE_MUTATION } from '../graphql/mutations/UpdateIssueMutation';
import { DELETE_ISSUE_MUTATION } from '../graphql/mutations/DeleteIssueMutation';
import { CREATE_COMMENT_MUTATION } from '../graphql/mutations/CreateCommentMutation';

const IssuePage = ({ match, location }) => {
    const { userData } = useContext(UserContext);
    const [showEdit, setShowEdit] = useState(false); // Used to indicate if currentUser is author an can edit issue
    const [inEditMode, setInEditMode] = useState(false); // Used to indicate if user clicked edit
    const [isLoaded, setIsLoaded] = useState(false);
    const [issueData, setIssueData] = useState({
        data: {
            title: '',
            description: ''
        }
    });
    const [addCommentData, setAddCommentData] = useState({message: ''});
    const [shouldRefetch, setShouldRefetch] = useState(false);
    const [isRefetched, setIsRefetched] = useState(false);
    const { setShouldUpdate } = useContext(IssueContext);

    // Store arguments as variables
    const { params: { _id } } = match; // Get _id from url params NOTE: match is passed by history.push()
    const issue = location.state.issue;
    const issueAuthor = location.state.author;

     /*
        GraphQL Query and Mutation initializations
    */
    // Initialize useQuery hook to get all issue comments
    const { loading, error, data, refetch } = useQuery(GET_ISSUE_COMMENTS, {
        variables: { getCommentsByIssueIssue: _id },
    });     

    // Initialize useMutation for updating an issue
    const [updateIssue, updateIssueArgs] = useMutation(UPDATE_ISSUE_MUTATION);

    // Initialize useMutation for deleting an issue
    const [deleteIssue, deleteIssueArgs] = useMutation(DELETE_ISSUE_MUTATION);

    // Initialize useMutation for creating a comment
    const [createComment, createCommentArgs] = useMutation(CREATE_COMMENT_MUTATION);
    
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
            // Set issue state data
            setIssueData({data: {
                title: issue.title,
                description: issue.description
            }})

            if (userData.user.username === issueAuthor) {
                setShowEdit(true);
                // setInEditMode(true);
            }           
        };     
    }, [userData, isLoaded, issueAuthor, issue]);   
    
    // Used to refetch comments when one is added or changed
    // triggered when shouldRefetch state is true
    useEffect(() => {
        const reloadComments = async () => {
            await refetch();

            setIsRefetched(true);
        }

        reloadComments();

        if(shouldRefetch && isRefetched) {            
            setShouldRefetch(false);
            setIsRefetched(false);
        }
    }, [shouldRefetch, isRefetched, setShouldRefetch, refetch])  
    
    /*
        Issue Edit Handling
    */
    const handleIssueEdit = () => {
        setInEditMode(true);
    }

    const handleEditIssueChange = (e) => {
        e.preventDefault();

        const name = e.target.name;
        const value = e.target.value;
        let issueInfo = issueData;
    
        // Handle text inputs
        if (issueInfo.data.hasOwnProperty(name)) {
            issueInfo.data[name] = value;
            setIssueData({ data: issueInfo.data });
       }
    }

    const handleEditSubmit = () => {
        // make mutation call to api
        if(updateIssueArgs.error) { // catch GraphQL api errors
            console.log(updateIssueArgs.error);
        }

        const updateIssueMutation = updateIssue({ variables: { 
            editIssueInput: {
                "title": issueData.data.title,
                "description": issueData.data.description,
                "currentUser": userData.user.id,
                "_id": issue._id
            } 
        }});

        console.log(updateIssueMutation);

        // switch edit mode off and refresh data
        setInEditMode(false);

        // let issueContainer know it needs to update via issueContext
        setShouldUpdate(true);

        // display message notifying user that the issue is updated successfully
        alert('Issue was updated successfully!');
    }

    // const handleEditDeleteConfirm = () => {
    //     confirmAlert({
    //         title: 'Confirm to submit',
    //         message: 'Are you sure to delete this Issue?',
    //         buttons: [
    //             {
    //                 label: 'Yes',
    //                 onClick: handleEditDelete
    //             },
    //             {
    //                 label: 'No',
    //             }
    //         ]
    //     });
    // }

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
        if(deleteIssueArgs.error) { // catch GraphQL api errors
            console.log(updateIssueArgs.error);
        }

        // Call mutation
        const deleteIssueMutation = deleteIssue({ variables: { 
            deleteIssueInput: {
                "currentUser": userData.user.id,
                "_id": issue._id
            } 
        }});

        console.log(deleteIssueMutation);     

        // Make clear that Issue is deleted
        setIssueData({data: {title: "[deleted]", description: "[deleted]"}});

        // switch editing flags off
        setShowEdit(false);
        setInEditMode(false);
        
        // let issueContainer know it needs to update via issueContext
        setShouldUpdate(true);
    }

    const handleEditCancel = () => {
        // switch edit mode off
        setInEditMode(false);
    }

    /*
        Add Comment Functionality
    */
    const handleAddCommentSubmit = (e) => {
        e.preventDefault();

        // make mutation call to api
        if(createCommentArgs.error) { // catch GraphQL api errors
            console.log(createCommentArgs.error);
        }

        const createCommentMutation = createComment({ variables: { 
            createCommentInput: {
                "message": addCommentData.message,
                "issue": issue._id,
                "currentUser": userData.user.id
            } 
        }});

        console.log(createCommentMutation);

        // reset comment input field
        setAddCommentData({ message: '' });  

        // trigger useEffect to refetch the comments by querying again
        setShouldRefetch(true);
    }

    const handleAddCommentChange = (e) => {
        e.preventDefault();

        const message = e.target.value;

        setAddCommentData({ message: message });  
    }      

    if(showEdit && !inEditMode) {
        return (
            <div className='issuePage'>
                <div className='issues'>
                    <IssueVotes issue={issue} />
                    <div className='issueContent'>
                        <h2>{issueData.data.title}</h2>
                        <p>{issueData.data.description}</p>
                        <div className='issueAuthor'>
                            Posted by {issueAuthor} 
                            <IssueDate timeCreated={issue.timeCreated}/>
                            <div className='issueAuthorEdit'>
                                <span onClick={handleIssueEdit}>Edit</span>
                            </div>                            
                        </div>
                    </div>
                </div>       
                <div className='comments'>
                    <h3>Comments: </h3>
                    <div className='addCommentDiv'>
                        <form onSubmit={handleAddCommentSubmit}>
                            <input type="text" name='message' value={addCommentData.message} onChange={handleAddCommentChange}/>
                            <button type='submit'>Add Comment</button>
                        </form>
                    </div>
                    <QueryResult error={error} loading={loading} data={data}>
                        {data?.getCommentsByIssue?.map((comment, index) => (
                            <CommentCard comment={comment} key={comment._id}/>
                        ))}
                        {data?.getUserById?.username}
                    </QueryResult>  
                </div>
            </div>
        )
    }

    if(inEditMode) {
        return (
            <div className='issuePage'>
                <div className='issues'>
                    <div className='issuePageForm'>
                        <form onSubmit={handleEditSubmit}>
                            <div className='issueFormInput'>
                                <input type="text" name='title' value={issueData.data.title} onChange={handleEditIssueChange}/>
                                {/* <input type="textarea" name='description' value={issueData.data.description} onChange={handleEditIssueChange}/> */}
                                <textarea name='description' value={issueData.data.description} onChange={handleEditIssueChange}/>
                            </div>   
                            <div className='issueFormBtns'>
                                <div className='issueFormUpdateBtns'>
                                    <button type='submit'>Update</button>
                                    <button type='button' onClick={handleEditCancel}>Cancel</button>
                                </div>
                                <div className='issueFormDeleteBtn'>
                                    <button type='button' onClick={handleEditDeleteConfirm}>Delete</button>
                                </div>                                
                            </div>                            
                        </form>                        
                    </div>
                </div>       
                <div className='comments'>
                    <h3>Comments: </h3>
                    <div className='addCommentDiv'>
                        <form onSubmit={handleAddCommentSubmit}>
                            <input type="text" name='message' value={addCommentData.message} onChange={handleAddCommentChange}/>
                            <button type='submit'>Add Comment</button>
                        </form>
                    </div>
                    <QueryResult error={error} loading={loading} data={data}>
                        {data?.getCommentsByIssue?.map((comment, index) => (
                            <CommentCard comment={comment} key={comment._id}/>
                        ))}
                        {data?.getUserById?.username}
                    </QueryResult>  
                </div>
            </div>
        )
    }

    return (
        <div className='issuePage'>
            <div className='issues'>
                <IssueVotes issue={issue} />
                <div className='issueContent'>
                    <h2>{issueData.data.title}</h2>
                    <p>{issueData.data.description}</p>
                    <p className='issueAuthor'>Posted by {issueAuthor}</p>
                </div>
            </div>       
            <div className='comments'>
                <h3>Comments: </h3>
                <div className='addCommentDiv'>
                    <form onSubmit={handleAddCommentSubmit}>
                        <input type="text" name='message' value={addCommentData.message} onChange={handleAddCommentChange}/>
                        <button type='submit'>Add Comment</button>
                    </form>
                </div>
                <QueryResult error={error} loading={loading} data={data}>
                    {data?.getCommentsByIssue?.map((comment, index) => (
                        <CommentCard comment={comment} key={comment._id}/>
                    ))}
                    {data?.getUserById?.username}
                </QueryResult>  
            </div>
        </div>
    )
}

export default IssuePage;