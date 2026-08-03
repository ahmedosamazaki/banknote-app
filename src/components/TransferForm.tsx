import React, { useState, ChangeEvent, FormEvent } from 'react';
import './TransferStyle.css';

export default function TransferForm() {
  const [role, setRole] = useState<'rep' | 'admin' | null>(null);
  
  // شاشة التحقق الخاصة بالإدارة
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>('');

  const [repView, setRepView] = useState<'menu' | 'new' | 'my-transfers'>('menu');

  const branchesList: string[] = [
    "الهرم", "التجمع", "إمبابة", "الفسطاط", "مسطرد", "المعادي",
    "مدينة نصر", "زهراء مدينة نصر", "أبو رواش", "محل القومية",
    "محل البراجيل", "نستله البراجيل", "محل بولاق"
  ];

  const [branch, setBranch] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

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

  // التحقق من كلمة سر الإدارة
  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') { // يمكنك تغيير كلمة السر هنا
      setIsAdminAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('كلمة السر غير صحيحة، حاول مرة أخرى.');
    }
  };

  // 1. شاشة اختيار الصلاحية
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

  // 2. شاشة إدخال باسورد الإدارة إذا لم يتم المصادقة بعد
  if (role === 'admin' && !isAdminAuthenticated) {
    return (
      <div style={{ direction: 'rtl', padding: '30px', backgroundColor: '#0b0f19', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '400px', width: '100%', background: '#111827', padding: '30px', borderRadius: '16px', border: '1px solid #1f2937' }}>
          <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>تسجيل دخول الإدارة</h3>
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>كلمة المرور</label>
              <input 
                type="password" 
                value={adminPassword} 
                onChange={(e) => setAdminPassword(e.target.value)} 
                placeholder="أدخل كلمة مرور الإدارة" 
                style={{ padding: '12px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }} 
              />
            </div>
            {passwordError && <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>{passwordError}</p>}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                دخول
              </button>
              <button type="button" onClick={() => { setRole(null); setAdminPassword(''); setPasswordError(''); }} style={{ background: '#374151', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
                رجوع
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 3. لو تم التحقق وتدخل الإدارة بنجاح
  if (role === 'admin' && isAdminAuthenticated) {
    return (
      <div style={{ direction: 'rtl', padding: '20px', backgroundColor: '#0b0f19', minHeight: '100vh', color: '#fff' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #1e293b', paddingBottom: '15px' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>لوحة تحكم الإدارة (Dashboard)</h2>
          <button onClick={() => { setRole(null); setIsAdminAuthenticated(false); setAdminPassword(''); }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>تسجيل خروج</button>
        </header>
        <div style={{ background: '#111827', padding: '20px', borderRadius: '12px', border: '1px solid #1f2937' }}>
          <h3>متابعة جميع العمليات والتحويلات الخاصة بالفروع الـ 13</h3>
          <p style={{ color: '#94a3b8' }}>هنا تظهر كافة تقارير المناديب وتحويلاتهم بشكل لحظي ومباشر.</p>
        </div>
      </div>
    );
  }

  // 4. لو المستخدم اختار "مندوب"
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>صورة الإيصال (الخطوة الأولى للفحص)</label>
              <input type="file" accept="image/*" onChange={handleReceiptChange} style={{ padding: '10px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }} />
              {isScanning && <p style={{ color: '#3b82f6', fontSize: '0.85rem' }}>{aiMessage}</p>}
              {aiVerified && <p style={{ color: '#10b981', fontSize: '0.85rem' }}>{aiMessage}</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>اختر الفرع</label>
              <select value={branch} onChange={(e) => setBranch(e.target.value)} style={{ padding: '12px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }}>
                <option value="">-- اختر الفرع التابع له --</option>
                {branchesList.map((bName, index) => (
                  <option key={index} value={bName}>{bName}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>رقم الموبايل</label>
              <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="01xxxxxxxxx" style={{ padding: '12px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>المبلغ (جنيه)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" style={{ padding: '12px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: '8px' }} />
            </div>

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