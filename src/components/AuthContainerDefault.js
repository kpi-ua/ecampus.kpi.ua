import React, { useState } from 'react';
import AuthForm from './AuthForm';
import * as campus from '../CampusClient';
import { useHistory } from 'react-router-dom';

const AuthContainerDefault = () => {
  const [authFail, setAuthFail] = useState(false);
  const history = useHistory();

  const KPI_ID_LINK = "https://auth.kpi.ua?appId=3d1488ae-128e-4655-8ca2-1ef554379335";

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
      <div className="form-group">
        <a className="btn btn-block btn-social btn-kpi-id" href={KPI_ID_LINK}>
          <div className="icon">
            <span className="fa fa-key"/>
          </div>
          Увiйти через KPI ID
        </a>
      </div>
    </AuthForm>
  );
};

export default AuthContainerDefault;