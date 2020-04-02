import React from 'react'
import '../css/Home.css';
import * as campus from "../CampusClient";
import {Link} from "react-router-dom";
import BbList from "./Bb/BbList";
import * as Security from "../Security";
import {DropdownItem, NavLink} from "reactstrap";

class Home extends React.Component {
  state = {
    user: null
  };

  async componentDidMount() {
    const user = await campus.getCurrentUser();

    if (!user) {
      this.props.history.push('/login');
      return;
    } else {

      if (!user.modules){
        await campus.logout();
        window.location.href = 'https://ecampus.kpi.ua/'
      }

    }

    this.setState({user});
  }

  redirectToOldUI = async (e) => {
    e.preventDefault();
    await campus.redirectToOldUI();
  };

  render() {
    const { user } = this.state;

    return <div>
      <br />



      <div className="row">
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Вітаємо, {!!user && user.fullName}!</h1>
              <div className="jumbotron">

                <p className="lead">
                  Електронний кампус  – це система підтримки навчального процесу університету.
                </p>
                <hr className="my-4" />
                <p>
                  Ви авторизовані у версії, що на даний час знаходиться у процесі розробки.
                  Частина функцій системи ще не реалізовані.
                  Для доступу до цих можливостей, ви можете перейти у поточну версію системи.

                </p>
                <p className="lead">

                  <a className="btn btn-primary btn-lg" role="button" href="#" onClick={this.redirectToOldUI}>
                    До поточної версії кампусу <i className="fa fa-external-link"/>
                  </a>

                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">

              {/*<h3>Дисципліни вибору</h3>*/}

              {/*<ul>*/}
              {/*  <li><span href="#">Вибір студента​</span><span className="badge badge-light">У розробцi</span></li>*/}
              {/*  <li><span href="#">Пропозиції дисциплін​</span><span className="badge badge-light">У розробцi</span></li>*/}
              {/*  <li><span href="#">Дисципліни спеціалізації</span><span className="badge badge-light">У розробцi</span></li>*/}
              {/*</ul>*/}

              {Security.hasAccessToModule(user, Security.Modules.AttestationResult) &&
                <h3><span href="#">Результати аттестації​</span><span className="badge badge-light">У розробцi</span></h3>
              }

              { Security.hasAccessToModule(user, Security.Modules.Statistic) && <h3>Статистика</h3> }

              { Security.hasAccessToModule(user, Security.Modules.Statistic) &&
                <ul>
                  <li><Link to="/statistic/zkm">Забезпечення кредитного модуля</Link></li>
                  <li><Link to="/statistic/npp">Індивідуальне навантаження викладачів</Link></li>
                </ul>
              }

              {Security.hasAccessToModule(user, Security.Modules.RNP) &&
                <h3><span href="#">РНП</span><span className="badge badge-light">У розробцi</span></h3>
              }

              {Security.hasAccessToModule(user, Security.Modules.Messages) &&
                <h3><span href="#">Повідомлення</span><span className="badge badge-light">У розробцi</span></h3>
              }

            </div>

            <div className="col-md-4">

              {Security.hasAccessToModule(user, Security.Modules.Information) && <h3>Iнформація</h3> }

              {Security.hasAccessToModule(user, Security.Modules.Information) &&
                <ul>
                  <li><a target="_campus_calendar" href="http://rozklad.kpi.ua/">Розклад занять та сесії <i className="fa fa-external-link"/></a></li>
                  <li><Link to="/bb">Дошка оголошень</Link></li>
                  <li><Link to="/help">Інструкція користувача</Link></li>
                  <li><Link to="/faq">Поширенi запитання</Link></li>
                  <li className="actual"><Link to="/lecturer-help">Послідовність роботи викладача</Link></li>
                  <li><Link to="/privacy">Правила використання інформації сайту</Link></li>
                  <li><Link to="/about">Про систему</Link></li>
                  <li><Link to="/documents">Документи КПІ ім. Ігоря Сікорського</Link></li>
                  <li><Link to="/contacts">Контактнi данi</Link></li>
                </ul>
              }

            </div>

            <div className="col-md-4">
              {Security.hasAccessToModule(user, Security.Modules.PersonalArea) && <h3>Аккаунт</h3> }

              {Security.hasAccessToModule(user, Security.Modules.PersonalArea) &&
                <ul>
                  <li><Link to="/settings">Налаштування</Link></li>
                </ul>
              }
            </div>

          </div>

          <hr />

          <div className="row">
            <div className="col-md-7">

              <h2>Соціальні мережі</h2>

              Ви завжди можете знайти найактуальнішу інформацію щодо роботи системи "Електронний кампус КПІ", а також інших сервісів на нашій сторінці в Facebook, та також у нашому Телеграм-каналі:
              <br />
              <br />
              <a className="info-button" target="_tg" href="https://www.facebook.com/kbis.kpi.ua/"><i className="fa fa-facebook" />Facebook</a>
              <a className="info-button" target="_fb" href="https://t.me/kpikb"><i className="fa fa-telegram" />Telegram канал</a>
              <br /><br />
            </div>
            <div className="col-md-5">
              <h2>Служба пiдтримки</h2>

              Ви завжди можете звернутися в службу підтримки:
              <br />
              <br />
              <a className="info-button" href="mailto:ecampus@kpi.ua"><i className="fa fa-envelope" />Email</a>
              <br />
              <br />
              <Link className="info-button" to={`/feedback`}><i className="fa fa-comments-o" aria-hidden="true" />Форма скарг i пропозицiй</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <h3>Оголошення</h3>
          <BbList enablePaging={false} pageSize={3}/>
          <Link to="/bb">Читати усi оголошення</Link>
        </div>
      </div>

    </div>;
  }
}

export default Home
