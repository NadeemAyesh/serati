const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'يرجى إدخال الاسم الكامل'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'يرجى إدخال البريد الإلكتروني'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'صيغة البريد الإلكتروني غير صحيحة']
  },
  password: {
    type: String,
    required: [true, 'يرجى إدخال كلمة المرور'],
    minlength: 6,
    select: false
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  aiCredits: {
    type: Number,
    default: 3 // 3 free AI resume parsings for testing
  },
  subscriptionExpiresAt: {
    type: Date,
    default: null
  },
  purchasedTemplates: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
