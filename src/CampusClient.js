import ApplicationConfiguration from './ApplicationConfiguration';
import * as Security from './Security';

/**
 * Application configuration
 */
export const config = {
  ecampusDomain: 'ecampus.kpi.ua',
  rootDomain: 'kpi.ua',
};

/**
 * Authorize in Campus API
 * @param {string} login
 * @param {string} password
 * @returns {Promise<Object>}
 */
export const auth = async (login, password) => {
  const payload = {
    username: login,
    password: password,
    grant_type: 'password',
  };

  const response = await fetch(
    `${ApplicationConfiguration.ApiEndpoint}oauth/token`,
    {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: toUrlEncode(payload),
    },
  );

  if (response.status < 200 || response.status >= 300) {
    console.warn(`Incorrect password`);
    return null;
  }

  const credentials = await response.json();

  if (!credentials) {
    return null;
  }

  await storeCredentials(credentials.sessionId, credentials.access_token);

  return await getCurrentUser();
};

/**
 * Exchange KPI ID ticket for sessionId and token
 * @param {string} ticketId
 * @returns {Promise<Object|null>}
 */
export const exchangeKpiIdTicket = async (ticketId) => {
  if (!ticketId) {
    console.warn('Ticket ID is required');
    return null;
  }

  const response = await fetch(
    `${ApplicationConfiguration.ApiEndpoint}auth/kpi-id?ticketId=${encodeURIComponent(ticketId)}`,
    {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (response.status !== 200) {
    console.warn(`Failed to exchange ticketId: ${ticketId}`);

    return null;
  }

  const credentialsCollection = await response.json();

  if (!credentialsCollection || credentialsCollection.length === 0) {
    return null;
  }

  // Assuming the first user in the response should be used
  const credentials = credentialsCollection[0];

  await storeCredentials(credentials.sessionId, credentials.access_token);

  return await getCurrentUser();
};

/**
 * Logout from Campus API
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await callApi('Account/logout', 'GET');

  await storeCredentials(null, null);

  localStorage.clear();
};

/**
 * Redirect to old API after refresh session
 * @returns {Promise<void>}
 */
export const redirectToOldUI = async () => {
  const response = await callApi('auth/refresh', 'GET');

  if (response.status === 200) {
    const credentials = await response.json();

    if (credentials) {
      await storeCredentials(credentials.sessionId, credentials.access_token);
      window.location.replace(ApplicationConfiguration.OldUIAddress);
      return;
    }
  }

  await logout();
  window.location.replace(ApplicationConfiguration.LoginPageAddress);
};

/**
 * Method for calling Campus API. Auth token will be prepared automatically.
 * @param {string} path
 * @param {string} method
 * @param {Object} payload
 * @returns {Promise<Response>}
 */
export const callApi = async (path, method, payload = null) => {
  let url = `${ApplicationConfiguration.ApiEndpoint}${path}`;

  let request = {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    query: {},
  };

  if (!!payload) {
    if (method === 'GET') {
      url += `?${Object.keys(payload)
        .map((key) => key + '=' + payload[key])
        .join('&')}`;
    } else {
      request.body = JSON.stringify(payload);
    }
  }

  return await fetch(url, request);
};

/**
 * Check authorization status for current user
 * For authorization saved to local storage token will be used
 * @param ignoreCache
 * @returns {Promise<null|any>}
 */
export const getCurrentUser = async (ignoreCache) => {
  const cachedUserInfoKey = 'currentUser';

  let token = getToken();

  if (!token) {
    localStorage.setItem(cachedUserInfoKey, '');
    return null;
  }

  const cachedUserInfoJson = localStorage.getItem(cachedUserInfoKey);
  const cachedUserInfo = !!cachedUserInfoJson
    ? JSON.parse(cachedUserInfoJson)
    : null;

  if (!!cachedUserInfo && !ignoreCache) {
    console.log('Used cached user info');
    return cachedUserInfo;
  }

  const response = await callApi('profile', 'GET');

  if (response.status < 200 || response.status >= 300) {
    return null;
  }

  const user = await response.json();

  if (!!user) {
    user.modules = [
      Security.Modules.Information,
      Security.Modules.PersonalArea,
    ];

    if (!!user.studentProfile) {
      user.modules.push(Security.Modules.EmploymentSystem);
    }

    localStorage.setItem(cachedUserInfoKey, JSON.stringify(user));
  }

  console.log('user from api', user);
  return user;
};

/**
 * Get auth token from local storage or cookies
 * @returns {string}
 */
const getToken = () => {
  const tokenFromLocalStorage = localStorage.getItem('token');

  if (!tokenFromLocalStorage || tokenFromLocalStorage === 'null') {
    const tokenFromCookie = getCookie('token');

    if (!!tokenFromCookie) {
      localStorage.setItem('token', tokenFromCookie);
      return tokenFromCookie;
    }
  }

  return tokenFromLocalStorage;
};

/**
 * Update current user profile image
 * @param file
 * @returns {Promise<string | null>}
 */
export const updateUserProfileImage = async (file) => {
  const user = await getCurrentUser();
  const token = getToken();
  const endpoint = `${ApplicationConfiguration.ApiEndpoint}profile/photo`;

  const formData = new FormData();
  formData.append('file', file, file.name);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.warn(`Error during uploading image: ${errorText}`);
    return null;
  }

  return `${ApplicationConfiguration.ApiEndpoint}profile/${user.id}/photo?rnd=${getRandomNumber()}`;
};

/**
 * Return random number. By default in range [1..1000]
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const getRandomNumber = (min = 1, max = 1000) =>
  Math.random() * (max - min) + min;

/**
 * Store token and session ids
 * @param sessionId
 * @param token
 * @returns {Promise<void>}
 */
const storeCredentials = async (sessionId, token) => {
  if (!token) {
    localStorage.removeItem('token');
  } else {
    localStorage.setItem('token', token);
  }

  await setAuthCookie('SID', sessionId, config.rootDomain);
  await setAuthCookie('token', token, config.ecampusDomain);
};

const toUrlEncode = (obj) => {
  return Object.keys(obj)
    .map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
    })
    .join('&');
};

/**
 * Load bulletins for current user
 * @param page
 * @param size
 * @returns {Promise<void>}
 */
export const getBulletinBoardForCurrentUser = async (page, size) => {
  return null;
};

/**
 * Function that returns the value of a specified cookie
 * https://www.w3schools.com/js/js_cookies.asp
 * @param cname
 * @returns {string}
 */
const getCookie = (cname) => {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

/**
 * Sets an authentication cookie with specified parameters
 *
 * @param {string} name - The name of the cookie
 * @param {string} value - The value to store in the cookie (falsy values will be stored as empty string)
 * @param {string} domain - The domain for which the cookie is valid
 * @param {number} [days=30] - Number of days until cookie expiration (default: 30)
 * @returns {void}
 */
const setAuthCookie = (name, value, domain, days = 30) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = date.toUTCString();

  document.cookie = `${name}=${value || ''};expires=${expires};domain=.${domain};path=/;SameSite=Strict;Secure`;
};