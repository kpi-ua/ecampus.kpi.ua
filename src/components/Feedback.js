import React, { Component } from 'react';

class Feedback extends Component {
  render() {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <h1>Форма скарг i пропозицiй</h1>

          <iframe
            src='https://docs.google.com/forms/d/e/1FAIpQLSdlWaMSxcYVSfYDZpVgygSIl8reTZBM2Nl2ZzyuZzdaFwef_w/viewform?embedded=true'
            width='90%'
            height='1200px'
            frameBorder='0'
            marginHeight='0'
            marginWidth='0'
            scrolling='no'
            style={{ border: 'none', maxWidth: '90%', overflow: 'hidden' }}
            allowFullScreen
            webkitallowfullscreen
            mozallowfullscreen
            msallowfullscreen
          >
            Завантаження…
          </iframe>
        </div>
      </div>
    );
  }
}

export default Feedback;
