import React from 'react';
import { X, MapPin, Package, Calendar, AlertTriangle, Truck, CheckCircle2, Clock } from 'lucide-react';
import { EnrichedCustomer } from '../types.ts';

interface CustomerDetailModalProps {
  customer: EnrichedCustomer | null;
  onClose: () => void;
  onEditAddress: (customer: EnrichedCustomer) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  onClose,
  onEditAddress,
}) => {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{customer.name}</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {customer.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {customer.email} · {customer.phone}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Shipping Address Section */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                Live Shipping Address in Database
              </span>
              <p className="text-sm font-semibold text-slate-100">{customer.shippingAddress}</p>
              <p className="text-xs text-slate-400 mt-1">
                Any modifications made by the AI agent or support portal immediately update here.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onEditAddress(customer);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shrink-0"
            >
              Edit Address
            </button>
          </div>

          {/* Subscription Section */}
          {customer.subscription && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-3">
                <Calendar className="w-4 h-4" />
                Membership & Restock Box Subscription
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Plan:</span>
                  <p className="font-semibold text-white">{customer.subscription.planName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Frequency:</span>
                  <p className="font-semibold text-white">{customer.subscription.cadence}</p>
                </div>
                <div>
                  <span className="text-slate-400">Next Scheduled Bill Date:</span>
                  <p className="font-semibold text-amber-400">{customer.subscription.nextBillDate}</p>
                </div>
                <div>
                  <span className="text-slate-400">Subscription Status:</span>
                  <p className="font-semibold text-emerald-400">{customer.subscription.status}</p>
                </div>
              </div>
              {customer.subscription.notes && (
                <p className="mt-3 text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  Note: {customer.subscription.notes}
                </p>
              )}
            </div>
          )}

          {/* Orders Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
              <Package className="w-4 h-4" />
              Order History & Fulfillment Details ({customer.orders.length})
            </h3>
            <div className="space-y-3">
              {customer.orders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-sm">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold border bg-slate-900 text-slate-300 border-slate-700">
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Carrier:</span>{' '}
                      <span className="text-slate-200">{order.carrier}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Tracking:</span>{' '}
                      <span className="font-mono text-slate-200">{order.trackingNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Estimated Delivery:</span>{' '}
                      <span className="font-semibold text-amber-400">{order.eta}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Shipment Destination:</span>{' '}
                      <span className="text-slate-200">{order.shippingAddress}</span>
                    </div>
                  </div>

                  <div className="text-xs bg-slate-900/70 p-2 rounded-lg border border-slate-800 text-slate-300">
                    <span className="text-slate-400">Last Carrier Scan:</span> {order.lastCarrierScan}
                  </div>

                  <div className="text-xs text-slate-400">
                    <span>Items: </span>
                    <ul className="list-disc list-inside mt-1 text-slate-300">
                      {order.items.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Replacements Section */}
          {customer.replacements && customer.replacements.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                Dispatched Replacement Shipments
              </h3>
              <div className="space-y-2">
                {customer.replacements.map((r) => (
                  <div key={r.replacementId} className="text-xs text-slate-300">
                    <span className="font-mono font-bold text-white">{r.replacementId}</span> (Original:{' '}
                    {r.originalOrderNumber}) - Reason: {r.reason}
                    <div className="text-slate-400 text-[11px]">
                      Destination: {r.shippingAddress} · Status: {r.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
