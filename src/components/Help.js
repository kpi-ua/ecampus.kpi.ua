import React, { Component } from 'react';

const link =
  'https://do4rt9wur3t6m.cloudfront.net/campus-user-manual.pdf';

class Help extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <h1>Інструкція користувача</h1>
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
              pluginspage="https://www.adobe.com/products/acrobat/readstep2.html"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Help;
