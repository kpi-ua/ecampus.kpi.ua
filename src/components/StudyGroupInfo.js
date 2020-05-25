import React from 'react'

const StudyGroupInfo = (props) =>
<div className="study-group-info">
    <strong>{props.value.name}</strong>
    <br />

    {!props.value.curator.profile &&
        <span>{props.value.curator.fullName}</span>
    }

    {!!props.value.curator.profile &&
        <a target='_intellect' href={props.value.curator.profile}>{props.value.curator.fullName}
            <i className='fa fa-external-link'></i>
        </a>
    }

    <br />
    <i>{props.value.cathedra.name}</i>
</div>;

export default StudyGroupInfo