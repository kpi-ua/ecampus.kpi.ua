import React from 'react';
import { Link } from 'react-router-dom';
import SupportInformationDialog from './SupportInformationDialog';
import * as campus from '../CampusClient';

class Login extends React.Component {
  state = {
    modal: false,
  };

  componentDidMount = async () => {
    if (!!(await campus.getCurrentUser())) {
      this.props.history.push('/home');
    }
  };

  render = () => (
    <section>
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
                <h2 className="text-center">Авторизацiя у системi</h2>
                <div className="panel-body">{this.props.children}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4" />
      </div>

      {!this.props.isExternal ?
      <>
      <div className="row">
        <div className="col-md-4" />
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="text-center">
                <div className="panel-body">
                  <div className="row">
                    <div className="col-md-4">
                      <Link className="menu-icon" to={`/restore-password`}>
                        <i className="fa fa-unlock-alt" aria-hidden="true" />
                        Вiдновити втрачений пароль
                      </Link>
                    </div>
                    <div className="col-md-4">
                      <Link className="menu-icon" to={`/find-curator`}>
                        <i className="fa fa-search" aria-hidden="true" />
                        Знайти куратора групи
                      </Link>
                    </div>
                    <div className="col-md-4">
                      <Link className="menu-icon" to={`/feedback`}>
                        <i className="fa fa-comments-o" aria-hidden="true" />
                        Форма скарг i пропозицiй
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4" />
      </div>

      <div className="row">
        <div className="col-md-4" />
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="text-center">
                <div className="panel-body">
                  <div className="row">
                    <div className="col-md-4">
                      <SupportInformationDialog />
                    </div>
                    <div className="col-md-4">
                      <a
                        target="_tg"
                        href="https://t.me/joinchat/HtJ6IROiP8Rv5BR-eZ64fw"
                        className="menu-icon"
                      >
                        <i className="fa fa-telegram" aria-hidden="true" />
                        Telegram чат
                      </a>
                    </div>
                    <div className="col-md-4">
                      <Link className="menu-icon" to={`/faq`}>
                        <i
                          className="fa fa-question-circle"
                          aria-hidden="true"
                        />
                        Поширенi запитання
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4" />
      </div>
      </> : null}
    </section>
  );
}

export default Login;
