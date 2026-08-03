import { useState, useRef } from 'react';
import {
  User,
  Building2,
  DollarSign,
  Phone,
  Hash,
  FileText,
  Camera,
  Images,
  Scan,
  CheckCircle,
  Loader2,
  X,
  ChevronDown,
  AlertCircle,
  Send,
  CreditCard,
  Smartphone,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { simulateOcrExtraction } from '@/lib/ocr';

interface FormData {
  representative_name: string;
  branch_name: string;
  transfer_amount: string;
  sender_phone: string;
  reference_number: string;
  transfer_type: 'instapay' | 'vodafone_cash';
  bank_name: string;
  transfer_date: string;
  notes: string;
}

const INITIAL_FORM: FormData = {
  representative_name: '',
  branch_name: '',
  transfer_amount: '',
  sender_phone: '',
  reference_number: '',
  transfer_type: 'instapay',
  bank_name: '',
  transfer_date: '',
  notes: '',
};

const BRANCHES = [
  'فرع القاهرة',
  'فرع الجيزة',
  'فرع الإسكندرية',
  'فرع المنصورة',
  'فرع طنطا',
  'فرع أسيوط',
  'فرع الأقصر',
  'فرع أسوان',
  'فرع بورسعيد',
  'فرع السويس',
  'فرع الإسماعيلية',
  'المركز الرئيسي',
];

export default function TransferForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrDone, setOcrDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFile(file);
    setOcrDone(false);

    const url = URL.createObjectURL(file);
    setReceiptPreview(url);

    // Auto-trigger OCR
    setOcrLoading(true);
    try {
      const result = await simulateOcrExtraction(file);
      if (result.amount) set('transfer_amount', result.amount);
      if (result.referenceNumber) set('reference_number', result.referenceNumber);
      if (result.bankName) set('bank_name', result.bankName);
      if (result.date) set('transfer_date', result.date);
      if (result.transferType) set('transfer_type', result.transferType);
      setOcrDone(true);
    } catch {
      // OCR failed silently, user fills manually
    } finally {
      setOcrLoading(false);
    }
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setOcrDone(false);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.representative_name.trim())
      newErrors.representative_name = 'الاسم مطلوب';
    if (!form.branch_name.trim()) newErrors.branch_name = 'الفرع مطلوب';
    if (!form.transfer_amount || isNaN(Number(form.transfer_amount)) || Number(form.transfer_amount) <= 0)
      newErrors.transfer_amount = 'أدخل مبلغاً صحيحاً';
    if (!form.sender_phone.trim() || form.sender_phone.replace(/\D/g, '').length < 10)
      newErrors.sender_phone = 'رقم الهاتف غير صحيح';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setSubmitting(true);

    try {
      let receiptImageUrl: string | null = null;

      if (receiptFile) {
        const ext = receiptFile.name.split('.').pop();
        const fileName = `receipts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, receiptFile, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(fileName);
        receiptImageUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from('transfers').insert({
        representative_name: form.representative_name.trim(),
        branch_name: form.branch_name.trim(),
        transfer_amount: Number(form.transfer_amount),
        sender_phone: form.sender_phone.trim(),
        reference_number: form.reference_number.trim() || null,
        transfer_type: form.transfer_type,
        bank_name: form.bank_name.trim() || null,
        transfer_date: form.transfer_date.trim() || null,
        notes: form.notes.trim() || null,
        receipt_image_url: receiptImageUrl,
      });

      if (insertError) throw insertError;

      // Mirror to Google Sheets (fire-and-forget; data is safe in Supabase regardless)
      const { data: inserted } = await supabase
        .from('transfers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (inserted) {
        fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-to-sheets`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify(inserted),
          }
        ).catch(() => {
          // Silently ignore — Supabase is the source of truth
        });
      }

      setSubmitted(true);
      setForm(INITIAL_FORM);
      setReceiptFile(null);
      setReceiptPreview(null);
      setOcrDone(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء الإرسال';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">تم الإرسال بنجاح!</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          تم تسجيل التحويل وسيتم مراجعته من قِبل الإدارة.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25"
        >
          تسجيل تحويل جديد
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4" noValidate>
      {/* Transfer Type Toggle */}
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          نوع التحويل
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => set('transfer_type', 'instapay')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all duration-200 ${
              form.transfer_type === 'instapay'
                ? 'border-blue-500 bg-blue-500/15 text-blue-400'
                : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            InstaPay
          </button>
          <button
            type="button"
            onClick={() => set('transfer_type', 'vodafone_cash')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all duration-200 ${
              form.transfer_type === 'vodafone_cash'
                ? 'border-red-500 bg-red-500/15 text-red-400'
                : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            فودافون كاش
          </button>
        </div>
      </div>

      {/* Receipt Upload & OCR */}
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          إيصال التحويل{' '}
          <span className="text-slate-500 font-normal">(اختياري - للمسح الضوئي)</span>
        </label>
        {!receiptPreview ? (
          <div className="grid grid-cols-2 gap-3">
            {/* Camera button */}
            <label
              htmlFor="receipt-camera"
              className="flex flex-col items-center justify-center gap-2.5 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-800/30 hover:bg-emerald-500/5 rounded-xl py-5 px-3 cursor-pointer transition-all duration-200 group"
            >
              <div className="w-11 h-11 bg-slate-700/50 group-hover:bg-emerald-500/10 rounded-full flex items-center justify-center transition-colors duration-200">
                <Camera className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors duration-200" />
              </div>
              <div className="text-center">
                <p className="text-slate-300 font-medium text-xs">تصوير الإيصال</p>
                <p className="text-slate-500 text-xs mt-0.5">فتح الكاميرا</p>
              </div>
              <input
                id="receipt-camera"
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {/* Gallery button */}
            <label
              htmlFor="receipt-gallery"
              className="flex flex-col items-center justify-center gap-2.5 border-2 border-dashed border-slate-700 hover:border-blue-500/50 bg-slate-800/30 hover:bg-blue-500/5 rounded-xl py-5 px-3 cursor-pointer transition-all duration-200 group"
            >
              <div className="w-11 h-11 bg-slate-700/50 group-hover:bg-blue-500/10 rounded-full flex items-center justify-center transition-colors duration-200">
                <Images className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors duration-200" />
              </div>
              <div className="text-center">
                <p className="text-slate-300 font-medium text-xs">اختيار من المعرض</p>
                <p className="text-slate-500 text-xs mt-0.5">الصور المحفوظة</p>
              </div>
              <input
                id="receipt-gallery"
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800/50">
            <img
              src={receiptPreview}
              alt="إيصال التحويل"
              className="w-full max-h-48 object-cover"
            />
            <button
              type="button"
              onClick={removeReceipt}
              className="absolute top-2 left-2 w-7 h-7 bg-slate-900/80 hover:bg-red-500/80 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            {ocrLoading && (
              <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center gap-2">
                <div className="relative">
                  <Scan className="w-8 h-8 text-emerald-400 animate-pulse" />
                  <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-sm animate-scan-line" />
                </div>
                <p className="text-emerald-400 text-sm font-medium">جاري استخراج البيانات...</p>
              </div>
            )}
            {ocrDone && !ocrLoading && (
              <div className="absolute bottom-0 inset-x-0 bg-emerald-500/90 px-3 py-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                <span className="text-white text-xs font-medium">تم استخراج البيانات بنجاح</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Representative Name */}
      <FormField
        label="اسم المندوب"
        icon={<User className="w-4 h-4" />}
        error={errors.representative_name}
      >
        <input
          type="text"
          value={form.representative_name}
          onChange={(e) => set('representative_name', e.target.value)}
          placeholder="أدخل اسم المندوب"
          className={inputClass(!!errors.representative_name)}
          autoComplete="name"
        />
      </FormField>

      {/* Branch Name */}
      <FormField
        label="اسم الفرع"
        icon={<Building2 className="w-4 h-4" />}
        error={errors.branch_name}
      >
        <div className="relative">
          <select
            value={form.branch_name}
            onChange={(e) => set('branch_name', e.target.value)}
            className={`${inputClass(!!errors.branch_name)} appearance-none`}
          >
            <option value="">اختر الفرع</option>
            {BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </FormField>

      {/* Transfer Amount */}
      <FormField
        label="المبلغ (جنيه)"
        icon={<DollarSign className="w-4 h-4" />}
        error={errors.transfer_amount}
      >
        <input
          type="number"
          inputMode="decimal"
          value={form.transfer_amount}
          onChange={(e) => set('transfer_amount', e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className={inputClass(!!errors.transfer_amount)}
        />
      </FormField>

      {/* Sender Phone */}
      <FormField
        label="رقم هاتف المرسل"
        icon={<Phone className="w-4 h-4" />}
        error={errors.sender_phone}
      >
        <input
          type="tel"
          inputMode="tel"
          value={form.sender_phone}
          onChange={(e) => set('sender_phone', e.target.value)}
          placeholder="01xxxxxxxxx"
          className={inputClass(!!errors.sender_phone)}
          autoComplete="tel"
          dir="ltr"
        />
      </FormField>

      {/* Reference Number */}
      <FormField
        label="رقم العملية / المرجع"
        icon={<Hash className="w-4 h-4" />}
      >
        <input
          type="text"
          inputMode="text"
          value={form.reference_number}
          onChange={(e) => set('reference_number', e.target.value)}
          placeholder="أدخل رقم المرجع"
          className={inputClass(false)}
          dir="ltr"
        />
      </FormField>

      {/* Bank Name */}
      <FormField label="اسم البنك / الجهة" icon={<CreditCard className="w-4 h-4" />}>
        <input
          type="text"
          value={form.bank_name}
          onChange={(e) => set('bank_name', e.target.value)}
          placeholder="مثال: بنك مصر، فودافون كاش"
          className={inputClass(false)}
        />
      </FormField>

      {/* Notes */}
      <FormField label="ملاحظات" icon={<FileText className="w-4 h-4" />}>
        <textarea
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="أي ملاحظات إضافية..."
          rows={3}
          className={`${inputClass(false)} resize-none`}
        />
      </FormField>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl p-3.5">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm leading-relaxed">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gradient-to-l from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:from-emerald-600 active:to-teal-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 transition-all duration-200 text-base"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            جاري الإرسال...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            إرسال التحويل
          </>
        )}
      </button>
    </form>
  );
}

function FormField({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-slate-300 text-sm font-medium mb-2">
        <span className="text-slate-400">{icon}</span>
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-red-400 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full bg-slate-800/60 border ${
    hasError ? 'border-red-500/60 focus:border-red-500' : 'border-slate-700 focus:border-emerald-500'
  } text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-200 focus:bg-slate-800`;
}
