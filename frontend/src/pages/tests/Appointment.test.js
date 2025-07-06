// src/pages/__tests__/Appointment.test.js
import { screen, fireEvent } from '@testing-library/react';
import Appointment from '../Appointment';
import { renderWithRouter } from './testUtils';

test('user can pick date & time', () => {
  renderWithRouter(<Appointment />);

  const dateInput = screen.getByLabelText(/preferred date/i);
  const timeInput = screen.getByLabelText(/preferred time/i);


  fireEvent.change(dateInput, { target: { value: '2025-07-01' } });
  fireEvent.change(timeInput, { target: { value: '12:30' } });

  expect(dateInput).toHaveValue('2025-07-01');
  expect(timeInput).toHaveValue('12:30');
});
