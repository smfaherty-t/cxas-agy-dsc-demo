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

// 5. Dispatch Secure Payment Link
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
