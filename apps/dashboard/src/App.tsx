import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Header } from './components/Header.tsx';
import { StatsBar } from './components/StatsBar.tsx';
import { CustomerCard } from './components/CustomerCard.tsx';
import { CustomerDetailModal } from './components/CustomerDetailModal.tsx';
import { EditAddressModal } from './components/EditAddressModal.tsx';
import { EnrichedCustomer } from './types.ts';

const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'https://cxas-dsc-api-z66d5k5ioa-uc.a.run.app';

export const App: React.FC = () => {
  const [customers, setCustomers] = useState<EnrichedCustomer[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Modals state
  const [selectedCustomer, setSelectedCustomer] = useState<EnrichedCustomer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<EnrichedCustomer | null>(null);
  
  // Live update toast notifications
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // Address map to track mutations across polling cycles
  const prevAddressesRef = useRef<Map<string, string>>(new Map());
  const initialFetchDoneRef = useRef(false);

  const fetchCustomers = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsSyncing(true);
    try {
      const res = await fetch(`${DEFAULT_API_URL}/api/customers`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      const fetchedList: EnrichedCustomer[] = data.customers || [];

      // Detect address modifications across polls
      const newAddresses = new Map<string, string>();
      let changedCustomerName: string | null = null;
      let changedAddress: string | null = null;

      const updatedList = fetchedList.map((cust) => {
        const prevAddr = prevAddressesRef.current.get(cust.id);
        const hasChanged = initialFetchDoneRef.current && prevAddr && prevAddr !== cust.shippingAddress;
        
        if (hasChanged) {
          changedCustomerName = cust.name;
          changedAddress = cust.shippingAddress;
        }

        newAddresses.set(cust.id, cust.shippingAddress);
        return {
          ...cust,
          isRecentlyUpdated: hasChanged || (cust.isRecentlyUpdated && false),
        };
      });

      // If an address change was detected, update notification and maintain highlight
      if (changedCustomerName && changedAddress) {
        setRecentNotification(`Real-Time Event: Address for ${changedCustomerName} was updated to "${changedAddress}"`);
        setTimeout(() => setRecentNotification(null), 12000);
      }

      prevAddressesRef.current = newAddresses;
      initialFetchDoneRef.current = true;
      setCustomers(updatedList);
      setIsConnected(true);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      setIsConnected(false);
    } finally {
      if (!isBackground) setIsSyncing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCustomers(false);
  }, [fetchCustomers]);

  // Polling interval (3s) when autoSync is enabled
  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      fetchCustomers(true);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoSync, fetchCustomers]);

  // Handler to update shipping address via API
  const handleAddressUpdated = async (email: string, newAddress: string): Promise<boolean> => {
    try {
      const res = await fetch(`${DEFAULT_API_URL}/api/customers/address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newAddress })
      });
      if (!res.ok) return false;
      
      // Immediately refresh and trigger notification
      await fetchCustomers(false);
      setRecentNotification(`Address successfully updated for ${email} to "${newAddress}"`);
      setTimeout(() => setRecentNotification(null), 10000);
      return true;
    } catch (e) {
      console.error('Failed to update address:', e);
      return false;
    }
  };

  // Filtered customer list
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      searchTerm === '' ||
      cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.orders.some((o) =>
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'RECENT') return cust.isRecentlyUpdated;

    return cust.orders.some((o) => o.status === statusFilter);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Header
        apiUrl={DEFAULT_API_URL}
        isConnected={isConnected}
        isSyncing={isSyncing}
        autoSync={autoSync}
        onToggleAutoSync={() => setAutoSync((prev) => !prev)}
        onRefresh={() => fetchCustomers(false)}
        lastUpdated={lastUpdated}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {/* Live Notification Toast */}
        {recentNotification && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500 text-slate-950 font-semibold shadow-lg flex items-center justify-between animate-bounce">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm">{recentNotification}</span>
            </div>
            <button
              onClick={() => setRecentNotification(null)}
              className="text-xs font-bold uppercase underline hover:opacity-80 ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Demo Explanation Alert Banner */}
        <div className="mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Live Dual-Screen Synchronization
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
                Open the Dollar Shave Club storefront in another tab and ask the AI agent:
                <span className="text-amber-400 font-mono font-medium ml-1">
                  "I moved, please change my address for alex@example.com to 123 Palm Ave, Miami FL 33101"
                </span>
                . The CX Agent Studio agent will invoke the REST tool and the record on this dashboard will update live within 3 seconds!
              </p>
            </div>
          </div>
        </div>

        {/* Metric Overview */}
        <StatsBar customers={customers} />

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 my-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search member by name, email, order #, tracking #, or address..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 hidden sm:inline" />
            {[
              { id: 'ALL', label: 'All Members' },
              { id: 'IN_TRANSIT', label: 'In Transit' },
              { id: 'DELIVERED', label: 'Delivered' },
              { id: 'LOST_IN_TRANSIT', label: 'Lost / Attention' },
              { id: 'PROCESSING', label: 'Processing' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Cards Grid */}
        {filteredCustomers.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No matching customer records found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or status filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCustomers.map((cust) => (
              <CustomerCard
                key={cust.id}
                customer={cust}
                onSelect={(c) => setSelectedCustomer(c)}
                onEditAddress={(c) => setEditingCustomer(c)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 sm:px-8 py-6 text-center text-xs text-slate-500">
        Dollar Shave Club Customer Operations Portal · Powered by Google CX Agent Studio & Cloud Run
      </footer>

      {/* Detail Modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onEditAddress={(c) => setEditingCustomer(c)}
      />

      {/* Edit Address Modal */}
      <EditAddressModal
        customer={editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onAddressUpdated={handleAddressUpdated}
      />
    </div>
  );
};

export default App;
