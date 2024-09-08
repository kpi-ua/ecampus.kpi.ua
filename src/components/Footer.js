import React from 'react';
import { withRouter } from 'react-router-dom';

class Header extends React.Component {
  render() {
    return (
        <footer className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              Усі права застережено Test. &copy; {new Date().getFullYear()}{' '}
              <a href="https://kpi.ua/">КПІ ім. Ігоря Сікорського</a>
              <br/>
              Розробник:{' '}
              <a href="https://kbis.kpi.ua/">
                Конструкторське бюро інформаційних систем
              </a>
            </div>
          </div>
        </footer>
    );
  }
}

export default withRouter(Header);
