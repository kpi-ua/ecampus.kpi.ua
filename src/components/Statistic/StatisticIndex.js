import React from 'react';
import { Link } from 'react-router-dom';

const StatisticIndex = () => (
  <div className="row">
    <div className="col-md-12">
      <h1>Статистика</h1>

      <div className="row">
        <div className="col-md-12">
          <a
            className="btn btn-primary btn-lg btn-statistic"
            role="button"
            href="https://statistic.ecampus.kpi.ua/zkm.html"
          >
            Забезпечення кредитного модуля <i className="fa fa-external-link" />
          </a>

          <a
            className="btn btn-primary btn-lg btn-statistic"
            role="button"
            href="https://statistic.ecampus.kpi.ua/npp.html"
          >
            Індивідуальне навантаження викладачів{' '}
            <i className="fa fa-external-link" />
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default StatisticIndex;
