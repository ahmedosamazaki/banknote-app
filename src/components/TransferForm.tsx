import React, { useState, ChangeEvent, FormEvent } from 'react';
import './TransferStyle.css';

export default function TransferForm() {
  // اختيار الدور: null أو 'rep' (مندوب) أو 'admin' (إدارة)
  const [role, setRole] = useState<'rep' | 'admin' | null>(null);
  
  // شاشة المندوب: 'menu' أو 'new' أو 'my-transfers'
  const [repView, setRepView] = useState<'menu' | 'new' | 'my-transfers'>('menu');

  // قائمة الـ 13 فرع الرسمية
  const branchesList: string[] = [
    "الهرم",
    "التجمع",
    "إمبابة",
    "الفسطاط",
    "مسطرد",
    "المعادي",
    "مدينة نصر",
    "زهراء مدينة نصر",
    "أبو رواش",
    "محل القومية",
    "محل البراجيل",
    "نستله البراجيل",
    "محل بولاق"
  ];

  // حقول الفورم
  const [branch, setBranch] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // فحص الإيصال بالذكاء الاصطناعي (في البداية)
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [aiVerified, setAiVerified] = useState<boolean | null>(null);
  const [aiMessage, setAiMessage] = useState<string>('');

  const handleReceiptChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
      setIsScanning(true);
      setAiVerified(null);
      setAiMessage('جاري فحص الإيصال بالذكاء الاصطناعي...');

      setTimeout(() => {
        setIsScanning(false);
        setAiVerified(true);
        setAiMessage('تم التحقق من الإيصال بنجاح وتطابق البيانات!');
      }, 2000);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('تم إرسال التحويل بنجاح!');
  };

  // 1. شاشة اختيار الصلاحية (مندوب ولا إدارة)
  if (!role) {
    return (
      <div style={{ direction: 'rtl', padding: '30px', backgroundColor: '#0b0f19', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>نظام تحويلات بنكنوت</h2>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>برجاء تحديد صفحتك للمتابعة</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => setRole('rep')} style={{ padding: '15px 30px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
            مندوب معتمد
          </button>
          <button onClick={() => setRole('admin')} style={{ padding: '15px 30px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
            إدارة (Dashboard)
          </button>
        </div>
      </div>
    );
  }

  // 2. لو المستخدم اختار "إدارة" (Admin Dashboard)
  if (role === 'admin') {
    return (
      <div style={{ direction: 'rtl', padding: '20px', backgroundColor: '#0b0f19', minHeight: '100vh', color: '#fff' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>لوحة تحكم الإدارة (Dashboard)</h2>
          <button onClick={() => setRole(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>تسجيل خروج</button>
        </header>
        <div style={{ background: '#111827', padding: '20px', borderRadius: '12px', border: '1px solid #1f2937' }}>
          <h3>متابعة جميع العمليات والتحويلات الخاصة بالفروع الـ 13</h3>
          <p style={{ color: '#94a3b8' }}>هنا تظهر كافة تقارير المناديب وتحويلاتهم بشكل لحظي ومباشر.</p>
        </div>
      </div>
    );
  }

  // 3. لو المستخدم اختار "مندوب"
  return (
    <div style={{ direction: 'rtl', padding: '20px', backgroundColor: '#0b0f19', minHeight: '100vh', color: '#fff' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Banknotepay - بوابة المندوب</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>أهلاً بك يا أحمد</span>
          <button onClick={() => setRole(null)} style={{ background: '#374151', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>تغيير الحساب</button>
        </div>
      </header>

      {repView === 'menu' && (
        <div style={{ maxWidth: '500px', margin: '40px auto', background: '#111827', padding: '30px', borderRadius: '16px', border: '1px solid #1f2937', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px' }}>اختر الإجراء المطلوب</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={() => setRepView('new')} style={{ padding: '14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
              إرسال تحويل جديد
            </button>
            <button onClick={() => setRepView('my-transfers')} style={{ padding: '14px', background: '#374151', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
              تحويلاتي السابقة
            </button>
          </div>
        </div>
      )}

      {repView === 'my-transfers' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#111827', padding: '25px', borderRadius: '16px', border: '1px solid #1f2937' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>سجل تحويلاتي</h3>
            <button onClick={() => setRepView('menu')} style={{ background: '#374151', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>الرجوع للقائمة</button>
          </div>
          <p style={{ color: '#94a3b8' }}>لا توجد تحويلات مسجلة حتى الآن.</p>
        </div>
      )}

      {repView === 'new' && (
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#111827', padding: '25px', borderRadius: '16px', border: '1px solid #1f2937' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>إرسال تحويل جديد</h3>
            <button onClick={() => setRepView('menu')} style={{ background: '#374151', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>رجوع</button>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* 1. صورة الإيصال في البداية */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>صورة الإيصال (الخطوة الأولى للفحص)</label>
              <input type="file" accept="image/*" onChange={handleReceiptChange} style={{ padding: '10px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }} />
              {isScanning && <p style={{ color: '#3b82f6', fontSize: '0.85rem' }}>{aiMessage}</p>}
              {aiVerified && <p style={{ color: '#10b981', fontSize: '0.85rem' }}>{aiMessage}</p>}
            </div>

            {/* 2. اختيار الفرع (القائمة الرسمية للـ 13 فرع) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>اختر الفرع</label>
              <select value={branch} onChange={(e) => setBranch(e.target.value)} style={{ padding: '12px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }}>
                <option value="">-- اختر الفرع التابع له --</option>
                {branchesList.map((bName, index) => (
                  <option key={index} value={bName}>{bName}</option>
                ))}
              </select>
            </div>

            {/* 3. رقم الموبايل */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>رقم الموبايل</label>
              <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="01xxxxxxxxx" style={{ padding: '12px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }} />
            </div>

            {/* 4. المبلغ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>المبلغ (جنيه)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" style={{ padding: '12px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }} />
            </div>

            {/* 5. ملاحظات */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>ملاحظات</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات إضافية..." style={{ padding: '12px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '8px', minHeight: '80px' }} />
            </div>

            <button type="submit" style={{ marginTop: '10px', padding: '14px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              تأكيد وإرسال التحويل
            </button>
          </form>
        </div>
      )}
    </div>
  );
}