// __tests__/HomePage.test.js
import React from 'react';
import { render, screen } from '@testing-library/react'; // Using @testing-library/react for rendering
import HomePage from '../src/pages/home';
import fetchMock from 'jest-fetch-mock';

fetchMock.mockResponseOnce(JSON.stringify({ /* mock user data */ }));

it('renders HomePage without crashing', () => {
  render(<HomePage />);
  // Add assertions here to check if the HomePage is rendering correctly
  expect(screen.getByText(/some expected text/i)).toBeInTheDocument();
});
