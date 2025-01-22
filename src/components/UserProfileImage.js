import React from 'react';
import { getRandomNumber } from '../CampusClient';
import ApplicationConfiguration from "../ApplicationConfiguration";

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
        src={`${ApplicationConfiguration.ApiEndpoint}profile/${this.props.user.id}/photo?rnd=${this.state.rnd}`}
        alt={this.props.user.fullName}
      />
    );
  }
}

export default UserProfileImage;
