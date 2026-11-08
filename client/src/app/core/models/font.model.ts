export interface CvFontOption {
  id: string;
  name: string;
  englishName: string;
  category: string;
  badge?: string;
  recommendedFor: string;
  sampleArabic: string;
  sampleEnglish: string;
}

export const AVAILABLE_CV_FONTS: CvFontOption[] = [
  {
    id: 'IBM Plex Sans Arabic',
    name: 'آي بي إم بليكس (IBM Plex)',
    englishName: 'IBM Plex Sans Arabic',
    category: 'عصري وتقني',
    badge: 'الافتراضي المعتمد',
    recommendedFor: 'كافة التخصصات، التقنية، الهندسية، والإدارة',
    sampleArabic: 'أحمد محمود • مهندس برمجيات وتطبيقات سحابية',
    sampleEnglish: 'Ahmed Mahmoud • Senior Software Engineer'
  },
  {
    id: 'Cairo',
    name: 'كايرو (Cairo)',
    englishName: 'Cairo',
    category: 'عصري وحيوي',
    badge: 'الأكثر شهرة',
    recommendedFor: 'التسويق، المبيعات، التصميم، والشركات الناشئة',
    sampleArabic: 'أحمد محمود • مهندس برمجيات وتطبيقات سحابية',
    sampleEnglish: 'Ahmed Mahmoud • Senior Software Engineer'
  },
  {
    id: 'Tajawal',
    name: 'تجوّل (Tajawal)',
    englishName: 'Tajawal',
    category: 'أنيق ومتوازن',
    badge: 'رسمي هادئ',
    recommendedFor: 'الشركات الكبرى، البنوك، والمؤسسات الاستشارية',
    sampleArabic: 'أحمد محمود • مهندس برمجيات وتطبيقات سحابية',
    sampleEnglish: 'Ahmed Mahmoud • Senior Software Engineer'
  },
  {
    id: 'Almarai',
    name: 'المراعي (Almarai)',
    englishName: 'Almarai',
    category: 'هادئ ونظيف',
    badge: 'وضوح فائق',
    recommendedFor: 'القطاع المالي، التعليم، والوظائف الحكومية',
    sampleArabic: 'أحمد محمود • مهندس برمجيات وتطبيقات سحابية',
    sampleEnglish: 'Ahmed Mahmoud • Senior Software Engineer'
  },
  {
    id: 'Readex Pro',
    name: 'ريدكس برو (Readex Pro)',
    englishName: 'Readex Pro',
    category: 'هندسي متطور',
    badge: 'طابع تقني حديث',
    recommendedFor: 'المبرمجين، مصممي المنتجات، والـ UI/UX',
    sampleArabic: 'أحمد محمود • مهندس برمجيات وتطبيقات سحابية',
    sampleEnglish: 'Ahmed Mahmoud • Senior Software Engineer'
  },
  {
    id: 'Noto Sans Arabic',
    name: 'نوتو سانس (Noto Sans)',
    englishName: 'Noto Sans Arabic',
    category: 'رسمي عالمي',
    badge: 'معتمد دولياً',
    recommendedFor: 'المنظمات الدولية والشركات متعددة الجنسيات',
    sampleArabic: 'أحمد محمود • مهندس برمجيات وتطبيقات سحابية',
    sampleEnglish: 'Ahmed Mahmoud • Senior Software Engineer'
  },
  {
    id: 'Amiri',
    name: 'الأميري (Amiri)',
    englishName: 'Amiri',
    category: 'أكاديمي ورصين',
    badge: 'كلاسيكي تقليدي',
    recommendedFor: 'الأطباء، المحامين، القضاة، والباحثين الأكاديميين',
    sampleArabic: 'أحمد محمود • مهندس برمجيات وتطبيقات سحابية',
    sampleEnglish: 'Ahmed Mahmoud • Senior Software Engineer'
  }
];
