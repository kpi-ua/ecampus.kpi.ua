import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter from next/router
import AuthForm from './AuthForm';
import * as campus from '../utils/CampusClient';

const AuthContainerExternal = () => {
  const [authFail, setAuthFail] = useState(false);
  const router = useRouter(); // Get router object
  const { query } = router; // Access query parameters

  const authorize = async (e, { login, password }) => {
    e.preventDefault();

    const redirectionUrl = query.redirect_url || ''; // Use query parameter

    try {
      const req = await campus.externalAuth(login, password, query.appId, redirectionUrl);

      if (req.ok) {
        window.location.replace(redirectionUrl); // Use window for client-side redirect
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
