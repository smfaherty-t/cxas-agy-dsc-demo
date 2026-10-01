export interface Order {
  orderNumber: string;
  customerId: string;
  status: 'IN_TRANSIT' | 'DELIVERED' | 'PROCESSING' | 'LOST_IN_TRANSIT';
  trackingNumber: string;
  carrier: string;
  eta: string;
  lastCarrierScan: string;
  isLost: boolean;
  items: string[];
  createdDate: string;
  shippingAddress: string;
}

export interface Subscription {
  customerId: string;
  planName: string;
  cadence: string;
  nextBillDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  isStarterSetTrial: boolean;
  notes: string;
}

export interface ReplacementOrder {
  replacementId: string;
  originalOrderNumber: string;
  customerId: string;
  reason: string;
  items: string[];
  shippingAddress: string;
  createdAt: string;
  status: 'QUEUED' | 'SHIPPED';
}

export interface EnrichedCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  shippingAddress: string;
  orders: Order[];
  subscription?: Subscription;
  replacements?: ReplacementOrder[];
  isRecentlyUpdated?: boolean;
}
