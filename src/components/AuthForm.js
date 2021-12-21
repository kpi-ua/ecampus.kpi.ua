import React, { useState } from 'react';

const AuthForm = ({
  authorize,
  authFail,
  dismissInvalid,
  children
}) => {
  const [login, setLoginValue] = useState('');
  const [password, setPasswordValue] = useState('');

  const setLogin = (e) => {
    setLoginValue(e.target.value);
  };

  const setPassword = (e) => {
    setPasswordValue(e.target.value);
  };

  return (
    <form>
      <fieldset>
        <div className="form-group">
          <input
            type="text"
            value={login}
            onChange={setLogin}
            className="form-control"
            placeholder="Логін"
            aria-label="Логін"
            autoComplete="current-username"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={setPassword}
            className="form-control"
            placeholder="Пароль"
            aria-label="Пароль"
            autoComplete="current-password"
          />
        </div>

        {authFail && (
          <div className="form-group">
            <div className="alert alert-danger">
              <button
                type="button"
                className="close"
                onClick={dismissInvalid}
                data-dismiss="alert"
                aria-hidden="true"
              >
                &times;
              </button>
              Перевірте корректність логіну та паролю.
            </div>
          </div>
        )}

        <div className="form-group">
          <input
            type="submit"
            onClick={(e) => authorize(e, { login, password })}
            className="btn btn-success btn-block"
            value="Вхід"
          />
        </div>

        {children}
      </fieldset>
    </form>
  );
};

export default AuthForm;
