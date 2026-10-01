import React from 'react';
import { RefreshCw, Activity, ExternalLink, ShieldCheck, Database } from 'lucide-react';

interface HeaderProps {
  apiUrl: string;
  isConnected: boolean;
  isSyncing: boolean;
  autoSync: boolean;
  onToggleAutoSync: () => void;
  onRefresh: () => void;
  lastUpdated: Date | null;
}

export const Header: React.FC<HeaderProps> = ({
  apiUrl,
  isConnected,
  isSyncing,
  autoSync,
  onToggleAutoSync,
  onRefresh,
  lastUpdated,
}) => {
  const storeUrl = import.meta.env.VITE_STORE_URL || 'https://cxas-dsc-web-z66d5k5ioa-uc.a.run.app';

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black text-xl tracking-tighter">
            DSC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Customer Operations & Live Database Monitor
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                Live DB
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Observing real-time customer profile, order state, and shipping address modifications
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Connection status badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected
                  ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                  : 'bg-rose-500'
              }`}
            />
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[140px] sm:max-w-xs text-slate-300 font-mono" title={apiUrl}>
              {isConnected ? 'API Connected' : 'Connecting...'}
            </span>
            {lastUpdated && (
              <span className="text-slate-500 text-[10px] hidden sm:inline">
                ({lastUpdated.toLocaleTimeString()})
              </span>
            )}
          </div>

          {/* Auto Sync Toggle */}
          <button
            onClick={onToggleAutoSync}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              autoSync
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle live database polling every 3 seconds"
          >
            <Activity className={`w-3.5 h-3.5 ${autoSync ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>{autoSync ? 'Auto-Sync On (3s)' : 'Auto-Sync Paused'}</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Link to Storefront */}
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shadow-sm transition-colors"
          >
            <span>Open Store & AI Chat</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
