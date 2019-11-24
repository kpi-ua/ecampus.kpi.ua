import React from 'react'
import {Link} from "react-router-dom";

const StatisticIndex = () =>
  <div className="row">
    <div className="col-md-12">
      <h1>Статистика</h1>
      <div className="row">
        <div className="col-md-12">
          <Link to="/statistic/zkm">Забезпечення кредитного модуля</Link>
          <Link to="/statistic/npp">Індивідуальне навантаження викладачів</Link>
        </div>
      </div>
    </div>
  </div>;


export default StatisticIndex
