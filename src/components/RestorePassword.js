import React from 'react';
// import SupportInformationDialog from './SupportInformationDialog';
import * as campus from '../CampusClient';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

class RestorePassword extends React.Component {
  state = {
    step: 1,
    captchaImage: '',
    userId: '',
    captcha: '',
    loader: false,
  };

  showMessage = (message) => {
    console.log(`${message}`);
    alert(message);
  };

  handleSubmit = (event) => event.preventDefault();

  onCaptchaVerified = (code) => {
    this.setState({ captcha: code });
    this.setState({ userEnteredCaptcha: true });
  };

  updateUserId = (event) => this.setState({ userId: event.target.value });

  getCaptcha = () =>
    this.setState({
      captcha: '',
      step: 2,
    });

  restorePassword = async () => {
    const payload = {
      Captcha: this.state.captcha,
      UserIdentifier: this.state.userId,
    };

    this.setState({ loader: true });

    const response = await campus.callApi('Account/Recovery', 'POST', payload);

    this.setState({ loader: false });

    if (response.status === 200 || response.status === 202) {
      this.setState({ step: 3 });
    } else if (response.status === 403) {
      this.showMessage('Невiрний код пiдтвердження.');
      this.getCaptcha();
    } else if (response.status === 404) {
      this.showMessage(
        'Користувача з таким логiном або електронною поштою не знайдено.',
      );
      this.setState({ step: 1, userId: '' });
    } else if (response.status === 409) {
      this.setState({ step: 4 });
    }
    if (response.status === 500) {
      this.showMessage('Для вiдновлення паролю звернiться у службу пiдтримки.');
      this.setState({ step: 1, userId: '' });
    }
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-4" />
        <div className="col-md-4">
          <br />
          <div className="card">
            <div className="card-body">
              <div className="text-center">
                <a href="/">
                  <img
                    src="/images/logo-big-green.png"
                    alt="Електроний кампус"
                    className="img-responsive logo-green"
                  />
                </a>
                <h2 className="text-center">Втратили свiй пароль, чи логiн?</h2>
                <p>Ви можете вiдновити доступ до системи.</p>
                <div className="panel-body">
                  <form className="form" onSubmit={this.handleSubmit}>
                    <fieldset>
                      {this.state.step === 1 && (
                        <div className="form-group">
                          <div className="input-group">
                            <span className="input-group-addon">
                              <i className="glyphicon glyphicon-envelope color-blue" />
                            </span>
                            <input
                              onChange={this.updateUserId}
                              value={this.state.userId}
                              placeholder="Email або Логiн"
                              className="form-control"
                              type="text"
                              required
                            />
                          </div>
                        </div>
                      )}
                      {this.state.step === 2 && (
                        <div className="form-group">
                          <div className="captcha-container">
                            <ReCAPTCHA
                              badge="inline"
                              sitekey="6LeyV4gUAAAAAAKYS6FdLzKCIFvInaPnr-N7RKhI"
                              onChange={this.onCaptchaVerified}
                            />
                          </div>
                        </div>
                      )}
                      {this.state.step === 1 && (
                        <div className="form-group">
                          <input
                            disabled={!this.state.userId}
                            className="btn btn-md btn-primary btn-block"
                            value="Вiдновити доступ"
                            onClick={this.getCaptcha}
                            type="submit"
                          />
                        </div>
                      )}
                      {this.state.step === 2 && (
                        <div className="form-group">
                          <input
                            className="btn btn-md btn-primary btn-block"
                            value="Надiслати пароль"
                            disabled={!this.state.userEnteredCaptcha}
                            onClick={this.restorePassword}
                            type="submit"
                          />
                        </div>
                      )}
                      {!!this.state.loader && (
                        <div className="form-group loader">
                          <div className="input-group">
                            <img
                              className="img-responsive"
                              src="/images/ajax-loader.gif"
                              alt="loading..."
                            />
                          </div>
                        </div>
                      )}
                      {this.state.step === 3 && (
                        <div className="form-group">
                          <h4>
                            Лист з iнструкцiями по вiдновленню паролю було
                            надiслано на вашу електрону пошту
                          </h4>
                          <Link to={'/'}>Перейти на головну</Link>
                        </div>
                      )}
                      {this.state.step === 4 && (
                        <div className="form-group">
                          <h4>Неможливо надiслати пароль</h4>
                          <div className="text-left">
                            На жаль, електронна пошта не налаштована для вашого
                            облікового запису.
                            <br />
                            Проте ви все ще можете вiдновити доступ до системи:
                            <h4>Варіант 1</h4>
                            <strong>
                              Не знаю (забув) логін та пароль (при цьому не
                              змінював пароль)
                            </strong>
                            :
                            <ol>
                              <li>
                                Звернутися до відповідального на кафедрі за
                                впровадження ЕК або до{' '}
                                <a href="/find-curator">куратора</a>, якому
                                повинен був передати ці данні відповідальний
                              </li>
                              <li>
                                Прийти в 13 корпус 25 кабінет і отримати власні
                                дані після пред'явлення будь-якого документу з
                                фото, що підтверджує особу (читацький квиток
                                також підходить).
                              </li>
                            </ol>
                            <h4>Варіант 2</h4>
                            <strong>
                              Забув змінений пароль. В цьому випадку пароль не
                              видається відповідальному на підрозділі
                            </strong>
                            :
                            <ol>
                              <li>
                                Написати лист на e-campus@ukr.net з копією на
                                ecampus@kpi.ua з тієї пошті, за допомогою якої
                                була здійснена зміна паролю та очікувати
                                відповідь (нажаль ця процедура здійснюється не
                                автоматично, а людиною). Проте бували випадки,
                                коли за викладача поштову скриньку створювали
                                студенти, а потім надсилали нам листи від імені
                                викладача щодо зміни власних даних та даних
                                поточного контролю, тому будьте уважними!
                              </li>
                              <li>
                                Прийти в 13 корпус 25 кабінет і отримати власні
                                дані після пред'явлення будь-якого документу з
                                фото, що підтверджує особу (читацький квиток
                                також підходить).
                              </li>
                            </ol>
                          </div>
                        </div>
                      )}
                    </fieldset>
                  </form>
                  <Link className="btn btn-md btn-info btn-block" to={'/login'}>
                    Повернутися
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4" />
      </div>
    );
  }
}

export default RestorePassword;
