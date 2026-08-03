import React, { useState } from 'react';
import { TransferForm } from './components/TransferForm';
import { MyTransfers } from './components/MyTransfers';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export function App() {
  const [currentView, setCurrentView] = useState<'form' | 'history' | 'admin'>('form');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans">
      <Header onNavigate={setCurrentView} currentView={currentView} />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6">
        {currentView === 'form' && <TransferForm />}
        {currentView === 'history' && <MyTransfers />}
        {currentView === 'admin' && <AdminDashboard onBack={() => setCurrentView('form')} />}
      </main>

      <Footer />
    </div>
  );
}

export default App;