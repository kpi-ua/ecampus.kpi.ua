import React from 'react'
import {Link} from 'react-router-dom';
import SupportInformationDialog from './SupportInformationDialog';
import * as campus from "../CampusClient";
import TelegramLoginWidget from "./TelegramLoginWidget";


class Login extends React.Component {

  state = {
    login: '',
    password: '',
    authFail: false
  };

  componentDidMount = async () => {
    if (!!await campus.getCurrentUser()) {
      this.props.history.push('/home');
    }
  };

  setLogin = (event) => {
    this.setState({login: event.target.value});
  };

  setPassword = (event) => {
    this.setState({password: event.target.value});
  };

  authorize = async (e) => {
    e.preventDefault();

    const user = await campus.auth(this.state.login, this.state.password);
    await this.setState({authFail: !user});

    if (!!user) {
      this.props.history.push(`/home`);
      window.location.reload();
    }
  };

  handleTelegramResponse = async (telegramResponse) => {
    const user = await campus.authViaTelegram(telegramResponse);

    await this.setState({authFail: !user});

    if (!!user) {
      this.props.history.push(`/home`);
      window.location.reload();
    }
  };

  render = () =>
    <div className="row">
      <div className="col-md-4"/>
      <div className="col-md-4">
        <br/>
        <div className="card">
          <div className="card-body">
            <div className="text-center">
              <a href="/"> <img src="/images/logo-big-green.png" alt="Електроний кампус"
                                className="img-responsive logo-green"/> </a>
              <h2 className="text-center">Авторизацiя у системi</h2>
              <div className="panel-body">
                <form>
                  <fieldset>
                    <div className="form-group">
                      <input type="text" value={this.state.login} onChange={this.setLogin} className="form-control"
                             placeholder="Логін"/>
                    </div>

                    <div className="form-group">
                      <input type="password" value={this.state.password} onChange={this.setPassword}
                             className="form-control" placeholder="Пароль"/>
                    </div>

                    {this.state.authFail && <div className="form-group">
                      <div className="alert alert-danger">
                        <button type="button" className="close" onClick={() => this.setState({authFail: false})}
                                data-dismiss="alert" aria-hidden="true">&times;</button>
                        Перевірте корректність логіну та паролю.
                      </div>
                    </div>}

                    <div className="form-group">
                      <input type="submit" onClick={this.authorize} className="btn btn-success btn-block" value="Вхід"/>
                    </div>

                    <div className="form-group">
                      <a className="btn btn-block btn-social btn-facebook"
                         href={campus.generateFacebookAuthorizationLink()}>
                        <div className="icon">
                          <span className="fa fa-facebook"/>
                        </div>
                        Увiйти через Facebook
                      </a>
                    </div>

                    <div className="form-group">
                      <a className="btn btn-block btn-social btn-kpi-id" href="/kpiid">
                        <div className="icon">
                          <span className="fa fa-key"/>
                        </div>
                        Увiйти через KPI ID
                      </a>
                    </div>

                    <div className="form-group">
                      <TelegramLoginWidget
                        callbackOnAuth={this.handleTelegramResponse}
                        botName={campus.config.telegram.botName}/>
                    </div>

                  </fieldset>
                </form>
                <br/>

                <SupportInformationDialog/>
                <Link to={`/restore-password`}>Вiдновити втрачений пароль</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4"/>
    </div>;
}

export default Login
