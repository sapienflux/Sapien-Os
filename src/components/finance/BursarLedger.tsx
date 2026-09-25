import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  Plus,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  DollarSign,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Invoice, InvoiceStatus } from '../../types/erp';

interface BursarLedgerProps {
  onOpenRecordPayment: (invoice?: Invoice) => void;
}

export const BursarLedger: React.FC<BursarLedgerProps> = ({ onOpenRecordPayment }) => {
  const { invoices, financialSummary, setSelectedInvoiceForPrint, role } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.programTitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  // Export Invoices to CSV
  const handleExportCSV = () => {
    const headers = [
      'Invoice Number',
      'Student Code',
      'Student Name',
      'Program',
      'Issue Date',
      'Due Date',
      'Total Amount ($)',
      'Paid Amount ($)',
      'Balance ($)',
      'Status',
    ];

    const rows = filteredInvoices.map((i) => [
      i.invoiceNumber,
      i.studentCode,
      `"${i.studentName}"`,
      `"${i.programTitle}"`,
      i.issueDate,
      i.dueDate,
      i.totalAmount,
      i.paidAmount,
      i.balance,
      i.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SAPIEN_Invoices_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Financial Highlights */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#091827] border border-[#162D47] rounded-xl p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#DFB142] uppercase tracking-wider mb-1">
            <span>Bursar Office</span>
            <span aria-hidden="true">·</span>
            <span>Institutional Financial Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Tuition & Accounts Receivable
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time fee auditing, payment verification, and official tuition receipts
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-lg bg-[#0F2236] hover:bg-[#16314D] text-slate-300 hover:text-white border border-[#1E3B5C] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Ledger</span>
          </button>

          {(role === 'admin' || role === 'finance') && (
            <button
              onClick={() => onOpenRecordPayment()}
              className="px-3.5 py-2 rounded-lg bg-[#C59B27] hover:bg-[#D4AF37] text-[#07121E] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Record Fee Payment</span>
            </button>
          )}
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#091827] border border-[#162D47] rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Invoiced Tuition
          </span>
          <p className="text-2xl font-black text-white mt-1">
            ${financialSummary.totalInvoiced.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Across {invoices.length} active invoices</span>
        </div>

        <div className="bg-[#091827] border border-[#162D47] rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Collected Cashflow
          </span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            ${financialSummary.totalCollected.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">
            {financialSummary.collectionRate}% realized to date
          </span>
        </div>

        <div className="bg-[#091827] border border-[#162D47] rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Outstanding Receivables
          </span>
          <p className="text-2xl font-black text-amber-400 mt-1">
            ${financialSummary.totalOutstanding.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">Due within trimester cycles</span>
        </div>

        <div className="bg-[#091827] border border-[#162D47] rounded-xl p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Overdue Invoices
          </span>
          <p className="text-2xl font-black text-rose-400 mt-1">
            {invoices.filter((i) => i.status === 'overdue').length}
          </p>
          <span className="text-[10px] text-rose-400 font-semibold">Immediate follow-up</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#091827] border border-[#162D47] rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice number, scholar name, or student code..."
            className="w-full bg-[#071424] text-xs text-slate-200 placeholder-slate-400 pl-9 pr-3 py-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        <div className="w-full sm:w-60">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#071424] text-xs text-slate-300 px-3 py-2 rounded-lg border border-[#19334F] focus:outline-none focus:border-[#C59B27] cursor-pointer"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid in Full</option>
            <option value="partial">Partially Paid</option>
            <option value="unpaid">Unpaid Pending</option>
            <option value="overdue">Overdue Past Due</option>
          </select>
        </div>
      </div>

      {/* Main Invoices Table */}
      <div className="bg-[#091827] border border-[#162D47] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#06111D] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-[#142940]">
              <tr>
                <th className="py-3 px-4">Invoice # & Date</th>
                <th className="py-3 px-4">Scholar Details</th>
                <th className="py-3 px-4">Total Fee</th>
                <th className="py-3 px-4">Paid Realized</th>
                <th className="py-3 px-4">Remaining Balance</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Ledger Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#13273E] text-slate-300">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    No invoice records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#0B1E32]/60 transition-colors">
                    {/* Invoice ID */}
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-[#DFB142]">{inv.invoiceNumber}</p>
                      <p className="text-[11px] text-slate-400">Due: {inv.dueDate}</p>
                    </td>

                    {/* Student Details */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{inv.studentName}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span className="font-mono text-[#C59B27]">{inv.studentCode}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate max-w-[180px]">{inv.programTitle}</span>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 font-mono font-bold text-white text-xs">
                      ${inv.totalAmount.toLocaleString()}
                    </td>

                    {/* Paid */}
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">
                      ${inv.paidAmount.toLocaleString()}
                    </td>

                    {/* Balance */}
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={inv.balance > 0 ? 'text-amber-400' : 'text-slate-500'}>
                        ${inv.balance.toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          inv.status === 'paid'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : inv.status === 'partial'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : inv.status === 'overdue'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-slate-900 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.balance > 0 && (role === 'admin' || role === 'finance') && (
                          <button
                            onClick={() => onOpenRecordPayment(inv)}
                            className="px-2.5 py-1 rounded bg-[#142A42] hover:bg-[#1E3B5C] text-[#DFB142] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Record Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Collect</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedInvoiceForPrint(inv)}
                          className="px-2.5 py-1 rounded bg-[#0F2236] hover:bg-[#16314D] text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Print Official Invoice Receipt"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-400" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
