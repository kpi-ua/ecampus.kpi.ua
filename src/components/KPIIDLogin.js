import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import SupportInformationDialog from './SupportInformationDialog';
import * as campus from '../CampusClient';

class KPIIDLogin extends React.Component {
  state = {
    phone: '',
    secret: '',
    authFail: false,
    codeWasRequested: false,
  };

  componentDidMount = async () => {
    const history = useHistory();

    if (!!(await campus.getCurrentUser())) {
      history.push('/home');
    }
  };

  setPhone = (event) => {
    this.setState({ phone: event.target.value });
  };

  setSecret = (event) => {
    this.setState({ secret: event.target.value });
  };

  getCode = async (e) => {
    e.preventDefault();

    await campus.requestKpiIdSecret(this.state.phone);

    this.setState({ codeWasRequested: true });
  };

  authorize = async (e) => {
    e.preventDefault();

    const history = useHistory();
    const user = await campus.authByKpiId(this.state.phone, this.state.secret);
    await this.setState({ authFail: !user });

    if (!!user) {
      history.push(`/home`);
      window.location.reload();
    }
  };

  render = () => (
    <div className="row">
      <div className="col-md-4" />
      <div className="col-md-4">
        <br />
        <div className="card">
          <div className="card-body">
            <div className="text-center">
              <a href="/">
                {' '}
                <img
                  src="/images/logo-big-green.png"
                  alt="Електроний кампус"
                  className="img-responsive logo-green"
                />{' '}
              </a>
              <h2 className="text-center">Авторизацiя через KPI ID</h2>
              <div className="panel-body">
                <form>
                  <fieldset>
                    <div className="form-group">
                      <input
                        type="text"
                        value={this.state.login}
                        onChange={this.setPhone}
                        className="form-control"
                        placeholder="Телефон у форматi 095XXXXXXX"
                      />
                    </div>

                    {this.state.codeWasRequested === true && (
                      <div className="form-group">
                        <input
                          type="text"
                          maxLength="4"
                          value={this.state.password}
                          onChange={this.setSecret}
                          className="form-control"
                          placeholder="Код"
                        />
                      </div>
                    )}

                    {this.state.authFail && (
                      <div className="form-group">
                        <div className="alert alert-danger">
                          <button
                            type="button"
                            className="close"
                            onClick={() => this.setState({ authFail: false })}
                            data-dismiss="alert"
                            aria-hidden="true"
                          >
                            &times;
                          </button>
                          Перевірте корректність телефону та коду.
                        </div>
                      </div>
                    )}

                    <div className="form-group">
                      {this.state.codeWasRequested === false && (
                        <input
                          type="submit"
                          onClick={this.getCode}
                          className="btn btn-block btn-kpi-id"
                          value="Отримати код"
                        />
                      )}

                      {this.state.codeWasRequested === true && (
                        <input
                          type="submit"
                          onClick={this.authorize}
                          className="btn btn-block btn-kpi-id"
                          value="Вхід"
                        />
                      )}
                    </div>
                  </fieldset>
                </form>
                <br />

                <SupportInformationDialog />
                <Link to={`/restore-password`}>Вiдновити втрачений пароль</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4" />
    </div>
  );
}

export default KPIIDLogin;
