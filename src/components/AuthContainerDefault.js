import React, { useState } from 'react';
import AuthForm from './AuthForm';
import * as campus from '../utils/CampusClient';
import TelegramLoginWidget from './TelegramLoginWidget';
import { useRouter } from 'next/router'; // Import useRouter from next/router

const AuthContainerDefault = () => {
  const [authFail, setAuthFail] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const authorize = async (e, { login, password }) => {
    e.preventDefault();

    const user = await campus.auth(login, password);
    setAuthFail(!user);

    if (user) {
      router.push('/home'); // Use router.push for navigation
      window.location.reload();
    }
  };

  const handleTelegramResponse = async (telegramResponse) => {
    const user = await campus.authViaTelegram(telegramResponse);

    setAuthFail(!user);

    if (user) {
      router.push('/home'); // Use router.push for navigation
      window.location.reload();
    }
  };

  const dismissInvalid = () => setAuthFail(false);

  return (
    <AuthForm
      authorize={authorize}
      authFail={authFail}
      dismissInvalid={dismissInvalid}
    >
      {/*<div className="form-group">*/}
      {/*  <a*/}
      {/*    className="btn btn-block btn-social btn-facebook"*/}
      {/*    href={campus.generateFacebookAuthorizationLink()}*/}
      {/*  >*/}
      {/*    <div className="icon">*/}
      {/*      <span className="fa fa-facebook" />*/}
      {/*    </div>*/}
      {/*    Увiйти через Facebook*/}
      {/*  </a>*/}
      {/*</div>*/}

      {/*<div className="form-group">*/}
      {/*  <a className="btn btn-block btn-social btn-kpi-id" href="/kpiid">*/}
      {/*    <div className="icon">*/}
      {/*      <span className="fa fa-key"/>*/}
      {/*    </div>*/}
      {/*    Увiйти через KPI ID*/}
      {/*  </a>*/}
      {/*</div>*/}

      <div className="form-group">
        <TelegramLoginWidget
          callbackOnAuth={handleTelegramResponse}
          botName={campus.config.telegram.botName}
        />
      </div>
    </AuthForm>
  );
};

export default AuthContainerDefault;
