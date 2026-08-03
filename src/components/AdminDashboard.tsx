import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Footer } from './Footer';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Trash2, 
  LogOut, 
  CheckCircle2, 
  FileText, 
  ChevronDown, 
  Building2, 
  DollarSign, 
  Calendar,
  Smartphone,
  QrCode,
  X,
  Printer,
  Download,
  Share2,
  RefreshCw,
  Info,
  Check
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

const ADMIN_PASSWORD = 'Banknotepay@2021';

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransfers();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('كلمة المرور غير صحيحة!');
    }
  };

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transfers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransfers(data || []);
    } catch (err) {
      console.error('Error fetching transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا السجل؟')) return;

    try {
      const { error } = await supabase
        .from('transfers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTransfers(transfers.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting transfer:', err);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrintQr = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>طباعة QR Code - بنكنوت</title>
            <style>
              body { font-family: Tahoma, sans-serif; text-align: center; padding: 40px; background: #fff; color: #000; }
              .container { border: 2px dashed #333; padding: 40px; border-radius: 20px; display: inline-block; max-width: 400px; }
              h1 { font-size: 24px; margin-bottom: 10px; color: #1e3a8a; }
              p { font-size: 14px; color: #555; margin-bottom: 20px; }
              img { width: 250px; height: 250px; margin: 20px 0; }
              .footer { font-size: 12px; margin-top: 20px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>شركة بنكنوت للتحويلات</h1>
              <p>امسح الكود باستخدام كاميرا الهاتف المحمول لتسجيل تحويلات الفروع فوراً</p>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin)}" />
              <div class="footer">نظام إدارة الفروع الذكي</div>
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const filteredTransfers = transfers.filter(item => {
    const matchesSearch = 
      (item.branch && item.branch.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.sender_phone && item.sender_phone.includes(searchTerm)) ||
      (item.reference_number && item.reference_number.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBranch = selectedBranch === 'all' || item.branch === selectedBranch;

    let matchesDate = true;
    if (selectedDate !== 'all' && item.created_at) {
      const itemDate = new Date(item.created_at).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      
      if (selectedDate === 'today') {
        matchesDate = itemDate === today;
      }
    }

    return matchesSearch && matchesBranch && matchesDate;
  });

  const totalAmount = filteredTransfers.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const uniqueBranches = Array.from(new Set(transfers.map(t => t.branch).filter(Boolean)));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 text-white">
        <div className="max-w-md mx-auto my-auto bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl w-full text-center space-y-6">
          <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-2xl mx-auto flex items-center justify-center border border-blue-500/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-wide">لوحة تحكم الإدارة</h2>
            <p className="text-xs text-slate-400">أدخل كلمة مرور الإدارة للمتابعة والمشاهدة</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="كلمة مرور الإدارة"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-blue-500 transition text-center"
              autoFocus
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-blue-600/30"
            >
              تسجيل الدخول
            </button>
          </form>

          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white transition"
          >
            ← العودة للرئيسية
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between text-white selection:bg-blue-500 selection:text-white">
      {/* نافذة الـ QR Code الشاملة للإدارة */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl max-w-md w-full text-center space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-400" /> QR Code وتوزيع المناديب
              </h3>
              <button 
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-slate-300">قم بتعليق هذا الكود في الفروع لتمكين المناديب من تسجيل التحويلات بكاميرا الهاتف مباشرة</p>
            
            <div className="bg-white p-5 rounded-2xl flex flex-col justify-center items-center shadow-inner space-y-3">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin)}`} 
                alt="App QR Code"
                className="mx-auto rounded-lg shadow-sm"
              />
              <span className="text-[10px] text-slate-500 font-mono break-all bg-slate-100 p-2 rounded-lg w-full">
                {window.location.origin}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrintQr}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" /> طباعة الإيصال
              </button>
              
              <button
                onClick={handleCopyLink}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-slate-600"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                {copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}
              </button>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-950 text-slate-400 hover:text-white py-2.5 rounded-xl text-xs font-medium transition border border-slate-700"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto w-full p-4 md:p-6 space-y-6 flex-1">
        {/* الهيدر العلوي للوحة */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800/80 backdrop-blur-md border border-slate-700/60 p-5 rounded-3xl shadow-xl">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-black tracking-wide text-white">إدارة تحويلات بنكنوت</h1>
            <p className="text-xs text-slate-400">متابعة كافة التحويلات الواردة من جميع الفروع لحظياً</p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowQrModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/20 border border-blue-500/30"
            >
              <QrCode className="w-4 h-4" /> عرض QR Code للفروع
            </button>
            <button
              onClick={fetchTransfers}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2.5 rounded-xl text-xs transition border border-slate-600/50"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onBack}
              className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 border border-slate-600/50"
            >
              <LogOut className="w-4 h-4 text-red-400" /> تسجيل خروج
            </button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-3xl flex items-center justify-between shadow-lg">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">إجمالي التحويلات المصفاة</span>
              <h3 className="text-2xl font-black text-white">{totalAmount.toLocaleString()} <span className="text-xs text-blue-400 font-normal">ج.م</span></h3>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center border border-blue-500/20">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-3xl flex items-center justify-between shadow-lg">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">عدد السجلات المعروضة</span>
              <h3 className="text-2xl font-black text-white">{filteredTransfers.length} <span className="text-xs text-emerald-400 font-normal">عملية</span></h3>
            </div>
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <FileText className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* أدوات البحث والفلترة */}
        <div className="bg-slate-800/80 border border-slate-700/60 p-4 rounded-3xl shadow-lg flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="البحث بالفرع، رقم الهاتف، أو المرجع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pr-10 pl-4 py-2.5 text-xs outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <FilterSelect
              value={selectedBranch}
              onChange={setSelectedBranch}
              options={[
                { value: 'all', label: 'جميع الفروع' },
                ...uniqueBranches.map(b => ({ value: b, label: b }))
              ]}
            />

            <FilterSelect
              value={selectedDate}
              onChange={setSelectedDate}
              options={[
                { value: 'all', label: 'كل الأوقات' },
                { value: 'today', label: 'اليوم فقط' }
              ]}
            />
          </div>
        </div>

        {/* جدول التحويلات */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-slate-400 text-sm">جاري جلب البيانات...</div>
          ) : filteredTransfers.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">لا توجد تحويلات مطابقة للبحث.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-700 text-slate-400">
                    <th className="p-4">الفرع</th>
                    <th className="p-4">المبلغ</th>
                    <th className="p-4">الهاتف / المرجع</th>
                    <th className="p-4">حالة الفحص</th>
                    <th className="p-4">الإيصال</th>
                    <th className="p-4">التاريخ</th>
                    <th className="p-4 text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredTransfers.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/30 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        {item.branch}
                      </td>
                      <td className="p-4 font-black text-emerald-400 text-sm">
                        {Number(item.amount).toLocaleString()} ج.م
                      </td>
                      <td className="p-4 text-slate-300 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-slate-400" />
                          <span>{item.sender_phone || 'غير مسجل'}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          مرجع: {item.reference_number || 'بدون'}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> تم التحقق AI
                        </span>
                      </td>
                      <td className="p-4">
                        {item.receipt_url ? (
                          <a
                            href={item.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-xl text-[11px] font-medium transition"
                          >
                            عرض الإيصال 🖼️
                          </a>
                        ) : (
                          <span className="text-slate-500 text-[11px]">بدون إيصال</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">
                        {item.created_at ? new Date(item.created_at).toLocaleString('ar-EG') : 'غير محدد'}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl flex items-center justify-center transition mx-auto"
                          title="حذف السجل"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative flex-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-3 py-2 text-xs outline-none pr-3 pl-7 focus:border-slate-600"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
    </div>
  );
}

export default AdminDashboard;