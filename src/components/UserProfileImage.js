import React from 'react'
import {ApiEndpoint, getRandomNumber} from "../CampusClient";

const UserProfileImage = (props) =>
    <img
        className="img-fluid"
        src={`${ApiEndpoint}Account/${props.user.id}/ProfileImage?tmp=${getRandomNumber()}`}
        alt={props.user.fullName} />;

export default UserProfileImage