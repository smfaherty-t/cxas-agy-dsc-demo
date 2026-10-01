import { db, Customer, Order, Subscription, ReplacementOrder } from '../db/database.js';

export interface TrackingResult {
  found: boolean;
  customer?: Customer;
  order?: Order;
  subscription?: Subscription;
  trackingInsight: {
    statusSummary: string;
    isLostInTransit: boolean;
    recommendedAction?: string;
  };
}

export class DscService {
  /**
   * Track order by customer email or order number
   */
  public static trackOrder(identifier: string): TrackingResult {
    const trimmed = identifier.trim();
    let customer: Customer | undefined;
    let order: Order | undefined;

    if (trimmed.includes('@')) {
      customer = db.findCustomerByEmail(trimmed);
      if (customer) {
        const orders = db.findOrdersByCustomerId(customer.id);
        order = orders[orders.length - 1]; // Latest order
      }
    } else {
      order = db.findOrderByNumber(trimmed);
      if (order) {
        customer = db.findCustomerById(order.customerId);
      }
    }

    if (!order && !customer) {
      return {
        found: false,
        trackingInsight: {
          statusSummary: `No order or customer found for '${identifier}'.`,
          isLostInTransit: false
        }
      };
    }

    const subscription = customer ? db.findSubscriptionByCustomerId(customer.id) : undefined;
    const isLost = order?.isLost || false;

    let statusSummary = '';
    let recommendedAction: string | undefined;

    if (isLost) {
      statusSummary = `Carrier has not scanned package in >4 days. Package is determined lost in transit.`;
      recommendedAction = `Immediate free replacement order authorized. Verify shipping address before submitting.`;
    } else if (order?.status === 'IN_TRANSIT') {
      statusSummary = `Order ${order.orderNumber} is in transit via ${order.carrier} (${order.trackingNumber}), arriving ${order.eta}.`;
    } else if (order?.status === 'DELIVERED') {
      statusSummary = `Order ${order.orderNumber} was delivered to ${order.shippingAddress}.`;
    }

    return {
      found: true,
      customer,
      order,
      subscription,
      trackingInsight: {
        statusSummary,
        isLostInTransit: isLost,
        recommendedAction
      }
    };
  }

  /**
   * Update customer shipping address in the database
   */
  public static updateShippingAddress(email: string, newAddress: string): { success: boolean; customer?: Customer; message: string } {
    const customer = db.findCustomerByEmail(email);
    if (!customer) {
      return { success: false, message: `Customer with email '${email}' not found.` };
    }

    const updated = db.updateCustomerAddress(customer.id, newAddress.trim());
    return {
      success: true,
      customer: updated,
      message: `Shipping address for ${customer.name} updated to '${newAddress.trim()}' for all current and future boxes.`
    };
  }

  /**
   * Create a free replacement order for lost or damaged goods
   */
  public static processReplacement(params: {
    email: string;
    originalOrderNumber: string;
    reason: string;
    items?: string[];
    newAddress?: string;
  }): { success: boolean; replacement?: ReplacementOrder; message: string } {
    const customer = db.findCustomerByEmail(params.email);
    if (!customer) {
      return { success: false, message: `Customer with email '${params.email}' not found.` };
    }

    // If new address provided, update customer shipping address
    let targetAddress = customer.shippingAddress;
    if (params.newAddress && params.newAddress.trim()) {
      db.updateCustomerAddress(customer.id, params.newAddress.trim());
      targetAddress = params.newAddress.trim();
    }

    const originalOrder = db.findOrderByNumber(params.originalOrderNumber);
    const itemsToReplace = params.items && params.items.length > 0
      ? params.items
      : originalOrder?.items || ["Standard Replacement Box"];

    const replacementCount = db.getReplacements().filter(r => r.originalOrderNumber === params.originalOrderNumber).length;
    const replacementId = `${params.originalOrderNumber}-R${replacementCount + 1}`;

    const replacement: ReplacementOrder = {
      replacementId,
      originalOrderNumber: params.originalOrderNumber,
      customerId: customer.id,
      reason: params.reason,
      items: itemsToReplace,
      shippingAddress: targetAddress,
      createdAt: new Date().toISOString(),
      status: 'QUEUED'
    };

    db.addReplacement(replacement);

    return {
      success: true,
      replacement,
      message: `Free replacement order ${replacementId} successfully queued to ship within 24 hours to ${targetAddress}.`
    };
  }

  /**
   * Delay next Restock Box bill date
   */
  public static delayRestockBox(email: string, newBillDate: string): { success: boolean; subscription?: Subscription; message: string } {
    const customer = db.findCustomerByEmail(email);
    if (!customer) {
      return { success: false, message: `Customer with email '${email}' not found.` };
    }

    const updatedSub = db.updateSubscriptionBillDate(customer.id, newBillDate);
    return {
      success: true,
      subscription: updatedSub,
      message: `Next Restock Box billing date delayed to ${newBillDate}. Membership remains active with uninterrupted benefits.`
    };
  }

  /**
   * Dispatch secure Shop Pay payment update link (never collect card over chat)
   */
  public static sendSecurePaymentLink(email: string, channel: 'SMS' | 'EMAIL' | 'BOTH' = 'BOTH'): {
    success: boolean;
    channel: string;
    recipientEmail: string;
    recipientPhone: string;
    message: string;
  } {
    const customer = db.findCustomerByEmail(email);
    if (!customer) {
      return {
        success: false,
        channel,
        recipientEmail: email,
        recipientPhone: '',
        message: `Customer with email '${email}' not found.`
      };
    }

    db.recordSecureLinkDispatch({
      customerId: customer.id,
      email: customer.email,
      phone: customer.phone,
      purpose: 'CREDIT_CARD_UPDATE_SHOP_PAY',
      channel
    });

    return {
      success: true,
      channel,
      recipientEmail: customer.email,
      recipientPhone: customer.phone,
      message: `Secure Shop Pay link dispatched to phone (${customer.phone}) and email (${customer.email}). Zero card credentials collected in chat.`
    };
  }
}
