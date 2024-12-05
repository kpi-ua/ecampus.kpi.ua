import React, { useState } from 'react';
import AuthForm from './AuthForm';
import * as campus from '../CampusClient';
import { useHistory } from 'react-router-dom';

const AuthContainerDefault = () => {
  const [authFail, setAuthFail] = useState(false);
  const history = useHistory();

  const authorize = async (e, { login, password }) => {
    e.preventDefault();

    const user = await campus.auth(login, password);
    setAuthFail(!user);

    if (!!user) {
      history.push(`/home`);
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

    </AuthForm>
  );
};

export default AuthContainerDefault;
