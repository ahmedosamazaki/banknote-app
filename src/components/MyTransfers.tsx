import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Image as ImageIcon, 
  X, 
  ChevronDown, 
  Calendar, 
  Hash, 
  Building2, 
  Banknote 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// تعريف الـ Interface للـ Transfer مباشرة هنا لتجنب أي مشاكل استيراد
export interface Transfer {
  id: string;
  created_at: string;
  sender_name: string;
  sender_phone: string;
  bank_name: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  receipt_url?: string;
  notes?: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد المراجعة',
  approved: 'مقبول',
  rejected: 'مرفوض',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

export function MyTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transfers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTransfers(data);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">سجل التحويلات</h2>
        <button 
          onClick={fetchTransfers}
          className="text-xs text-slate-400 hover:text-white bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 transition"
        >
          تحديث
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">جاري تحميل التحويلات...</div>
      ) : transfers.length === 0 ? (
        <div className="text-center py-10 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
          لا توجد تحويلات سابقة
        </div>
      ) : (
        <div className="space-y-3">
          {transfers.map((item) => (
            <div 
              key={item.id} 
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 transition hover:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  {item.bank_name}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[item.status] || 'bg-slate-800 text-slate-300'}`}>
                  {STATUS_LABELS[item.status] || item.status}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">{item.sender_name}</span>
                <span className="text-emerald-400 font-bold text-base">{item.amount} ج.م</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/60">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.created_at).toLocaleDateString('ar-EG')}
                </span>
                
                {item.receipt_url && (
                  <button 
                    onClick={() => setSelectedImage(item.receipt_url || null)}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    عرض الإيصال
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal عرض الإيصال */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-lg w-full bg-slate-900 rounded-2xl p-2 border border-slate-800">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 left-4 bg-slate-800 text-slate-300 p-1.5 rounded-full hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={selectedImage} 
              alt="إيصال التحويل" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl mt-8" 
            />
          </div>
        </div>
      )}
    </div>
  );
}