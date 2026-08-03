import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './TransferStyle.css';

export default function TransferForm() {
  // بيانات المندوب والفرع
  const [repName, setRepName] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [method, setMethod] = useState<string>('instapay'); // instapay أو vodafone
  
  // States الخاصة برفع الإيصال والذكاء الاصطناعي
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [aiVerified, setAiVerified] = useState<boolean | null>(null); // true: سليم, false: مزيف/مشكوك فيه
  const [aiMessage, setAiMessage] = useState<string>('');

  // حقول الفورم التي يتم تعبئتها أوتوماتيك أو يدوياً
  const [transactionId, setTransactionId] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

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

  useEffect(() => {
    // جلب اسم المندوب تلقائياً من السيشن
    const storedRep = localStorage.getItem('repName') || 'أحمد (مندوب معتمد)';
    setRepName(storedRep);
  }, []);

  // محاكاة رفع الإيصال وفحصه بالذكاء الاصطناعي واستخراج البيانات
  const handleReceiptUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setReceiptFile(file);
    setIsScanning(true);
    setAiVerified(null);
    setAiMessage('جاري فحص الإيصال بالذكاء الاصطناعي والتحقق من صحته...');

    // محاكاة عملية الذكاء الاصطناعي (AI Anti-Fraud & OCR)
    setTimeout(() => {
      setIsScanning(false);
      setAiVerified(true);
      setAiMessage('تم فحص الإيصال بنجاح: الإيصال أصلي وتم استخراج البيانات أوتوماتيك! ✅');
      
      // سحب البيانات أوتوماتيك في الفورم
      setTransactionId('TRX-' + Math.floor(100000 + Math.random() * 900000));
      setMobileNumber('01012345678');
      setAmount('1500');
    }, 2500);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (aiVerified === false) {
      alert("عذراً، لا يمكن إرسال التحويل لأن الذكاء الاصطناعي أثبت أن الإيصال غير مطابق أو مزيف!");
      return;
    }

    const transferData = {
      repName,
      branch,
      method,
      transactionId,
      mobileNumber,
      amount,
      notes,
      date: new Date().toISOString()
    };
    
    console.log("تم إرسال التحويل بنجاح وتوثيقه:", transferData);
    alert("تم اعتماد وإرسال التحويل بنجاح يا فنان!");
  };

  return (
    <div className="previous-transfers-theme-container">
      {/* الهيدر مع اللوجو ورسالة الترحيب */}
      <header className="app-header">
        <div className="logo-container">
          <img 
            src="/logo.png" 
            alt="لوجو شركة بنكنوت" 
            className="company-logo" 
          />
        </div>
        <div className="welcome-banner">
          <h2>أهلاً بيك يا، {repName} 👋</h2>
          <p>جاهز لتسجيل وتوثيق التحويل الجديد بكل سلاسة</p>
        </div>
      </header>

      {/* نموذج إرسال تحويل جديد */}
      <div className="form-card-container">
        <h3 className="section-title">إرسال تحويل جديد</h3>

        {/* 1. رفع صورة الإيصال في البداية خالص */}
        <div className="receipt-upload-section">
          <label className="upload-label-box">
            <span className="upload-icon">📄</span>
            <span className="upload-text">
              {receiptFile ? `تم رفع: ${receiptFile.name}` : 'اضغط هنا لرفع صورة الإيصال (أول خطوة)'}
            </span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleReceiptUpload} 
              style={{ display: 'none' }} 
            />
          </label>

          {/* مؤشر الفحص والذكاء الاصطناعي */}
          {isScanning && (
            <div className="ai-scanning-box">
              <div className="spinner"></div>
              <p>{aiMessage}</p>
            </div>
          )}

          {aiVerified !== null && !isScanning && (
            <div className={`ai-result-box ${aiVerified ? 'success' : 'error'}`}>
              <p>{aiMessage}</p>
            </div>
          )}
        </div>

        {/* اختيار طريقة الدفع (تقسيمة انستاباي وفودافون كاش) */}
        <div className="payment-method-selector">
          <button 
            type="button" 
            className={`method-btn ${method === 'instapay' ? 'active-instapay' : ''}`}
            onClick={() => setMethod('instapay')}
          >
            InstaPay
          </button>
          <button 
            type="button" 
            className={`method-btn ${method === 'vodafone' ? 'active-vodafone' : ''}`}
            onClick={() => setMethod('vodafone')}
          >
            Vodafone Cash
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transfer-form">
          {/* اختيار الفرع من الفروع الحقيقية */}
          <div className="form-group">
            <label>اختر الفرع</label>
            <select 
              value={branch} 
              onChange={(e) => setBranch(e.target.value)} 
              required
            >
              <option value="">-- اختر الفرع التابع له --</option>
              {branchesList.map((bName, index) => (
                <option key={index} value={bName}>{bName}</option>
              ))}
            </select>
          </div>

          {/* اسم المندوب (تلقائي من السيشن) */}
          <div className="form-group">
            <label>اسم المندوب (تلقائي من السيشن)</label>
            <input 
              type="text" 
              value={repName} 
              readOnly 
              className="readonly-input"
            />
          </div>

          {/* رقم العملية */}
          <div className="form-group">
            <label>رقم العملية / مرجع التحويل</label>
            <input 
              type="text" 
              placeholder="يتم السحب أوتوماتيك من الإيصال أو التعديل..." 
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
            />
          </div>

          {/* رقم الموبايل */}
          <div className="form-group">
            <label>رقم الموبايل</label>
            <input 
              type="tel" 
              placeholder="01xxxxxxxxx" 
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>

          {/* المبلغ */}
          <div className="form-group">
            <label>المبلغ (جنيه)</label>
            <input 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* بيانات إضافية أو تعديل يدوي */}
          <div className="form-group">
            <label>بيانات إضافية أو تعديل لأي بيانات لم تتسحب أوتوماتيك</label>
            <textarea 
              placeholder="أدخل أي ملاحظات..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-transfer-btn">
            إرسال وتوثيق التحويل
          </button>
        </form>
      </div>
    </div>
  );
}