import React, { Component } from 'react';

const link = "http://rozklad.kpi.ua/";

class Schedule extends Component {

  render() {

    return (
      <div className="row">
        <div className="col-md-12">
          <h1>Розклад</h1>

          <a target="_campus_calendar" href="http://rozklad.kpi.ua/">Відкрити у новій вкладці<i className="fa fa-external-link"/></a>

          <div>
            <iframe style={{border: 'none'}}
              src={link}
              width="100%"
              height="700" />
          </div>

        </div>
      </div>
    );
  }
}

export default Schedule