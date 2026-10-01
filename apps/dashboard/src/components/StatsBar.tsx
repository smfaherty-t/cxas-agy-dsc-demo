import React from 'react';
import { Users, Truck, AlertTriangle, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { EnrichedCustomer } from '../types.ts';

interface StatsBarProps {
  customers: EnrichedCustomer[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ customers }) => {
  const totalCustomers = customers.length;
  
  let inTransitCount = 0;
  let deliveredCount = 0;
  let lostCount = 0;
  let activeSubsCount = 0;

  customers.forEach(c => {
    if (c.subscription?.status === 'ACTIVE') {
      activeSubsCount++;
    }
    c.orders.forEach(o => {
      if (o.status === 'IN_TRANSIT') inTransitCount++;
      if (o.status === 'DELIVERED') deliveredCount++;
      if (o.status === 'LOST_IN_TRANSIT' || o.isLost) lostCount++;
    });
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
      {/* Total Customers */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Total Members</p>
          <p className="text-2xl font-bold text-white mt-1">{totalCustomers}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <Users className="w-5 h-5" />
        </div>
      </div>

      {/* In Transit */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">In Transit</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{inTransitCount}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Truck className="w-5 h-5" />
        </div>
      </div>

      {/* Delivered */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Delivered</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{deliveredCount}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Lost / Attention */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Lost In Transit</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">{lostCount}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Active Subs</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{activeSubsCount}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <CalendarCheck className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
