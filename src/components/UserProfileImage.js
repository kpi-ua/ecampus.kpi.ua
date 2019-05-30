import React from 'react'
import {ApiEndpoint, default as campus, getRandomNumber} from "../CampusClient";
import ProgressBar from "./ProgressBar";
import TelegramLoginWidget from "./TelegramLoginWidget";
import {Link} from "react-router-dom";

class UserProfileImage extends React.Component {

  state = {
    rnd: 0
  };

  async componentDidMount() {
    this.setState({rnd: getRandomNumber()});
  };

  render() {

    return <img
      className="img-fluid"
      src={`${ApiEndpoint}Account/${this.props.user.id}/ProfileImage?tmp=${this.state.rnd}`}
      alt={this.props.user.fullName} />
  }
}

export default UserProfileImage
