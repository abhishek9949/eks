import { render, screen } from '@testing-library/react';
import React from 'react';
import { getStatusChip } from '@/utils/statusChip'; // adjust path as needed

describe('getStatusChip', () => {
  it('renders Published chip for "published"', () => {
    render(getStatusChip('published'));
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('renders Active chip for "active"', () => {
    render(getStatusChip('active'));
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders Inactive chip for "inactive"', () => {
    render(getStatusChip('inactive'));
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders Failed chip for "failure"', () => {
    render(getStatusChip('failure'));
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('renders Pending chip for "pending"', () => {
    render(getStatusChip('pending'));
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders Deleted chip for "deleted"', () => {
    render(getStatusChip('deleted'));
    expect(screen.getByText('Deleted')).toBeInTheDocument();
  });

  it('renders Invite Expired chip for "expired"', () => {
    render(getStatusChip('expired'));
    expect(screen.getByText('Invite Expired')).toBeInTheDocument();
  });

  it('renders Draft chip for unknown status', () => {
    render(getStatusChip('unknown'));
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });
});
