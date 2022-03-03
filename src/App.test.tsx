import { render, screen } from '@testing-library/react';
import { Header } from 'components/organisms/Header';

test('renders learn react link', () => {
  // testサンプル
  render(<Header />);

  const linkElement = screen.getByText(/tottoko/i);
  expect(linkElement).toBeInTheDocument();
});
