import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Download, 
  ArrowUpRight, 
  Zap, 
  ShieldCheck, 
  Calendar,
  X,
  Check
} from 'lucide-react';
import { HOSTING_PLANS } from '../../data/plans';
import { User, InvoiceItem } from '../../types';

interface BillingViewProps {
  user: User;
  onSelectPlan: (planId: string) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({ user, onSelectPlan }) => {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    {
      id: 'inv_01',
      invoiceNumber: 'ASTRA-2026-0891',
      amountUzs: 49000,
      status: 'PAID',
      planName: 'Astra Pro Hosting (1 Oy)',
      createdAt: '2026-09-01T10:00:00Z',
    },
    {
      id: 'inv_02',
      invoiceNumber: 'ASTRA-2026-0742',
      amountUzs: 49000,
      status: 'PAID',
      planName: 'Astra Pro Hosting (1 Oy)',
      createdAt: '2026-08-01T10:00:00Z',
    },
  ]);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'payme' | 'click' | 'uzcard'>('payme');
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaySuccess(true);
      const newInv: InvoiceItem = {
        id: `inv_${Date.now()}`,
        invoiceNumber: `ASTRA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        amountUzs: 49000,
        status: 'PAID',
        planName: 'Astra Pro Hosting (1 Oy)',
        createdAt: new Date().toISOString(),
      };
      setInvoices([newInv, ...invoices]);
      setTimeout(() => {
        setPaySuccess(false);
        setIsPaymentModalOpen(false);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">To'lov va Obuna Boshqaruvi</h2>
        <p className="text-xs text-slate-400 mt-1">
          Payme, Click va Uzcard orqali to'lovlar, hisob-fakturalar va tarif rejalari
        </p>
      </div>

      {/* Active Plan Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-[#090e1a] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-white">Joriy Tarifingiz:</span>
            <span className="text-xl font-black text-cyan-400 font-mono">ASTRA PRO</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold uppercase font-mono">
              Faol
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Har oy 49,000 UZS • Keyingi avtomatik to'lov sanasi: <strong className="text-white">2026-10-12</strong>
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400 mt-3 font-mono">
            <span>Disk: 10 GB NVMe</span>
            <span>•</span>
            <span>Saytlar: 5 ta</span>
            <span>•</span>
            <span>Git CI/CD: Faol</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            Hisobni To'ldirish
          </button>
        </div>
      </div>

      {/* Available Plans Switcher */}
      <div className="rounded-2xl bg-[#090e1a] border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Tarifni Yangilash (Upgrade / Downgrade)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOSTING_PLANS.map((p) => (
            <div
              key={p.id}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                p.id === 'pro'
                  ? 'bg-cyan-950/20 border-cyan-500/40 shadow-md'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white text-sm">{p.name}</span>
                  <span className="text-cyan-400 font-mono font-bold text-xs">
                    {p.priceUzs.toLocaleString()} UZS/oy
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">{p.tagline}</p>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>• {p.storageGb} GB NVMe Disk</div>
                  <div>• {p.websitesLimit} ta Vebsayt</div>
                  <div>• {p.databasesLimit} ta SQL Baza</div>
                </div>
              </div>

              <button
                onClick={() => onSelectPlan(p.id)}
                className={`mt-4 w-full py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  p.id === 'pro'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                {p.id === 'pro' ? 'Joriy Tarif' : 'Tanlash'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      <div className="rounded-2xl bg-[#090e1a] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">To'lovlar Tarixi va Hisob-fakturalar</h3>
            <p className="text-[11px] text-slate-400">Barcha to'lov kvitansiyalarini yuklab olishingiz mumkin</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="pb-3 font-semibold">Invoys Raqami</th>
                <th className="pb-3 font-semibold">Xizmat Nomi</th>
                <th className="pb-3 font-semibold">Summa</th>
                <th className="pb-3 font-semibold">Sana</th>
                <th className="pb-3 font-semibold">Holat</th>
                <th className="pb-3 text-right">Kvitansiya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-900/40">
                  <td className="py-3 text-white font-bold">{inv.invoiceNumber}</td>
                  <td className="py-3 text-slate-300 font-sans">{inv.planName}</td>
                  <td className="py-3 text-cyan-300 font-bold">{inv.amountUzs.toLocaleString()} UZS</td>
                  <td className="py-3 text-slate-400">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => alert(`Invoys ${inv.invoiceNumber} PDF shaklida yuklandi.`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                      title="PDF kvitansiya"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0b101e] border border-slate-700/80 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-xs">
            <button
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Hisobni To'ldirish</h3>
            <p className="text-slate-400 mb-5">
              O'zbekiston milliy to'lov tizimlari orqali xavfsiz to'lov
            </p>

            <div className="space-y-3 mb-6">
              {[
                { id: 'payme', name: 'Payme', desc: 'Tezkor to\'lov va keshbek' },
                { id: 'click', name: 'Click Up', desc: 'USSD yoki Click dasturi' },
                { id: 'uzcard', name: 'Uzcard / Humo', desc: 'To\'g\'ridan-to\'g\'ri bank kartasi' },
              ].map((prov) => (
                <button
                  key={prov.id}
                  onClick={() => setSelectedProvider(prov.id as any)}
                  className={`w-full p-3.5 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                    selectedProvider === prov.id
                      ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div>
                    <span className="font-bold text-sm block text-white">{prov.name}</span>
                    <span className="text-[11px] text-slate-400">{prov.desc}</span>
                  </div>
                  {selectedProvider === prov.id && (
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 mb-6 flex justify-between items-center">
              <span className="text-slate-400">To'lov summasi:</span>
              <span className="text-base font-black text-cyan-400 font-mono">49,000 UZS</span>
            </div>

            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {paySuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>To'lov Muvaffaqiyatli!</span>
                </>
              ) : paying ? (
                <span>To'lov o'tkazilmoqda...</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>To'lovni Amalga Oshirish</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
