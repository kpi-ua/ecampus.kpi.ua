import React, { useState } from 'react';
import AuthForm from './AuthForm';
import * as campus from '../CampusClient';
import { useLocation, useHistory } from 'react-router-dom';
import ApplicationConfiguration from '../ApplicationConfiguration';

const AuthContainerDefault = () => {
  const [authFail, setAuthFail] = useState(false);
  const history = useHistory();
  const location = useLocation();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const showKpiIdAuthButton = queryParams.get('kid') === 'true';

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
      {showKpiIdAuthButton && (
        <div className="form-group">
          <a
            className="btn btn-block btn-social btn-kpi-id"
            href={ApplicationConfiguration.KpiIdRedirectAddress}
          >
            <div className="icon">
              <span className="fa fa-key" />
            </div>
            Увiйти через KPI ID
          </a>
        </div>
      )}
    </AuthForm>
  );
};

export default AuthContainerDefault;