export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  avatarUrl?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  grade?: string;
  description?: string;
}

export interface Skill {
  id?: string;
  name: string;
  level: string; // مبتدئ, متوسط, متقدم, خبير
}

export interface Language {
  id?: string;
  name: string;
  proficiency: string; // أساسي, جيد, طلاقة, اللغة الأم
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  link?: string;
}

export interface Reference {
  id?: string;
  name: string;
  jobTitle: string;
  company: string;
  email?: string;
  phone?: string;
}

export interface CanvaElement {
  id?: string;
  type: 'qr' | 'signature' | 'badge' | 'customText';
  label: string;
  value?: string;
  position?: 'top' | 'bottom' | 'sidebar';
}

export interface CV {
  _id?: string;
  title: string;
  templateId: 'modern-vibrant' | 'executive-slate' | 'minimal-clean' | 'creative-indigo' | 'tech-developer' | 'classic-ivy' | 'golden-prestige' | string;
  themeColor: string;
  fontFamily: string;
  language?: 'ar' | 'en' | 'fr' | 'de' | 'es' | 'tr' | string;
  isPublic?: boolean;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  references?: Reference[];
  sectionOrder?: string[];
  canvaElements?: CanvaElement[];
  customFontSize?: number;
  createdAt?: string;
  updatedAt?: string;
}
