const { parseResumeBuffer, enhanceResumeText } = require('../services/aiParser.service');
const User = require('../models/User');

// @desc    Parse uploaded resume file using AI
// @route   POST /api/ai/parse-resume
exports.parseResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check credits if on free plan
    if (user.plan === 'free' && user.aiCredits <= 0) {
      return res.status(403).json({
        success: false,
        message: 'لقد استنفدت رصيدك المجاني من عمليات التحليل بالذكاء الاصطناعي. يرجى الترقية إلى باقة Pro أو شراء رصيد إضافي.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إرفاق ملف السيرة الذاتية (PDF أو نص)'
      });
    }

    const parsedData = await parseResumeBuffer(req.file.buffer, req.file.mimetype);

    // Deduct 1 credit if on free plan
    if (user.plan === 'free') {
      user.aiCredits = Math.max(0, user.aiCredits - 1);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'تم تحليل السيرة الذاتية واستخراج البيانات بنجاح بواسطة الذكاء الاصطناعي!',
      remainingCredits: user.aiCredits,
      data: parsedData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل في تحليل السيرة الذاتية: ' + error.message
    });
  }
};

// @desc    Enhance text / bullet points using AI
// @route   POST /api/ai/enhance-text
exports.enhanceText = async (req, res) => {
  try {
    const { text, type } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'يرجى تقديم النص المراد تحسينه'
      });
    }

    const enhanced = await enhanceResumeText(text, type || 'summary');

    res.status(200).json({
      success: true,
      data: {
        original: text,
        enhanced
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'فشل تحسين النص: ' + error.message
    });
  }
};
