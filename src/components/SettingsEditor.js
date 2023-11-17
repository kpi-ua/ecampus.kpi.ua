import React from 'react';
import '../css/Settings.css';
import '../css/SettingsEditor.css';
import * as campus from '../CampusClient';
import { Link, Redirect } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import UserProfileImage from './UserProfileImage';
import TelegramLoginWidget from './TelegramLoginWidget';

class SettingsEditor extends React.Component {
  state = {
    user: {
      tgAuthLinked: '',
    },
    selectedFile: null,
    email: '',
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
    fullName: '',
    credo: '',
    scientificInterest: '',
    inProgress: false,
    redirect: null
  };

  async componentDidMount() {
    const user = await campus.getCurrentUser();

    if (!user) {
      this.props.history.push('/login');
      return;
    }

    this.setState({ user });
    this.setState({ email: user.email });
    this.setState({ credo: user.credo });
    this.setState({ scientificInterest: user.scientificInterest });
    this.setState({ fullName: user.fullName });
    this.setState({ currentPassword: '' });
    this.setState({ password: '' });
    this.setState({ passwordConfirmation: '' });
  }

  /**
   * Validate password
   * @returns {boolean}
   */
  validatePassword = () => {
    if (
      this.state.password !== '' ||
      this.state.currentPassword !== '' ||
      this.state.passwordConfirmation !== ''
    ) {
      if (
        this.state.currentPassword === '' ||
        this.state.password !== this.state.passwordConfirmation
      ) {
        return false;
      }
      if (
        this.state.password === '' &&
        this.state.passwordConfirmation === ''
      ) {
        return false;
      }
    }
    return true;
  };

  /**
   * Update user profile details
   * @returns {Promise<boolean>}
   */
  updateUser = async () => {
    const payload = {
      email: this.state.email,
      fullName: this.state.fullName,
      scientificInterest: this.state.scientificInterest,
      credo: this.state.credo,
    };

    if (!this.validatePassword()) {
      alert('Паролi не спiвпадають');
      return false;
    } else {
      payload.currentPassword = this.state.currentPassword;
      payload.password = this.state.password;
    }

    const response = await campus.callApi('Account/Info', 'PUT', payload);

    if (response.status !== 200) {
      alert('Не вдалося зберегти змiни.');
      return false;
    }

    return true;
  };

  /**
   * Update user profile image
   * @returns {Promise<boolean>}
   */
  updateUserAvatar = async () => {
    if (!!this.state.selectedFile) {
      const newProfileImageUrl = await campus.updateUserProfileImage(
        this.state.selectedFile,
      );

      if (newProfileImageUrl == null) {
        alert('Не вдалося зберегти зображення');
        return false;
      }
    }
    return true;
  };

  /**
   *
   * @returns {Promise<boolean>}
   */
  updateProfile = async () => {
    this.setState({ inProgress: true });

    //Check session
    if (!(await campus.getCurrentUser())) {
      this.props.history.push('/login');
      return false;
    }

    const [r1, r2] = await Promise.all([
      this.updateUser(),
      this.updateUserAvatar(),
    ]);

    this.setState({ inProgress: false });

    if (r1 && r2) {
      this.props.history.push('/settings');
      return true;
    }

    this.setState({ user: await campus.getCurrentUser() });

    return false;
  };

  handleSelectedFile = async (event) =>
    this.setState({ selectedFile: event.target.files[0] });

  handleTelegramResponse = async (telegramResponse) => {
    const user = await campus.authViaTelegram(telegramResponse);

    await this.setState({ authFail: !user });

    if (!!user) {
      this.props.history.push(`/settings-editor`);
      this.setState({ user });

      alert('Ви пiдключили авторизацiю через Telegram.');

      this.setState({redirect: '/settings'});
    }
  };

  render() {

    if (!!this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    const { user } = this.state;

    return (
      <div className="row">
        1
        <div className="col-md-12">
          <h1>Налаштування</h1>

          <div className="row">
            <div className="col-md-3">
              <div className="profile-img">
                <UserProfileImage user={this.state.user} />
                <div className="file btn btn-lg btn-primary">
                  Оновити фото
                  <input
                    type="file"
                    name="file"
                    onChange={this.handleSelectedFile}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-7">
              {this.state.inProgress && <ProgressBar text="Збереження" />}

              <div
                className={`profile-head ${
                  this.state.inProgress ? 'hidden' : ''
                }`}
              >
                <h2>{user.fullName}</h2>
                <h4>Кредо</h4>
                <input
                  type="text"
                  className="form-control"
                  maxLength="500"
                  value={this.state.credo}
                  onChange={(e) => {
                    this.setState({ credo: e.target.value });
                  }}
                />
                <h4>Науковi iнтереси</h4>
                <input
                  type="text"
                  className="form-control"
                  maxLength="300"
                  value={this.state.scientificInterest}
                  onChange={(e) => {
                    this.setState({ scientificInterest: e.target.value });
                  }}
                />
                <h4>Електронна пошта</h4>
                <input
                  type="email"
                  className="form-control"
                  maxLength="50"
                  value={this.state.email}
                  onChange={(e) => {
                    this.setState({ email: e.target.value });
                  }}
                />
                <h4>Логiн</h4>
                <input
                  type="text"
                  className="form-control"
                  readOnly={true}
                  maxLength="50"
                  value={this.state.user.username}
                />
                <h4>Пароль </h4>
                <strong>Поточний:</strong>
                <br />
                <input
                  type="password"
                  className="form-control"
                  maxLength="50"
                  value={this.state.currentPassword}
                  onChange={(e) => {
                    this.setState({ currentPassword: e.target.value });
                  }}
                />
                <br />
                <strong>Новий:</strong>
                <br />
                <input
                  type="password"
                  className="form-control"
                  maxLength="50"
                  value={this.state.password}
                  onChange={(e) => {
                    this.setState({ password: e.target.value });
                  }}
                />
                <br />
                <strong>Пiдтвердження:</strong>
                <br />
                <input
                  type="password"
                  className="form-control"
                  maxLength="50"
                  value={this.state.passwordConfirmation}
                  onChange={(e) => {
                    this.setState({ passwordConfirmation: e.target.value });
                  }}
                />
                <br />
                <br />
                <h4>Telegram (beta)</h4>
                <TelegramLoginWidget
                  callbackOnAuth={this.handleTelegramResponse}
                  botName={campus.config.telegram.botName}
                />
                Cтатус:{' '}
                <b>
                  {!!this.state.user.tgAuthLinked
                    ? `пiдключено`
                    : `не пiдключено`}
                </b>
                <br />
                <br />
              </div>
            </div>

            <div className="col-md-2 state-buttons">
              <input
                type="button"
                className="btn btn-success"
                value="Зберегти"
                onClick={this.updateProfile}
              />
              <br />
              <br />
              <Link className="btn btn-danger" to="/settings">
                Вiдмiнити змiни
              </Link>
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
    );
  }
}

export default SettingsEditor;
