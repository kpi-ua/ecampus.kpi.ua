import React, { Component } from 'react';

class Feedback extends Component {

  render() {

    return (
      <div className="row">
        <div className="col-md-12">
          <h1>Форма скарг i пропозицiй</h1>

          <iframe width="100%" height="1000px"
                  src="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAZ__pj8rjRUOUFNWTNVU0VIWFlRWTZXNzRaVklaUUVPTS4u&embed=true"
                  frameBorder="0" marginWidth="0" marginHeight="0"
                  style={{border: "none", maxWidth: "100%", maxHeight: "100vh"}}
                  allowFullScreen webkitallowfullscreen
                  mozallowfullscreen msallowfullscreen>
          </iframe>

        </div>
      </div>
    );
  }
}

export default Feedback