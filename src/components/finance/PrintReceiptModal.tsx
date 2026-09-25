import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { Invoice } from '../../types/erp';
import { SapienLogo } from '../SapienLogo';

interface PrintReceiptModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export const PrintReceiptModal: React.FC<PrintReceiptModalProps> = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        {/* Top Control Bar (Hidden during print) */}
        <div className="print:hidden p-4 bg-[#091827] text-white flex items-center justify-between border-b border-[#18314E]">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#DFB142]" />
            <span className="text-xs font-bold">Official Invoice & Receipt Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#142A42] hover:bg-[#1E3B5C] text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Document */}
        <div className="p-8 sm:p-10 space-y-6 bg-white font-sans text-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-300 pb-6">
            <div>
              <SapienLogo variant="full" size="lg" />
              <p className="text-[10px] tracking-widest uppercase text-slate-500 font-semibold mt-2">
                Future Skills Academy · Autonomous Systems Institute
              </p>
              <p className="text-[10px] text-slate-500">
                100 Innovation Way, Neural Hall · bursar@sapien.academy
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-800 border border-slate-300">
                Official Bursar Document
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                TUITION INVOICE & RECEIPT
              </h1>
              <p className="font-mono text-xs font-bold text-[#C59B27] mt-0.5">
                {invoice.invoiceNumber}
              </p>
              <div className="text-[10px] text-slate-500 mt-1 space-y-0.5">
                <p>Date of Issue: {invoice.issueDate}</p>
                <p>Payment Due Date: {invoice.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Scholar Information Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                Billed Scholar Details
              </span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{invoice.studentName}</p>
              <p className="font-mono text-xs font-semibold text-slate-600">
                Student ID: {invoice.studentCode}
              </p>
            </div>

            <div>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                Enrolled Academic Program
              </span>
              <p className="font-bold text-slate-800 text-xs mt-0.5">{invoice.programTitle}</p>
              <p className="text-[11px] text-slate-600">Autumn Academic Term 2026</p>
            </div>
          </div>

          {/* Itemized Billing Table */}
          <div>
            <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
              Itemized Academic Fees
            </h2>
            <table className="w-full text-left border border-slate-200">
              <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Fee ($ USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{item.description}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      ${item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Transactions Recorded */}
          <div>
            <h2 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
              Payment Transactions & Audit Trail
            </h2>
            {invoice.payments.length === 0 ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-800 text-[11px]">
                No payment transactions recorded. Full balance remains outstanding.
              </div>
            ) : (
              <table className="w-full text-left border border-slate-200">
                <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Method</th>
                    <th className="py-2 px-3">Reference #</th>
                    <th className="py-2 px-3 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoice.payments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2 px-3 text-slate-700">{p.date}</td>
                      <td className="py-2 px-3 uppercase font-semibold text-slate-800">
                        {p.method.replace('_', ' ')}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-600">{p.reference}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                        ${p.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Financial Totals Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Total Fee Invoiced:</span>
                <span className="font-mono font-bold text-slate-900">
                  ${invoice.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-700">
                  ${invoice.paidAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-slate-300 font-bold text-sm">
                <span className="text-slate-900">Balance Remaining:</span>
                <span className="font-mono text-amber-700">
                  ${invoice.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Stamp & Signatures */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-[10px] text-slate-500">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Verified by SAPIEN ERP Digital Ledger</span>
              </div>
              <p>
                This receipt constitutes legal proof of tuition payment. Retain this document for
                tax compliance and academic registration verification.
              </p>
            </div>

            <div className="text-right flex flex-col justify-end">
              <div className="border-b border-slate-400 w-48 ml-auto pb-1 mb-1">
                <span className="font-mono text-slate-800 text-[11px] font-semibold">
                  M. Vance, Ph.D.
                </span>
              </div>
              <span>Authorized Institutional Bursar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
