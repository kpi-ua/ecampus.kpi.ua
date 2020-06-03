import React from 'react';
import BbList from './BbList';

const BbIndex = () => (
  <div className="row">
    <div className="col-md-12">
      <h1>Дошка оголошень</h1>

      <BbList enablePaging={true} pageSize={5} />
    </div>
  </div>
);

export default BbIndex;
