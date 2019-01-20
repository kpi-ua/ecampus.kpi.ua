export const ApiEndpoint = 'https://api.campus.kpi.ua/';

/**
 * Application configuration
 */
export const config = {
  fb: {
    appId: '1214335051921931',
    redirectUrl: `${ApiEndpoint}account/oauth/login/fb`
  },
  telegram: {
    botName: 'kpi_ua_bot'
  },
  appDomains: [
    'kpi.ua',
    'campus.kpi.ua',
    'login.kpi.ua',
  ]
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
    grant_type: 'password'
  };

  const response = await fetch(`${ApiEndpoint}oauth/token`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: toUrlEncode(payload)
  });

  if (response.status < 200 || response.status >= 300) {
    console.warn(`Incorrect password`);
    return null;
  }

  const credentials = await response.json();

  if (!credentials || !credentials.access_token) {
    return null
  }

  localStorage.setItem('token', credentials.access_token);

  const user = await getCurrentUser();

  if (!!user){
    await setAuthCookies(user.sid);
  }

  return user;
};

/**
 * Authorize in Campus API with Telegram
 * @param telegramResponse
 * @returns {Promise<*>}
 */
export const authViaTelegram = async (telegramResponse) => {

  const response = await callApi('Account/oauth/login/telegram', 'POST', telegramResponse);

  if (response.status < 200 || response.status >= 300) {
    return null;
  }

  const credentials = await response.json();

  localStorage.setItem('token', credentials.access_token);
  const user = await getCurrentUser();

  if (!user){
    return null;
  }

  await setAuthCookies(user.sid);

  return user;
};

/**
 * Logout from system
 * @returns {Promise<void>}
 */
export const logout = async () => {
  localStorage.setItem('token', null);
  await setAuthCookies(null);
};

/**
 * Method for calling Campus API. Auth token will be prepared automatically.
 * @param {string} path
 * @param {string} method
 * @param {Object} payload
 * @returns {Promise<Response>}
 */
export const callApi = async (path, method, payload = null) => {

  let url = `${ApiEndpoint}${path}`;

  let request = {
    method: method,
    headers: {
      "Accept": 'application/json',
      "Content-Type": 'application/json',
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  };

  if (!!payload){
    if (method === 'GET'){
      url += `?${Object.keys(payload).map(key => key + '=' + payload[key]).join('&')}`;
    } else {
      request.body = JSON.stringify(payload);
    }
  }

  return await fetch(url, request);
};
/**
 * Get URL for Facebook auth
 * @returns {string}
 */
export const generateFacebookAuthorizationLink = () => {
  const scope = "email";
  return `https://www.facebook.com/dialog/oauth?client_id=${config.fb.appId}&redirect_uri=${config.fb.redirectUrl}&scope=${scope}`;
};

/**
 * Check authorization status for current user
 * For authorization saved to local storage token will be used
 * @returns {Promise<*>}
 */
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');

  if (!token){
    return null
  }

  const response = await callApi('Account/Info', 'GET');

  if (response.status < 200 || response.status >= 300) {
    return null;
  }

  return await response.json();
};

/**
 * Update current user profile image
 * @param file
 * @returns {Promise<string>}
 */
export const updateUserProfileImage = async (file) => {
  const user = await getCurrentUser();
  const token = localStorage.getItem('token');
  const endpoint = `${ApiEndpoint}Account/${user.id}/ProfileImage`;

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });

  if (response.status < 200 || response.status >= 300) {
    console.warn(`Error during uploading image`);
    return null;
  }

  return `${ApiEndpoint}Account/${user.id}/ProfileImage?tmp=${getRandomNumber()}`;
};

/**
 * Return random number. By default in range [1..1000]
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const getRandomNumber = (min = 1, max = 1000) => Math.random() * (max - min) + min;

const setCookie = (name, value, domain, days) => {

  let date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = date.toUTCString();

  document.cookie = name + "=" + (value || "") + ";expires=" + expires + ";domain=." + domain + ";path=/";
};

/**
 *
 * @param sessionId
 * @returns {Promise<void>}
 */
const setAuthCookies = async (sessionId) => {
  config.appDomains.forEach(function(domain) {
    setCookie('SID', sessionId, domain, 1);
  });
};

const toUrlEncode = (obj) => {
  return Object.keys(obj).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
  }).join('&');
};