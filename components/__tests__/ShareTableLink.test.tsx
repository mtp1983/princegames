import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ShareTableLink } from '../ShareTableLink';

describe('ShareTableLink', () => {
  const tableId = 'test-table-123';
  const inviteCode = 'ABC123';

  it('renders share section with table link info', () => {
    render(<ShareTableLink tableId={tableId} inviteCode={inviteCode} />);
    expect(screen.getByText(/Share Table/i)).toBeInTheDocument();
    expect(screen.getByText(/Invite Anyone/i)).toBeInTheDocument();
    expect(screen.getByText(inviteCode)).toBeInTheDocument();
  });

  it('renders Copy link and Share buttons', () => {
    render(<ShareTableLink tableId={tableId} inviteCode={inviteCode} />);
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('displays direct table link URL', () => {
    render(<ShareTableLink tableId={tableId} inviteCode={inviteCode} />);
    const linkEl = document.querySelector('.break-all');
    expect(linkEl?.textContent).toContain(`/table/${tableId}`);
  });
});
