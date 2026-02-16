import type { QuestionType } from '~/stores/questionnaire'
import {
  FileText,
  CircleDot,
  ListChecks,
  ListOrdered,
  ListFilter,
  Activity,
  Star,
  LayoutPanelLeft,
  Table,
  Upload,
  MapPin,
  ArrowLeft,
  Hand
} from 'lucide-vue-next'

export const QUESTION_TYPES_META: { type: QuestionType; label: string; icon: any; tone: string }[] = [
//   { type: 'long_text', label: 'متن طولانی', icon: FileText, tone: 'bg-indigo-50 text-indigo-600' },
//   { type: 'single_choice', label: 'تک انتخابی', icon: CircleDot, tone: 'bg-emerald-50 text-emerald-600' },
  { type: 'multiple_choice', label: 'چند انتخابی', icon: ListChecks, tone: 'bg-pink-50 text-pink-600' },
//   { type: 'ranking', label: 'رتبه‌بندی', icon: ListOrdered, tone: 'bg-amber-50 text-amber-600' },
//   { type: 'dropdown', label: 'لیست کشویی', icon: ListFilter, tone: 'bg-sky-50 text-sky-600' },
//   { type: 'scale', label: 'مقیاس', icon: Activity, tone: 'bg-purple-50 text-purple-600' },
//   { type: 'rating', label: 'امتیازی', icon: Star, tone: 'bg-yellow-50 text-yellow-600' },
//   { type: 'content_block', label: 'بلوک محتوا', icon: LayoutPanelLeft, tone: 'bg-slate-50 text-slate-600' },
//   { type: 'matrix', label: 'ماتریس', icon: Table, tone: 'bg-orange-50 text-orange-600' },
//   { type: 'file_upload', label: 'آپلود فایل', icon: Upload, tone: 'bg-green-50 text-green-600' },
//   { type: 'geo_location', label: 'موقعیت مکانی', icon: MapPin, tone: 'bg-teal-50 text-teal-600' }
]

export const SPECIAL_PAGES = [
  {
    key: 'welcome',
    label: 'صفحه خوش‌آمدگویی',
    description: 'متن و راهنمای شروع پرسشنامه',
    icon: ArrowLeft,
    tone: 'bg-slate-100 text-slate-700'
  },
  {
    key: 'end',
    label: 'صفحه پایان',
    description: 'پیام تشکر و پایان پرسشنامه',
    icon: Hand,
    tone: 'bg-amber-50 text-amber-700'
  }
]

export function getQuestionMeta(type: QuestionType) {
  return QUESTION_TYPES_META.find((item) => item.type === type)
}
