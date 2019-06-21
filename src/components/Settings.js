import React from 'react'
import '../css/Settings.css';
import * as campus from "../CampusClient";
import {Link} from "react-router-dom";
import UserProfileImage from "./UserProfileImage";


class Settings extends React.Component {

  state = {
    user: {}
  };

  async componentDidMount() {
    const user = await campus.getCurrentUser();

    if (!user) {
      this.props.history.push('/login');
      return;
    }

    this.setState({user})
  }

  render() {
    const { user } = this.state;

    return <div className="row">
      <div className="col-md-12">
        <h1>Налаштування</h1>

            <div className="row">
              <div className="col-md-3">
                <div className="profile-img">
                  <UserProfileImage user={this.state.user} />
                </div>
              </div>
              <div className="col-md-7">
                <div className="profile-head">
                  <h2>{user.fullName}</h2>

                  <div className="credo">
                    {this.state.user.credo}
                  </div>

                  <h4>Електрона пошта</h4>
                  <span>{this.state.user.email}</span>

                  <h4>Логiн</h4>
                  <span>{this.state.user.username}</span>

                  <h4>Науковi iнтереси</h4>
                  {this.state.user.scientificInterest}

                  <h4>Пiдроздiл</h4>
                  {!!user && !!user.subdivision && user.subdivision.map(s => <span key={s.id} href="#">{s.name}</span>)}

                  <h4>Позицiя</h4>
                  {!!user && !!user.position && user.position.map(p => <span key={p.id} href="#">{p.name}</span>)}


                  {!!this.state.user.userIdentifier &&
                    <div>
                      <h4>Публiчний профiль</h4>
                      <a href={`http://intellect.kpi.ua/profile/${this.state.user.userIdentifier}`} target="_intellect">
                        {`intellect.kpi.ua/profile/${this.state.user.userIdentifier}`} <i className="fa fa-external-link"/>
                      </a>
                    </div>
                  }
                </div>
              </div>
              <div className="col-md-2 state-buttons">
                <Link to="settings-editor" className="btn btn-success">Редагувати</Link>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="profile-work" />
              </div>
              <div className="col-md-8" />
            </div>

      </div>
    </div>
  }
}

export default Settings