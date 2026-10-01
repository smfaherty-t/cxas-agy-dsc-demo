import React from 'react';
import {
  MapPin,
  Package,
  Calendar,
  AlertCircle,
  Truck,
  CheckCircle,
  Clock,
  Sparkles,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { EnrichedCustomer } from '../types.ts';

interface CustomerCardProps {
  customer: EnrichedCustomer;
  onSelect: (customer: EnrichedCustomer) => void;
  onEditAddress: (customer: EnrichedCustomer) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onSelect,
  onEditAddress,
}) => {
  const latestOrder = customer.orders && customer.orders.length > 0
    ? customer.orders[customer.orders.length - 1]
    : undefined;

  const isLost = latestOrder?.isLost || latestOrder?.status === 'LOST_IN_TRANSIT';

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Truck className="w-3 h-3" /> In Transit
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" /> Delivered
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3" /> Processing
          </span>
        );
      case 'LOST_IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" /> Lost In Transit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400">
            No Active Orders
          </span>
        );
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 relative flex flex-col justify-between overflow-hidden ${
        customer.isRecentlyUpdated
          ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.25)]'
          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:shadow-lg'
      }`}
    >
      {/* Real-time Update Banner */}
      {customer.isRecentlyUpdated && (
        <div className="bg-emerald-500 text-slate-950 px-3 py-1 text-xs font-bold flex items-center justify-between tracking-wide animate-pulse">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Address Updated Live in Database!
          </span>
          <span className="text-[10px] uppercase font-mono">Just Now</span>
        </div>
      )}

      {/* Card Content */}
      <div className="p-5">
        {/* Customer Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white tracking-tight">
                {customer.name}
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {customer.id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{customer.email}</p>
            <p className="text-xs text-slate-500">{customer.phone}</p>
          </div>
          {getStatusBadge(latestOrder?.status)}
        </div>

        {/* Shipping Address Section - Highlighted */}
        <div
          className={`p-3 rounded-xl mb-4 border transition-colors ${
            customer.isRecentlyUpdated
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-500" />
              Live Shipping Address
            </span>
            <button
              onClick={() => onEditAddress(customer)}
              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-0.5 font-medium"
              title="Test updating this address"
            >
              <Edit3 className="w-2.5 h-2.5" /> Edit
            </button>
          </div>
          <p className="text-xs font-medium leading-relaxed break-words">
            {customer.shippingAddress}
          </p>
        </div>

        {/* Latest Order Summary */}
        {latestOrder && (
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 mb-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-mono">
                <Package className="w-3 h-3 text-slate-400" />
                {latestOrder.orderNumber}
              </span>
              <span className="text-slate-400 text-[11px]">
                {latestOrder.carrier} · {latestOrder.trackingNumber}
              </span>
            </div>

            <div className="text-xs text-slate-300">
              <span className="text-slate-400">ETA: </span>
              <span className="font-semibold text-slate-200">{latestOrder.eta}</span>
            </div>

            <div className="text-[11px] text-slate-400 truncate" title={latestOrder.items.join(', ')}>
              Items: {latestOrder.items.join(', ')}
            </div>

            {isLost && (
              <div className="mt-1 text-[11px] text-rose-300 bg-rose-950/40 border border-rose-900/50 p-1.5 rounded-lg flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
                <span>Package lost in transit (&gt;4 days without carrier scan). Replacement eligible.</span>
              </div>
            )}
          </div>
        )}

        {/* Subscription Summary */}
        {customer.subscription && (
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 py-1">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate">{customer.subscription.planName}</span>
            </div>
            <span className="text-[11px] font-medium text-slate-300 shrink-0">
              Next: {customer.subscription.nextBillDate}
            </span>
          </div>
        )}

        {/* Replacements indicator */}
        {customer.replacements && customer.replacements.length > 0 && (
          <div className="mt-2 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2 py-1 rounded-lg">
            ✓ Replacement dispatched: {customer.replacements.map(r => r.replacementId).join(', ')}
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
        <button
          onClick={() => onSelect(customer)}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
        >
          <span>View Full Profile & Orders</span>
          <ExternalLink className="w-3 h-3" />
        </button>
        <button
          onClick={() => onEditAddress(customer)}
          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
        >
          Update Address
        </button>
      </div>
    </div>
  );
};
