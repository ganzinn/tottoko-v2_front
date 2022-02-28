import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from 'components/organisms/Header';

test('renders learn react link', () => {
  // testサンプル
  const topUrl = () => null;
  const navItems = [
    {
      label: 'dummy1',
      onClick: () => null,
    },
    {
      label: 'dummy2',
      onClick: () => null,
    },
  ];
  render(<Header topUrl={topUrl} navItems={navItems} />);

  const linkElement = screen.getByText(/tottoko/i);
  expect(linkElement).toBeInTheDocument();
});
