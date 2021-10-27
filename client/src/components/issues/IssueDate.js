import React from 'react'

const IssueDate = ({ timeCreated }) => {
    let unix = parseInt(timeCreated);
    let date = new Date(unix);
    let humanFormat = date.toLocaleString();
    

    return (
        <>
            {' '+humanFormat}
        </>
    )
}

export default IssueDate;