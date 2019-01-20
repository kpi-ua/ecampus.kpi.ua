import React from 'react'

const ProgressBar = (props) =>
<div className="spinner">
    <div>
        {props.text}
    </div>
    <div className="spinner-grow text-success" role="status">
        <span className="sr-only">...</span>
    </div>
    <div className="spinner-grow text-success" role="status">
        <span className="sr-only">...</span>
    </div>
    <div className="spinner-grow text-success" role="status">
        <span className="sr-only">...</span>
    </div>
</div>;

export default ProgressBar