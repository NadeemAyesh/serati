const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'seerati_super_secret_jwt_key_2026_modern_cv', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'يرجى تقديم جميع الحقول المطلوبة (الاسم، البريد، كلمة المرور)'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل بالفعل، يمكنك تسجيل الدخول'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      plan: 'free',
      aiCredits: 3
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        aiCredits: user.aiCredits
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم أثناء التسجيل: ' + error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الاعتماد غير صحيحة'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الاعتماد غير صحيحة'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        aiCredits: user.aiCredits,
        purchasedTemplates: user.purchasedTemplates
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم أثناء تسجيل الدخول: ' + error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        aiCredits: user.aiCredits,
        purchasedTemplates: user.purchasedTemplates,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upgrade Plan / Add Credits
// @route   POST /api/auth/upgrade
exports.upgradePlan = async (req, res) => {
  try {
    const { plan, addCredits, templateId } = req.body;
    const user = await User.findById(req.user.id);

    if (plan && ['free', 'pro', 'enterprise'].includes(plan)) {
      user.plan = plan;
      if (plan === 'pro') {
        user.aiCredits += 25; // add 25 credits with pro plan
        user.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      }
    }

    if (addCredits && typeof addCredits === 'number') {
      user.aiCredits += addCredits;
    }

    if (templateId && !user.purchasedTemplates.includes(templateId)) {
      user.purchasedTemplates.push(templateId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'تم تحديث خطتك بنجاح!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        aiCredits: user.aiCredits,
        purchasedTemplates: user.purchasedTemplates
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
