import React, { useState, useEffect } from 'react';
import { X, CreditCard, CheckCircle2, DollarSign, ShieldAlert, ArrowRight } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Invoice, PaymentMethod } from '../../types/erp';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedInvoice?: Invoice;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  preselectedInvoice,
}) => {
  const { invoices, recordPayment, setSelectedInvoiceForPrint } = useERP();

  const unpaidInvoices = invoices.filter((i) => i.balance > 0);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(
    preselectedInvoice?.id || unpaidInvoices[0]?.id || ''
  );

  useEffect(() => {
    if (preselectedInvoice) {
      setSelectedInvoiceId(preselectedInvoice.id);
    } else if (unpaidInvoices.length > 0 && !selectedInvoiceId) {
      setSelectedInvoiceId(unpaidInvoices[0].id);
    }
  }, [preselectedInvoice, unpaidInvoices]);

  const currentInvoice = invoices.find((i) => i.id === selectedInvoiceId);

  const [amount, setAmount] = useState<number>(currentInvoice?.balance || 0);
  const [method, setMethod] = useState<PaymentMethod>('bank_transfer');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Sync amount with balance on invoice change
  useEffect(() => {
    if (currentInvoice) {
      setAmount(currentInvoice.balance);
      setReference(`TXN-${Date.now().toString().slice(-6)}`);
    }
  }, [selectedInvoiceId, currentInvoice]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInvoice) {
      setError('Please select an active invoice.');
      return;
    }

    if (amount <= 0 || amount > currentInvoice.balance) {
      setError(`Payment amount must be between $1 and remaining balance of $${currentInvoice.balance}.`);
      return;
    }

    recordPayment(
      currentInvoice.id,
      Number(amount),
      method,
      reference.trim() || `REF-${Date.now().toString().slice(-6)}`,
      'Bursar Office',
      notes.trim() || undefined
    );

    // Open receipt print preview
    const updated = {
      ...currentInvoice,
      paidAmount: currentInvoice.paidAmount + Number(amount),
      balance: Math.max(0, currentInvoice.balance - Number(amount)),
      status: (currentInvoice.balance - Number(amount) === 0 ? 'paid' : 'partial') as any,
    };
    setSelectedInvoiceForPrint(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#091827] border border-[#193554] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0C1E32] to-[#0A1828] border-b border-[#162D47] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Record Tuition Fee Payment</h2>
              <p className="text-xs text-slate-400">
                Issue official payment transaction & update scholar account balance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Select Invoice */}
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Select Student Invoice</label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27] cursor-pointer"
            >
              {unpaidInvoices.length === 0 ? (
                <option value="">No pending invoices available</option>
              ) : (
                unpaidInvoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} · {inv.studentName} (${inv.balance} Due)
                  </option>
                ))
              )}
            </select>
          </div>

          {currentInvoice && (
            <div className="p-3.5 rounded-xl bg-[#050E17] border border-[#142A42] space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Scholar:</span>
                <span className="font-bold text-white">
                  {currentInvoice.studentName} ({currentInvoice.studentCode})
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Academic Track:</span>
                <span className="text-slate-300">{currentInvoice.programTitle}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#142A42] text-xs">
                <span className="text-slate-400">Total Invoiced:</span>
                <span className="font-mono text-white">${currentInvoice.totalAmount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Previously Paid:</span>
                <span className="font-mono text-emerald-400">${currentInvoice.paidAmount}</span>
              </div>
              <div className="flex justify-between font-bold text-sm">
                <span className="text-amber-400">Outstanding Balance:</span>
                <span className="font-mono text-amber-400">${currentInvoice.balance}</span>
              </div>
            </div>
          )}

          {/* Payment Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Payment Amount ($) *</label>
              <input
                type="number"
                required
                min={1}
                max={currentInvoice?.balance || 10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-[#071321] text-white font-mono font-bold text-base p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Payment Channel</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27] cursor-pointer"
              >
                <option value="bank_transfer">Wire / Direct Bank Transfer</option>
                <option value="card">Credit / Debit Card (Stripe Gateway)</option>
                <option value="cash">Cash at Bursar Counter</option>
                <option value="scholarship">Institutional Dean Scholarship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Transaction Reference Code</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g. WIRE-88192-X or Card Auth Ref"
              className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Bursar Remarks (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. First installment verified via bank statement"
              className="w-full bg-[#071321] text-white p-2.5 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#15273C] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!currentInvoice || currentInvoice.balance <= 0}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record ${amount} & Issue Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
