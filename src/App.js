import React, { Component } from 'react';
import './css/App.css';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Privacy from './components/Privacy';
import Documents from './components/Documents';
import About from './components/About';
import Contacts from './components/Contacts';
import RestorePassword from './components/RestorePassword';
import SocialForbidden from './components/SocialForbidden';
import Header from './components/Header';
import Login from './components/Login';
import LecturerHelp from './components/LecturerHelp';
import * as campus from './CampusClient';
import Settings from './components/Settings';
import SettingsEditor from './components/SettingsEditor';
import Help from './components/Help';
import Feedback from './components/Feedback';
import Faq from './components/Faq';
import FindCurator from './components/FindCurator';
import AuthContainerDefault from './components/AuthContainerDefault';
import EmploymentSystem from './components/EmploymentSystem';
import KpiId from './components/KPIID';

const InternalLogin = () => {
  return (
    <Login isExternal={false}>
      <AuthContainerDefault />
    </Login>
  );
};


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    campus.getCurrentUser(true).then(user => {
      this.setState({ user });
    });
  }

  render() {
    return (
      <div className="App">
        <Header
          user={this.state.user}
          onLogout={() => this.setState({ user: null })}
        />

        <div className="container-fluid content">
          <div className="content">
            <Switch>
              <Route exact path="/" component={InternalLogin} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/login" component={InternalLogin} />
              <Route exact path="/privacy" component={Privacy} />
              <Route exact path="/documents" component={Documents} />
              <Route exact path="/about" component={About} />
              <Route exact path="/help" component={Help} />
              <Route exact path="/lecturer-help" component={LecturerHelp} />
              <Route exact path="/employment-system" component={EmploymentSystem} />
              <Route exact path="/contacts" component={Contacts} />
              <Route exact path="/feedback" component={Feedback} />
              <Route exact path="/faq" component={Faq} />
              <Route exact path="/kpi-id" component={KpiId} />
              <Route exact path="/settings" component={Settings} />
              <Route exact path="/settings-editor" component={SettingsEditor} />
              <Route
                exact
                path="/restore-password"
                component={RestorePassword}
              />
              <Route exact path="/find-curator" component={FindCurator} />
              <Route
                exact
                path="/social-forbidden"
                component={SocialForbidden}
              />
            </Switch>
          </div>
        </div>

        <footer className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              Усі права застережено. &copy; {new Date().getFullYear()}{' '}
              <a href="https://kpi.ua/">КПІ ім. Ігоря Сікорського</a>
              <br />
              Розробник:{' '}
              <a href="https://kbis.kpi.ua/">
                Конструкторське бюро інформаційних систем
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
