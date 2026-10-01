import React, { useState } from 'react';
import { X, MapPin, Save, Loader2 } from 'lucide-react';
import { EnrichedCustomer } from '../types.ts';

interface EditAddressModalProps {
  customer: EnrichedCustomer | null;
  onClose: () => void;
  onAddressUpdated: (email: string, newAddress: string) => Promise<boolean>;
}

export const EditAddressModal: React.FC<EditAddressModalProps> = ({
  customer,
  onClose,
  onAddressUpdated,
}) => {
  if (!customer) return null;

  const [address, setAddress] = useState(customer.shippingAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Address cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const success = await onAddressUpdated(customer.email, address.trim());
      if (success) {
        onClose();
      } else {
        setError('Failed to update address on backend');
      }
    } catch (err: any) {
      setError(err?.message || 'Error communicating with backend');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              Update Shipping Address
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Member: <span className="text-white font-medium">{customer.name}</span> ({customer.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Current Address in DB
            </label>
            <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 break-words">
              {customer.shippingAddress}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              New Shipping Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              required
              className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g. 742 Evergreen Terrace, Springfield OR 97477"
            />
          </div>

          {error && (
            <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 p-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Database...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Address & Sync
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
