import { useState, useEffect } from 'react';
import { PlusCircle, History, LayoutDashboard, Lock, X, AlertCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TransferForm from '@/components/TransferForm';
import AdminDashboard from '@/components/AdminDashboard';
import MyTransfers from '@/components/MyTransfers';

const ADMIN_PASSWORD = 'Banknotepay@2021';
const ADMIN_PATH = '/admin';

function getPath() {
  return window.location.pathname;
}

// ─── Rep view (two tabs only, admin never visible) ──────────────────────────

type RepTab = 'form' | 'my-transfers';

function RepView() {
  const [tab, setTab] = useState<RepTab>('form');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col" dir="rtl">
      <Header />
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-[60px] z-40">
        <div className="max-w-2xl mx-auto px-4 flex">
          <TabButton
            active={tab === 'form'}
            onClick={() => setTab('form')}
            icon={<PlusCircle className="w-4 h-4" />}
            label="إرسال تحويل"
          />
          <TabButton
            active={tab === 'my-transfers'}
            onClick={() => setTab('my-transfers')}
            icon={<History className="w-4 h-4" />}
            label="تحويلاتي"
          />
        </div>
      </nav>
      <main className="flex-1 max-w-2xl mx-auto w-full">
        {tab === 'form' && <TransferForm />}
        {tab === 'my-transfers' && <MyTransfers />}
      </main>
      <Footer />
    </div>
  );
}

// ─── Admin view (password-gated, only reachable via /admin) ─────────────────

function AdminView() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      setUnlocked(true);
      setInput('');
      setHasError(false);
    } else {
      setHasError(true);
      setInput('');
    }
  };

  const goBack = () => {
    history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (unlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col" dir="rtl">
        <Header />
        <nav className="bg-slate-900 border-b border-slate-800 sticky top-[60px] z-40">
          <div className="max-w-2xl mx-auto px-4 flex items-center justify-between py-2.5 pr-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm font-semibold">لوحة الإدارة</span>
            </div>
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              خروج
            </button>
          </div>
        </nav>
        <main className="flex-1 max-w-2xl mx-auto w-full">
          <AdminDashboard />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6" dir="rtl">
      <div className="w-full max-w-sm">
        {/* Back link */}
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للتطبيق
        </button>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <h2 className="text-white font-bold text-xl text-center mb-1">لوحة الإدارة</h2>
          <p className="text-slate-400 text-sm text-center mb-6">
            هذه المنطقة مخصصة للمسؤولين فقط
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setHasError(false);
              }}
              placeholder="أدخل كلمة المرور"
              autoFocus
              className={`w-full bg-slate-800 border ${
                hasError
                  ? 'border-red-500/70 focus:border-red-500'
                  : 'border-slate-700 focus:border-emerald-500'
              } text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors text-center tracking-widest`}
            />
            {hasError && (
              <div className="flex items-center justify-center gap-1.5 text-red-400 text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                كلمة المرور غير صحيحة، حاول مجدداً
              </div>
            )}
            <button
              type="submit"
              disabled={!input}
              className="w-full bg-gradient-to-l from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/20"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Root router ─────────────────────────────────────────────────────────────

export default function App() {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const onPop = () => setPath(getPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (path === ADMIN_PATH || path.startsWith(ADMIN_PATH + '/')) {
    return <AdminView />;
  }
  return <RepView />;
}

// ─── Shared tab button ───────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
        active
          ? 'border-emerald-500 text-emerald-400'
          : 'border-transparent text-slate-400 hover:text-slate-300'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
