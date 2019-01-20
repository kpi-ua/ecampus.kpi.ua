import React from 'react';
import PropTypes from 'prop-types';

class TelegramLoginWidget extends React.Component {
  componentDidMount() {
    const {botName, size, requestAccess, showUserPic, callbackOnAuth} = this.props;
    window.TelegramLoginWidget = {
      callbackOnAuth: user => callbackOnAuth(user)
    };
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?5';
    script.setAttribute('data-telegram-login', botName || 'samplebot');
    script.setAttribute('data-size', size || 'medium');
    script.setAttribute('data-radius', '0');
    script.setAttribute('data-request-access', requestAccess || 'write');
    script.setAttribute('data-userpic', !showUserPic);
    script.setAttribute('data-onauth', 'TelegramLoginWidget.callbackOnAuth(user)');
    script.async = true;
    this.instance.appendChild(script);
  }

  render() {
    return (
      <div ref={component => this.instance = component}>
        {this.props.children}
      </div>
    );
  }
}

TelegramLoginWidget.propTypes = {
  callbackOnAuth: PropTypes.func.isRequired,
  botName: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  requestAccess: PropTypes.oneOf(['write']),
  showUserPic: PropTypes.bool
};


export default TelegramLoginWidget
