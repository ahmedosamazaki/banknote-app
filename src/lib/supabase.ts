import { createClient } from '@supabase/supabase-js'

// استخدام قيم افتراضية مؤقتة لمنع أي خطأ في التحميل
const supabaseUrl = 'https://placeholder.supabase.co'
const supabaseAnonKey = 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)