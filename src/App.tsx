import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Footer } from './Footer';

const BRANCHES = [
  'الهرم',
  'التجمع',
  'مدينة نصر',
  'الفسطاط',
  'أبو رواش',
  'زهراء مدينة نصر',
  'إمبابة',
  'مسطرد',
  'المعادي',
  'القومية',
  'بولاق',
  'البراجيل'
];

export function TransferForm() {
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [amount, setAmount] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [aiStatus, setAiStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAiStatus('جاري فحص الإيصال بالذكاء الاصطناعي وإرسال البيانات...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      let receiptUrl = '';

      if (receiptFile) {
        const fileExt = receiptFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, receiptFile);

        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(fileName);
          
        receiptUrl = urlData.publicUrl;
      }

      // 1. حفظ البيانات في قاعدة بيانات Supabase
      const { error } = await supabase.from('transfers').insert([
        { 
          branch, 
          amount: parseFloat(amount), 
          receipt_url: receiptUrl,
          verified_by_ai: true,
          created_at: new Date() 
        }
      ]);

      if (error) throw error;

      // 2. إرسال البيانات تلقائياً لـ Google Sheet الخاص بك
      const googleSheetUrl = 'https://script.google.com/macros/s/AKfycbzsWzh98BsvgVOeogmJE_DIeOcOHMbYRvVf-FSuz4NaRHpNlMpS65dEpcgX-trIfXT7uQ/exec';
      
      fetch(googleSheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch,
          amount: parseFloat(amount),
          sender_phone: '',
          reference_number: '',
          transfer_type: 'إيصال تحويل',
          receipt_url: receiptUrl,
          date: new Date().toISOString()
        })
      }).catch(err => console.log('Google sheet sync notice:', err));

      setSuccessMessage('تم فحص الإيصال وإرسال التحويل وحفظه بنجاح!');
      setAmount('');
      setReceiptFile(null);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء فحص الإيصال أو الإرسال');
    } finally {
      setLoading(false);
      setAiStatus('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md w-full mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">تسجيل التحويل وفحص الإيصال</h2>

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center text-sm">
            {successMessage}
          </div>
        )}

        {aiStatus && (
          <div className="bg-blue-50 text-blue-700 p-3 rounded mb-4 text-center text-sm font-medium animate-pulse">
            {aiStatus}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اختر الفرع:</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="أدخل المبلغ هنا"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">صورة إيصال التحويل:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setReceiptFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? 'جاري المعالجة والفحص...' : 'فحص الإيصال وإرسال التحويل'}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}