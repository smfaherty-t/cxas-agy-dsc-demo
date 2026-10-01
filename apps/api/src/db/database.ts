export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  shippingAddress: string;
}

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

export interface DatabaseSchema {
  customers: Customer[];
  orders: Order[];
  subscriptions: Subscription[];
  replacements: ReplacementOrder[];
  secureLinksDispatched: Array<{
    id: string;
    customerId: string;
    email: string;
    phone: string;
    purpose: string;
    channel: string;
    dispatchedAt: string;
  }>;
}

const INITIAL_DATA: DatabaseSchema = {
  customers: [
    {
      id: "cust-alex",
      name: "Alex Vance",
      email: "alex@example.com",
      phone: "(555) 234-5678",
      shippingAddress: "789 Maple Ave, Denver CO 80202"
    },
    {
      id: "cust-jamie",
      name: "Jamie Cole",
      email: "jamie@example.com",
      phone: "(555) 345-6789",
      shippingAddress: "456 Oak Rd, Seattle WA 98101"
    },
    {
      id: "cust-chris",
      name: "Chris Wright",
      email: "chris@example.com",
      phone: "(555) 456-7890",
      shippingAddress: "101 Pine St, Chicago IL 60601"
    }
  ],
  orders: [
    {
      orderNumber: "DSC-8832",
      customerId: "cust-alex",
      status: "IN_TRANSIT",
      trackingNumber: "1Z99999999999999",
      carrier: "UPS",
      eta: "Tomorrow by 8 PM",
      lastCarrierScan: "Today, 6:15 AM - Out for Delivery Facility",
      isLost: false,
      items: [
        "Executive 6-Blade Starter Handle & 2 Cartridges",
        "Dr. Carver's Easy Shave Butter (6 oz)"
      ],
      createdDate: "2026-09-28",
      shippingAddress: "789 Maple Ave, Denver CO 80202"
    },
    {
      orderNumber: "DSC-9104",
      customerId: "cust-jamie",
      status: "LOST_IN_TRANSIT",
      trackingNumber: "9400111122223333",
      carrier: "USPS",
      eta: "Pending carrier scan",
      lastCarrierScan: "4 days ago - Regional Distribution Hub (No subsequent scans)",
      isLost: true,
      items: [
        "4-Blade Club Restock Box (8 cartridges)",
        "Post Shave Dew"
      ],
      createdDate: "2026-09-20",
      shippingAddress: "456 Oak Rd, Seattle WA 98101"
    },
    {
      orderNumber: "DSC-7721",
      customerId: "cust-chris",
      status: "DELIVERED",
      trackingNumber: "1Z88888888888888",
      carrier: "UPS",
      eta: "Delivered yesterday at front porch",
      lastCarrierScan: "Yesterday, 2:45 PM - Delivered",
      isLost: false,
      items: [
        "Dr. Carver's Easy Shave Butter (6 oz)",
        "6-Blade Club Refill Pack (8 cartridges)"
      ],
      createdDate: "2026-09-25",
      shippingAddress: "101 Pine St, Chicago IL 60601"
    }
  ],
  subscriptions: [
    {
      customerId: "cust-alex",
      planName: "Executive Starter Set -> Full Restock Box",
      cadence: "Bi-monthly (first restock box in 2 weeks)",
      nextBillDate: "October 15, 2026",
      status: "ACTIVE",
      isStarterSetTrial: true,
      notes: "Starter Set trial initiated. First full-size Restock Box automatically scheduled 2 weeks later to avoid running out of blades."
    },
    {
      customerId: "cust-jamie",
      planName: "4-Blade Club",
      cadence: "Every 2 months",
      nextBillDate: "November 2, 2026",
      status: "ACTIVE",
      isStarterSetTrial: false,
      notes: "Regular restock cadence."
    },
    {
      customerId: "cust-chris",
      planName: "Shave Butter + 6-Blade Club",
      cadence: "Monthly",
      nextBillDate: "Tomorrow",
      status: "ACTIVE",
      isStarterSetTrial: false,
      notes: "Billing scheduled for tomorrow."
    }
  ],
  replacements: [],
  secureLinksDispatched: []
};

// In-memory singleton with deep-clone reset capability
class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  public reset(): void {
    this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  public getCustomers(): Customer[] {
    return this.data.customers;
  }

  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getSubscriptions(): Subscription[] {
    return this.data.subscriptions;
  }

  public getReplacements(): ReplacementOrder[] {
    return this.data.replacements;
  }

  public getDispatchedLinks() {
    return this.data.secureLinksDispatched;
  }

  public findCustomerByEmail(email: string): Customer | undefined {
    return this.data.customers.find(c => c.email.toLowerCase() === email.trim().toLowerCase());
  }

  public findCustomerById(id: string): Customer | undefined {
    return this.data.customers.find(c => c.id === id);
  }

  public findOrderByNumber(orderNumber: string): Order | undefined {
    return this.data.orders.find(o => o.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase());
  }

  public findOrdersByCustomerId(customerId: string): Order[] {
    return this.data.orders.filter(o => o.customerId === customerId);
  }

  public findSubscriptionByCustomerId(customerId: string): Subscription | undefined {
    return this.data.subscriptions.find(s => s.customerId === customerId);
  }

  public updateCustomerAddress(customerId: string, newAddress: string): Customer | undefined {
    const cust = this.findCustomerById(customerId);
    if (cust) {
      cust.shippingAddress = newAddress;
    }
    return cust;
  }

  public addReplacement(replacement: ReplacementOrder): void {
    this.data.replacements.push(replacement);
  }

  public updateSubscriptionBillDate(customerId: string, newBillDate: string): Subscription | undefined {
    const sub = this.findSubscriptionByCustomerId(customerId);
    if (sub) {
      sub.nextBillDate = newBillDate;
    }
    return sub;
  }

  public recordSecureLinkDispatch(record: {
    customerId: string;
    email: string;
    phone: string;
    purpose: string;
    channel: string;
  }): void {
    this.data.secureLinksDispatched.push({
      id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...record,
      dispatchedAt: new Date().toISOString()
    });
  }
}

export const db = new DatabaseStore();
