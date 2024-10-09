import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import App from './App';

// Create an Axios mock adapter instance
const mock = new AxiosMockAdapter(axios);

// Mock the response for your arbitrage API
mock.onGet('http://localhost:3001/api/arbitrages').reply(200, [
  {
    home_team: 'Team A',
    away_team: 'Team B',
    profitMargin: '5.50',
    bets: [
      { team: 'Team A', bookmaker: 'Bookmaker 1', odds: 2.0, amount: 100 },
      { team: 'Team B', bookmaker: 'Bookmaker 2', odds: 3.0, amount: 50 }
    ]
  }
]);

test('renders arbitrage opportunities', async () => {
  render(<App />);
  const heading = await screen.findByText(/Arbitrage Opportunities/i);
  expect(heading).toBeInTheDocument();
});
