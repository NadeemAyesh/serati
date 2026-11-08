export interface CVLanguage {
  id: 'ar' | 'en' | 'fr' | 'de' | 'es' | 'tr';
  name: string;
  nativeName: string;
  direction: 'rtl' | 'ltr';
  isPro: boolean;
  badge?: string;
  defaultFont: string;
}

export interface CVSectionLabels {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  projects: string;
  certifications: string;
  references: string;
  present: string;
  grade: string;
  contacts: string;
  executiveVision: string;
  stackSkills: string;
  consultingProfile: string;
  aboutMe: string;
  academicProfile: string;
  inDegree: string;
  gpaPrefix: string;
  certifiedBadge: string;
}

export interface CVBuilderUI {
  backToDashboard: string;
  templatesGallery: string;
  themeColors: string;
  fontFamily: string;
  fontSize: string;
  canvaStudio: string;
  exportPdf: string;
  saveCV: string;
  saving: string;
  saved: string;
  unsaved: string;
  cvLanguage: string;
  tabs: {
    personal: string;
    experience: string;
    education: string;
    skills: string;
    certifications: string;
    projects: string;
    references: string;
  };
  personal: {
    title: string;
    step: string;
    photoTitle: string;
    photoDesc: string;
    uploadPhoto: string;
    changePhoto: string;
    removePhoto: string;
    photoRecommended: string;
    fullName: string;
    fullNamePlaceholder: string;
    jobTitle: string;
    jobTitlePlaceholder: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    github: string;
    website: string;
    summary: string;
    summaryPlaceholder: string;
    aiEnhance: string;
    aiEnhancing: string;
  };
  experience: {
    title: string;
    step: string;
    addBtn: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: string;
    description: string;
    delete: string;
    noItems: string;
  };
  education: {
    title: string;
    step: string;
    addBtn: string;
    institution: string;
    degree: string;
    field: string;
    year: string;
    grade: string;
    description: string;
    delete: string;
    noItems: string;
  };
  skills: {
    title: string;
    step: string;
    addSkillBtn: string;
    skillName: string;
    level: string;
    spokenLanguages: string;
    addLangBtn: string;
    langName: string;
    proficiency: string;
    delete: string;
  };
  certifications: {
    title: string;
    step: string;
    addBtn: string;
    name: string;
    issuer: string;
    date: string;
    url: string;
    delete: string;
    noItems: string;
  };
  projects: {
    title: string;
    step: string;
    addBtn: string;
    name: string;
    role: string;
    url: string;
    description: string;
    delete: string;
    noItems: string;
  };
  references: {
    title: string;
    step: string;
    addBtn: string;
    name: string;
    company: string;
    contact: string;
    delete: string;
    noItems: string;
  };
  preview: {
    title: string;
    tip: string;
    canvaBanner: string;
    sampleContentSwitched: string;
  };
}

export const AVAILABLE_CV_LANGUAGES: CVLanguage[] = [
  {
    id: 'ar',
    name: 'العربية',
    nativeName: 'العربية (Arabic)',
    direction: 'rtl',
    isPro: false,
    defaultFont: '"IBM Plex Sans Arabic", system-ui, sans-serif'
  },
  {
    id: 'en',
    name: 'English',
    nativeName: 'English (الإنجليزية)',
    direction: 'ltr',
    isPro: false,
    defaultFont: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  {
    id: 'fr',
    name: 'Français',
    nativeName: 'Français (الفرنسية)',
    direction: 'ltr',
    isPro: true,
    badge: 'PRO',
    defaultFont: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  {
    id: 'de',
    name: 'Deutsch',
    nativeName: 'Deutsch (الألمانية)',
    direction: 'ltr',
    isPro: true,
    badge: 'PRO',
    defaultFont: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  {
    id: 'es',
    name: 'Español',
    nativeName: 'Español (الإسبانية)',
    direction: 'ltr',
    isPro: true,
    badge: 'PRO',
    defaultFont: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  {
    id: 'tr',
    name: 'Türkçe',
    nativeName: 'Türkçe (التركية)',
    direction: 'ltr',
    isPro: true,
    badge: 'PRO',
    defaultFont: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }
];

export const CV_DICTIONARY: Record<string, CVSectionLabels> = {
  ar: {
    summary: 'النبذة المهنية',
    experience: 'الخبرات الوظيفية',
    education: 'المؤهلات العلمية',
    skills: 'المهارات والكفاءات',
    languages: 'اللغات',
    projects: 'المشاريع البارزة',
    certifications: 'الشهادات والاعتمادات',
    references: 'المراجع المهنية',
    present: 'الآن',
    grade: 'التقدير',
    contacts: 'بيانات الاتصال',
    executiveVision: 'الرؤية والخبرة التنفيذية',
    stackSkills: 'المكدس والمهارات التقنية',
    consultingProfile: 'الملف الاستشاري والشخصي',
    aboutMe: 'عن مسيرتي',
    academicProfile: 'الملخص المهني والأكاديمي',
    inDegree: 'في',
    gpaPrefix: 'التقدير: ',
    certifiedBadge: 'سيرة ذاتية معتمدة ومطابقة 100% لمعايير التوظيف والـ ATS'
  },
  en: {
    summary: 'Professional Summary',
    experience: 'Work Experience',
    education: 'Education & Qualifications',
    skills: 'Skills & Competencies',
    languages: 'Languages',
    projects: 'Featured Projects',
    certifications: 'Certifications',
    references: 'Professional References',
    present: 'Present',
    grade: 'Grade / GPA',
    contacts: 'Contact Information',
    executiveVision: 'Executive Vision & Leadership',
    stackSkills: 'Core Technical Stack',
    consultingProfile: 'Executive Consulting Profile',
    aboutMe: 'About Me',
    academicProfile: 'Academic & Professional Profile',
    inDegree: 'in',
    gpaPrefix: 'GPA / Grade: ',
    certifiedBadge: 'Verified & 100% ATS-Compliant Professional Resume'
  },
  fr: {
    summary: 'Profil Professionnel',
    experience: 'Expérience Professionnelle',
    education: 'Formation & Diplômes',
    skills: 'Compétences Clés',
    languages: 'Langues',
    projects: 'Projets Réalisés',
    certifications: 'Certifications',
    references: 'Références Professionnelles',
    present: 'Présent',
    grade: 'Mention',
    contacts: 'Coordonnées',
    executiveVision: 'Vision Stratégique & Direction',
    stackSkills: 'Technologies & Compétences',
    consultingProfile: 'Profil Conseil & Expertise',
    aboutMe: 'À Propos',
    academicProfile: 'Profil Académique',
    inDegree: 'en',
    gpaPrefix: 'Mention: ',
    certifiedBadge: 'CV Certifié Conforme aux Normes ATS 100%'
  },
  de: {
    summary: 'Berufsprofil',
    experience: 'Berufserfahrung',
    education: 'Ausbildung & Studium',
    skills: 'Fachkenntnisse & Fähigkeiten',
    languages: 'Sprachen',
    projects: 'Ausgewählte Projekte',
    certifications: 'Zertifikate',
    references: 'Referenzen',
    present: 'Heute',
    grade: 'Note',
    contacts: 'Kontaktdaten',
    executiveVision: 'Führungskompetenz & Vision',
    stackSkills: 'Technologien & Skills',
    consultingProfile: 'Beraterprofil',
    aboutMe: 'Über mich',
    academicProfile: 'Akademisches Profil',
    inDegree: 'in',
    gpaPrefix: 'Note: ',
    certifiedBadge: '100% ATS-konformer und geprüfter Lebenslauf'
  },
  es: {
    summary: 'Perfil Profesional',
    experience: 'Experiencia Laboral',
    education: 'Educación y Formación',
    skills: 'Habilidades y Competencias',
    languages: 'Idiomas',
    projects: 'Proyectos Destacados',
    certifications: 'Certificaciones',
    references: 'Referencias',
    present: 'Actual',
    grade: 'Calificación',
    contacts: 'Datos de Contacto',
    executiveVision: 'Visión Ejecutiva y Liderazgo',
    stackSkills: 'Stack Tecnológico',
    consultingProfile: 'Perfil de Consultoría',
    aboutMe: 'Sobre Mí',
    academicProfile: 'Perfil Académico',
    inDegree: 'en',
    gpaPrefix: 'Calificación: ',
    certifiedBadge: 'Currículum Certificado 100% Compatible con ATS'
  },
  tr: {
    summary: 'Profesyonel Özet',
    experience: 'İş Deneyimi',
    education: 'Eğitim & Öğretim',
    skills: 'Beceriler & Yetkinlikler',
    languages: 'Yabancı Diller',
    projects: 'Öne Çıkan Projeler',
    certifications: 'Sertifikalar',
    references: 'Referanslar',
    present: 'Devam Ediyor',
    grade: 'Derece',
    contacts: 'İletişim Bilgileri',
    executiveVision: 'Yönetici Vizyonu',
    stackSkills: 'Teknoloji ve Beceriler',
    consultingProfile: 'Danışmanlık Profili',
    aboutMe: 'Hakkımda',
    academicProfile: 'Akademik Profil',
    inDegree: 'alanında',
    gpaPrefix: 'Derece: ',
    certifiedBadge: '%100 ATS Uyumlu Onaylı Özgeçmiş'
  }
};

export const CV_BUILDER_UI: Record<string, CVBuilderUI> = {
  ar: {
    backToDashboard: 'العودة للوحة التحكم',
    templatesGallery: 'معرض القوالب',
    themeColors: 'تخصيص الألوان',
    fontFamily: 'نوع الخط',
    fontSize: 'حجم الخط',
    canvaStudio: 'محرر كانفا',
    exportPdf: 'تصدير PDF',
    saveCV: 'حفظ السيرة',
    saving: 'جاري الحفظ...',
    saved: 'تم الحفظ تلقائياً',
    unsaved: 'مسودة غير محفوظة',
    cvLanguage: 'لغة السيرة',
    tabs: {
      personal: 'البيانات الشخصية',
      experience: 'الخبرات الوظيفية',
      education: 'التعليم والمؤهلات',
      skills: 'المهارات واللغات',
      certifications: 'الشهادات والاعتمادات',
      projects: 'المشاريع البارزة',
      references: 'المراجع المهنية'
    },
    personal: {
      title: 'البيانات الشخصية ومعلومات الاتصال',
      step: 'الخطوة 1 من 7',
      photoTitle: 'الصورة الشخصية الرسمية',
      photoDesc: 'تظهر صورتك الشخصية بأناقة في القوالب التي تدعم الصور الشخصية.',
      uploadPhoto: 'رفع صورة شخصية',
      changePhoto: 'تغيير الصورة',
      removePhoto: 'إزالة الصورة',
      photoRecommended: 'مُستحسن: صورة شخصية احترافية بخلفية محايدة (PNG / JPG)',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'أحمد محمود',
      jobTitle: 'المسمى المهني المستهدف',
      jobTitlePlaceholder: 'مهندس برمجيات وتطبيقات سحابية',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      address: 'المدينة والدولة',
      linkedin: 'رابط حساب LinkedIn',
      github: 'رابط حساب GitHub',
      website: 'الموقع الشخصي أو معرض الأعمال (Portfolio)',
      summary: 'النبذة المهنية التلخيصية (Professional Summary)',
      summaryPlaceholder: 'اكتب نبذة ملهمة ومختصرة تلخص خبراتك وأبرز مهاراتك القيادية والتقنية...',
      aiEnhance: 'تحسين الصياغة بالذكاء الاصطناعي',
      aiEnhancing: 'جاري التحسين الذكي...'
    },
    experience: {
      title: 'الخبرات المهنية وسجل العمل',
      step: 'الخطوة 2 من 7',
      addBtn: 'إضافة خبرة وظيفية جديدة',
      company: 'اسم الشركة أو المؤسسة',
      position: 'المسمى الوظيفي',
      location: 'الموقع (مثال: دبي، أو عن بُعد)',
      startDate: 'تاريخ البدء',
      endDate: 'تاريخ المغادرة',
      isCurrent: 'ما زلت أعمل هنا حتى الآن',
      description: 'المسؤوليات والإنجازات البارزة (نص أو نقاط)',
      delete: 'حذف هذه الخبرة',
      noItems: 'لم يتم إضافة أي خبرات بعد. أضف خبرتك الأولى لتعزيز سيرتك الذاتية!'
    },
    education: {
      title: 'المؤهلات العلمية والشهادات الأكاديمية',
      step: 'الخطوة 3 من 7',
      addBtn: 'إضافة مؤهل دراسي جديد',
      institution: 'اسم الجامعة أو المعهد الأكاديمي',
      degree: 'الدرجة العلمية (مثال: بكالوريوس، ماجستير)',
      field: 'التخصص العلمي',
      year: 'سنة التخرج أو التخرج المتوقع',
      grade: 'التقدير أو المعدل التراكمي (اختياري)',
      description: 'مشروع التخرج أو أبرز الإنجازات الأكاديمية',
      delete: 'حذف هذا المؤهل',
      noItems: 'لم يتم إضافة أي مؤهلات تعليمية بعد.'
    },
    skills: {
      title: 'المهارات التقنية والشخصية واللغات',
      step: 'الخطوة 4 من 7',
      addSkillBtn: 'إضافة مهارة جديدة',
      skillName: 'اسم المهارة',
      level: 'مستوى الإتقان',
      spokenLanguages: 'اللغات المنطوقة',
      addLangBtn: 'إضافة لغة جديدة',
      langName: 'اسم اللغة',
      proficiency: 'مستوى التحدث والإتقان',
      delete: 'حذف',
    },
    certifications: {
      title: 'الشهادات المهنية والدورات التدريبية',
      step: 'الخطوة 5 من 7',
      addBtn: 'إضافة شهادة مهنية',
      name: 'اسم الشهادة أو الدورة',
      issuer: 'الجهة المانحة للشهادة',
      date: 'تاريخ الحصول عليها',
      url: 'رابط التحقق الإلكتروني (اختياري)',
      delete: 'حذف الشهادة',
      noItems: 'لا توجد شهادات مضافة حالياً.'
    },
    projects: {
      title: 'المشاريع المميزة والإنجازات',
      step: 'الخطوة 6 من 7',
      addBtn: 'إضافة مشروع جديد',
      name: 'اسم المشروع',
      role: 'دورك ومسؤوليتك في المشروع',
      url: 'رابط المعاينة أو الكود (Live Demo / Repo)',
      description: 'نبذة عن المشروع والتقنيات المستخدمة والنتائج',
      delete: 'حذف المشروع',
      noItems: 'لا توجد مشاريع مضافة حالياً.'
    },
    references: {
      title: 'المراجع والتوصيات المهنية',
      step: 'الخطوة 7 من 7',
      addBtn: 'إضافة مرجع مهني',
      name: 'اسم الشخص أو المشرف',
      company: 'الشركة والمسمى الوظيفي',
      contact: 'رقم الهاتف أو البريد الإلكتروني للتواصل',
      delete: 'حذف المرجع',
      noItems: 'المراجع متاحة عند الطلب، أو يمكنك إضافة جهات اتصال موثوقة.'
    },
    preview: {
      title: 'المعاينة الحية للسيرة الذاتية (A4 Live Paper)',
      tip: 'انقر على أي نص على الورقة للتعديل المباشر في وضع كانفا',
      canvaBanner: 'وضع كانفا الاحترافي مُفعّل: انقر على أي نص لتعديله مباشرة على الورقة!',
      sampleContentSwitched: 'تم تحويل المحتوى النموذجي للإنجليزية بنجاح!'
    }
  },
  en: {
    backToDashboard: 'Back to Dashboard',
    templatesGallery: 'Templates Gallery',
    themeColors: 'Theme Colors',
    fontFamily: 'Typography',
    fontSize: 'Font Size',
    canvaStudio: 'Canva Studio',
    exportPdf: 'Export PDF',
    saveCV: 'Save CV',
    saving: 'Saving...',
    saved: 'Saved Automatically',
    unsaved: 'Unsaved Draft',
    cvLanguage: 'CV Language',
    tabs: {
      personal: 'Personal Info',
      experience: 'Work Experience',
      education: 'Education',
      skills: 'Skills & Languages',
      certifications: 'Certifications',
      projects: 'Projects',
      references: 'References'
    },
    personal: {
      title: 'Personal Information & Contact Details',
      step: 'Step 1 of 7',
      photoTitle: 'Official Profile Photo',
      photoDesc: 'Your profile photo is rendered with pristine quality in photo-supported templates.',
      uploadPhoto: 'Upload Profile Photo',
      changePhoto: 'Change Photo',
      removePhoto: 'Remove Photo',
      photoRecommended: 'Recommended: High-resolution square photo with neutral background (PNG / JPG)',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Ahmed Mahmoud',
      jobTitle: 'Target Job Title',
      jobTitlePlaceholder: 'Senior Full-Stack Cloud Engineer',
      email: 'Email Address',
      phone: 'Phone Number',
      address: 'City, Country',
      linkedin: 'LinkedIn Profile URL',
      github: 'GitHub Profile URL',
      website: 'Personal Website / Portfolio URL',
      summary: 'Professional Summary',
      summaryPlaceholder: 'Write a compelling, concise summary highlighting your leadership, technical expertise, and career achievements...',
      aiEnhance: 'Enhance with AI Assistant',
      aiEnhancing: 'AI Optimizing...'
    },
    experience: {
      title: 'Professional Work Experience',
      step: 'Step 2 of 7',
      addBtn: '+ Add Work Experience',
      company: 'Company / Organization',
      position: 'Job Title / Position',
      location: 'Location (e.g. Remote, Hybrid, City)',
      startDate: 'Start Date',
      endDate: 'End Date',
      isCurrent: 'I currently work in this role',
      description: 'Key Responsibilities, Achievements & Deliverables',
      delete: 'Delete Experience',
      noItems: 'No work experience added yet. Add your first position to strengthen your resume!'
    },
    education: {
      title: 'Academic Education & Qualifications',
      step: 'Step 3 of 7',
      addBtn: '+ Add Education',
      institution: 'University / Educational Institution',
      degree: 'Degree (e.g. Bachelor of Science, Master of Science)',
      field: 'Field of Study / Major',
      year: 'Graduation Year or Expected',
      grade: 'Grade / GPA / Honors (Optional)',
      description: 'Capstone project, thesis, or notable academic honors',
      delete: 'Delete Education',
      noItems: 'No education qualifications added yet.'
    },
    skills: {
      title: 'Technical Competencies, Skills & Languages',
      step: 'Step 4 of 7',
      addSkillBtn: '+ Add Skill',
      skillName: 'Skill Name',
      level: 'Proficiency Level',
      spokenLanguages: 'Spoken Languages',
      addLangBtn: '+ Add Spoken Language',
      langName: 'Language Name',
      proficiency: 'Fluency Level',
      delete: 'Delete'
    },
    certifications: {
      title: 'Professional Certifications & Licenses',
      step: 'Step 5 of 7',
      addBtn: '+ Add Certification',
      name: 'Certification Title',
      issuer: 'Issuing Organization',
      date: 'Issue Date',
      url: 'Credential Verification URL (Optional)',
      delete: 'Delete Certificate',
      noItems: 'No certifications added yet.'
    },
    projects: {
      title: 'Featured Projects & Key Accomplishments',
      step: 'Step 6 of 7',
      addBtn: '+ Add Project',
      name: 'Project Name',
      role: 'Your Role / Responsibilities',
      url: 'Live Demo or GitHub Repository URL',
      description: 'Overview, tech stack used, challenges solved, and key outcomes',
      delete: 'Delete Project',
      noItems: 'No featured projects added yet.'
    },
    references: {
      title: 'Professional References & Endorsements',
      step: 'Step 7 of 7',
      addBtn: '+ Add Reference',
      name: 'Full Name',
      company: 'Company & Designation',
      contact: 'Contact Info (Email or Phone)',
      delete: 'Delete Reference',
      noItems: 'References available upon request, or add verified contacts.'
    },
    preview: {
      title: 'A4 Live Resume Preview',
      tip: 'Click any text on the paper to edit directly in Canva mode',
      canvaBanner: 'Canva Pro Mode Active: Click directly on any text on the paper to edit!',
      sampleContentSwitched: 'Sample content successfully translated to English!'
    }
  }
};

export function getCVSectionLabels(lang: string = 'ar'): CVSectionLabels {
  return CV_DICTIONARY[lang] || CV_DICTIONARY['ar'];
}

export function getCVBuilderUI(lang: string = 'ar'): CVBuilderUI {
  return CV_BUILDER_UI[lang] || CV_BUILDER_UI['ar'];
}
