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

export interface DamageInspectionReport {
  id: string;
  customerId: string;
  email: string;
  originalOrderNumber: string;
  damagedItem: string;
  imageUrl?: string;
  isValidDamage: boolean;
  damageType: string;
  confidence: number;
  analysisSummary: string;
  replacementId?: string;
  inspectedAt: string;
}

export interface DatabaseSchema {
  customers: Customer[];
  orders: Order[];
  subscriptions: Subscription[];
  replacements: ReplacementOrder[];
  damageReports: DamageInspectionReport[];
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
    },
    {
      id: "cust-morgan",
      name: "Morgan Bailey",
      email: "morgan.bailey@example.com",
      phone: "(555) 567-8901",
      shippingAddress: "245 Elm St, Austin TX 78701"
    },
    {
      id: "cust-taylor",
      name: "Taylor Brooks",
      email: "taylor.brooks@example.com",
      phone: "(555) 678-9012",
      shippingAddress: "882 Sunset Blvd, Los Angeles CA 90028"
    },
    {
      id: "cust-jordan",
      name: "Jordan Hayes",
      email: "jordan.hayes@example.com",
      phone: "(555) 789-0123",
      shippingAddress: "512 Peachtree St, Atlanta GA 30308"
    },
    {
      id: "cust-casey",
      name: "Casey Miller",
      email: "casey.miller@example.com",
      phone: "(555) 890-1234",
      shippingAddress: "1340 Grand Ave, St. Paul MN 55105"
    },
    {
      id: "cust-riley",
      name: "Riley Davis",
      email: "riley.davis@example.com",
      phone: "(555) 901-2345",
      shippingAddress: "303 Ocean Ave, Miami FL 33139"
    },
    {
      id: "cust-sam",
      name: "Sam Parker",
      email: "sam.parker@example.com",
      phone: "(555) 112-2334",
      shippingAddress: "670 Broadway, New York NY 10012"
    },
    {
      id: "cust-dakota",
      name: "Dakota Kelly",
      email: "dakota.kelly@example.com",
      phone: "(555) 223-3445",
      shippingAddress: "1420 Market St, San Francisco CA 94102"
    },
    {
      id: "cust-avery",
      name: "Avery Cooper",
      email: "avery.cooper@example.com",
      phone: "(555) 334-4556",
      shippingAddress: "915 River Rd, Portland OR 97201"
    },
    {
      id: "cust-reese",
      name: "Reese Sullivan",
      email: "reese.sullivan@example.com",
      phone: "(555) 445-5667",
      shippingAddress: "202 Beacon St, Boston MA 02116"
    },
    {
      id: "cust-quinn",
      name: "Quinn Howard",
      email: "quinn.howard@example.com",
      phone: "(555) 556-6778",
      shippingAddress: "710 Broadway Blvd, Kansas City MO 64105"
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
    },
    {
      orderNumber: "DSC-6120",
      customerId: "cust-morgan",
      status: "IN_TRANSIT",
      trackingNumber: "1Z111222333444",
      carrier: "FedEx",
      eta: "Tomorrow by 5 PM",
      lastCarrierScan: "Today, 4:20 AM - In Transit to Local Facility",
      isLost: false,
      items: [
        "Executive Shave Starter Kit",
        "Charcoal Daily Face Wash"
      ],
      createdDate: "2026-09-29",
      shippingAddress: "245 Elm St, Austin TX 78701"
    },
    {
      orderNumber: "DSC-5431",
      customerId: "cust-taylor",
      status: "DELIVERED",
      trackingNumber: "940551122334455",
      carrier: "USPS",
      eta: "Delivered 3 days ago",
      lastCarrierScan: "3 days ago, 11:30 AM - Delivered in Parcel Locker",
      isLost: false,
      items: [
        "6-Blade Refills (8ct)",
        "Post Shave Dew Daily Hydrator"
      ],
      createdDate: "2026-09-22",
      shippingAddress: "882 Sunset Blvd, Los Angeles CA 90028"
    },
    {
      orderNumber: "DSC-7890",
      customerId: "cust-jordan",
      status: "PROCESSING",
      trackingNumber: "1Z333444555666",
      carrier: "UPS",
      eta: "Friday by 7 PM",
      lastCarrierScan: "Order packed and awaiting carrier pickup at warehouse",
      isLost: false,
      items: [
        "Dr. Carver's Shave Butter (2pk)",
        "Soothing Pre-Shave Oil"
      ],
      createdDate: "2026-09-30",
      shippingAddress: "512 Peachtree St, Atlanta GA 30308"
    },
    {
      orderNumber: "DSC-4419",
      customerId: "cust-casey",
      status: "LOST_IN_TRANSIT",
      trackingNumber: "940022233344455",
      carrier: "USPS",
      eta: "Pending carrier scan",
      lastCarrierScan: "5 days ago - Regional Sort Center (No movement)",
      isLost: true,
      items: [
        "4-Blade Starter Handle & Cartridges",
        "Dr. Carver's Easy Shave Butter (6 oz)"
      ],
      createdDate: "2026-09-18",
      shippingAddress: "1340 Grand Ave, St. Paul MN 55105"
    },
    {
      orderNumber: "DSC-9923",
      customerId: "cust-riley",
      status: "IN_TRANSIT",
      trackingNumber: "1Z777888999000",
      carrier: "UPS",
      eta: "Thursday by 2 PM",
      lastCarrierScan: "Departed Sort Facility - Jacksonville FL",
      isLost: false,
      items: [
        "Charcoal Exfoliating Scrub",
        "6-Blade Refill Cartridges (4ct)"
      ],
      createdDate: "2026-09-29",
      shippingAddress: "303 Ocean Ave, Miami FL 33139"
    },
    {
      orderNumber: "DSC-3310",
      customerId: "cust-sam",
      status: "DELIVERED",
      trackingNumber: "1Z555666777888",
      carrier: "FedEx",
      eta: "Delivered today, signed by front desk",
      lastCarrierScan: "Today, 10:15 AM - Delivered to Reception",
      isLost: false,
      items: [
        "Double Header Electric Trimmer",
        "Precision Trimmer Blade Attachments"
      ],
      createdDate: "2026-09-26",
      shippingAddress: "670 Broadway, New York NY 10012"
    },
    {
      orderNumber: "DSC-8205",
      customerId: "cust-dakota",
      status: "PROCESSING",
      trackingNumber: "940559988776655",
      carrier: "USPS",
      eta: "Monday by 8 PM",
      lastCarrierScan: "Shipping label created; preparing shipment",
      isLost: false,
      items: [
        "Fresh Citrus Ball Deodorant Spray",
        "4-Blade Cartridge Pack (8ct)"
      ],
      createdDate: "2026-10-01",
      shippingAddress: "1420 Market St, San Francisco CA 94102"
    },
    {
      orderNumber: "DSC-6781",
      customerId: "cust-avery",
      status: "IN_TRANSIT",
      trackingNumber: "1Z222333444555",
      carrier: "UPS",
      eta: "Friday by 6 PM",
      lastCarrierScan: "Arrived at Portland Delivery Facility",
      isLost: false,
      items: [
        "6-Blade Heritage Edition Handle & Weighted Stand",
        "Heritage Razor Cartridges (4ct)"
      ],
      createdDate: "2026-09-28",
      shippingAddress: "915 River Rd, Portland OR 97201"
    },
    {
      orderNumber: "DSC-1144",
      customerId: "cust-reese",
      status: "DELIVERED",
      trackingNumber: "940019988776655",
      carrier: "USPS",
      eta: "Delivered 5 days ago",
      lastCarrierScan: "5 days ago, 1:12 PM - Delivered at Mailbox",
      isLost: false,
      items: [
        "Exfoliating Shave Prep Scrub",
        "Easy Shave Butter (2pk)"
      ],
      createdDate: "2026-09-21",
      shippingAddress: "202 Beacon St, Boston MA 02116"
    },
    {
      orderNumber: "DSC-5567",
      customerId: "cust-quinn",
      status: "IN_TRANSIT",
      trackingNumber: "1Z666777888999",
      carrier: "FedEx",
      eta: "Tomorrow by end of day",
      lastCarrierScan: "In Transit - Kansas City Hub",
      isLost: false,
      items: [
        "Travel Shave Kit with Hard Case",
        "4-Blade Refill Cartridges (4ct)"
      ],
      createdDate: "2026-09-29",
      shippingAddress: "710 Broadway Blvd, Kansas City MO 64105"
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
    },
    {
      customerId: "cust-morgan",
      planName: "Executive Club",
      cadence: "Every 2 months",
      nextBillDate: "November 10, 2026",
      status: "ACTIVE",
      isStarterSetTrial: false,
      notes: "Bi-monthly restock cadence."
    },
    {
      customerId: "cust-taylor",
      planName: "6-Blade Razor Subscription",
      cadence: "Monthly",
      nextBillDate: "October 24, 2026",
      status: "ACTIVE",
      isStarterSetTrial: false,
      notes: "Heavy shaver monthly cadence."
    },
    {
      customerId: "cust-jordan",
      planName: "Grooming Essentials Bundle",
      cadence: "Monthly",
      nextBillDate: "October 18, 2026",
      status: "ACTIVE",
      isStarterSetTrial: false,
      notes: "Includes Shave Butter + Pre-Shave Oil."
    },
    {
      customerId: "cust-casey",
      planName: "4-Blade Club",
      cadence: "Every 2 months",
      nextBillDate: "November 1, 2026",
      status: "ACTIVE",
      isStarterSetTrial: true,
      notes: "Starter set recently shipped."
    },
    {
      customerId: "cust-riley",
      planName: "Skincare + Blade Cadence",
      cadence: "Every 3 months",
      nextBillDate: "December 1, 2026",
      status: "ACTIVE",
      isStarterSetTrial: false,
      notes: "Quarterly delivery."
    },
    {
      customerId: "cust-sam",
      planName: "Trimmer Blade Maintenance",
      cadence: "Every 6 months",
      nextBillDate: "March 15, 2027",
      status: "ACTIVE",
      isStarterSetTrial: false,
      notes: "Semi-annual trimmer head replacement."
    },
    {
      customerId: "cust-dakota",
      planName: "Body Care & Razor Plan",
      cadence: "Monthly",
      nextBillDate: "October 20, 2026",
      status: "ACTIVE",
      isStarterSetTrial: false,
      notes: "Deodorant + 4-Blade cartridge plan."
    },
    {
      customerId: "cust-avery",
      planName: "Heritage Blade Club",
      cadence: "Every 2 months",
      nextBillDate: "November 15, 2026",
      status: "ACTIVE",
      isStarterSetTrial: false,
      notes: "Premium metal handle member."
    },
    {
      customerId: "cust-reese",
      planName: "Shave Prep Duo",
      cadence: "Monthly",
      nextBillDate: "October 27, 2026",
      status: "ACTIVE",
      isStarterSetTrial: false,
      notes: "Scrub + Shave Butter restock."
    },
    {
      customerId: "cust-quinn",
      planName: "Frequent Traveler Plan",
      cadence: "Every 2 months",
      nextBillDate: "November 5, 2026",
      status: "ACTIVE",
      isStarterSetTrial: false,
      notes: "Compact travel cartridges."
    }
  ],
  replacements: [],
  damageReports: [],
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

  public getAllEnrichedCustomers() {
    return this.data.customers.map(c => {
      const orders = this.findOrdersByCustomerId(c.id);
      const subscription = this.findSubscriptionByCustomerId(c.id);
      const replacements = this.data.replacements.filter(r => r.customerId === c.id);
      return {
        ...c,
        orders,
        subscription,
        replacements
      };
    });
  }

  public updateCustomerAddress(customerId: string, newAddress: string): Customer | undefined {
    const cust = this.findCustomerById(customerId);
    if (cust) {
      cust.shippingAddress = newAddress;
      // Also update any active / processing / in transit orders for this customer
      for (const order of this.data.orders) {
        if (order.customerId === customerId && (order.status === 'IN_TRANSIT' || order.status === 'PROCESSING' || order.status === 'LOST_IN_TRANSIT')) {
          order.shippingAddress = newAddress;
        }
      }
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

  public updateSubscriptionCadence(customerId: string, newCadence: string): Subscription | undefined {
    const sub = this.findSubscriptionByCustomerId(customerId);
    if (sub) {
      sub.cadence = newCadence;
    }
    return sub;
  }

  public recordDamageReport(report: DamageInspectionReport): void {
    if (!this.data.damageReports) {
      this.data.damageReports = [];
    }
    this.data.damageReports.push(report);
  }

  public getDamageReports(): DamageInspectionReport[] {
    return this.data.damageReports || [];
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
