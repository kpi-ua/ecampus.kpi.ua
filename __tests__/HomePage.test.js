// Example test file __tests__/HomePage.test.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from '../src/pages/home';
import fetchMock from 'jest-fetch-mock';

fetchMock.mockResponseOnce(JSON.stringify({ /* mock user data */ }));

it('renders HomePage without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Router>
      <HomePage />
    </Router>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
