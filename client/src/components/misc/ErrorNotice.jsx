// ErrorNotice.jsx

// This component displays a popup containing the user error on authentication components

import React from 'react'

export default function ErrorNotice(props) {
    return (
        <div className='errorNotice'>
            <span>{props.message}</span>
            <button onClick={props.clearError}>X</button>
        </div>
    )
}
