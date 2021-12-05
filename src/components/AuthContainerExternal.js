import React, { useState } from 'react';
import AuthForm from './AuthForm';
import * as campus from '../CampusClient';
import { useLocation } from 'react-router-dom';

const useQuery = () => {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
};

const AuthContainerExternal = () => {
  const [authFail, setAuthFail] = useState(false);
  const query = useQuery();

  const authorize = async (e, { login, password }) => {
    e.preventDefault();

    try {
      const req = await campus.externalAuth(login, password, query.get('appId'), query.get('redirect_uri'));

      if (req.ok) {
        // TODO redirection back + passing auth token
      } else {
        setAuthFail(true);
      }
    } catch {
      setAuthFail(true);
    }
  };

  const dismissInvalid = () => setAuthFail(false);

  return (
    <AuthForm
      authorize={authorize}
      authFail={authFail}
      dismissInvalid={dismissInvalid} />
  );
};

export default AuthContainerExternal;
