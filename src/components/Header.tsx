import { Banknote, Shield } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-l from-slate-900 to-slate-800 shadow-xl sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <Banknote className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight leading-tight">
              Banknotepay
            </h1>
            <p className="text-emerald-400 text-xs font-medium tracking-wider">
              نظام تتبع التحويلات
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 text-xs font-medium">آمن</span>
        </div>
      </div>
    </header>
  );
}
