import React, { Component } from 'react';
// import { DropdownItem } from 'reactstrap';

const link =
  'https://a2c27d7243ea.blob.core.windows.net/kpi/files/current_control.pdf';

class LecturerHelp extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <h1>Послідовність роботи викладача</h1>
          <br />
          <a className="btn btn-info" href={link}>
            Завантажити
          </a>
          <br />
          <br />

          <div>
            <embed
              src={link}
              width="100%"
              height="700"
              alt="pdf"
              pluginspage="http://www.adobe.com/products/acrobat/readstep2.html"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default LecturerHelp;
