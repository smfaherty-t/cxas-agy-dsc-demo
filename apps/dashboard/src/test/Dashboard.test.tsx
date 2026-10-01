import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { App } from '../App.tsx';
import { StatsBar } from '../components/StatsBar.tsx';
import { CustomerCard } from '../components/CustomerCard.tsx';
import { EnrichedCustomer } from '../types.ts';

const MOCK_CUSTOMERS: EnrichedCustomer[] = [
  {
    id: 'cust-alex',
    name: 'Alex Vance',
    email: 'alex@example.com',
    phone: '(555) 234-5678',
    shippingAddress: '789 Maple Ave, Denver CO 80202',
    orders: [
      {
        orderNumber: 'DSC-8832',
        customerId: 'cust-alex',
        status: 'IN_TRANSIT',
        trackingNumber: '1Z99999999999999',
        carrier: 'UPS',
        eta: 'Tomorrow by 8 PM',
        lastCarrierScan: 'Today, 6:15 AM - Out for Delivery Facility',
        isLost: false,
        items: ['Executive 6-Blade Starter Handle & 2 Cartridges'],
        createdDate: '2026-09-28',
        shippingAddress: '789 Maple Ave, Denver CO 80202'
      }
    ],
    subscription: {
      customerId: 'cust-alex',
      planName: 'Executive Starter Set',
      cadence: 'Bi-monthly',
      nextBillDate: 'October 15, 2026',
      status: 'ACTIVE',
      isStarterSetTrial: true,
      notes: 'Trial'
    }
  },
  {
    id: 'cust-jamie',
    name: 'Jamie Cole',
    email: 'jamie@example.com',
    phone: '(555) 345-6789',
    shippingAddress: '456 Oak Rd, Seattle WA 98101',
    orders: [
      {
        orderNumber: 'DSC-9104',
        customerId: 'cust-jamie',
        status: 'LOST_IN_TRANSIT',
        trackingNumber: '9400111122223333',
        carrier: 'USPS',
        eta: 'Pending carrier scan',
        lastCarrierScan: '4 days ago - Hub',
        isLost: true,
        items: ['4-Blade Club Restock Box'],
        createdDate: '2026-09-20',
        shippingAddress: '456 Oak Rd, Seattle WA 98101'
      }
    ],
    subscription: {
      customerId: 'cust-jamie',
      planName: '4-Blade Club',
      cadence: 'Every 2 months',
      nextBillDate: 'November 2, 2026',
      status: 'ACTIVE',
      isStarterSetTrial: false,
      notes: 'Active'
    }
  }
];

describe('Dollar Shave Club Operations Dashboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('StatsBar Component', () => {
    it('should compute metrics correctly from customer data', () => {
      render(<StatsBar customers={MOCK_CUSTOMERS} />);
      expect(screen.getByText('Total Members')).toBeInTheDocument();
      expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1); // 2 members and 2 subs
      expect(screen.getByText('In Transit')).toBeInTheDocument();
      expect(screen.getByText('Lost In Transit')).toBeInTheDocument();
    });
  });

  describe('CustomerCard Component', () => {
    it('should display customer name, live shipping address, and tracking info', () => {
      const onSelect = vi.fn();
      const onEdit = vi.fn();
      render(
        <CustomerCard
          customer={MOCK_CUSTOMERS[0]}
          onSelect={onSelect}
          onEditAddress={onEdit}
        />
      );

      expect(screen.getByText('Alex Vance')).toBeInTheDocument();
      expect(screen.getByText('789 Maple Ave, Denver CO 80202')).toBeInTheDocument();
      expect(screen.getByText('DSC-8832')).toBeInTheDocument();
      expect(screen.getByText('In Transit')).toBeInTheDocument();
    });

    it('should highlight lost shipments with warning indicators', () => {
      const onSelect = vi.fn();
      const onEdit = vi.fn();
      render(
        <CustomerCard
          customer={MOCK_CUSTOMERS[1]}
          onSelect={onSelect}
          onEditAddress={onEdit}
        />
      );

      expect(screen.getByText('Jamie Cole')).toBeInTheDocument();
      expect(screen.getByText('Lost In Transit')).toBeInTheDocument();
      expect(screen.getByText(/Package lost in transit/)).toBeInTheDocument();
    });
  });

  describe('App Component Integration', () => {
    it('should render dashboard and load customers from API', async () => {
      global.fetch = vi.fn().mockImplementation((url: string) => {
        if (url.includes('/api/customers')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ total: 2, customers: MOCK_CUSTOMERS })
          });
        }
        return Promise.reject(new Error('not found'));
      });

      render(<App />);

      expect(screen.getByText('Customer Operations & Live Database Monitor')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText('Alex Vance')).toBeInTheDocument();
        expect(screen.getByText('Jamie Cole')).toBeInTheDocument();
      });
    });

    it('should filter customers by search query', async () => {
      global.fetch = vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ total: 2, customers: MOCK_CUSTOMERS })
        })
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Alex Vance')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search member by name/);
      fireEvent.change(searchInput, { target: { value: 'Seattle' } });

      expect(screen.queryByText('Alex Vance')).not.toBeInTheDocument();
      expect(screen.getByText('Jamie Cole')).toBeInTheDocument();
    });
  });
});
