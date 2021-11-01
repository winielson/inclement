    // // const handleEditSubmit = () => {
    // //     // make mutation call to api
    // //     if(updateIssueArgs.error) { // catch GraphQL api errors
    // //         console.log(updateIssueArgs.error);
    // //     }

    // //     const updateIssueMutation = updateIssue({ variables: { 
    // //         editIssueInput: {
    // //             "title": issueData.data.title,
    // //             "description": issueData.data.description,
    // //             "currentUser": userData.user.id,
    // //             "_id": issue._id
    // //         } 
    // //     }});

    // //     console.log(updateIssueMutation);

    // //     // switch edit mode off and refresh data
    // //     setInEditMode(false);

    // //     // let issueContainer know it needs to update via issueContext
    // //     setShouldUpdate(true);

    // //     // display message notifying user that the issue is updated successfully
    // //     alert('Issue was updated successfully!');
    // // }