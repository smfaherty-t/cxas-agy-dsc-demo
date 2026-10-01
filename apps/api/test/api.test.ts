import { describe, it, expect, beforeEach } from 'vitest';
import { DscService } from '../src/services/dscService.js';
import { db } from '../src/db/database.js';
import { OPENAPI_SPEC } from '../src/openapi.js';

describe('Dollar Shave Club Customer Service API & Services', () => {
  beforeEach(() => {
    db.reset();
  });

  describe('OpenAPI Specification Integrity', () => {
    it('should export valid OpenAPI 3.0.3 specification with required paths', () => {
      expect(OPENAPI_SPEC.openapi).toBe('3.0.3');
      expect(OPENAPI_SPEC.paths['/api/orders/track']).toBeDefined();
      expect(OPENAPI_SPEC.paths['/api/customers/address']).toBeDefined();
      expect(OPENAPI_SPEC.paths['/api/orders/replacement']).toBeDefined();
      expect(OPENAPI_SPEC.paths['/api/subscriptions/delay']).toBeDefined();
      expect(OPENAPI_SPEC.paths['/api/billing/secure-link']).toBeDefined();
    });
  });

  describe('Database Store Initialization', () => {
    it('should initialize with pre-seeded customers, orders, and subscriptions', () => {
      expect(db.getCustomers().length).toBe(13);
      expect(db.getOrders().length).toBe(13);
      expect(db.getSubscriptions().length).toBe(13);
      expect(db.getReplacements().length).toBe(0);
    });

    it('should return enriched customer records with orders and subscriptions', () => {
      const enriched = db.getAllEnrichedCustomers();
      expect(enriched.length).toBe(13);
      const morgan = enriched.find(c => c.id === 'cust-morgan');
      expect(morgan).toBeDefined();
      expect(morgan?.orders.length).toBe(1);
      expect(morgan?.orders[0].orderNumber).toBe('DSC-6120');
      expect(morgan?.subscription?.planName).toBe('Executive Club');
    });

    it('should synchronize order destination address when customer address is updated', () => {
      const updated = db.updateCustomerAddress('cust-morgan', '999 New Wave Way, Austin TX 78704');
      expect(updated?.shippingAddress).toBe('999 New Wave Way, Austin TX 78704');
      const orders = db.findOrdersByCustomerId('cust-morgan');
      expect(orders[0].shippingAddress).toBe('999 New Wave Way, Austin TX 78704');
    });
  });

  describe('Use Case 1: Alex Vance (Order Tracking & Restock Box Cadence)', () => {
    it('should track order by email and retrieve ETA and subscription billing schedule', () => {
      const result = DscService.trackOrder('alex@example.com');
      expect(result.found).toBe(true);
      expect(result.customer?.name).toBe('Alex Vance');
      expect(result.order?.orderNumber).toBe('DSC-8832');
      expect(result.order?.status).toBe('IN_TRANSIT');
      expect(result.order?.trackingNumber).toBe('1Z99999999999999');
      expect(result.order?.eta).toBe('Tomorrow by 8 PM');
      expect(result.subscription?.nextBillDate).toBe('October 15, 2026');
      expect(result.subscription?.isStarterSetTrial).toBe(true);
    });

    it('should track order by order number DSC-8832', () => {
      const result = DscService.trackOrder('DSC-8832');
      expect(result.found).toBe(true);
      expect(result.customer?.email).toBe('alex@example.com');
      expect(result.order?.carrier).toBe('UPS');
    });

    it('should delay next Restock Box billing date', () => {
      const result = DscService.delayRestockBox('alex@example.com', 'November 1, 2026');
      expect(result.success).toBe(true);
      expect(result.subscription?.nextBillDate).toBe('November 1, 2026');

      // Verify persistence in DB
      const sub = db.findSubscriptionByCustomerId('cust-alex');
      expect(sub?.nextBillDate).toBe('November 1, 2026');
    });
  });

  describe('Use Case 2: Jamie Cole (Lost/Missing Item & Address Update)', () => {
    it('should identify lost package with >4 days since carrier scan', () => {
      const result = DscService.trackOrder('jamie@example.com');
      expect(result.found).toBe(true);
      expect(result.order?.orderNumber).toBe('DSC-9104');
      expect(result.order?.isLost).toBe(true);
      expect(result.trackingInsight.isLostInTransit).toBe(true);
      expect(result.trackingInsight.recommendedAction).toContain('Immediate free replacement');
    });

    it('should update customer shipping address in database', () => {
      const result = DscService.updateShippingAddress('jamie@example.com', '123 Main St, Austin TX 78701');
      expect(result.success).toBe(true);
      expect(result.customer?.shippingAddress).toBe('123 Main St, Austin TX 78701');

      // Verify persistence in db
      const cust = db.findCustomerByEmail('jamie@example.com');
      expect(cust?.shippingAddress).toBe('123 Main St, Austin TX 78701');
    });

    it('should process free replacement order to updated address', () => {
      const result = DscService.processReplacement({
        email: 'jamie@example.com',
        originalOrderNumber: 'DSC-9104',
        reason: 'LOST_IN_TRANSIT',
        newAddress: '123 Main St, Austin TX 78701'
      });

      expect(result.success).toBe(true);
      expect(result.replacement?.replacementId).toBe('DSC-9104-R1');
      expect(result.replacement?.shippingAddress).toBe('123 Main St, Austin TX 78701');
      expect(result.replacement?.status).toBe('QUEUED');
      expect(db.getReplacements().length).toBe(1);
    });
  });

  describe('Use Case 3: Chris Wright (Damaged Item & Secure Payment Link)', () => {
    it('should process replacement for damaged Shave Butter', () => {
      const result = DscService.processReplacement({
        email: 'chris@example.com',
        originalOrderNumber: 'DSC-7721',
        reason: 'DAMAGED_ITEM_EXPLODED_IN_TRANSIT',
        items: ["Dr. Carver's Easy Shave Butter (6 oz)"]
      });

      expect(result.success).toBe(true);
      expect(result.replacement?.replacementId).toBe('DSC-7721-R1');
      expect(result.replacement?.items).toEqual(["Dr. Carver's Easy Shave Butter (6 oz)"]);
    });

    it('should dispatch secure Shop Pay link without collecting card in chat', () => {
      const result = DscService.sendSecurePaymentLink('chris@example.com', 'BOTH');
      expect(result.success).toBe(true);
      expect(result.recipientPhone).toBe('(555) 456-7890');
      expect(result.recipientEmail).toBe('chris@example.com');
      expect(result.message).toContain('Zero card credentials collected in chat');
      expect(db.getDispatchedLinks().length).toBe(1);
    });
  });
});
