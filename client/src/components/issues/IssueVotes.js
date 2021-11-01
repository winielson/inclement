// IssueVotes.js

// Child of IssueCard that displays and allows updating of the current user's votes

import React, { useState, useContext, useEffect } from 'react'
import { useMutation } from '@apollo/client';

import UserContext from '../../context/userContext';
import { UPDATE_ISSUE_VOTES } from '../graphql/mutations/UpdateIssueVotesMutation';

export default function IssueVotes({ issue }) {
    const { userData } = useContext(UserContext);
    const [voteData, setVoteData] = useState({
        usersUpvoted: '',
        usersDownvoted: '',
        totalUpvotes: '',
        totalDownvotes: '',
        totalVotes: '',
        upvoteColor: 'pink',
        downvoteColor: 'cyan'
    });
    const [isLoaded, setIsLoaded] = useState(false);

    // Initialize useMutation for updating an issue
    const [updateVotes] = useMutation(UPDATE_ISSUE_VOTES);

    useEffect(() => {
        const checkIfContextLoaded = async () => {
            await userData.user;
        
            // If user is logged in and token in memory is valid, set user data
            if(userData.user) {
                setIsLoaded(true);
            }
        }

        checkIfContextLoaded();

        // Set issue vote data of current issue and color based on current user
        if(isLoaded) {
            setVoteData({
                usersUpvoted: issue.usersUpvoted,
                usersDownvoted: issue.usersDownvoted,
                totalUpvotes: issue.usersUpvoted.length,
                totalDownvotes: issue.usersDownvoted.length,
                totalVotes: issue.usersUpvoted.length - issue.usersDownvoted.length,
                upvoteColor: (issue.usersUpvoted.includes(userData.user.id) ? "#FF8b60" : "#18191A"),
                downvoteColor: (issue.usersDownvoted.includes(userData.user.id) ? "#9494FF" : "#18191A")
            });   
        }
    }, [isLoaded, userData, issue]);

    const handleUpvote = (e) => {
        e.preventDefault();

        // Create copy of voteData obj to make changes to it
        const voteObj = voteData;

        // Create copy of usersUpvoted array to be manipulated
        let upvoteArr = voteObj.usersUpvoted.slice(0);
        let downvoteArr = voteObj.usersDownvoted.slice(0);

        // console.log(upvoteArr);

        // If already in upvoted list, remove it from list
        if(upvoteArr.includes(userData.user.id)) {
            // Remove from upvote array by value
            const index = upvoteArr.indexOf(userData.user.id);

            if (index !== -1) {
                upvoteArr.splice(index, 1); // Remove by using splice method
            }
        }
        // If in downvoted list, remove it from downvoted list and add to upvoted list
        else if(downvoteArr.includes(userData.user.id)) {
            // Remove from downvote array by value
            const index = downvoteArr.indexOf(userData.user.id);

            if (index !== -1) {
                downvoteArr.splice(index, 1); // Remove by using splice method
            }

            // Push currentUser id into upvote array
            upvoteArr.push(userData.user.id);
        }
        // Base: Add nonvoted user's vote to upvoted list
        else { 
            upvoteArr.push(userData.user.id);
        }

        // Remove null values from arrays
        upvoteArr = upvoteArr.filter(x => x !== null);
        downvoteArr = downvoteArr.filter(x => x !== null);

        setVoteData({                
            usersUpvoted: upvoteArr,
            usersDownvoted: downvoteArr,
            totalUpvotes: upvoteArr.length,
            totalDownvotes: downvoteArr.length,
            totalVotes: upvoteArr.length - downvoteArr.length,
            upvoteColor: (upvoteArr.includes(userData.user.id) ? "#FF8b60" : "#18191A"),
            downvoteColor: (downvoteArr.includes(userData.user.id) ? "#9494FF" : "#18191A")
        });

        // Update issue data by calling editIssue mutation
        updateVotes({ variables: { 
            editIssueInput: {
                "_id": issue._id,
                "usersUpvoted": upvoteArr,
                "usersDownvoted": downvoteArr,
                "totalVotes": upvoteArr.length - downvoteArr.length
            }
        }});
    }

    const handleDownvote = (e) => {
        e.preventDefault();

        // Create copy of voteData obj to make changes to it
        const voteObj = voteData;

        // Create copy of usersUpvoted array to be manipulated
        let upvoteArr = voteObj.usersUpvoted.slice(0);
        let downvoteArr = voteObj.usersDownvoted.slice(0);

        // If already in downvote list, remove it from list
        if(downvoteArr.includes(userData.user.id)) {
            // Remove from upvote array by value
            const index = downvoteArr.indexOf(userData.user.id);

            if (index !== -1) {
                downvoteArr.splice(index, 1); // Remove by using splice method
            }
        }
        // If in upvoted list, remove it from upvoted list and add to downvoted list
        else if(upvoteArr.includes(userData.user.id)) {
            // Remove from downvote array by value
            const index = upvoteArr.indexOf(userData.user.id);

            if (index !== -1) {
                upvoteArr.splice(index, 1); // Remove by using splice method
            }

            // Push currentUser id into upvote array
            downvoteArr.push(userData.user.id);
        }
        // Base: Add nonvoted user's vote to upvoted list
        else { 
            downvoteArr.push(userData.user.id);
        }

        // NOTE: null values might come from an userData being undefined
        // TODO: fix problem in parent components and delete these filters
        // Remove null values from arrays
        upvoteArr = upvoteArr.filter(x => x !== null);
        downvoteArr = downvoteArr.filter(x => x !== null);

        setVoteData({                
            usersUpvoted: upvoteArr,
            usersDownvoted: downvoteArr,
            totalUpvotes: upvoteArr.length,
            totalDownvotes: downvoteArr.length,
            totalVotes: upvoteArr.length - downvoteArr.length,
            upvoteColor: (upvoteArr.includes(userData.user.id) ? "#FF8b60" : "#18191A"),
            downvoteColor: (downvoteArr.includes(userData.user.id) ? "#9494FF" : "#18191A")
        });

        // Update issue data by calling editIssue mutation
        updateVotes({ variables: { 
            editIssueInput: {
                "_id": issue._id,
                "usersUpvoted": upvoteArr,
                "usersDownvoted": downvoteArr,
                "totalVotes": upvoteArr.length - downvoteArr.length
            }
        }});
    }

    return (
        <div className='issueVotes'>
            <button type='button' className='upvoteButton' style={{backgroundColor: voteData.upvoteColor}} onClick={handleUpvote}>+</button>
            <span className='voteCount'>{voteData.totalVotes}</span>
            <button type='button' className='downvoteButton' style={{backgroundColor: voteData.downvoteColor}} onClick={handleDownvote}>-</button>
        </div>
    )
    
}
