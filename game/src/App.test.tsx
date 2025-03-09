import React from 'react';
import { render, screen } from '@testing-library/react';
import TestComponent from './TestComponent';

test('renders message input', () => {
  render(<TestComponent />);
  const inputElement = screen.getByPlaceholderText(/enter message/i);
  expect(inputElement).toBeInTheDocument();
});