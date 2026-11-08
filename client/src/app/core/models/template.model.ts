export interface TemplateInfo {
  id: string;
  name: string;
  arabicName: string;
  englishName: string;
  category: 'all' | 'modern' | 'executive' | 'creative' | 'tech' | 'classic';
  categoryLabel: string;
  isPro: boolean;
  badgeText?: string;
  description: string;
  recommendedFor: string;
  accentDefault: string;
  features: string[];
}

export const AVAILABLE_TEMPLATES: TemplateInfo[] = [
  {
    id: 'modern-vibrant',
    name: 'القالب العصري',
    arabicName: 'القالب العصري الحيوي',
    englishName: 'Modern Vibrant',
    category: 'modern',
    categoryLabel: 'عصري',
    isPro: false,
    badgeText: 'مجاني الأكثر طلباً',
    description: 'تصميم متوازن وديناميكي يجمع بين العصرية والأناقة مع شريط ترويسة ملون وأيقونات واضحة.',
    recommendedFor: 'كافة التخصصات، التسويق، المبيعات، والإدارة العامة',
    accentDefault: '#2563eb',
    features: ['توافق ATS بنسبة 99%', 'شريط هيدر متدرج', 'وسوم مهارات تفاعلية', 'تصدير A4 فائق الدقة']
  },
  {
    id: 'minimal-clean',
    name: 'الأنيق البسيط',
    arabicName: 'الأنيق البسيط النوردي',
    englishName: 'Minimalist Nordic',
    category: 'classic',
    categoryLabel: 'بسيط ونقي',
    isPro: false,
    badgeText: 'مجاني معتمد للـ ATS',
    description: 'أعلى درجات البساطة والوضوح مع استغلال مثالي للمساحات البيضاء لتسهيل القراءة الآلية والبشرية.',
    recommendedFor: 'الباحثين عن العمل في الشركات العالمية والمالية والاستشارات',
    accentDefault: '#334155',
    features: ['بسيط جداً وسريع الفرز', 'نقاء تام في الطباعة', 'هيكلية تقليدية معتمدة', 'بدون أي تعقيدات بصرية']
  },
  {
    id: 'classic-ivy',
    name: 'الكلاسيكي الأكاديمي',
    arabicName: 'الكلاسيكي الأكاديمي',
    englishName: 'Classic Ivy',
    category: 'classic',
    categoryLabel: 'كلاسيكي',
    isPro: false,
    badgeText: 'مجاني للجامعات والطب',
    description: 'ترويسة مركزية مع خطوط فاصلة رصينة مستوحاة من أعرق الجامعات والمؤسسات الطبية والأكاديمية.',
    recommendedFor: 'الأطباء، المحامين، المعلمين، والباحثين الأكاديميين',
    accentDefault: '#1e3a8a',
    features: ['ترويسة مركزية أنيقة', 'فواصل رصينة ومتقنة', 'ترتيب هرمي كلاسيكي', 'مثالي للسير الطويلة']
  },
  {
    id: 'executive-slate',
    name: 'التنفيذي الفاخر',
    arabicName: 'التنفيذي الفاخر',
    englishName: 'Executive Slate',
    category: 'executive',
    categoryLabel: 'تنفيذي وقيادي',
    isPro: true,
    badgeText: 'Pro باقة المحترفين',
    description: 'ترويسة داكنة فاخرة تمنح سيرتك هيبة استثنائية، مخصصة لأصحاب الخبرات الطويلة والقياديين.',
    recommendedFor: 'المدراء التنفيذيين (C-Level)، مدراء المشاريع، ورؤساء الأقسام',
    accentDefault: '#1e293b',
    features: ['هيدر داكن فخم', 'إبراز المهارات القيادية', 'رؤية تنفيذية واضحة', 'تصميم عالي التباين']
  },
  {
    id: 'creative-indigo',
    name: 'الإبداعي ثنائي الأعمدة',
    arabicName: 'الإبداعي ثنائي الأعمدة',
    englishName: 'Creative Two-Column',
    category: 'creative',
    categoryLabel: 'إبداعي عصري',
    isPro: true,
    badgeText: 'Pro باقة المحترفين',
    description: 'تصميم عصري مزدوج يقسم الصفحة إلى شريط جانبي مخصص للمعلومات السريعة ومحتوى رئيسي واسع.',
    recommendedFor: 'المصممين (UI/UX)، صانعي المحتوى، وهواة التصاميم الجذابة',
    accentDefault: '#4f46e5',
    features: ['شريط جانبي مميز (Sidebar)', 'توزيع ذكي للمساحات', 'أيقونات وشارات إبداعية', 'إبراز المشاريع والروابط']
  },
  {
    id: 'tech-developer',
    name: 'التقني المطور',
    arabicName: 'التقني للمطورين والـ IT',
    englishName: 'Tech Developer',
    category: 'tech',
    categoryLabel: 'تقني ومبرمجين',
    isPro: true,
    badgeText: 'Pro باقة المحترفين',
    description: 'تصميم هندسي متقدم يركز على المشاريع البرمجية، المكدس التقني (Tech Stack)، وحسابات GitHub وLinkedIn.',
    recommendedFor: 'المبرمجين، مهندسي البرمجيات، خبراء السحابة DevOps، والذكاء الاصطناعي',
    accentDefault: '#059669',
    features: ['إبراز الـ Tech Stack والمهارات', 'بطاقات للمشاريع البرمجية', 'تصميم حاد وعصري', 'شريط مؤشرات مستوى المهارة']
  },
  {
    id: 'golden-prestige',
    name: 'الذهبي الماسي',
    arabicName: 'الذهبي الماسي الفاخر',
    englishName: 'Golden Prestige',
    category: 'executive',
    categoryLabel: 'فاخر واستشاري',
    isPro: true,
    badgeText: 'Pro باقة المحترفين',
    description: 'لمسات ذهبية دافئة وأنيقة تضفي إحساساً بالفخامة والتميز على سيرتك الذاتية وتجعلها تعلق في الذاكرة.',
    recommendedFor: 'المستشارين، رواد الأعمال، والمهنيين في القطاع المصرفي والفندقي الفاخر',
    accentDefault: '#d97706',
    features: ['لمسات ذهبية دقيقة', 'إطارات متباينة برقي', 'تصميم فاخر للنبذة والخبرة', 'انطباع أول استثنائي']
  }
];
