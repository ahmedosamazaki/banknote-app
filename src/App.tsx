import React, { useState } from 'react';
import { TransferForm } from './components/TransferForm';
import { AdminDashboard } from './components/AdminDashboard';
import { MyTransfers } from './components/MyTransfers';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ShieldCheck, UserCheck } from 'lucide-react';

export function App() {
  const [userRole, setUserRole] = useState<'select' | 'delegate' | 'admin'>('select');
  const [delegateName, setDelegateName] = useState('');
  const [currentTab, setCurrentTab] = useState<'send' | 'list'>('send');

  // صفحة اختيار نوع الدخول (مندوب أم إدارة)
  if (userRole === 'select') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-between text-white p-4">
        <Header />
        <div className="max-w-md mx-auto my-auto bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white">نظام تحويلات بنكنوت</h1>
            <p className="text-xs text-slate-400">اختر طريقة الدخول للمتابعة</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                const name = prompt('أدخل اسم المندوب الكريم:');
                if (name && name.trim()) {
                  setDelegateName(name.trim());
                  setUserRole('delegate');
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <UserCheck className="w-5 h-5" /> دخول كمندوب فرع
            </button>

            <button
              onClick={() => setUserRole('admin')}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3.5 px-4 rounded-2xl text-sm transition flex items-center justify-center gap-2 border border-slate-600"
            >
              <ShieldCheck className="w-5 h-5 text-blue-400" /> دخول لوحة تحكم الإدارة
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // إذا تم اختيار لوحة تحكم الإدارة
  if (userRole === 'admin') {
    return <AdminDashboard onBack={() => setUserRole('select')} />;
  }

  // واجهة المندوب (إرسال التحويلات ومتابعتها)
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between text-white">
      <Header />
      
      <main className="max-w-4xl mx-auto w-full p-4 md:p-6 flex-1 space-y-6">
        <div className="flex justify-between items-center bg-slate-800/80 border border-slate-700/60 p-4 rounded-2xl shadow-lg">
          <div>
            <span className="text-xs text-slate-400">مرحباً بك،</span>
            <h3 className="text-sm font-bold text-white">{delegateName}</h3>
          </div>
          <button
            onClick={() => setUserRole('select')}
            className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl transition"
          >
            تغيير المستخدم
          </button>
        </div>

        {/* أزرار التنقل بين إرسال تحويل أو تحويلاتي */}
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentTab('send')}
            className={`flex-1 py-3 rounded-2xl text-xs font-bold transition border ${
              currentTab === 'send'
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            إرسال تحويل جديد
          </button>
          <button
            onClick={() => setCurrentTab('list')}
            className={`flex-1 py-3 rounded-2xl text-xs font-bold transition border ${
              currentTab === 'list'
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            تحويلاتي السابقة
          </button>
        </div>

        {currentTab === 'send' ? (
          <TransferForm delegateName={delegateName} />
        ) : (
          <MyTransfers delegateName={delegateName} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;