import React, { Component } from 'react';
import './css/App.css';
import {Switch, Route} from 'react-router-dom'
import Home from "./components/Home";
import Privacy from "./components/Privacy";
import Documents from "./components/Documents";
import About from "./components/About";
import Contacts from "./components/Contacts";
import RestorePassword from "./components/RestorePassword";
import SocialForbidden from "./components/SocialForbidden";
import Header from "./components/Header";
import Login from "./components/Login";
import LecturerHelp from "./components/LecturerHelp";
import KPIIDLogin from "./components/KPIIDLogin";
import * as campus from "./CampusClient";
import Settings from "./components/Settings";
import SettingsEditor from "./components/SettingsEditor";
import Help from "./components/Help";
import BbIndex from "./components/Bb/BbIndex";
import StatisticIndex from "./components/Statistic/StatisticIndex";
import NPP from "./components/Statistic/NPP";
import ZKM from "./components/Statistic/ZKM";


class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      user: null
    };
  }

  async componentDidMount() {
    this.setState({user: await campus.getCurrentUser()});
  }

  render () {
    return (
      <div className="App">

        <Header user={this.state.user} onLogout={() => this.setState({user: null})} />

        <div className="container-fluid content">
          <div className="content">

            <Switch>
              <Route exact path='/' component={Login}/>
              <Route exact path='/home' component={Home}/>
              <Route exact path='/login' component={Login}/>
              <Route exact path='/kpiid' component={KPIIDLogin}/>
              <Route exact path='/privacy' component={Privacy}/>
              <Route exact path='/documents' component={Documents}/>
              <Route exact path='/about' component={About}/>
              <Route exact path='/help' component={Help}/>
              <Route exact path='/lecturer-help' component={LecturerHelp}/>
              <Route exact path='/contacts' component={Contacts}/>
              <Route exact path='/bb' component={BbIndex}/>
              <Route exact path='/settings' component={Settings}/>
              <Route exact path='/settings-editor' component={SettingsEditor}/>
              <Route exact path='/restore-password' component={RestorePassword}/>
              <Route exact path='/social-forbidden' component={SocialForbidden}/>
              <Route exact path='/statistic' component={StatisticIndex}/>
              <Route exact path='/statistic/npp' component={NPP}/>
              <Route exact path='/statistic/zkm' component={ZKM}/>
            </Switch>

          </div>
        </div>

        <footer className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              Усі права застережено. &copy; {new Date().getFullYear()} <a href="http://kpi.ua/">КПІ ім. Ігоря Сікорського</a>
              <br/>
              Розробник: <a href="http://kbis.kpi.ua/">Конструкторське бюро інформаційних систем</a>
            </div>
          </div>
        </footer>

      </div>
    );
  }
}

export default App;
