import React from 'react'
import '../css/Home.css';
import * as campus from "../CampusClient";
import {Link} from "react-router-dom";

class Home extends React.Component {
  state = {
    user: null
  };

  async componentDidMount() {
    const user = await campus.getCurrentUser();

    if (!user) {
      this.props.history.push('/login');
      return;
    }

    this.setState({user});
  }

  render() {
    const { user } = this.state;

    return <div>
      <br />
      <div className="jumbotron">
        <h1 className="display-4">Вітаємо, {!!user && user.name}!</h1>
        <p className="lead">
          Електронний кампус  – це система підтримки навчального процесу університету.
        </p>
        <hr className="my-4" />
          <p>
            Ви авторизовані у версії, що на даний час знаходиться у процесі розробки.
            Частина функцій системи ще не реалізовані у поточній версії.
            Для доступу до цих можливостей, ви можете перейти у попередню версію системи.

          </p>
          <p className="lead">
            <a className="btn btn-primary btn-lg"  role="button" href="http://campus.kpi.ua" target="_campus">
              До попередньої версії кампусу <i className="fa fa-external-link"/>
            </a>

          </p>
      </div>

      <div className="row">
        <div className="col-md-4">

          <h3>Дисципліни вибору</h3>

          <ul>
            <li><span href="#">Вибір студента​</span><span className="badge badge-light">У розробцi</span></li>
            <li><span href="#">Пропозиції дисциплін​</span><span className="badge badge-light">У розробцi</span></li>
            <li><span href="#">Дисципліни спеціалізації</span><span className="badge badge-light">У розробцi</span></li>
          </ul>


          <h3><span href="#">Результати аттестації​</span><span className="badge badge-light">У розробцi</span></h3>

          <h3>Статистика</h3>

          <ul>
            <li><span href="#">Забезпечення кредитного модуля</span><span className="badge badge-light">У розробцi</span></li>
            <li><span href="#">Індивідуальне навантаження викладачів</span><span className="badge badge-light">У розробцi</span></li>
          </ul>

          <h3><span href="#">РНП</span><span className="badge badge-light">У розробцi</span></h3>

          <h3><Link to="/messages">Повідомлення</Link><span className="badge badge-light">У розробцi</span></h3>

        </div>

        <div className="col-md-4">

          <h3>Iнформація</h3>
          <ul>
            <li><a href="http://rozklad.kpi.ua/" target="_campus_calendar">Розклад занять та сесії <i className="fa fa-external-link"/></a></li>
            <li><span href="#">Дошка оголошень</span><span className="badge badge-light">У розробцi</span></li>
            <li><a href="http://kbis.kpi.ua/kbis/images/stories/lira/InstructionTeacherCampusV1.pdf" target="_campus_manual">Інструкція користувача <i className="fa fa-external-link"/></a></li>
            <li><Link to="/privacy">Правила використання інформації сайту</Link></li>
            <li><Link to="/about">Про систему</Link></li>
            <li><Link to="/contacts">Контактнi данi</Link></li>
            <li><a href="http://kpi.ua/code" target="_campus_code">Кодекс честi <i className="fa fa-external-link"/></a></li>
            <li><a href="http://kpi.ua/admin-rule" target="_campus_rule">Правила внутрішнього розпорядку <i className="fa fa-external-link"/></a></li>
            <li><a href="http://kpi.ua/regulations" target="_campus_regulations">Тимчасове положення про організацію освітнього процесу в Університеті <i className="fa fa-external-link"/></a></li>
          </ul>

        </div>

        <div className="col-md-4">
          <h3>Аккаунт</h3>
          <ul>
            <li><Link to="/settings">Налаштування</Link></li>
          </ul>

        </div>

      </div>
    </div>;
  }
}

export default Home
