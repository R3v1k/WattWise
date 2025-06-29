
import { render, screen } from '@testing-library/react';
import userEvent              from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Estimate from '../Estimate';


const renderWithRouter = (state = {}) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: '/estimate', state }]}>
      <Routes>
        <Route path="/estimate"    element={<Estimate />} />
        <Route path="/appointment" element={<div>Appointment Page</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('Estimate page', () => {
  test('shows correct monthly & yearly savings', () => {

    const rooms = [
      {
        name: 'Living Room',
        devices: [
          { name: 'LED Bulb' },
          { name: 'LED Bulb' },
          { name: 'Television' },
        ],
      },
    ];

    renderWithRouter({ rooms });

    expect(screen.getByText('$8.00',  { exact: false })).toBeInTheDocument();
    expect(screen.getByText('$96.00', { exact: false })).toBeInTheDocument();
  });

  test('navigates to appointment page on button click', async () => {
    renderWithRouter();
    await userEvent.click(
      screen.getByRole('button', { name: /book an appointment/i })
    );

    expect(screen.getByText(/appointment page/i)).toBeInTheDocument();
  });
});
