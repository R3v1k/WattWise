// src/pages/__tests__/testUtils.js
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export const renderWithRouter = (ui, route = '/') =>
  render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
