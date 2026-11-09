/**
 * بنك الوظائف والشواغر الحية لمساعد وبوت الوظائف (Job Scout Bot)
 * يركز أساساً على فلسطين (الضفة الغربية، القدس، قطاع غزة) مع دعم دول عربية وعن بُعد
 */

const jobsDatabase = [
  // ===================== فلسطين (PALESTINE) =====================
  {
    id: 'job-ps-01',
    title: 'مهندس برمجيات وتطبيقات سحابية (Full Stack Cloud Engineer)',
    company: 'ASAL Technologies',
    logo: 'code',
    country: 'فلسطين',
    countryCode: 'PS',
    city: 'روابي / رام الله',
    field: 'تكنولوجيا ومعلومات',
    jobType: 'دوام كامل',
    workplaceType: 'هجين (Hybrid)',
    experienceLevel: 'متوسط (2-4 سنوات)',
    salaryRange: '7,000 - 11,000 ₪',
    deadline: '2026-11-28',
    postedTimeAgo: 'منذ 25 دقيقة',
    source: 'ASAL Careers / Jobs.ps',
    isHot: true,
    isNew: true,
    description: 'نبحث عن مهندس برمجيات موهوب للانضمام إلى فريق تطوير الأنظمة السحابية لعملاء عالميين. ستعمل بأحدث تقنيات Node.js و Angular / React والخدمات المصغرة (Microservices) على بيئة AWS.',
    requirements: [
      'درجة البكالوريوس في علم الحاسوب أو هندسة البرمجيات أو ما يعادلها.',
      'خبرة لا تقل عن سنتين في تطوير تطبيقات الويب الحديثة (JavaScript / TypeScript).',
      'إتقان التعامل مع قواعد البيانات الحديثة (MongoDB, PostgreSQL).',
      'إجادة اللغة الإنجليزية تحدثاً وكتابة للتعامل مع العملاء الدوليين.'
    ],
    applyUrl: 'https://www.asaltech.com/careers',
    applyEmail: 'hr@asaltech.com'
  },

  {
    id: 'job-ps-02',
    title: 'مسؤول ائتمان وتسهيلات مصرفية (Credit & Relationship Officer)',
    company: 'بنك فلسطين (Bank of Palestine)',
    logo: 'account_balance',
    country: 'فلسطين',
    countryCode: 'PS',
    city: 'رام الله والبيرة',
    field: 'محاسبة ومالية وبنوك',
    jobType: 'دوام كامل',
    workplaceType: 'حضوري بالفرع',
    experienceLevel: 'متوسط (1-3 سنوات)',
    salaryRange: '4,500 - 6,500 ₪ + حوافز وتأمين',
    deadline: '2026-11-25',
    postedTimeAgo: 'منذ ساعتين',
    source: 'بوابة توظيف بنك فلسطين',
    isHot: true,
    isNew: true,
    description: 'فرصة للانضمام إلى أكبر مجموعة مصرفية في فلسطين كمسؤول ائتمان. يتولى الموظف دراسة الملفات الائتمانية للأفراد والشركات الصغيرة وتحليل القوائم المالية وإعداد مذكرات الائتمان بما يتوافق مع تعليمات سلطة النقد.',
    requirements: [
      'بكالوريوس في العلوم المالية والمصرفية أو المحاسبة أو إدارة الأعمال.',
      'معرفة جيدة بالقوائم المالية ونسب التحليل المالي ومبادئ الجدارة الائتمانية.',
      'مهارات تواصل وتفاوض ممتازة مع الزبائن.',
      'إتقان استخدام البرمجيات المصرفية وتطبيقات Excel المتقدمة.'
    ],
    applyUrl: 'https://bop.ps/careers',
    applyEmail: 'recruitment@bop.ps'
  },

  {
    id: 'job-ps-03',
    title: 'منسق مشاريع إغاثية ومجتمعية (Field Project Coordinator)',
    company: 'وكالة الأمم المتحدة لإغاثة وتشغيل اللاجئين (UNRWA)',
    logo: 'public',
    country: 'فلسطين',
    countryCode: 'PS',
    city: 'القدس الشريف / الضفة الغربية',
    field: 'منظمات دولية وNGOs',
    jobType: 'عقد مشروع سنوي قابل للتجديد',
    workplaceType: 'ميداني وحضوري',
    experienceLevel: 'متقدم (3-5 سنوات)',
    salaryRange: '$2,200 - $2,800',
    deadline: '2026-11-30',
    postedTimeAgo: 'منذ 4 ساعات',
    source: 'UNRWA Inspira Portal',
    isHot: true,
    isNew: false,
    description: 'الإشراف على تنفيذ المبادرات والبرامج الإغاثية في المخيمات والمجتمعات المستهدفة، ومتابعة مؤشرات الإنجاز، والتنسيق الوثيق مع الشركاء المحليين لضمان الالتزام بأعلى المعايير الإنسانية الدولية.',
    requirements: [
      'شهادة جامعية أولى في العلوم الاجتماعية، إدارة الأعمال، أو التنمية الدولية.',
      'خبرة موثقة في العمل الإنساني وإدارة دورة حياة المشروع (PCM).',
      'إتقان تام للغتين العربية والإنجليزية قراءة وكتابة ومحادثة.',
      'التزام صارم بمدونة السلوك ومبادئ الحيادية والنزاهة بالأمم المتحدة.'
    ],
    applyUrl: 'https://inspira.un.org',
    applyEmail: 'jobs.unrwa@un.org'
  },

  {
    id: 'job-ps-04',
    title: 'أخصائي شبكات وأمن معلومات (Network & Cybersecurity Specialist)',
    company: 'مجموعة الاتصالات الفلسطينية - جوال (Jawwal)',
    logo: 'cell_tower',
    country: 'فلسطين',
    countryCode: 'PS',
    city: 'البيرة / رام الله',
    field: 'تكنولوجيا ومعلومات',
    jobType: 'دوام كامل',
    workplaceType: 'حضوري',
    experienceLevel: 'متوسط (2-4 سنوات)',
    salaryRange: '6,000 - 8,500 ₪',
    deadline: '2026-12-05',
    postedTimeAgo: 'منذ 6 ساعات',
    source: 'بوابة التوظيف - Paltel Group',
    isHot: false,
    isNew: true,
    description: 'متابعة البنية التحتية لشبكات الاتصالات، وإدارة الجدران النارية (Firewalls)، واكتشاف التهديدات السيبرانية والاستجابة للحوادث الأمنية لضمان استمرارية الخدمات بكفاءة عالية.',
    requirements: [
      'بكالوريوس في هندسة الحاسوب، شبكات الحاسوب، أو أمن المعلومات.',
      'شهادات مهنية مفضلة مثل CCNA/CCNP أو CompTIA Security+.',
      'خبرة في إدارة أنظمة Linux وجدران الحماية وفحص الثغرات.',
      'القدرة على العمل في نوبات دعم فني عند الحاجة لحماية أمن البيانات.'
    ],
    applyUrl: 'https://careers.paltelgroup.ps',
    applyEmail: 'jobs@jawwal.ps'
  },

  {
    id: 'job-ps-05',
    title: 'محاسب عام وتدقيق مالي (General Accountant)',
    company: 'شركة المشروبات الوطنية كوكاكولا / كابي',
    logo: 'receipt_long',
    country: 'فلسطين',
    countryCode: 'PS',
    city: 'بيتونيا / رام الله',
    field: 'محاسبة ومالية وبنوك',
    jobType: 'دوام كامل',
    workplaceType: 'حضوري',
    experienceLevel: 'متوسط (1-3 سنوات)',
    salaryRange: '4,000 - 5,500 ₪',
    deadline: '2026-11-27',
    postedTimeAgo: 'منذ يوم',
    source: 'Jobs.ps',
    isHot: false,
    isNew: false,
    description: 'إعداد القيود المحاسبية اليومية، ومتابعة حسابات الموردين والزبائن، وإعداد تسويات البنوك الدورية، والمشاركة في تجهيز الإقرارات الضريبية وضريبة القيمة المضافة.',
    requirements: [
      'بكالوريوس محاسبة من جامعة معترف بها بتقدير جيد على الأقل.',
      'معرفة عملية ببرنامج الشامل أو بيسان أو برامج ERP المحاسبية.',
      'دقة عالية في العمل والتعامل مع الأرقام والبيانات المالية.',
      'فهم قانون العمل الفلسطيني وقانون ضريبة الدخل والقيمة المضافة.'
    ],
    applyUrl: 'https://www.jobs.ps',
    applyEmail: 'hr@nbc-pal.com'
  },

  {
    id: 'job-ps-06',
    title: 'معلم / معلمة لغة إنجليزية للمرحلة الأساسية والعليا',
    company: 'مدارس المستقبل الأهلية الحديثة',
    logo: 'school',
    country: 'فلسطين',
    countryCode: 'PS',
    city: 'نابلس',
    field: 'تعليم وتربية',
    jobType: 'دوام كامل',
    workplaceType: 'حضوري',
    experienceLevel: 'حديث تخرج إلى سنتين',
    salaryRange: '3,200 - 4,500 ₪',
    deadline: '2026-12-01',
    postedTimeAgo: 'منذ يوم',
    source: 'شبكة وظائف فلسطين',
    isHot: false,
    isNew: false,
    description: 'تدريس مادة اللغة الإنجليزية وفق مناهج متطورة، واستخدام استراتيجيات التعلم التفاعلي والوسائل التكنولوجية الحديثة لتحفيز الطلاب على إتقان مهارات المحادثة والقراءة.',
    requirements: [
      'بكالوريوس في آداب اللغة الإنجليزية أو أساليب تدريس اللغة الإنجليزية مع تأهيل تربوي.',
      'طلاقة تامة في اللغة الإنجليزية كتابة ونطقاً.',
      'مهارات ممتازة في إدارة الغرفة الصفية وإعداد خطط الدروس والأنشطة.',
      'إجادة استخدام شاشات التفاعل والمنصات التعليمية الرقمية.'
    ],
    applyUrl: 'https://www.jobs.ps',
    applyEmail: 'info@mustaqbal-school.edu.ps'
  },

  {
    id: 'job-ps-07',
    title: 'مهندس موقع مدني (Civil Site Engineer)',
    company: 'شركة اتحاد المقاولين للمشاريع الإنشائية',
    logo: 'engineering',
    country: 'فلسطين',
    countryCode: 'PS',
    city: 'الخليل',
    field: 'هندسة وإدارة مشاريع',
    jobType: 'دوام كامل',
    workplaceType: 'ميداني في الموقع',
    experienceLevel: 'متوسط (2-4 سنوات)',
    salaryRange: '5,000 - 7,500 ₪',
    deadline: '2026-11-29',
    postedTimeAgo: 'منذ يومين',
    source: 'نقابة المهندسين - مركز القدس / وظائف',
    isHot: false,
    isNew: false,
    description: 'متابعة تنفيذ الأعمال الإنشائية في الموقع ومطابقتها للمخططات الهندسية وجداول الكميات، والإشراف على فحص المواد ومطابقتها للمواصفات الفلسطينية، وتطبيق معايير السلامة المهنية.',
    requirements: [
      'بكالوريوس هندسة مدنية وعضوية مسجلة في نقابة المهندسين.',
      'إتقان استخدام برامج AutoCAD و MS Project أو Primavera.',
      'مهارات عالية في حل المشكلات الميدانية والتنسيق مع المقاولين الفرعيين.',
      'رخصة قيادة سارية المفعول.'
    ],
    applyUrl: 'https://paleng.org/jobs',
    applyEmail: 'site.careers@hebron-const.ps'
  },

  {
    id: 'job-ps-08',
    title: 'ممرض / ممرضة قانونية (Staff Nurse - ICU / Emergency)',
    company: 'المستشفى الاستشاري العربي',
    logo: 'local_hospital',
    country: 'فلسطين',
    countryCode: 'PS',
    city: 'ضاحية الريحان / رام الله',
    field: 'صحة وتمريض',
    jobType: 'دوام كامل (نوبات)',
    workplaceType: 'حضوري بالمستشفى',
    experienceLevel: 'مبتدئ إلى متوسط (1-3 سنوات)',
    salaryRange: '4,000 - 5,800 ₪ + بدلات نوبات',
    deadline: '2026-12-10',
    postedTimeAgo: 'منذ 3 ساعات',
    source: 'إعلانات التوظيف الرسمية',
    isHot: true,
    isNew: true,
    description: 'تقديم الرعاية التمريضية الشاملة والمباشرة للمرضى وفق أعلى معايير الجودة وسلامة المرضى في أقسام العناية المكثفة والطوارئ، مع توثيق العلامات الحيوية وإعطاء العلاجات بدقة.',
    requirements: [
      'بكالوريوس تمريض من كلية معترف بها مع مزاولة مهنة فلسطينية سارية.',
      'عضوية نقابة التمريض والقبالة الفلسطينية.',
      'شهادة BLS / ACLS حديثة لإنعاش القلب تعتبر ميزة إضافية.',
      'القدرة على العمل بروح الفريق وتحت ضغط الحالات الطارئة.'
    ],
    applyUrl: 'https://iah.ps/careers',
    applyEmail: 'hr@iah.ps'
  },

  {
    id: 'job-ps-09',
    title: 'أخصائي تسويق رقمي وصناعة محتوى (Digital Marketer & Content Creator)',
    company: 'شركة أوريدو فلسطين (Ooredoo Palestine)',
    logo: 'campaign',
    country: 'فلسطين',
    countryCode: 'PS',
    city: 'البيرة / رام الله',
    field: 'تسويق ومبيعات وإعلام',
    jobType: 'دوام كامل',
    workplaceType: 'هجين',
    experienceLevel: 'متوسط (2-3 سنوات)',
    salaryRange: '5,000 - 7,000 ₪',
    deadline: '2026-11-26',
    postedTimeAgo: 'منذ 5 ساعات',
    source: 'بوابة أوريدو للوظائف',
    isHot: false,
    isNew: true,
    description: 'تطوير وتنفيذ الحملات التسويقية الرقمية، وإدارة حسابات التواصل الاجتماعي، وتحليل أداء الإعلانات الممولة (Meta, TikTok, Google Ads)، وكتابة محتوى إبداعي جذاب للمستهلكين.',
    requirements: [
      'بكالوريوس في التسويق أو الإعلام الرقمي أو العلاقات العامة.',
      'خبرة عملية في إدارة الحملات الإعلانية وتحليل مؤشرات الأداء (ROAS, CPC, CTR).',
      'إجادة صياغة النصوص الإعلانية (Copywriting) بلهجة شبابية جذابة.',
      'معرفة بأدوات التصميم الخفيف والمونتاج كـ Canva أو Premiere.'
    ],
    applyUrl: 'https://www.ooredoo.ps/careers',
    applyEmail: 'recruitment@ooredoo.ps'
  },

  {
    id: 'job-ps-10',
    title: 'مطور واجهات أمامية متدرب (Frontend Angular Intern)',
    company: 'Exalt Technologies Ltd',
    logo: 'laptop_chromebook',
    country: 'فلسطين',
    countryCode: 'PS',
    city: 'رام الله',
    field: 'تكنولوجيا ومعلومات',
    jobType: 'تدريب منتهي بالتوظيف',
    workplaceType: 'حضوري',
    experienceLevel: 'حديث تخرج / خريج جديد',
    salaryRange: 'مكافأة شهرية مجزية + تثبيت بعد 3 أشهر',
    deadline: '2026-11-24',
    postedTimeAgo: 'منذ 10 دقائق',
    source: 'Exalt Tech LinkedIn',
    isHot: true,
    isNew: true,
    description: 'برنامج تدريب عملي مكثف مدفوع لحديثي التخرج المتميزين للتدرب على بناء تطبيقات الويب الضخمة باستخدام Angular و Tailwind CSS والربط مع APIs في بيئة عمل عالمية مرنة.',
    requirements: [
      'خريج حديث في تخصص علوم الحاسوب أو هندسة أنظمة الحاسوب.',
      'معرفة قوية بأساسيات JavaScript/TypeScript و HTML5/CSS3.',
      'شغف عالي بالتعلم الذاتي وبناء مشاريع عملية خلال فترة الجامعة.',
      'مهارات ممتازة في التواصل وحل المشكلات.'
    ],
    applyUrl: 'https://exalt.ps/internships',
    applyEmail: 'internships@exalt.ps'
  },

  // ===================== وظائف عن بُعد (REMOTE) =====================
  {
    id: 'job-rem-01',
    title: 'مطور برمجيات Full Stack (Remote - للشرق الأوسط وفلسطين)',
    company: 'TechFlow Global',
    logo: 'globe',
    country: 'عن بُعد',
    countryCode: 'REMOTE',
    city: 'عن بُعد من أي مكان',
    field: 'تكنولوجيا ومعلومات',
    jobType: 'عن بُعد بالكامل',
    workplaceType: '100% عن بُعد',
    experienceLevel: 'متوسط إلى متقدم (3+ سنوات)',
    salaryRange: '$1,800 - $2,600 شهرياً',
    deadline: '2026-12-15',
    postedTimeAgo: 'منذ ساعتين',
    source: 'Remote Palestine / Wuzzuf',
    isHot: true,
    isNew: true,
    description: 'فرصة عمل عن بُعد بالكامل مع شركة استشارات تقنية كندية. نبحث عن مبرمج يجيد بناء الواجهات الحديثة والخوادم السحابية مع مرونة في ساعات العمل.',
    requirements: [
      'خبرة عملية في Node.js و Angular أو React.',
      'إنترنت سريع ومستقر وبيئة عمل هادئة من المنزل.',
      'إجادة ممتازة للتواصل باللغة الإنجليزية كتابة ومحادثة.'
    ],
    applyUrl: 'https://techflow-global.com/careers',
    applyEmail: 'remote-hire@techflow-global.com'
  },

  // ===================== الأردن (JORDAN) =====================
  {
    id: 'job-jo-01',
    title: 'محلل أعمال وأنظمة رقمية (Digital Business Analyst)',
    company: 'البنك العربي (Arab Bank)',
    logo: 'account_balance',
    country: 'الأردن',
    countryCode: 'JO',
    city: 'عمان - الشميساني',
    field: 'محاسبة ومالية وبنوك',
    jobType: 'دوام كامل',
    workplaceType: 'حضوري',
    experienceLevel: 'متوسط (2-4 سنوات)',
    salaryRange: '900 - 1,400 دينار أردني',
    deadline: '2026-12-08',
    postedTimeAgo: 'منذ 7 ساعات',
    source: 'بوابة التوظيف - البنك العربي',
    isHot: false,
    isNew: true,
    description: 'تحليل متطلبات الأعمال المصرفية الرقمية، وتحويلها إلى مواصفات تقنية دقيقة لفرق التطوير، وتسهيل اختبارات قبول المستخدمين (UAT) للمنصات البنكية.',
    requirements: [
      'بكالوريوس في نظم المعلومات الإدارية (MIS) أو تكنولوجيا المعلومات أو المالية.',
      'خبرة في نمذجة العمليات (BPMN) والمنهجيات الرشيقة (Agile/Scrum).',
      'مهارات تحليلية رفيعة المستوى.'
    ],
    applyUrl: 'https://www.arabbank.jo/careers',
    applyEmail: 'careers@arabbank.jo'
  },

  // ===================== الإمارات (UAE) =====================
  {
    id: 'job-ae-01',
    title: 'أخصائي ذكاء اصطناعي وتحليل بيانات (AI & Data Analyst)',
    company: 'Emirates Future Tech',
    logo: 'smart_toy',
    country: 'الإمارات',
    countryCode: 'AE',
    city: 'دبي - مدينة الإنترنت',
    field: 'تكنولوجيا ومعلومات',
    jobType: 'دوام كامل',
    workplaceType: 'هجين',
    experienceLevel: 'متوسط (3-5 سنوات)',
    salaryRange: '15,000 - 22,000 درهم إماراتي',
    deadline: '2026-12-20',
    postedTimeAgo: 'منذ 12 ساعة',
    source: 'Dubai Careers / Bayt',
    isHot: true,
    isNew: false,
    description: 'بناء وتدريب نماذج التعلم الآلي وتحليل البيانات الضخمة لدعم اتخاذ القرارات وتحسين تجربة المتعاملين في قطاع الخدمات الذكية.',
    requirements: [
      'خبرة عميقة في Python ومكتبات Pandas و Scikit-Learn و PyTorch.',
      'فهم لنماذج اللغة الكبيرة (LLMs) وتقنيات RAG.',
      'إجادة اللغة الإنجليزية بطلاقة.'
    ],
    applyUrl: 'https://careers.dubaifuture.ae',
    applyEmail: 'talent@dubai-ai.ae'
  },

  // ===================== السعودية (SAUDI ARABIA) =====================
  {
    id: 'job-sa-01',
    title: 'مدير مشاريع تقنية معتمد (IT Project Manager - PMP)',
    company: 'شركة حلول الاتصالات وتقنية المعلومات',
    logo: 'domain',
    country: 'السعودية',
    countryCode: 'SA',
    city: 'الرياض - مركز الملك عبد الله المالي',
    field: 'إدارة ومشاريع',
    jobType: 'دوام كامل',
    workplaceType: 'حضوري',
    experienceLevel: 'متقدم (+5 سنوات)',
    salaryRange: '18,000 - 26,000 ريال سعودي',
    deadline: '2026-12-18',
    postedTimeAgo: 'منذ 8 ساعات',
    source: 'بوابة جدارات / طاقات',
    isHot: true,
    isNew: true,
    description: 'إدارة مشاريع التحول الرقمي وتطوير البنى التحتية الحكومية والخاصة مع الالتزام بالجدول الزمني والميزانية ومعايير الحوكمة الوطنية.',
    requirements: [
      'شهادة إدارة المشاريع الاحترافية (PMP) أو PMI-ACP إلزامية.',
      'خبرة في إدارة المشاريع التقنية والتحول الرقمي.',
      'مهارات قيادية متميزة وإدارة فرق متعددة التخصصات.'
    ],
    applyUrl: 'https://www.solutions.com.sa/careers',
    applyEmail: 'recruitment@solutions.com.sa'
  }
];

const availableCountries = [
  { code: 'PS', name: 'فلسطين', flag: '🇵🇸', isDefault: true, cities: ['الكل', 'رام الله والبيرة', 'غزة', 'القدس الشريف', 'نابلس', 'الخليل', 'جنين', 'بيت لحم', 'طولكرم', 'قلقيلية', 'أريحا', 'روابي'] },
  { code: 'REMOTE', name: 'عن بُعد (Remote)', flag: '🌐', isDefault: false, cities: ['الكل', 'عن بُعد من أي مكان'] },
  { code: 'JO', name: 'الأردن', flag: '🇯🇴', isDefault: false, cities: ['الكل', 'عمان', 'إربد', 'الزرقاء', 'العقبة'] },
  { code: 'SA', name: 'السعودية', flag: '🇸🇦', isDefault: false, cities: ['الكل', 'الرياض', 'جدة', 'الدمام', 'الخبر'] },
  { code: 'AE', name: 'الإمارات', flag: '🇦🇪', isDefault: false, cities: ['الكل', 'دبي', 'أبوظبي', 'الشارقة'] },
  { code: 'EG', name: 'مصر', flag: '🇪🇬', isDefault: false, cities: ['الكل', 'القاهرة', 'الإسكندرية', 'الجيزة'] },
  { code: 'QA', name: 'قطر', flag: '🇶🇦', isDefault: false, cities: ['الكل', 'الدوحة', 'الوكرة'] }
];

module.exports = {
  jobsDatabase,
  availableCountries
};
