const CV = require('../models/CV');

// @desc    Get all CVs for current user
// @route   GET /api/cv
exports.getAllCVs = async (req, res) => {
  try {
    const cvs = await CV.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      count: cvs.length,
      data: cvs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في جلب السير الذاتية: ' + error.message
    });
  }
};

// @desc    Get single CV by ID
// @route   GET /api/cv/:id
exports.getCVById = async (req, res) => {
  try {
    const cv = await CV.findOne({ _id: req.params.id, userId: req.user._id });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'السيرة الذاتية غير موجودة'
      });
    }

    res.status(200).json({
      success: true,
      data: cv
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new CV
// @route   POST /api/cv
exports.createCV = async (req, res) => {
  try {
    // فحص حد الباقة المجانية: سيرة ذاتية واحدة فقط
    if (req.user.plan === 'free') {
      const existingCount = await CV.countDocuments({ userId: req.user._id });
      if (existingCount >= 1) {
        return res.status(403).json({
          success: false,
          requireUpgrade: true,
          message: 'تسمح الباقة المجانية بإنشاء سيرة ذاتية واحدة فقط. يرجى الترقية إلى باقة Pro لإنشاء عدد غير محدود من السير الذاتية!'
        });
      }
    }

    // فحص حد اللغات للباقة المجانية: العربية والإنجليزية فقط مجاناً
    if (req.user.plan === 'free' && req.body.language && !['ar', 'en'].includes(req.body.language)) {
      return res.status(403).json({
        success: false,
        requireUpgrade: true,
        message: 'تتضمن الباقة المجانية لغتي السيرة الذاتية الأساسيتين (العربية والإنجليزية). يرجى الترقية إلى باقة Pro لإنشاء سيرتك بلغات إضافية كالفرنسية والألمانية!'
      });
    }

    const initialData = {
      userId: req.user._id,
      title: req.body.title || 'سيرتي الذاتية الجديدة',
      templateId: req.body.templateId || 'modern-vibrant',
      themeColor: req.body.themeColor || '#2563eb',
      fontFamily: req.body.fontFamily || '"IBM Plex Sans Arabic", system-ui, sans-serif',
      language: req.body.language || 'ar',
      personalInfo: {
        fullName: req.body.personalInfo?.fullName || req.user.name || '',
        email: req.body.personalInfo?.email || req.user.email || '',
        jobTitle: req.body.personalInfo?.jobTitle || '',
        phone: req.body.personalInfo?.phone || '',
        address: req.body.personalInfo?.address || '',
        summary: req.body.personalInfo?.summary || '',
        avatarUrl: req.body.personalInfo?.avatarUrl || '',
        ...req.body.personalInfo
      },
      experiences: req.body.experiences || [],
      education: req.body.education || [],
      skills: req.body.skills || [],
      languages: req.body.languages || [],
      certifications: req.body.certifications || [],
      projects: req.body.projects || [],
      references: req.body.references || []
    };

    const cv = await CV.create(initialData);

    res.status(201).json({
      success: true,
      data: cv
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في إنشاء السيرة الذاتية: ' + error.message
    });
  }
};

// @desc    Update CV
// @route   PUT /api/cv/:id
exports.updateCV = async (req, res) => {
  try {
    let cv = await CV.findOne({ _id: req.params.id, userId: req.user._id });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'السيرة الذاتية غير موجودة أو ليس لديك صلاحية تعديلها'
      });
    }

    // فحص حد اللغات للباقة المجانية عند التعديل
    if (req.user.plan === 'free' && req.body.language && !['ar', 'en'].includes(req.body.language)) {
      return res.status(403).json({
        success: false,
        requireUpgrade: true,
        message: 'تتضمن الباقة المجانية لغتي السيرة الذاتية الأساسيتين (العربية والإنجليزية). يرجى الترقية إلى باقة Pro لإنشاء سيرتك بلغات إضافية كالفرنسية والألمانية!'
      });
    }

    cv = await CV.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: cv
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في تحديث السيرة الذاتية: ' + error.message
    });
  }
};

// @desc    Delete CV
// @route   DELETE /api/cv/:id
exports.deleteCV = async (req, res) => {
  try {
    const cv = await CV.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: 'السيرة الذاتية غير موجودة'
      });
    }

    res.status(200).json({
      success: true,
      message: 'تم حذف السيرة الذاتية بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Duplicate CV
// @route   POST /api/cv/:id/duplicate
exports.duplicateCV = async (req, res) => {
  try {
    // فحص حد الباقة المجانية: سيرة ذاتية واحدة فقط
    if (req.user.plan === 'free') {
      const existingCount = await CV.countDocuments({ userId: req.user._id });
      if (existingCount >= 1) {
        return res.status(403).json({
          success: false,
          requireUpgrade: true,
          message: 'تسمح الباقة المجانية بإنشاء سيرة ذاتية واحدة فقط. قم بالترقية إلى باقة Pro لتكرار وإنشاء عدد غير محدود من السير الذاتية!'
        });
      }
    }

    const originalCV = await CV.findOne({ _id: req.params.id, userId: req.user._id });

    if (!originalCV) {
      return res.status(404).json({
        success: false,
        message: 'السيرة الذاتية الأصلية غير موجودة'
      });
    }

    const cvObj = originalCV.toObject();
    delete cvObj._id;
    delete cvObj.createdAt;
    delete cvObj.updatedAt;

    cvObj.title = `${originalCV.title} (نسخة)`;
    const newCV = await CV.create(cvObj);

    res.status(201).json({
      success: true,
      data: newCV
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
