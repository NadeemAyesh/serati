const { jobsDatabase, availableCountries } = require('../data/jobs.data');

// @desc    استرجاع قائمة الوظائف حسب الدولة والتخصص والمدينة
// @route   GET /api/jobs
exports.getJobs = (req, res) => {
  try {
    const { country, city, field, search, jobType, experience } = req.query;

    let filtered = [...jobsDatabase];

    // تصفية حسب الدولة (الافتراضي هو فلسطين إذا لم يُحدد)
    const targetCountry = (country || 'فلسطين').trim().toLowerCase();
    if (targetCountry && targetCountry !== 'all' && targetCountry !== 'الكل') {
      filtered = filtered.filter(j => 
        j.country.toLowerCase().includes(targetCountry) ||
        (j.countryCode && j.countryCode.toLowerCase() === targetCountry) ||
        (targetCountry.includes('palestine') && j.country === 'فلسطين') ||
        (targetCountry.includes('remote') && (j.country.includes('عن بُعد') || j.countryCode === 'REMOTE'))
      );
    }

    // تصفية حسب المدينة
    if (city && city !== 'all' && city !== 'الكل') {
      filtered = filtered.filter(j => j.city.toLowerCase().includes(city.toLowerCase()));
    }

    // تصفية حسب المجال / التخصص
    if (field && field !== 'all' && field !== 'الكل') {
      filtered = filtered.filter(j => j.field.toLowerCase().includes(field.toLowerCase()));
    }

    // تصفية حسب نوع الدوام
    if (jobType && jobType !== 'all' && jobType !== 'الكل') {
      filtered = filtered.filter(j => j.jobType.toLowerCase().includes(jobType.toLowerCase()));
    }

    // تصفية حسب الخبرة
    if (experience && experience !== 'all' && experience !== 'الكل') {
      filtered = filtered.filter(j => j.experienceLevel.toLowerCase().includes(experience.toLowerCase()));
    }

    // البحث بالكلمات المفتاحية
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.city.toLowerCase().includes(q) ||
        j.field.toLowerCase().includes(q) ||
        j.requirements.some(r => r.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      country: targetCountry,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في استرجاع الوظائف: ' + error.message
    });
  }
};

// @desc    استرجاع أحدث الوظائف المنشورة للبوت (Real-time Polling)
// @route   GET /api/jobs/latest
exports.getLatestJobs = (req, res) => {
  try {
    const { country = 'فلسطين', limit = 4 } = req.query;
    const targetCountry = country.trim().toLowerCase();

    let list = jobsDatabase.filter(j => 
      j.country.toLowerCase().includes(targetCountry) ||
      (targetCountry.includes('palestine') && j.country === 'فلسطين')
    );

    if (list.length === 0) {
      list = jobsDatabase;
    }

    // Sort to prioritize hot / new
    const sorted = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    const recent = sorted.slice(0, Number(limit));

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      count: recent.length,
      data: recent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في استرجاع أحدث الوظائف: ' + error.message
    });
  }
};

// @desc    قائمة الدول المدعومة مع إحصائيات الوظائف لكل دولة
// @route   GET /api/jobs/countries
exports.getCountries = (req, res) => {
  try {
    const result = availableCountries.map(c => {
      const jobCount = jobsDatabase.filter(j => 
        j.countryCode === c.code || 
        j.country.includes(c.name)
      ).length;
      return {
        ...c,
        jobCount
      };
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في استرجاع قائمة الدول: ' + error.message
    });
  }
};

// @desc    تفاصيل وظيفة محددة
// @route   GET /api/jobs/:id
exports.getJobById = (req, res) => {
  try {
    const job = jobsDatabase.find(j => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'الوظيفة غير موجودة'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في استرجاع بيانات الوظيفة: ' + error.message
    });
  }
};

// @desc    محادثة تفاعلية ذكية مع بوت الوظائف (AI Job Scout Bot)
// @route   POST /api/jobs/bot-ask
exports.askJobBot = async (req, res) => {
  try {
    const { message, country = 'فلسطين', userProfile } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إرسال استفسار أو سؤال للبوت'
      });
    }

    const query = message.trim().toLowerCase();
    const currentCountry = country.trim();

    // 1. تصفية أولية حسب الدولة المطلوبة
    let pool = jobsDatabase.filter(j => 
      j.country.toLowerCase().includes(currentCountry.toLowerCase()) ||
      (currentCountry.includes('فلسطين') && j.country === 'فلسطين') ||
      (currentCountry.includes('عن بُعد') && j.countryCode === 'REMOTE')
    );

    if (pool.length === 0) pool = [...jobsDatabase];

    // 2. البحث الذكي عن الكلمات الدلالية والتخصصات
    let matchedJobs = [];
    let botReply = '';
    let quickActions = [];

    // مطابقة التخصصات
    if (query.includes('محاسب') || query.includes('بنك') || query.includes('مالي') || query.includes('تدقيق') || query.includes('ائتمان')) {
      matchedJobs = pool.filter(j => j.field.includes('محاسبة') || j.title.includes('محاسب') || j.company.includes('بنك'));
      botReply = `وجدت لك شواغر ممتازة في القطاع المصرفي والمالي في ${currentCountry}. البنوك والشركات الكبرى تبحث حالياً عن كفاءات محاسبية وإدارية. يمكنك الاطلاع عليها مباشرة أدناه:`;
      quickActions = ['أسئلة مقابلات البنوك', 'امتحان الكفايات المصرفية', 'وظائف بنك فلسطين'];
    } else if (query.includes('برمج') || query.includes('كود') || query.includes('تكنول') || query.includes('حاسوب') || query.includes('it') || query.includes('angular') || query.includes('node') || query.includes('مطور')) {
      matchedJobs = pool.filter(j => j.field.includes('تكنولوجيا') || j.title.toLowerCase().includes('engineer') || j.title.includes('برمج') || j.title.includes('مطور'));
      botReply = `ممتاز! قطاع التكنولوجيا في ${currentCountry} وعن بُعد يشهد طلباً متزايداً على مطوري البرمجيات والأنظمة السحابية والشبكات. إليك أبرز الفرص المناسبة:`;
      quickActions = ['أسئلة مقابلات البرمجة', 'امتحان هندسة البرمجيات', 'وظائف عن بُعد'];
    } else if (query.includes('أونروا') || query.includes('unrwa') || query.includes('منظم') || query.includes('إغاث') || query.includes('دولية') || query.includes('ngo')) {
      matchedJobs = pool.filter(j => j.company.includes('UNRWA') || j.field.includes('منظمات'));
      botReply = `إليك أحدث الوظائف والمشاريع الإنسانية لدى وكالة الغوث (الأونروا) والمؤسسات الدولية في ${currentCountry}. تأكد من مراجعة معايير الحيادية ومدونة السلوك قبل التقديم:`;
      quickActions = ['أسئلة مقابلات الأونروا', 'امتحان الكفايات التربوية', 'وظائف القدس والضفة'];
    } else if (query.includes('تدريب') || query.includes('خريج') || query.includes('جديد') || query.includes('بدون خبرة') || query.includes('intern')) {
      matchedJobs = pool.filter(j => j.jobType.includes('تدريب') || j.experienceLevel.includes('حديث'));
      botReply = `أهلاً بك! لدينا برامج تدريبية منتهية بالتوظيف ووظائف مخصصة لحديثي التخرج في ${currentCountry} بدون اشتراط سنوات خبرة سابقة:`;
      quickActions = ['نصائح للمقابلات الأولى', 'بناء سيرة ATS لحديثي التخرج', 'وظائف رام الله'];
    } else if (query.includes('تعليم') || query.includes('معلم') || query.includes('مدرس') || query.includes('مدرسة')) {
      matchedJobs = pool.filter(j => j.field.includes('تعليم') || j.title.includes('معلم'));
      botReply = `تفضل، هذه أحدث الشواغر التعليمية والتربوية المتاحة في المدارس والمؤسسات الأكاديمية في ${currentCountry}:`;
      quickActions = ['امتحان كفايات التعليم بالأونروا', 'أسئلة المقابلات التربوية'];
    } else if (query.includes('صحة') || query.includes('تمريض') || query.includes('مستشفى') || query.includes('طبيب')) {
      matchedJobs = pool.filter(j => j.field.includes('صحة') || j.title.includes('ممرض') || j.company.includes('مستشفى'));
      botReply = `هذه أحدث الوظائف الصحية والتمريضية في المستشفيات والمراكز الطبية في ${currentCountry}:`;
      quickActions = ['وظائف المستشفى الاستشاري', 'نصائح مقابلات القطاع الطبي'];
    } else if (query.includes('اليوم') || query.includes('أحدث') || query.includes('جديد') || query.includes('الآن')) {
      matchedJobs = pool.slice(0, 4);
      botReply = `هذه أحدث الوظائف التي تم رصدها ونشرها اليوم في ${currentCountry}:`;
      quickActions = ['وظائف تكنولوجيا', 'وظائف بنوك ومحاسبة', 'وظائف حديثي التخرج'];
    } else {
      // بحث عام
      matchedJobs = pool.filter(j => 
        j.title.toLowerCase().includes(query) ||
        j.city.toLowerCase().includes(query) ||
        j.company.toLowerCase().includes(query) ||
        j.field.toLowerCase().includes(query)
      );

      if (matchedJobs.length === 0) {
        matchedJobs = pool.slice(0, 3);
        botReply = `لقد بحثت في قاعدة بيانات الوظائف في ${currentCountry}. إليك أبرز الوظائف الأكثر طلباً حالياً ويمكنك تخصيص بحثك عبر اختيار تخصصك أو مدينتك:`;
      } else {
        botReply = `وجدت لك ${matchedJobs.length} فرصة عمل تتطابق مع بحثك في ${currentCountry}:`;
      }
      quickActions = ['وظائف رام الله', 'وظائف نابلس', 'وظائف الأونروا', 'وظائف عن بُعد'];
    }

    res.status(200).json({
      success: true,
      botReply,
      matchedJobsCount: matchedJobs.length,
      matchedJobs: matchedJobs.slice(0, 5),
      quickActions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في استجابة بوت الوظائف: ' + error.message
    });
  }
};
