const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالدخول، يرجى تسجيل الدخول أولاً'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seerati_super_secret_jwt_key_2026_modern_cv');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم المرتبط بهذا الحساب لم يعد موجوداً'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'رمز التحقق غير صالح أو انتهت صلاحيته'
    });
  }
};

module.exports = { protect };
