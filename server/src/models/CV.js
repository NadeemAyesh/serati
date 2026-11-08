const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'سيرتي الذاتية الجديدة'
  },
  templateId: {
    type: String,
    default: 'modern-vibrant'
  },
  themeColor: {
    type: String,
    default: '#2563eb' // Default modern blue
  },
  fontFamily: {
    type: String,
    default: '"IBM Plex Sans Arabic", system-ui, sans-serif'
  },
  language: {
    type: String,
    enum: ['ar', 'en', 'fr', 'de', 'es', 'tr'],
    default: 'ar'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // 1. البيانات الشخصية
  personalInfo: {
    fullName: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    summary: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    website: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' }
  },

  // 2. الخبرات الوظيفية
  experiences: [{
    company: { type: String, default: '' },
    position: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, default: '' }
  }],

  // 3. البيانات التعليمية
  education: [{
    institution: { type: String, default: '' },
    degree: { type: String, default: '' },
    fieldOfStudy: { type: String, default: '' },
    graduationYear: { type: String, default: '' },
    grade: { type: String, default: '' },
    description: { type: String, default: '' }
  }],

  // 4. المهارات
  skills: [{
    name: { type: String, default: '' },
    level: { type: String, default: 'متقدم' }
  }],

  // 5. اللغات
  languages: [{
    name: { type: String, default: '' },
    proficiency: { type: String, default: 'طلاقة' }
  }],

  // 6. الشهادات والدورات
  certifications: [{
    name: { type: String, default: '' },
    issuer: { type: String, default: '' },
    issueDate: { type: String, default: '' },
    credentialUrl: { type: String, default: '' }
  }],

  // 7. المشاريع والإنجازات
  projects: [{
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    link: { type: String, default: '' }
  }],

  // 8. المراجع المهنية
  references: [{
    name: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    company: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' }
  }],

  // 9. ميزات محرر كانفا البصري (Canva Studio Pro)
  sectionOrder: [{ type: String }],
  canvaElements: [{
    type: { type: String },
    label: { type: String, default: '' },
    value: { type: String, default: '' },
    position: { type: String, default: 'bottom' }
  }],
  customFontSize: { type: Number, default: 14 }
}, {
  timestamps: true
});

module.exports = mongoose.model('CV', cvSchema);
