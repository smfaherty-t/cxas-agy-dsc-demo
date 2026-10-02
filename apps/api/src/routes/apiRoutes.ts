import { Router, Request, Response } from 'express';
import { DscService } from '../services/dscService.js';
import { OPENAPI_SPEC } from '../openapi.js';
import { db } from '../db/database.js';

export const apiRouter = Router();

// Healthcheck
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'dollar-shave-club-cxas-backend',
    database: {
      customers: db.getCustomers().length,
      orders: db.getOrders().length,
      replacements: db.getReplacements().length
    }
  });
});

// OpenAPI Spec Endpoint
apiRouter.get('/openapi.json', (_req: Request, res: Response) => {
  res.json(OPENAPI_SPEC);
});

// 1. Order Tracking & Subscription Cadence
apiRouter.post('/orders/track', (req: Request, res: Response) => {
  const { identifier } = req.body;
  if (!identifier || typeof identifier !== 'string') {
    res.status(400).json({ error: 'Missing or invalid identifier. Provide customer email or order number.' });
    return;
  }

  const result = DscService.trackOrder(identifier);
  if (!result.found) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
});

// 2. Shipping Address Update
apiRouter.post('/customers/address', (req: Request, res: Response) => {
  const { email, newAddress } = req.body;
  if (!email || !newAddress) {
    res.status(400).json({ error: 'Missing email or newAddress parameter.' });
    return;
  }

  const result = DscService.updateShippingAddress(email, newAddress);
  if (!result.success) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
});

// 3. Process Free Replacement
apiRouter.post('/orders/replacement', (req: Request, res: Response) => {
  const { email, originalOrderNumber, reason, items, newAddress } = req.body;
  if (!email || !originalOrderNumber || !reason) {
    res.status(400).json({ error: 'Missing required parameters: email, originalOrderNumber, reason.' });
    return;
  }

  const result = DscService.processReplacement({
    email,
    originalOrderNumber,
    reason,
    items,
    newAddress
  });

  if (!result.success) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
});

// 4. Delay Restock Box Billing
apiRouter.post('/subscriptions/delay', (req: Request, res: Response) => {
  const { email, newBillDate } = req.body;
  if (!email || !newBillDate) {
    res.status(400).json({ error: 'Missing email or newBillDate parameter.' });
    return;
  }

  const result = DscService.delayRestockBox(email, newBillDate);
  if (!result.success) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
});

// 5. Update Subscription Cadence / Delivery Frequency (Retention Workflow)
apiRouter.post('/subscriptions/cadence', (req: Request, res: Response) => {
  const { email, newCadence } = req.body;
  if (!email || !newCadence) {
    res.status(400).json({ error: 'Missing email or newCadence parameter.' });
    return;
  }

  const result = DscService.updateSubscriptionCadence(email, newCadence);
  if (!result.success) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
});

// 6. Validate Damaged Product Photo & Process Free Replacement
apiRouter.post('/damage/validate', (req: Request, res: Response) => {
  const { email, originalOrderNumber, imageUrl, imageBase64, imageName, item, description } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Missing email parameter.' });
    return;
  }

  const result = DscService.validateDamageAndReplace({
    email,
    originalOrderNumber,
    imageUrl,
    imageBase64,
    imageName,
    item,
    description
  });

  if (!result.success) {
    res.status(400).json(result);
    return;
  }
  res.json(result);
});

// 7. Get All Damage Inspection Reports
apiRouter.get('/damage/reports', (_req: Request, res: Response) => {
  const reports = db.getDamageReports();
  res.json({
    total: reports.length,
    reports,
    timestamp: new Date().toISOString()
  });
});

// 8. Dispatch Secure Payment Link
apiRouter.post('/billing/secure-link', (req: Request, res: Response) => {
  const { email, channel } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Missing email parameter.' });
    return;
  }

  const result = DscService.sendSecurePaymentLink(email, channel || 'BOTH');
  if (!result.success) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
});

// 6. Get All Customers (Enriched with Orders, Subscriptions, Replacements)
apiRouter.get('/customers', (_req: Request, res: Response) => {
  const customers = db.getAllEnrichedCustomers();
  res.json({
    total: customers.length,
    customers,
    timestamp: new Date().toISOString()
  });
});

// 7. Get Single Customer by ID or Email
apiRouter.get('/customers/:identifier', (req: Request, res: Response) => {
  const rawId = req.params.identifier;
  const identifier = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!identifier) {
    res.status(400).json({ error: 'Missing customer identifier.' });
    return;
  }
  const isEmail = identifier.includes('@');
  const customer = isEmail ? db.findCustomerByEmail(identifier) : db.findCustomerById(identifier);
  if (!customer) {
    res.status(404).json({ error: `Customer '${identifier}' not found.` });
    return;
  }
  const orders = db.findOrdersByCustomerId(customer.id);
  const subscription = db.findSubscriptionByCustomerId(customer.id);
  const replacements = db.getReplacements().filter(r => r.customerId === customer.id);
  res.json({
    ...customer,
    orders,
    subscription,
    replacements
  });
});

