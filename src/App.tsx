import React, { useState } from 'react';
import Header from './components/Header';
import TransferForm from './components/TransferForm';
import { Footer } from './components/Footer';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'send' | 'history'>('send');

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 flex flex-col justify-between max-w-md mx-auto">
      <div className="w-full">
        <Header />
        <main className="mt-4">
          <TransferForm />
        </main>
      </div>
      <Footer />
    </div>
  );
}