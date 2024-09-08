import React from 'react';
import { getRandomNumber } from '../utils/CampusClient';
import ApplicationConfiguration from "../utils/ApplicationConfiguration";

class UserProfileImage extends React.Component {
  state = {
    rnd: 0,
  };

  async componentDidMount() {
    this.setState({ rnd: getRandomNumber() });
  }

  render() {
    return (
      <img
        className="img-fluid"
        src={`${ApplicationConfiguration.ApiEndpoint}Account/${this.props.user.id}/ProfileImage?tmp=${this.state.rnd}`}
        alt={this.props.user.fullName}
      />
    );
  }
}

export default UserProfileImage;
