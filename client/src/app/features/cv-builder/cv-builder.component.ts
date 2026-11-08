import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CvService } from '../../core/services/cv.service';
import { AuthService } from '../../core/services/auth.service';
import { AiService } from '../../core/services/ai.service';
import { AlertService } from '../../core/services/alert.service';
import { CV, Experience, Education, Skill, Language, Certification, Project, Reference } from '../../core/models/cv.model';
import { AVAILABLE_TEMPLATES, TemplateInfo } from '../../core/models/template.model';
import { AVAILABLE_CV_FONTS, CvFontOption } from '../../core/models/font.model';
import { AVAILABLE_CV_LANGUAGES, CVLanguage, getCVSectionLabels, CVSectionLabels, getCVBuilderUI, CVBuilderUI } from '../../core/models/language.model';

@Component({
  selector: 'app-cv-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-100 flex flex-col font-sans" [attr.dir]="isRtl ? 'rtl' : 'ltr'">
      
      <!-- Top Action Bar (شريط التحكم العلوي) -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-sm no-print">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <!-- اليمين: زر الرجوع وعنوان السيرة -->
          <div class="flex items-center gap-3">
            <a routerLink="/dashboard" class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer" [title]="ui.backToDashboard">
              <span class="material-symbols-rounded text-xl">{{ isRtl ? 'arrow_forward' : 'arrow_back' }}</span>
            </a>
            <div>
              <input 
                type="text" 
                [(ngModel)]="cv.title" 
                (blur)="saveCV(false)"
                class="text-base sm:text-lg font-black text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none px-1"
                [placeholder]="isRtl ? 'اسم السيرة الذاتية' : 'Resume Title'"
              >
              <div class="text-[11px] text-slate-400 font-semibold flex items-center gap-2">
                <span *ngIf="isSaving" class="text-blue-600">{{ ui.saving }}</span>
                <span *ngIf="!isSaving && lastSaved">{{ ui.saved }} ({{ lastSaved | date:'shortTime' }})</span>
              </div>
            </div>
          </div>

          <!-- الوسط: معرض القوالب والثيمات والخطوط -->
          <div class="flex flex-wrap items-center gap-2.5">
            
            <!-- زر فتح معرض القوالب الاحترافي الكامل -->
            <button 
              (click)="showGalleryModal = true"
              class="btn bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs py-2 px-3.5 shadow-md shadow-indigo-500/20 font-bold flex items-center gap-1.5 rounded-xl transition-all cursor-pointer"
            >
              <span class="material-symbols-rounded text-base">palette</span>
              <span>{{ ui.templatesGallery }} ({{ templates.length }})</span>
              <span class="text-[10px] bg-white/25 px-1.5 py-0.5 rounded-full font-mono">{{ getTemplateName(cv.templateId) }}</span>
            </button>

            <!-- زر اختيار خط السيرة الذاتية التفاعلي -->
            <button 
              (click)="showFontModal = true"
              class="btn bg-white hover:bg-slate-50 text-slate-800 text-xs py-2 px-3 border border-slate-200/90 rounded-xl shadow-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              [title]="ui.fontFamily"
            >
              <span class="material-symbols-rounded text-base text-indigo-600">font_download</span>
              <span class="text-slate-500 hidden sm:inline">{{ ui.fontFamily }}:</span>
              <span class="text-indigo-700 font-black bg-indigo-50/90 px-2 py-0.5 rounded-lg border border-indigo-200/80 shadow-2xs flex items-center gap-1.5" [style.fontFamily]="cv.fontFamily">
                <span>{{ getSelectedFontName() }}</span>
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </span>
              <span class="material-symbols-rounded text-base text-slate-400">expand_more</span>
            </button>

            <!-- محدد لغة السيرة الذاتية (عربي / English / المزيد Pro) -->
            <div class="inline-flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/90 shadow-2xs">
              <button 
                (click)="setLanguage('ar')" 
                [class.bg-white]="(cv.language || 'ar') === 'ar'"
                [class.shadow-xs]="(cv.language || 'ar') === 'ar'"
                [class.font-black]="(cv.language || 'ar') === 'ar'"
                [class.text-blue-700]="(cv.language || 'ar') === 'ar'"
                [class.text-slate-600]="(cv.language || 'ar') !== 'ar'"
                class="text-xs py-1 px-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                title="السيرة الذاتية باللغة العربية (RTL)"
              >
                <span>عربي</span>
              </button>

              <button 
                (click)="setLanguage('en')" 
                [class.bg-white]="cv.language === 'en'"
                [class.shadow-xs]="cv.language === 'en'"
                [class.font-black]="cv.language === 'en'"
                [class.text-blue-700]="cv.language === 'en'"
                [class.text-slate-600]="cv.language !== 'en'"
                class="text-xs py-1 px-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-mono"
                title="English CV (LTR)"
              >
                <span>EN</span>
              </button>

              <button 
                (click)="showLanguageModal = true"
                class="text-[11px] py-1 px-2 rounded-lg text-amber-700 hover:bg-amber-100/70 transition-all cursor-pointer flex items-center gap-0.5 font-bold"
                title="إضافة لغات أخرى كـ الفرنسية والألمانية (Pro)"
              >
                <span class="material-symbols-rounded text-xs text-amber-500">add</span>
                <span class="hidden sm:inline">{{ isRtl ? 'لغة' : 'Lang' }}</span>
                <span class="material-symbols-rounded text-xs text-amber-600">workspace_premium</span>
              </button>
            </div>

            <!-- مغير ألوان الثيم الـ 8 -->
            <div class="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <button 
                *ngFor="let color of themeColors" 
                (click)="setColor(color)"
                [style.backgroundColor]="color"
                [class.ring-2]="cv.themeColor === color"
                class="w-4 h-4 sm:w-5 sm:h-5 rounded-full ring-offset-2 ring-slate-400 transition-transform hover:scale-110 cursor-pointer"
              ></button>
            </div>

          </div>

          <!-- اليسار: أزرار الذكاء الاصطناعي والحفظ والتحميل -->
          <div class="flex items-center gap-2">
            
            <!-- زر تفعيل محرر كانفا البصري (Canva Mode) المدفوع -->
            <button 
              (click)="toggleCanvaMode()"
              [class.bg-gradient-to-r]="!isCanvaMode"
              [class.from-purple-600]="!isCanvaMode"
              [class.to-indigo-600]="!isCanvaMode"
              [class.text-white]="!isCanvaMode"
              [class.bg-purple-100]="isCanvaMode"
              [class.text-purple-900]="isCanvaMode"
              [class.border-purple-300]="isCanvaMode"
              class="btn text-xs py-2 px-3.5 shadow-sm font-bold flex items-center gap-1.5 rounded-xl border transition-all cursor-pointer"
              [title]="ui.canvaStudio"
            >
              <span class="material-symbols-rounded text-base">brush</span>
              <span>{{ ui.canvaStudio }}</span>
              <span *ngIf="!isCanvaMode" class="text-[9px] bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full font-black shadow-xs flex items-center gap-0.5">
                <span class="material-symbols-rounded text-[10px]">workspace_premium</span>
                <span>PRO</span>
              </span>
              <span *ngIf="isCanvaMode" class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </button>

            <!-- زر مساعد الذكاء الاصطناعي -->
            <button 
              (click)="showAiModal = true"
              class="btn btn-ai text-xs py-2 px-3 shadow-sm flex items-center gap-1.5 cursor-pointer"
              title="AI Assistant"
            >
              <span class="material-symbols-rounded text-sm">auto_awesome</span>
              <span>AI</span>
            </button>

            <!-- زر الحفظ اليدوي -->
            <button 
              (click)="saveCV(true)"
              class="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-rounded text-sm">save</span>
              <span>{{ ui.saveCV }}</span>
            </button>

            <!-- زر التصدير PDF والطباعة -->
            <button 
              (click)="exportPDF()"
              class="btn btn-primary text-xs py-2 px-4 shadow-md shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-rounded text-base">download</span>
              <span>{{ ui.exportPdf }}</span>
            </button>

          </div>

        </div>
      </header>

      <!-- Main Split Area: Left (Form Editor) | Right (Live Preview) -->
      <div class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- ==================== المحرر الأيسر (Multi-Section Form Editor) ==================== -->
        <div class="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 no-print">
          
          <!-- التبويبات العلوية للأقسام (Section Tabs) -->
          <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-100 scrollbar-none">
            <button 
              (click)="activeSection = 'personal'"
              [class.bg-blue-600]="activeSection === 'personal'"
              [class.text-white]="activeSection === 'personal'"
              [class.bg-slate-100]="activeSection !== 'personal'"
              [class.text-slate-600]="activeSection !== 'personal'"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-rounded text-sm">person</span>
              <span>{{ ui.tabs.personal }}</span>
            </button>

            <button 
              (click)="activeSection = 'experience'"
              [class.bg-blue-600]="activeSection === 'experience'"
              [class.text-white]="activeSection === 'experience'"
              [class.bg-slate-100]="activeSection !== 'experience'"
              [class.text-slate-600]="activeSection !== 'experience'"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-rounded text-sm">work</span>
              <span>{{ ui.tabs.experience }} ({{ cv.experiences?.length || 0 }})</span>
            </button>

            <button 
              (click)="activeSection = 'education'"
              [class.bg-blue-600]="activeSection === 'education'"
              [class.text-white]="activeSection === 'education'"
              [class.bg-slate-100]="activeSection !== 'education'"
              [class.text-slate-600]="activeSection !== 'education'"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-rounded text-sm">school</span>
              <span>{{ ui.tabs.education }} ({{ cv.education?.length || 0 }})</span>
            </button>

            <button 
              (click)="activeSection = 'skills'"
              [class.bg-blue-600]="activeSection === 'skills'"
              [class.text-white]="activeSection === 'skills'"
              [class.bg-slate-100]="activeSection !== 'skills'"
              [class.text-slate-600]="activeSection !== 'skills'"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-rounded text-sm">psychology</span>
              <span>{{ ui.tabs.skills }}</span>
            </button>

            <button 
              (click)="activeSection = 'certifications'"
              [class.bg-blue-600]="activeSection === 'certifications'"
              [class.text-white]="activeSection === 'certifications'"
              [class.bg-slate-100]="activeSection !== 'certifications'"
              [class.text-slate-600]="activeSection !== 'certifications'"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-rounded text-sm">verified</span>
              <span>{{ ui.tabs.certifications }}</span>
            </button>

            <button 
              (click)="activeSection = 'projects'"
              [class.bg-blue-600]="activeSection === 'projects'"
              [class.text-white]="activeSection === 'projects'"
              [class.bg-slate-100]="activeSection !== 'projects'"
              [class.text-slate-600]="activeSection !== 'projects'"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-rounded text-sm">code</span>
              <span>{{ ui.tabs.projects }} ({{ cv.projects?.length || 0 }})</span>
            </button>

            <button 
              (click)="activeSection = 'references'"
              [class.bg-blue-600]="activeSection === 'references'"
              [class.text-white]="activeSection === 'references'"
              [class.bg-slate-100]="activeSection !== 'references'"
              [class.text-slate-600]="activeSection !== 'references'"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-rounded text-sm">groups</span>
              <span>{{ ui.tabs.references }} ({{ cv.references?.length || 0 }})</span>
            </button>
          </div>

          <!-- ==================== 1. قسم البيانات الشخصية ==================== -->
          <div *ngIf="activeSection === 'personal'" class="space-y-5 animate-fade-in">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-black text-slate-800">{{ ui.personal.title }}</h3>
              <span class="text-xs text-slate-400">{{ ui.personal.step }}</span>
            </div>

            <!-- بطاقة رفع الصورة الشخصية (Profile Photo Card) -->
            <div class="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 flex flex-col sm:flex-row items-center gap-5">
              
              <!-- المعاينة الحالية للصورة -->
              <div class="relative group flex-shrink-0">
                <div *ngIf="cv.personalInfo.avatarUrl" class="w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-md">
                  <img [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-full h-full object-cover">
                </div>
                
                <div *ngIf="!cv.personalInfo.avatarUrl" class="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-blue-300 flex flex-col items-center justify-center text-blue-500 shadow-xs">
                  <span class="material-symbols-rounded text-3xl">account_circle</span>
                  <span class="text-[10px] font-bold text-slate-500 mt-1">{{ isRtl ? 'بدون صورة' : 'No Photo' }}</span>
                </div>

                <span *ngIf="cv.personalInfo.avatarUrl" class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs border-2 border-white">
                  <span class="material-symbols-rounded text-xs">check</span>
                </span>
              </div>

              <!-- أزرار الإجراء والنصوص التوضيحية -->
              <div class="flex-1 text-center" [class.sm:text-right]="isRtl" [class.sm:text-left]="!isRtl">
                <div class="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h4 class="text-sm font-black text-slate-800">{{ ui.personal.photoTitle }}</h4>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{{ isRtl ? 'اختياري' : 'Optional' }}</span>
                </div>
                <p class="text-xs text-slate-500 mb-3 leading-relaxed">
                  {{ ui.personal.photoDesc }}
                </p>

                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <input #photoFileInput type="file" accept="image/*" (change)="onPhotoSelected($event)" class="hidden">
                  
                  <button 
                    type="button"
                    (click)="photoFileInput.click()" 
                    class="btn btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span class="material-symbols-rounded text-sm">photo_camera</span>
                    <span>{{ cv.personalInfo.avatarUrl ? ui.personal.changePhoto : ui.personal.uploadPhoto }}</span>
                  </button>

                  <button 
                    *ngIf="cv.personalInfo.avatarUrl"
                    type="button"
                    (click)="removePhoto()" 
                    class="btn bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span class="material-symbols-rounded text-sm">delete</span>
                    <span>{{ ui.personal.removePhoto }}</span>
                  </button>
                </div>
              </div>

            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">{{ ui.personal.fullName }} *</label>
                <input type="text" [(ngModel)]="cv.personalInfo.fullName" class="form-control" [placeholder]="ui.personal.fullNamePlaceholder">
              </div>

              <div class="form-group">
                <label class="form-label">{{ ui.personal.jobTitle }} *</label>
                <input type="text" [(ngModel)]="cv.personalInfo.jobTitle" class="form-control" [placeholder]="ui.personal.jobTitlePlaceholder">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">{{ ui.personal.email }} *</label>
                <input type="email" [(ngModel)]="cv.personalInfo.email" class="form-control" placeholder="example@email.com">
              </div>

              <div class="form-group">
                <label class="form-label">{{ ui.personal.phone }} *</label>
                <input type="text" [(ngModel)]="cv.personalInfo.phone" class="form-control" placeholder="+970 59 000 0000">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">{{ ui.personal.address }}</label>
              <input type="text" [(ngModel)]="cv.personalInfo.address" class="form-control" [placeholder]="isRtl ? 'فلسطين - رام الله' : 'City, Country'">
            </div>

            <div class="form-group">
              <div class="flex items-center justify-between mb-1">
                <label class="form-label mb-0">{{ ui.personal.summary }}</label>
                <button 
                  (click)="enhanceSummary()" 
                  [disabled]="isEnhancing"
                  class="text-[11px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span class="material-symbols-rounded text-xs">auto_awesome</span>
                  <span>{{ isEnhancing ? ui.personal.aiEnhancing : ui.personal.aiEnhance }}</span>
                </button>
              </div>
              <textarea 
                [(ngModel)]="cv.personalInfo.summary" 
                rows="4" 
                class="form-control" 
                [placeholder]="ui.personal.summaryPlaceholder"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div class="form-group">
                <label class="form-label text-xs">LinkedIn</label>
                <input type="text" [(ngModel)]="cv.personalInfo.linkedin" class="form-control text-xs" placeholder="linkedin.com/in/username">
              </div>
              <div class="form-group">
                <label class="form-label text-xs">GitHub</label>
                <input type="text" [(ngModel)]="cv.personalInfo.github" class="form-control text-xs" placeholder="github.com/username">
              </div>
              <div class="form-group">
                <label class="form-label text-xs">{{ ui.personal.website }}</label>
                <input type="text" [(ngModel)]="cv.personalInfo.website" class="form-control text-xs" placeholder="https://mywebsite.com">
              </div>
            </div>

            <div class="pt-4 flex justify-end">
              <button (click)="activeSection = 'experience'" class="btn btn-primary text-xs py-2 px-5 flex items-center gap-1.5 cursor-pointer">
                <span>{{ isRtl ? 'التالي: الخبرات الوظيفية' : 'Next: Work Experience' }}</span>
                <span class="material-symbols-rounded text-base">{{ isRtl ? 'arrow_back' : 'arrow_forward' }}</span>
              </button>
            </div>
          </div>

          <!-- ==================== 2. قسم الخبرات الوظيفية ==================== -->
          <div *ngIf="activeSection === 'experience'" class="space-y-6 animate-fade-in">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-black text-slate-800">{{ ui.experience.title }}</h3>
                <p class="text-xs text-slate-400">{{ isRtl ? 'أضف وظائفك السابقة بدءاً من الأحدث' : 'Add your career positions starting from the most recent' }}</p>
              </div>
              <button (click)="addExperience()" class="btn btn-outline-primary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-rounded text-xs">add</span>
                <span>{{ ui.experience.addBtn }}</span>
              </button>
            </div>

            <div *ngIf="!cv.experiences || cv.experiences.length === 0" class="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p class="text-xs text-slate-500 font-semibold mb-3">{{ ui.experience.noItems }}</p>
              <button (click)="addExperience()" class="btn btn-primary text-xs py-1.5 px-4 flex items-center gap-1 mx-auto cursor-pointer">
                <span class="material-symbols-rounded text-xs">add</span>
                <span>{{ ui.experience.addBtn }}</span>
              </button>
            </div>

            <div *ngFor="let exp of cv.experiences; let i = index" class="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4 relative">
              <button (click)="removeExperience(i)" class="absolute top-4" [class.left-4]="isRtl" [class.right-4]="!isRtl" class="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer" [title]="ui.experience.delete">
                <span class="material-symbols-rounded text-sm">delete</span>
                <span>{{ isRtl ? 'حذف' : 'Delete' }}</span>
              </button>

              <div class="font-bold text-slate-700 text-sm">{{ isRtl ? 'وظيفة #' : 'Position #' }}{{ i + 1 }}</div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.experience.position }} *</label>
                  <input type="text" [(ngModel)]="exp.position" class="form-control text-xs" [placeholder]="isRtl ? 'مثال: مطور برمجيات أول' : 'e.g. Senior Software Engineer'">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.experience.company }} *</label>
                  <input type="text" [(ngModel)]="exp.company" class="form-control text-xs" [placeholder]="isRtl ? 'مثال: شركة الحلول المتقدمة' : 'e.g. Acme Corporation'">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.experience.location }}</label>
                  <input type="text" [(ngModel)]="exp.location" class="form-control text-xs" [placeholder]="isRtl ? 'رام الله / عن بُعد' : 'City / Remote'">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.experience.startDate }}</label>
                  <input type="text" [(ngModel)]="exp.startDate" class="form-control text-xs" placeholder="2022-01">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.experience.endDate }}</label>
                  <input type="text" [(ngModel)]="exp.endDate" [disabled]="exp.isCurrent" class="form-control text-xs" [placeholder]="exp.isCurrent ? (isRtl ? 'الآن' : 'Present') : '2024-05'">
                </div>
              </div>

              <div class="flex items-center gap-2">
                <input type="checkbox" [(ngModel)]="exp.isCurrent" [id]="'curr-' + i" class="rounded text-blue-600">
                <label [for]="'curr-' + i" class="text-xs font-semibold text-slate-600 cursor-pointer">{{ ui.experience.isCurrent }}</label>
              </div>

              <div class="form-group">
                <label class="form-label text-xs">{{ ui.experience.description }}</label>
                <textarea [(ngModel)]="exp.description" rows="3" class="form-control text-xs" [placeholder]="isRtl ? '• قدت فريقاً من 4 مطورين لتحديث النظام...&#10;• حققت زيادة في الأداء بنسبة 35%...' : '• Led cross-functional team of 4 engineers...&#10;• Improved latency by 35%...'"></textarea>
              </div>
            </div>

            <div class="pt-4 flex justify-between">
              <button (click)="activeSection = 'personal'" class="btn btn-secondary text-xs py-2 px-4 cursor-pointer">{{ isRtl ? 'السابق' : 'Previous' }}</button>
              <button (click)="activeSection = 'education'" class="btn btn-primary text-xs py-2 px-5 flex items-center gap-1.5 cursor-pointer">
                <span>{{ isRtl ? 'التالي: التعليم' : 'Next: Education' }}</span>
                <span class="material-symbols-rounded text-base">{{ isRtl ? 'arrow_back' : 'arrow_forward' }}</span>
              </button>
            </div>
          </div>

          <!-- ==================== 3. قسم البيانات التعليمية ==================== -->
          <div *ngIf="activeSection === 'education'" class="space-y-6 animate-fade-in">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-black text-slate-800">{{ ui.education.title }}</h3>
                <p class="text-xs text-slate-400">{{ isRtl ? 'الشهادات الجامعية، الماجستير، أو الدبلومات' : 'University degrees, masters, or diplomas' }}</p>
              </div>
              <button (click)="addEducation()" class="btn btn-outline-primary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-rounded text-xs">add</span>
                <span>{{ ui.education.addBtn }}</span>
              </button>
            </div>

            <div *ngIf="!cv.education || cv.education.length === 0" class="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p class="text-xs text-slate-500 font-semibold mb-3">{{ ui.education.noItems }}</p>
              <button (click)="addEducation()" class="btn btn-primary text-xs py-1.5 px-4 flex items-center gap-1 mx-auto cursor-pointer">
                <span class="material-symbols-rounded text-xs">add</span>
                <span>{{ ui.education.addBtn }}</span>
              </button>
            </div>

            <div *ngFor="let edu of cv.education; let i = index" class="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4 relative">
              <button (click)="removeEducation(i)" class="absolute top-4" [class.left-4]="isRtl" [class.right-4]="!isRtl" class="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer" [title]="ui.education.delete">
                <span class="material-symbols-rounded text-sm">delete</span>
                <span>{{ isRtl ? 'حذف' : 'Delete' }}</span>
              </button>

              <div class="font-bold text-slate-700 text-sm">{{ isRtl ? 'مؤهل علمي #' : 'Qualification #' }}{{ i + 1 }}</div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.education.institution }} *</label>
                  <input type="text" [(ngModel)]="edu.institution" class="form-control text-xs" [placeholder]="isRtl ? 'جامعة النجاح الوطنية' : 'University Name'">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.education.degree }} *</label>
                  <input type="text" [(ngModel)]="edu.degree" class="form-control text-xs" [placeholder]="isRtl ? 'بكالوريوس / ماجستير' : 'B.Sc. / M.Sc.'">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.education.field }}</label>
                  <input type="text" [(ngModel)]="edu.fieldOfStudy" class="form-control text-xs" [placeholder]="isRtl ? 'هندسة الحاسوب' : 'Computer Science'">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.education.year }}</label>
                  <input type="text" [(ngModel)]="edu.graduationYear" class="form-control text-xs" placeholder="2022">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.education.grade }}</label>
                  <input type="text" [(ngModel)]="edu.grade" class="form-control text-xs" [placeholder]="isRtl ? 'امتياز مع مرتبة الشرف' : 'Honors / GPA'">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label text-xs">{{ ui.education.description }}</label>
                <textarea [(ngModel)]="edu.description" rows="2" class="form-control text-xs" [placeholder]="isRtl ? 'مشروع التخرج، الأنشطة الطلابية...' : 'Graduation project, thesis, honors...'"></textarea>
              </div>
            </div>

            <div class="pt-4 flex justify-between">
              <button (click)="activeSection = 'experience'" class="btn btn-secondary text-xs py-2 px-4 cursor-pointer">{{ isRtl ? 'السابق' : 'Previous' }}</button>
              <button (click)="activeSection = 'skills'" class="btn btn-primary text-xs py-2 px-5 flex items-center gap-1.5 cursor-pointer">
                <span>{{ isRtl ? 'التالي: المهارات واللغات' : 'Next: Skills & Languages' }}</span>
                <span class="material-symbols-rounded text-base">{{ isRtl ? 'arrow_back' : 'arrow_forward' }}</span>
              </button>
            </div>
          </div>

          <!-- ==================== 4. قسم المهارات واللغات ==================== -->
          <div *ngIf="activeSection === 'skills'" class="space-y-6 animate-fade-in">
            
            <!-- المهارات Skills -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-base font-black text-slate-800">{{ ui.skills.title }}</h3>
                  <p class="text-xs text-slate-400">{{ isRtl ? 'أضف مهاراتك الأساسية مع تحديد مستوى الإتقان' : 'Add core competencies and proficiency levels' }}</p>
                </div>
                <button (click)="addSkill()" class="btn btn-outline-primary text-xs py-1 px-3 flex items-center gap-1 cursor-pointer">
                  <span class="material-symbols-rounded text-xs">add</span>
                  <span>{{ ui.skills.addSkillBtn }}</span>
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div *ngFor="let skill of cv.skills; let i = index" class="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <input type="text" [(ngModel)]="skill.name" class="form-control text-xs py-1 flex-1" [placeholder]="ui.skills.skillName">
                  <select [(ngModel)]="skill.level" class="form-control text-xs py-1 w-24">
                    <option [value]="isRtl ? 'مبتدئ' : 'Beginner'">{{ isRtl ? 'مبتدئ' : 'Beginner' }}</option>
                    <option [value]="isRtl ? 'متوسط' : 'Intermediate'">{{ isRtl ? 'متوسط' : 'Intermediate' }}</option>
                    <option [value]="isRtl ? 'متقدم' : 'Advanced'">{{ isRtl ? 'متقدم' : 'Advanced' }}</option>
                    <option [value]="isRtl ? 'خبير' : 'Expert'">{{ isRtl ? 'خبير' : 'Expert' }}</option>
                  </select>
                  <button (click)="removeSkill(i)" class="text-red-400 hover:text-red-600 px-1 font-bold text-xs flex items-center cursor-pointer" [title]="ui.skills.delete">
                    <span class="material-symbols-rounded text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>

            <hr class="border-slate-100 my-4">

            <!-- اللغات Languages مع تطبيق شرط: اللغتان الأساسيتان مجاناً واللغات الإضافية مدفوعة -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-base font-black text-slate-800">{{ ui.skills.spokenLanguages }}</h3>
                    <span class="badge badge-primary text-[10px] py-0.5 px-2">{{ isRtl ? 'لغتان أساسيتان مجاناً' : '2 Languages Free' }}</span>
                    <span *ngIf="authService.currentUser()?.plan === 'pro'" class="badge badge-pro text-[10px] py-0.5 px-2 inline-flex items-center gap-1">
                      <span class="material-symbols-rounded text-xs text-amber-500">workspace_premium</span>
                      <span>{{ isRtl ? 'لغات غير محدودة Pro' : 'Unlimited Pro' }}</span>
                    </span>
                  </div>
                  <p class="text-xs text-slate-400 mt-0.5">{{ isRtl ? 'العربية والإنجليزية مجاناً، ولإضافة لغات إضافية يتطلب اشتراك Pro' : 'Arabic & English free, additional languages require Pro' }}</p>
                </div>
                
                <button (click)="addLanguageWithLimit()" class="btn btn-outline-primary text-xs py-1 px-3 flex items-center gap-1 cursor-pointer">
                  <span class="material-symbols-rounded text-xs">add</span>
                  <span>{{ ui.skills.addLangBtn }}</span>
                  <span *ngIf="(cv.languages?.length || 0) >= 2 && authService.currentUser()?.plan === 'free'" class="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                    <span class="material-symbols-rounded text-[10px]">workspace_premium</span>
                    <span>Pro</span>
                  </span>
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div *ngFor="let lang of cv.languages; let i = index" class="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 relative">
                  <!-- رقم اللغة وشارة مجاني / إضافي -->
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" [ngClass]="i < 2 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'">
                    {{ i < 2 ? (isRtl ? 'أساسية' : 'Standard') : (isRtl ? 'إضافية Pro' : 'Pro Extra') }}
                  </span>
                  
                  <input type="text" [(ngModel)]="lang.name" class="form-control text-xs py-1 flex-1" [placeholder]="ui.skills.langName">
                  <select [(ngModel)]="lang.proficiency" class="form-control text-xs py-1 w-28">
                    <option [value]="isRtl ? 'أساسي' : 'Basic'">{{ isRtl ? 'أساسي' : 'Basic' }}</option>
                    <option [value]="isRtl ? 'جيد' : 'Conversational'">{{ isRtl ? 'جيد' : 'Conversational' }}</option>
                    <option [value]="isRtl ? 'طلاقة' : 'Fluent'">{{ isRtl ? 'طلاقة' : 'Fluent' }}</option>
                    <option [value]="isRtl ? 'اللغة الأم' : 'Native'">{{ isRtl ? 'اللغة الأم' : 'Native' }}</option>
                  </select>
                  <button (click)="removeLanguage(i)" class="text-red-400 hover:text-red-600 px-1 font-bold text-xs flex items-center cursor-pointer" [title]="ui.skills.delete">
                    <span class="material-symbols-rounded text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="pt-4 flex justify-between">
              <button (click)="activeSection = 'education'" class="btn btn-secondary text-xs py-2 px-4">{{ isRtl ? 'السابق' : 'Previous' }}</button>
              <button (click)="activeSection = 'certifications'" class="btn btn-primary text-xs py-2 px-5">{{ isRtl ? 'التالي: الشهادات' : 'Next: Certifications' }}</button>
            </div>
          </div>

          <!-- ==================== 5. قسم الشهادات ==================== -->
          <div *ngIf="activeSection === 'certifications'" class="space-y-6 animate-fade-in">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-black text-slate-800">{{ ui.certifications.title }}</h3>
                <p class="text-xs text-slate-400">{{ isRtl ? 'الشهادات المعتمدة من منصات أو شركات عالمية' : 'Accredited certificates and licenses' }}</p>
              </div>
              <button (click)="addCertification()" class="btn btn-outline-primary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-rounded text-xs">add</span>
                <span>{{ ui.certifications.addBtn }}</span>
              </button>
            </div>

            <div *ngIf="!cv.certifications || cv.certifications.length === 0" class="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p class="text-xs text-slate-500 font-semibold mb-3">{{ ui.certifications.noItems }}</p>
              <button (click)="addCertification()" class="btn btn-primary text-xs py-1.5 px-4 flex items-center gap-1 mx-auto cursor-pointer">
                <span class="material-symbols-rounded text-xs">add</span>
                <span>{{ ui.certifications.addBtn }}</span>
              </button>
            </div>

            <div *ngFor="let cert of cv.certifications; let i = index" class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <button (click)="removeCertification(i)" class="absolute top-4" [class.left-4]="isRtl" [class.right-4]="!isRtl" class="text-red-500 text-xs font-bold flex items-center gap-1 cursor-pointer" [title]="ui.certifications.delete">
                <span class="material-symbols-rounded text-sm">delete</span>
                <span>{{ isRtl ? 'حذف' : 'Delete' }}</span>
              </button>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.certifications.name }} *</label>
                  <input type="text" [(ngModel)]="cert.name" class="form-control text-xs" placeholder="AWS Certified Solutions Architect">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.certifications.issuer }} *</label>
                  <input type="text" [(ngModel)]="cert.issuer" class="form-control text-xs" placeholder="Amazon Web Services">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.certifications.date }}</label>
                  <input type="text" [(ngModel)]="cert.issueDate" class="form-control text-xs" placeholder="2023">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.certifications.url }}</label>
                  <input type="text" [(ngModel)]="cert.credentialUrl" class="form-control text-xs" placeholder="https://credential.net/...">
                </div>
              </div>
            </div>

            <div class="pt-4 flex justify-between">
              <button (click)="activeSection = 'skills'" class="btn btn-secondary text-xs py-2 px-4 cursor-pointer">{{ isRtl ? 'السابق' : 'Previous' }}</button>
              <button (click)="activeSection = 'projects'" class="btn btn-primary text-xs py-2 px-5 flex items-center gap-1.5 cursor-pointer">
                <span>{{ isRtl ? 'التالي: المشاريع' : 'Next: Projects' }}</span>
                <span class="material-symbols-rounded text-base">{{ isRtl ? 'arrow_back' : 'arrow_forward' }}</span>
              </button>
            </div>
          </div>

          <!-- ==================== 6. قسم المشاريع ==================== -->
          <div *ngIf="activeSection === 'projects'" class="space-y-6 animate-fade-in">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-black text-slate-800">{{ ui.projects.title }}</h3>
                <p class="text-xs text-slate-400">{{ isRtl ? 'مشاريع برمجية، تصميمية، أو مبادرات قمت بتنفيذها' : 'Featured apps, architectures, and client projects' }}</p>
              </div>
              <button (click)="addProject()" class="btn btn-outline-primary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-rounded text-xs">add</span>
                <span>{{ ui.projects.addBtn }}</span>
              </button>
            </div>

            <div *ngIf="!cv.projects || cv.projects.length === 0" class="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p class="text-xs text-slate-500 font-semibold mb-3">{{ ui.projects.noItems }}</p>
              <button (click)="addProject()" class="btn btn-primary text-xs py-1.5 px-4 flex items-center gap-1 mx-auto cursor-pointer">
                <span class="material-symbols-rounded text-xs">add</span>
                <span>{{ ui.projects.addBtn }}</span>
              </button>
            </div>

            <div *ngFor="let proj of cv.projects; let i = index" class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <button (click)="removeProject(i)" class="absolute top-4" [class.left-4]="isRtl" [class.right-4]="!isRtl" class="text-red-500 text-xs font-bold flex items-center gap-1 cursor-pointer" [title]="ui.projects.delete">
                <span class="material-symbols-rounded text-sm">delete</span>
                <span>{{ isRtl ? 'حذف' : 'Delete' }}</span>
              </button>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.projects.name }} *</label>
                  <input type="text" [(ngModel)]="proj.title" class="form-control text-xs" [placeholder]="isRtl ? 'منصة التجارة الإلكترونية السحابية' : 'Cloud E-Commerce Platform'">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.projects.url }}</label>
                  <input type="text" [(ngModel)]="proj.link" class="form-control text-xs" placeholder="https://github.com/my-project">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label text-xs">{{ ui.projects.description }}</label>
                <textarea [(ngModel)]="proj.description" rows="2" class="form-control text-xs" [placeholder]="isRtl ? 'تطبيق ويب متكامل باستخدام Angular و Node.js...' : 'Full-stack application with Angular and Node.js...'"></textarea>
              </div>
            </div>

            <div class="pt-4 flex justify-between">
              <button (click)="activeSection = 'certifications'" class="btn btn-secondary text-xs py-2 px-4 cursor-pointer">{{ isRtl ? 'السابق' : 'Previous' }}</button>
              <button (click)="activeSection = 'references'" class="btn btn-primary text-xs py-2 px-5 flex items-center gap-1.5 cursor-pointer">
                <span>{{ isRtl ? 'التالي: المراجع' : 'Next: References' }}</span>
                <span class="material-symbols-rounded text-sm">groups</span>
              </button>
            </div>
          </div>

          <!-- ==================== 7. قسم المراجع ==================== -->
          <div *ngIf="activeSection === 'references'" class="space-y-6 animate-fade-in">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-black text-slate-800">{{ ui.references.title }}</h3>
                <p class="text-xs text-slate-400">{{ isRtl ? 'بيانات أشخاص أو مديرين سابقين للتزكية والتوصية المهنية' : 'Verified contacts and professional endorsements' }}</p>
              </div>
              <button (click)="addReference()" class="btn btn-outline-primary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-rounded text-xs">add</span>
                <span>{{ ui.references.addBtn }}</span>
              </button>
            </div>

            <div *ngIf="!cv.references || cv.references.length === 0" class="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p class="text-xs text-slate-500 font-semibold mb-3">{{ ui.references.noItems }}</p>
              <button (click)="addReference()" class="btn btn-primary text-xs py-1.5 px-4 flex items-center gap-1 mx-auto cursor-pointer">
                <span class="material-symbols-rounded text-xs">add</span>
                <span>{{ ui.references.addBtn }}</span>
              </button>
            </div>

            <div *ngFor="let ref of cv.references; let i = index" class="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4 relative">
              <button (click)="removeReference(i)" class="absolute top-4" [class.left-4]="isRtl" [class.right-4]="!isRtl" class="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer" [title]="ui.references.delete">
                <span class="material-symbols-rounded text-sm">delete</span>
                <span>{{ isRtl ? 'حذف' : 'Delete' }}</span>
              </button>

              <div class="font-bold text-slate-700 text-sm">{{ isRtl ? 'مرجع #' : 'Reference #' }}{{ i + 1 }}</div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.references.name }} *</label>
                  <input type="text" [(ngModel)]="ref.name" class="form-control text-xs" [placeholder]="isRtl ? 'مثال: م. خالد عبد الرحمن' : 'e.g. John Smith'">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.references.company }} *</label>
                  <input type="text" [(ngModel)]="ref.jobTitle" class="form-control text-xs" [placeholder]="isRtl ? 'مثال: مدير تقنية المعلومات (CTO)' : 'e.g. CTO / VP of Engineering'">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="form-group">
                  <label class="form-label text-xs">{{ isRtl ? 'الشركة أو المؤسسة' : 'Company / Organization' }}</label>
                  <input type="text" [(ngModel)]="ref.company" class="form-control text-xs" [placeholder]="isRtl ? 'مثال: شركة الحلول الرقمية' : 'e.g. Acme Tech Solutions'">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.personal.email }}</label>
                  <input type="email" [(ngModel)]="ref.email" class="form-control text-xs" placeholder="ref@example.com">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs">{{ ui.personal.phone }}</label>
                  <input type="text" [(ngModel)]="ref.phone" class="form-control text-xs" placeholder="+970 59 000 0000">
                </div>
              </div>
            </div>

            <div class="pt-4 flex justify-between">
              <button (click)="activeSection = 'projects'" class="btn btn-secondary text-xs py-2 px-4 cursor-pointer">{{ isRtl ? 'السابق' : 'Previous' }}</button>
              <button (click)="saveCV(true)" class="btn btn-primary text-xs py-2 px-5 flex items-center gap-1.5 cursor-pointer">
                <span class="material-symbols-rounded text-sm">save</span>
                <span>{{ ui.saveCV }}</span>
              </button>
            </div>
          </div>

        </div>


        <!-- ==================== المعاينة الحية المباشرة (Live CV Preview Canvas) ==================== -->
        <div class="lg:col-span-6 sticky top-24">
          
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-bold text-slate-500 px-2 no-print">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>المعاينة الحية الفورية (Live Preview)</span>
            </div>

            <div class="flex items-center gap-2">
              <!-- منتقي الخطوط السريع في شريط المعاينة -->
              <div class="flex items-center gap-1.5 bg-white border border-slate-200/90 px-2.5 py-1 rounded-xl shadow-xs">
                <span class="material-symbols-rounded text-sm text-indigo-600">font_download</span>
                <span class="text-[11px] font-bold text-slate-400">الخط:</span>
                <select 
                  [(ngModel)]="cv.fontFamily" 
                  (change)="setFont(cv.fontFamily)"
                  class="bg-transparent border-0 text-xs font-black text-indigo-700 outline-none cursor-pointer pr-1"
                  [style.fontFamily]="cv.fontFamily"
                >
                  <option *ngFor="let font of availableFonts" [value]="font.id" [style.fontFamily]="font.id">
                    {{ font.name }}
                  </option>
                </select>
              </div>

              <span class="badge badge-primary text-[10px]">{{ getTemplateName(cv.templateId) }}</span>
            </div>
          </div>

          <!-- ================= شريط أدوات كانفا ستوديو البصري (Canva Studio Toolbar) ================= -->
          <div *ngIf="isCanvaMode" class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-3.5 mb-3 shadow-xl border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 animate-fade-in no-print">
            
            <!-- الحالة والتعليمات -->
            <div class="flex items-center gap-2.5">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0"></span>
              <div>
                <span class="text-xs font-black bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-300 bg-clip-text text-transparent">CANVA STUDIO PRO</span>
                <span class="text-[11px] text-slate-300 font-medium block sm:inline sm:mr-2">انقر على أي نص في الورقة للتعديل المباشر</span>
              </div>
            </div>

            <!-- عناصر التحكم بحجم الخط والعناصر الإضافية -->
            <div class="flex flex-wrap items-center gap-2">
              
              <!-- حجم خط كانفا -->
              <div class="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-xl">
                <button (click)="adjustFontSize(-1)" class="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center justify-center transition-all cursor-pointer" title="تصغير الخط">
                  <span class="material-symbols-rounded text-sm">text_decrease</span>
                </button>
                <span class="text-[11px] font-mono font-bold px-1.5 text-indigo-200">{{ cv.customFontSize || 14 }}px</span>
                <button (click)="adjustFontSize(1)" class="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center justify-center transition-all cursor-pointer" title="تكبير الخط">
                  <span class="material-symbols-rounded text-sm">text_increase</span>
                </button>
              </div>

              <!-- إضافة QR Code -->
              <button 
                (click)="toggleCanvaElement('qr')" 
                [class.bg-blue-600]="hasCanvaElement('qr')"
                [class.bg-white_10]="!hasCanvaElement('qr')"
                class="text-xs py-1.5 px-2.5 rounded-xl hover:bg-blue-500 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <span class="material-symbols-rounded text-sm">qr_code_2</span>
                <span>QR Code</span>
              </button>

              <!-- إضافة توقيع رقمي -->
              <button 
                (click)="toggleCanvaElement('signature')" 
                [class.bg-blue-600]="hasCanvaElement('signature')"
                [class.bg-white_10]="!hasCanvaElement('signature')"
                class="text-xs py-1.5 px-2.5 rounded-xl hover:bg-blue-500 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <span class="material-symbols-rounded text-sm">draw</span>
                <span>توقيع رقمي</span>
              </button>

              <!-- إضافة شارة توثيق -->
              <button 
                (click)="toggleCanvaElement('badge')" 
                [class.bg-blue-600]="hasCanvaElement('badge')"
                [class.bg-white_10]="!hasCanvaElement('badge')"
                class="text-xs py-1.5 px-2.5 rounded-xl hover:bg-blue-500 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <span class="material-symbols-rounded text-sm">verified</span>
                <span>شارة توثيق</span>
              </button>

              <!-- رفع وتعديل الصورة الشخصية في كانفا -->
              <input #canvaPhotoInput type="file" accept="image/*" (change)="onPhotoSelected($event)" class="hidden">
              <button 
                (click)="canvaPhotoInput.click()" 
                [class.bg-blue-600]="cv.personalInfo.avatarUrl"
                [class.bg-white_10]="!cv.personalInfo.avatarUrl"
                class="text-xs py-1.5 px-2.5 rounded-xl hover:bg-blue-500 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
                title="إضافة أو تعديل الصورة الشخصية"
              >
                <span class="material-symbols-rounded text-sm">photo_camera</span>
                <span>{{ cv.personalInfo.avatarUrl ? 'تعديل الصورة' : 'إضافة صورة' }}</span>
              </button>

              <!-- زر إغلاق كانفا -->
              <button 
                (click)="isCanvaMode = false" 
                class="text-xs py-1.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 font-bold border border-rose-500/40 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>إنهاء كانفا</span>
                <span class="material-symbols-rounded text-sm">close</span>
              </button>

            </div>

          </div>

          <!-- ورقة السيرة الذاتية (A4 Paper Container) -->
          <div 
            id="cv-preview-element" 
            [attr.dir]="isRtl ? 'rtl' : 'ltr'"
            [class.canva-mode-active]="isCanvaMode"
            [style.fontSize.px]="cv.customFontSize || 14"
            [style.--cv-font]="cv.fontFamily || 'IBM Plex Sans Arabic'"
            [style.fontFamily]="(cv.fontFamily || 'IBM Plex Sans Arabic') + ', system-ui, sans-serif !important'" 
            class="cv-preview-paper bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-10 text-slate-800 transition-all min-h-[750px]"
          >
            
            <!-- شارة التوثيق في وضع كانفا إذا تم تفعيلها -->
            <div *ngIf="hasCanvaElement('badge')" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs mb-4">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="material-symbols-rounded text-sm text-emerald-600">verified</span>
              <span>{{ labels.certifiedBadge }}</span>
            </div>

            <!-- ==================== القالب 1: Modern Vibrant ==================== -->
            <div *ngIf="cv.templateId === 'modern-vibrant'" class="space-y-6">
              
              <!-- Header -->
              <div class="border-b-2 pb-6" [style.borderColor]="cv.themeColor">
                <div class="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-4">
                  <div class="flex-1">
                    <h1 
                      [attr.contenteditable]="isCanvaMode ? 'true' : null"
                      (blur)="onInlineTextChange('personalInfo.fullName', $event)"
                      [class.canva-editable]="isCanvaMode"
                      class="text-3xl font-black tracking-tight" 
                      [style.color]="cv.themeColor"
                      title="انقر لتعديل الاسم مباشرة"
                    >
                      {{ cv.personalInfo.fullName || (isRtl ? 'الاسم الكامل' : 'Full Name') }}
                    </h1>
                    <p 
                      [attr.contenteditable]="isCanvaMode ? 'true' : null"
                      (blur)="onInlineTextChange('personalInfo.jobTitle', $event)"
                      [class.canva-editable]="isCanvaMode"
                      class="text-lg font-bold text-slate-600 mt-1"
                      title="انقر لتعديل المسمى الوظيفي مباشرة"
                    >
                      {{ cv.personalInfo.jobTitle || (isRtl ? 'المسمى الوظيفي' : 'Job Title') }}
                    </p>
                  </div>

                  <div *ngIf="cv.personalInfo.avatarUrl" class="flex-shrink-0 self-center sm:self-start">
                    <img [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-md border-2" [style.borderColor]="cv.themeColor">
                  </div>
                </div>
                
                <!-- Contact info row -->
                <div class="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mt-4">
                  <span *ngIf="cv.personalInfo.email" [attr.contenteditable]="isCanvaMode ? 'true' : null" (blur)="onInlineTextChange('personalInfo.email', $event)" [class.canva-editable]="isCanvaMode" class="flex items-center gap-1">
                    <span class="material-symbols-rounded text-sm text-blue-600">mail</span>
                    <bdi>{{ cv.personalInfo.email }}</bdi>
                  </span>
                  <span *ngIf="cv.personalInfo.phone" [attr.contenteditable]="isCanvaMode ? 'true' : null" (blur)="onInlineTextChange('personalInfo.phone', $event)" [class.canva-editable]="isCanvaMode" class="flex items-center gap-1">
                    <span class="material-symbols-rounded text-sm text-blue-600">call</span>
                    <bdi>{{ cv.personalInfo.phone }}</bdi>
                  </span>
                  <span *ngIf="cv.personalInfo.address" [attr.contenteditable]="isCanvaMode ? 'true' : null" (blur)="onInlineTextChange('personalInfo.address', $event)" [class.canva-editable]="isCanvaMode" class="flex items-center gap-1">
                    <span class="material-symbols-rounded text-sm text-blue-600">location_on</span>
                    <bdi>{{ cv.personalInfo.address }}</bdi>
                  </span>
                  <span *ngIf="cv.personalInfo.linkedin" class="flex items-center gap-1">
                    <span class="material-symbols-rounded text-sm text-blue-600">link</span>
                    <span>LinkedIn</span>
                  </span>
                  <span *ngIf="cv.personalInfo.github" class="flex items-center gap-1">
                    <span class="material-symbols-rounded text-sm text-slate-700">code</span>
                    <span>GitHub</span>
                  </span>
                </div>
              </div>

              <!-- Summary -->
              <div *ngIf="cv.personalInfo.summary">
                <h2 class="text-sm font-black uppercase tracking-wider mb-2" [style.color]="cv.themeColor">{{ labels.summary }}</h2>
                <p 
                  [attr.contenteditable]="isCanvaMode ? 'true' : null"
                  (blur)="onInlineTextChange('personalInfo.summary', $event)"
                  [class.canva-editable]="isCanvaMode"
                  class="text-xs sm:text-sm text-slate-600 leading-relaxed"
                  title="انقر لتعديل النبذة مباشرة"
                >
                  {{ cv.personalInfo.summary }}
                </p>
              </div>

              <!-- Experience -->
              <div *ngIf="cv.experiences?.length">
                <h2 class="text-sm font-black uppercase tracking-wider mb-3" [style.color]="cv.themeColor">{{ labels.experience }}</h2>
                <div class="space-y-4">
                  <div *ngFor="let exp of cv.experiences" [class.border-r-2]="isRtl" [class.pr-3]="isRtl" [class.border-l-2]="!isRtl" [class.pl-3]="!isRtl" [style.borderColor]="cv.themeColor">
                    <div class="flex justify-between items-baseline font-bold text-sm text-slate-800">
                      <span>{{ exp.position }}</span>
                      <span class="text-xs text-slate-400 font-normal"><bdi>{{ exp.startDate }} - {{ exp.isCurrent ? labels.present : exp.endDate }}</bdi></span>
                    </div>
                    <div class="text-xs font-semibold text-slate-500">{{ exp.company }} <span *ngIf="exp.location">• {{ exp.location }}</span></div>
                    <p class="text-xs text-slate-600 mt-1.5 whitespace-pre-line leading-relaxed">{{ exp.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Education -->
              <div *ngIf="cv.education?.length">
                <h2 class="text-sm font-black uppercase tracking-wider mb-3" [style.color]="cv.themeColor">{{ labels.education }}</h2>
                <div class="space-y-3">
                  <div *ngFor="let edu of cv.education" [class.border-r-2]="isRtl" [class.pr-3]="isRtl" [class.border-l-2]="!isRtl" [class.pl-3]="!isRtl" [style.borderColor]="cv.themeColor">
                    <div class="flex justify-between items-baseline font-bold text-sm text-slate-800">
                      <span>{{ edu.degree }} {{ labels.inDegree }} {{ edu.fieldOfStudy }}</span>
                      <span class="text-xs text-slate-400 font-normal"><bdi>{{ edu.graduationYear }}</bdi></span>
                    </div>
                    <div class="text-xs font-semibold text-slate-500">{{ edu.institution }} <span *ngIf="edu.grade">• {{ edu.grade }}</span></div>
                    <p *ngIf="edu.description" class="text-xs text-slate-600 mt-1">{{ edu.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Skills & Languages Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div *ngIf="cv.skills?.length">
                  <h2 class="text-sm font-black uppercase tracking-wider mb-2" [style.color]="cv.themeColor">{{ labels.skills }}</h2>
                  <div class="flex flex-wrap gap-1.5">
                    <span *ngFor="let s of cv.skills" class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700">
                      <bdi>{{ s.name }}</bdi>
                      <span class="text-[10px] text-slate-500 font-normal">({{ s.level }})</span>
                    </span>
                  </div>
                </div>

                <div *ngIf="cv.languages?.length">
                  <h2 class="text-sm font-black uppercase tracking-wider mb-2" [style.color]="cv.themeColor">{{ labels.languages }}</h2>
                  <div class="space-y-1 text-xs text-slate-600 font-medium">
                    <div *ngFor="let l of cv.languages" class="flex justify-between">
                      <span>{{ l.name }}</span>
                      <span class="font-bold text-slate-500">{{ l.proficiency }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Certifications -->
              <div *ngIf="cv.certifications?.length">
                <h2 class="text-sm font-black uppercase tracking-wider mb-2" [style.color]="cv.themeColor">{{ labels.certifications }}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div *ngFor="let c of cv.certifications" class="p-2 rounded bg-slate-50 border border-slate-100">
                    <div class="font-bold text-slate-800">{{ c.name }}</div>
                    <div class="text-slate-500 text-[11px]">{{ c.issuer }} ({{ c.issueDate }})</div>
                  </div>
                </div>
              </div>

              <!-- Projects -->
              <div *ngIf="cv.projects?.length">
                <h2 class="text-sm font-black uppercase tracking-wider mb-2" [style.color]="cv.themeColor">{{ labels.projects }}</h2>
                <div class="space-y-2 text-xs">
                  <div *ngFor="let p of cv.projects" class="p-2 rounded bg-slate-50 border border-slate-100">
                    <div class="font-bold text-slate-800">{{ p.title }}</div>
                    <p class="text-slate-600 mt-0.5">{{ p.description }}</p>
                  </div>
                </div>
              </div>

              <!-- References -->
              <div *ngIf="cv.references?.length">
                <h2 class="text-sm font-black uppercase tracking-wider mb-2" [style.color]="cv.themeColor">{{ labels.references }}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div *ngFor="let ref of cv.references" class="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div class="font-bold text-slate-800 text-sm">{{ ref.name }}</div>
                    <div class="text-slate-600 font-semibold">{{ ref.jobTitle }} <span *ngIf="ref.company">— {{ ref.company }}</span></div>
                    <div class="text-slate-500 text-[11px] mt-1 space-y-0.5">
                      <div *ngIf="ref.email" class="flex items-center gap-1">
                        <span class="material-symbols-rounded text-xs text-blue-600">mail</span>
                        <bdi>{{ ref.email }}</bdi>
                      </div>
                      <div *ngIf="ref.phone" class="flex items-center gap-1">
                        <span class="material-symbols-rounded text-xs text-blue-600">call</span>
                        <bdi>{{ ref.phone }}</bdi>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- ==================== القالب 2: Minimal Clean ==================== -->
            <div *ngIf="cv.templateId === 'minimal-clean'" class="space-y-6">
              
              <div class="text-center pb-6 border-b border-slate-200">
                <div *ngIf="cv.personalInfo.avatarUrl" class="mb-4 flex justify-center">
                  <img [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-sm border border-slate-300">
                </div>
                <h1 
                  [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                  (blur)="onInlineTextChange('personalInfo.fullName', $event)" 
                  [class.canva-editable]="isCanvaMode"
                  class="text-3xl font-black text-slate-900 tracking-tight"
                >{{ cv.personalInfo.fullName || 'الاسم الكامل' }}</h1>
                <p 
                  [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                  (blur)="onInlineTextChange('personalInfo.jobTitle', $event)" 
                  [class.canva-editable]="isCanvaMode"
                  class="text-base font-semibold text-slate-600 mt-1"
                >{{ cv.personalInfo.jobTitle || 'المسمى الوظيفي' }}</p>
                <div class="flex flex-wrap justify-center items-center gap-3 text-xs text-slate-500 mt-3 font-medium">
                  <span *ngIf="cv.personalInfo.email"><bdi>{{ cv.personalInfo.email }}</bdi></span>
                  <span *ngIf="cv.personalInfo.phone">• <bdi>{{ cv.personalInfo.phone }}</bdi></span>
                  <span *ngIf="cv.personalInfo.address">• <bdi>{{ cv.personalInfo.address }}</bdi></span>
                </div>
              </div>

              <div *ngIf="cv.personalInfo.summary">
                <h2 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">{{ labels.summary }}</h2>
                <p 
                  [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                  (blur)="onInlineTextChange('personalInfo.summary', $event)" 
                  [class.canva-editable]="isCanvaMode"
                  class="text-xs text-slate-600 leading-relaxed text-justify"
                >{{ cv.personalInfo.summary }}</p>
              </div>

              <div *ngIf="cv.experiences?.length">
                <h2 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">{{ labels.experience }}</h2>
                <div class="space-y-3">
                  <div *ngFor="let exp of cv.experiences">
                    <div class="flex justify-between font-bold text-xs text-slate-800">
                      <span>{{ exp.position }} — {{ exp.company }}</span>
                      <span class="text-slate-400 font-normal"><bdi>{{ exp.startDate }} - {{ exp.isCurrent ? labels.present : exp.endDate }}</bdi></span>
                    </div>
                    <p class="text-xs text-slate-600 mt-1 whitespace-pre-line">{{ exp.description }}</p>
                  </div>
                </div>
              </div>

              <div *ngIf="cv.education?.length">
                <h2 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">{{ labels.education }}</h2>
                <div class="space-y-2">
                  <div *ngFor="let edu of cv.education" class="flex justify-between text-xs">
                    <span class="font-bold text-slate-800">{{ edu.degree }} {{ labels.inDegree }} {{ edu.fieldOfStudy }} ({{ edu.institution }})</span>
                    <span class="text-slate-400"><bdi>{{ edu.graduationYear }}</bdi></span>
                  </div>
                </div>
              </div>

              <div *ngIf="cv.skills?.length">
                <h2 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">{{ labels.skills }}</h2>
                <div class="text-xs text-slate-600">
                  <span *ngFor="let s of cv.skills; let last = last">{{ s.name }} ({{ s.level }})<span *ngIf="!last"> • </span></span>
                </div>
              </div>

              <!-- References -->
              <div *ngIf="cv.references?.length">
                <h2 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">{{ labels.references }}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div *ngFor="let ref of cv.references">
                    <div class="font-bold text-slate-800">{{ ref.name }}</div>
                    <div class="text-slate-500">{{ ref.jobTitle }} <span *ngIf="ref.company">({{ ref.company }})</span></div>
                    <div *ngIf="ref.email || ref.phone" class="text-slate-400 text-[11px]">
                      <span *ngIf="ref.email"><bdi>{{ ref.email }}</bdi></span>
                      <span *ngIf="ref.phone"> • <bdi>{{ ref.phone }}</bdi></span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- ==================== القالب 3: Executive Slate ==================== -->
            <div *ngIf="cv.templateId === 'executive-slate'" class="space-y-6">
              
              <div class="bg-slate-900 text-white -m-8 sm:-m-10 p-8 sm:p-10 mb-6 rounded-t-2xl">
                <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div class="flex items-center gap-4">
                    <img *ngIf="cv.personalInfo.avatarUrl" [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-400/60 shadow-xl flex-shrink-0">
                    <div>
                      <h1 
                        [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                        (blur)="onInlineTextChange('personalInfo.fullName', $event)" 
                        [class.canva-editable]="isCanvaMode"
                        class="text-3xl font-black tracking-tight text-white"
                      >{{ cv.personalInfo.fullName || 'الاسم الكامل' }}</h1>
                      <p 
                        [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                        (blur)="onInlineTextChange('personalInfo.jobTitle', $event)" 
                        [class.canva-editable]="isCanvaMode"
                        class="text-base font-bold text-indigo-300 mt-1"
                      >{{ cv.personalInfo.jobTitle || 'المسمى الوظيفي' }}</p>
                    </div>
                  </div>
                  <div class="text-left text-xs text-slate-300 space-y-1 font-medium">
                    <div *ngIf="cv.personalInfo.email" class="flex items-center gap-1">
                      <span class="material-symbols-rounded text-xs text-indigo-300">mail</span>
                      <bdi>{{ cv.personalInfo.email }}</bdi>
                    </div>
                    <div *ngIf="cv.personalInfo.phone" class="flex items-center gap-1">
                      <span class="material-symbols-rounded text-xs text-indigo-300">call</span>
                      <bdi>{{ cv.personalInfo.phone }}</bdi>
                    </div>
                    <div *ngIf="cv.personalInfo.address" class="flex items-center gap-1">
                      <span class="material-symbols-rounded text-xs text-indigo-300">location_on</span>
                      <bdi>{{ cv.personalInfo.address }}</bdi>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="cv.personalInfo.summary">
                <h2 class="text-xs font-black uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2">{{ labels.executiveVision }}</h2>
                <p 
                  [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                  (blur)="onInlineTextChange('personalInfo.summary', $event)" 
                  [class.canva-editable]="isCanvaMode"
                  class="text-xs text-slate-700 leading-relaxed"
                >{{ cv.personalInfo.summary }}</p>
              </div>

              <div *ngIf="cv.experiences?.length">
                <h2 class="text-xs font-black uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-3">{{ labels.experience }}</h2>
                <div class="space-y-4">
                  <div *ngFor="let exp of cv.experiences">
                    <div class="flex justify-between font-bold text-xs text-slate-900">
                      <span>{{ exp.position }} | {{ exp.company }}</span>
                      <span class="text-indigo-600"><bdi>{{ exp.startDate }} - {{ exp.isCurrent ? labels.present : exp.endDate }}</bdi></span>
                    </div>
                    <p class="text-xs text-slate-600 mt-1 whitespace-pre-line">{{ exp.description }}</p>
                  </div>
                </div>
              </div>

              <div *ngIf="cv.education?.length">
                <h2 class="text-xs font-black uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-3">{{ labels.education }}</h2>
                <div class="space-y-2">
                  <div *ngFor="let edu of cv.education" class="flex justify-between text-xs">
                    <span class="font-bold text-slate-800">{{ edu.degree }} {{ labels.inDegree }} {{ edu.fieldOfStudy }} — {{ edu.institution }}</span>
                    <span class="text-slate-500"><bdi>{{ edu.graduationYear }}</bdi></span>
                  </div>
                </div>
              </div>

              <div *ngIf="cv.skills?.length">
                <h2 class="text-xs font-black uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2">{{ labels.skills }}</h2>
                <div class="flex flex-wrap gap-1.5">
                  <span *ngFor="let s of cv.skills" class="px-2.5 py-1 text-xs font-bold rounded bg-slate-100 text-slate-800">
                    {{ s.name }}
                  </span>
                </div>
              </div>

              <!-- References -->
              <div *ngIf="cv.references?.length">
                <h2 class="text-xs font-black uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2">{{ labels.references }}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div *ngFor="let ref of cv.references" class="p-2.5 rounded bg-slate-50">
                    <div class="font-bold text-slate-900">{{ ref.name }}</div>
                    <div class="text-indigo-600">{{ ref.jobTitle }} • {{ ref.company }}</div>
                    <div class="text-slate-500 text-[11px] mt-0.5"><bdi>{{ ref.email }} | {{ ref.phone }}</bdi></div>
                  </div>
                </div>
              </div>

            </div>

            <!-- ==================== القالب 4: Creative Indigo ==================== -->
            <div *ngIf="cv.templateId === 'creative-indigo'" class="grid grid-cols-12 gap-6">
              
              <!-- Left/Right Sidebar in CV -->
              <div 
                class="col-span-4 bg-indigo-50/60 -my-8 sm:-my-10 p-6 space-y-6"
                [class.-mr-8]="isRtl" [class.sm:-mr-10]="isRtl" [class.rounded-r-2xl]="isRtl" [class.border-l]="isRtl"
                [class.-ml-8]="!isRtl" [class.sm:-ml-10]="!isRtl" [class.rounded-l-2xl]="!isRtl" [class.border-r]="!isRtl"
                class="border-indigo-100"
              >
                <div>
                  <img *ngIf="cv.personalInfo.avatarUrl" [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-20 h-20 rounded-2xl object-cover mb-3 shadow-md shadow-indigo-500/20 border-2 border-indigo-200">
                  <div *ngIf="!cv.personalInfo.avatarUrl" class="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center mb-3 shadow-md shadow-indigo-500/20">
                    {{ (cv.personalInfo.fullName || 'أ')[0] }}
                  </div>
                  <h2 
                    [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                    (blur)="onInlineTextChange('personalInfo.fullName', $event)" 
                    [class.canva-editable]="isCanvaMode"
                    class="font-black text-slate-900 text-lg leading-snug"
                  >{{ cv.personalInfo.fullName || 'الاسم الكامل' }}</h2>
                  <p 
                    [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                    (blur)="onInlineTextChange('personalInfo.jobTitle', $event)" 
                    [class.canva-editable]="isCanvaMode"
                    class="text-xs font-bold text-indigo-600 mt-0.5"
                  >{{ cv.personalInfo.jobTitle || 'المسمى الوظيفي' }}</p>
                </div>

                <div class="text-xs space-y-2 text-slate-600">
                  <div class="font-bold text-slate-800 uppercase tracking-wider text-[10px]">{{ labels.contacts }}</div>
                  <div *ngIf="cv.personalInfo.email" class="break-all"><bdi>{{ cv.personalInfo.email }}</bdi></div>
                  <div *ngIf="cv.personalInfo.phone"><bdi>{{ cv.personalInfo.phone }}</bdi></div>
                  <div *ngIf="cv.personalInfo.address"><bdi>{{ cv.personalInfo.address }}</bdi></div>
                </div>

                <div *ngIf="cv.skills?.length" class="space-y-2">
                  <div class="font-bold text-slate-800 uppercase tracking-wider text-[10px]">{{ labels.skills }}</div>
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let s of cv.skills" class="px-2 py-0.5 bg-white text-indigo-700 text-[10px] font-bold rounded shadow-xs">
                      {{ s.name }}
                    </span>
                  </div>
                </div>

                <div *ngIf="cv.languages?.length" class="space-y-1.5">
                  <div class="font-bold text-slate-800 uppercase tracking-wider text-[10px]">{{ labels.languages }}</div>
                  <div *ngFor="let l of cv.languages" class="text-xs flex justify-between">
                    <span>{{ l.name }}</span>
                    <span class="font-bold text-indigo-600">{{ l.proficiency }}</span>
                  </div>
                </div>
              </div>

              <!-- Main Content in CV -->
              <div class="col-span-8 space-y-6 py-2">
                <div *ngIf="cv.personalInfo.summary">
                  <h3 class="text-xs font-black uppercase tracking-wider text-indigo-600 mb-1">{{ labels.aboutMe }}</h3>
                  <p 
                    [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                    (blur)="onInlineTextChange('personalInfo.summary', $event)" 
                    [class.canva-editable]="isCanvaMode"
                    class="text-xs text-slate-600 leading-relaxed"
                  >{{ cv.personalInfo.summary }}</p>
                </div>

                <div *ngIf="cv.experiences?.length">
                  <h3 class="text-xs font-black uppercase tracking-wider text-indigo-600 mb-3">{{ labels.experience }}</h3>
                  <div class="space-y-4">
                    <div *ngFor="let exp of cv.experiences">
                      <div class="flex justify-between font-bold text-xs text-slate-800">
                        <span>{{ exp.position }}</span>
                        <span class="text-indigo-600 font-semibold"><bdi>{{ exp.startDate }} - {{ exp.isCurrent ? labels.present : exp.endDate }}</bdi></span>
                      </div>
                      <div class="text-[11px] font-semibold text-slate-500">{{ exp.company }}</div>
                      <p class="text-xs text-slate-600 mt-1 whitespace-pre-line">{{ exp.description }}</p>
                    </div>
                  </div>
                </div>

                <div *ngIf="cv.education?.length">
                  <h3 class="text-xs font-black uppercase tracking-wider text-indigo-600 mb-2">{{ labels.education }}</h3>
                  <div class="space-y-2">
                    <div *ngFor="let edu of cv.education" class="text-xs">
                      <div class="font-bold text-slate-800">{{ edu.degree }} {{ labels.inDegree }} {{ edu.fieldOfStudy }}</div>
                      <div class="text-slate-500 text-[11px]">{{ edu.institution }} ({{ edu.graduationYear }})</div>
                    </div>
                  </div>
                </div>

                <!-- References -->
                <div *ngIf="cv.references?.length">
                  <h3 class="text-xs font-black uppercase tracking-wider text-indigo-600 mb-2">{{ labels.references }}</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div *ngFor="let ref of cv.references" class="p-2 rounded bg-indigo-50/40">
                      <div class="font-bold text-slate-800">{{ ref.name }}</div>
                      <div class="text-slate-500 text-[11px]">{{ ref.jobTitle }} <span *ngIf="ref.company">— {{ ref.company }}</span></div>
                      <div *ngIf="ref.email || ref.phone" class="text-slate-400 text-[10px]"><bdi>{{ ref.email || ref.phone }}</bdi></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- ==================== القالب 5: Classic Ivy (الكلاسيكي الأكاديمي) ==================== -->
            <div *ngIf="cv.templateId === 'classic-ivy'" class="space-y-6">
              <!-- Centered Academic Header -->
              <div class="text-center pb-5 border-b-2" [style.borderColor]="cv.themeColor">
                <div *ngIf="cv.personalInfo.avatarUrl" class="mb-4 flex justify-center">
                  <img [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-24 h-24 rounded-full object-cover shadow-sm border-2" [style.borderColor]="cv.themeColor">
                </div>
                <h1 
                  [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                  (blur)="onInlineTextChange('personalInfo.fullName', $event)" 
                  [class.canva-editable]="isCanvaMode"
                  class="text-3xl font-black tracking-wide text-slate-900"
                >{{ cv.personalInfo.fullName || 'الاسم الكامل' }}</h1>
                <p 
                  [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                  (blur)="onInlineTextChange('personalInfo.jobTitle', $event)" 
                  [class.canva-editable]="isCanvaMode"
                  class="text-base font-bold mt-1" 
                  [style.color]="cv.themeColor"
                >{{ cv.personalInfo.jobTitle || 'المسمى الوظيفي' }}</p>
                <div class="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-slate-500 mt-3">
                  <span *ngIf="cv.personalInfo.email"><bdi>{{ cv.personalInfo.email }}</bdi></span>
                  <span *ngIf="cv.personalInfo.phone">• <bdi>{{ cv.personalInfo.phone }}</bdi></span>
                  <span *ngIf="cv.personalInfo.address">• <bdi>{{ cv.personalInfo.address }}</bdi></span>
                  <span *ngIf="cv.personalInfo.linkedin">• LinkedIn</span>
                  <span *ngIf="cv.personalInfo.website">• {{ isRtl ? 'الموقع الشخصي' : 'Portfolio' }}</span>
                </div>
              </div>

              <!-- Summary -->
              <div *ngIf="cv.personalInfo.summary">
                <h2 class="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b" [style.borderColor]="cv.themeColor" [style.color]="cv.themeColor">{{ labels.academicProfile }}</h2>
                <p 
                  [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                  (blur)="onInlineTextChange('personalInfo.summary', $event)" 
                  [class.canva-editable]="isCanvaMode"
                  class="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify"
                >{{ cv.personalInfo.summary }}</p>
              </div>

              <!-- Education -->
              <div *ngIf="cv.education?.length">
                <h2 class="text-xs font-black uppercase tracking-wider pb-1 mb-3 border-b" [style.borderColor]="cv.themeColor" [style.color]="cv.themeColor">{{ labels.education }}</h2>
                <div class="space-y-3">
                  <div *ngFor="let edu of cv.education">
                    <div class="flex justify-between items-baseline font-bold text-xs text-slate-900">
                      <span>{{ edu.degree }} {{ labels.inDegree }} {{ edu.fieldOfStudy }} — {{ edu.institution }}</span>
                      <span class="text-slate-500 font-normal"><bdi>{{ edu.graduationYear }}</bdi></span>
                    </div>
                    <div *ngIf="edu.grade" class="text-[11px] text-slate-500">{{ labels.grade }}: {{ edu.grade }}</div>
                    <p *ngIf="edu.description" class="text-xs text-slate-600 mt-1">{{ edu.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Experience -->
              <div *ngIf="cv.experiences?.length">
                <h2 class="text-xs font-black uppercase tracking-wider pb-1 mb-3 border-b" [style.borderColor]="cv.themeColor" [style.color]="cv.themeColor">{{ labels.experience }}</h2>
                <div class="space-y-3">
                  <div *ngFor="let exp of cv.experiences">
                    <div class="flex justify-between items-baseline font-bold text-xs text-slate-900">
                      <span>{{ exp.position }} — {{ exp.company }}</span>
                      <span class="text-slate-500 font-normal"><bdi>{{ exp.startDate }} - {{ exp.isCurrent ? labels.present : exp.endDate }}</bdi></span>
                    </div>
                    <p class="text-xs text-slate-600 mt-1 whitespace-pre-line leading-relaxed">{{ exp.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Skills & Languages -->
              <div class="grid grid-cols-2 gap-4">
                <div *ngIf="cv.skills?.length">
                  <h2 class="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b" [style.borderColor]="cv.themeColor" [style.color]="cv.themeColor">{{ labels.skills }}</h2>
                  <div class="text-xs text-slate-700">
                    <span *ngFor="let s of cv.skills; let last = last">{{ s.name }} ({{ s.level }})<span *ngIf="!last"> • </span></span>
                  </div>
                </div>

                <div *ngIf="cv.languages?.length">
                  <h2 class="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b" [style.borderColor]="cv.themeColor" [style.color]="cv.themeColor">{{ labels.languages }}</h2>
                  <div class="text-xs text-slate-700 space-y-1">
                    <div *ngFor="let l of cv.languages" class="flex justify-between">
                      <span>{{ l.name }}</span>
                      <span class="font-bold">{{ l.proficiency }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- References -->
              <div *ngIf="cv.references?.length">
                <h2 class="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b" [style.borderColor]="cv.themeColor" [style.color]="cv.themeColor">{{ labels.references }}</h2>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div *ngFor="let ref of cv.references">
                    <div class="font-bold text-slate-800">{{ ref.name }}</div>
                    <div class="text-slate-500 text-[11px]">{{ ref.jobTitle }} • {{ ref.company }}</div>
                    <div *ngIf="ref.email || ref.phone" class="text-slate-400 text-[10px]"><bdi>{{ ref.email }} {{ ref.phone }}</bdi></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ==================== القالب 6: Tech Developer (التقني المطور) ==================== -->
            <div *ngIf="cv.templateId === 'tech-developer'" class="space-y-6">
              <div class="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
                <div class="flex flex-wrap justify-between items-start gap-4">
                  <div class="flex items-center gap-4">
                    <img *ngIf="cv.personalInfo.avatarUrl" [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-20 h-20 rounded-xl object-cover border-2 border-emerald-400 shadow-lg flex-shrink-0">
                    <div>
                      <div class="text-xs text-emerald-400 font-mono mb-1">// Tech Stack & Developer Profile</div>
                      <h1 
                        [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                        (blur)="onInlineTextChange('personalInfo.fullName', $event)" 
                        [class.canva-editable]="isCanvaMode"
                        class="text-3xl font-black tracking-tight text-white"
                      >{{ cv.personalInfo.fullName || 'الاسم الكامل' }}</h1>
                      <p 
                        [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                        (blur)="onInlineTextChange('personalInfo.jobTitle', $event)" 
                        [class.canva-editable]="isCanvaMode"
                        class="text-sm font-bold text-slate-300 mt-1"
                      >{{ cv.personalInfo.jobTitle || 'Software Engineer' }}</p>
                    </div>
                  </div>
                  <div class="text-left text-xs text-slate-400 font-mono space-y-1">
                    <div *ngIf="cv.personalInfo.email" class="text-emerald-300"><bdi>{{ cv.personalInfo.email }}</bdi></div>
                    <div *ngIf="cv.personalInfo.github" class="text-blue-300"><bdi>{{ cv.personalInfo.github }}</bdi></div>
                    <div *ngIf="cv.personalInfo.address"><bdi>{{ cv.personalInfo.address }}</bdi></div>
                  </div>
                </div>
              </div>

              <div *ngIf="cv.personalInfo.summary" class="p-3.5 rounded-xl bg-slate-50" [class.border-r-4]="isRtl" [class.border-l-4]="!isRtl" [style.borderColor]="cv.themeColor">
                <p 
                  [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                  (blur)="onInlineTextChange('personalInfo.summary', $event)" 
                  [class.canva-editable]="isCanvaMode"
                  class="text-xs text-slate-700 leading-relaxed"
                >{{ cv.personalInfo.summary }}</p>
              </div>

              <!-- Tech Stack Badges -->
              <div *ngIf="cv.skills?.length">
                <h2 class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">// {{ labels.stackSkills }}</h2>
                <div class="flex flex-wrap gap-2">
                  <div *ngFor="let s of cv.skills" class="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full" [style.backgroundColor]="cv.themeColor"></span>
                    <bdi>{{ s.name }}</bdi>
                    <span class="text-[10px] text-slate-400 font-normal">({{ s.level }})</span>
                  </div>
                </div>
              </div>

              <!-- Featured Projects -->
              <div *ngIf="cv.projects?.length">
                <h2 class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2"># {{ labels.projects }}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div *ngFor="let p of cv.projects" class="p-3 rounded-xl border border-slate-200 bg-white">
                    <div class="flex justify-between items-center mb-1">
                      <span class="font-bold text-xs text-slate-800 flex items-center gap-1">
                        <span class="material-symbols-rounded text-xs text-amber-500">bolt</span>
                        <span>{{ p.title }}</span>
                      </span>
                      <span *ngIf="p.link" class="text-[10px] text-blue-600 font-mono underline">Source</span>
                    </div>
                    <p class="text-xs text-slate-600">{{ p.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Work Experience -->
              <div *ngIf="cv.experiences?.length">
                <h2 class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3"># {{ labels.experience }}</h2>
                <div class="space-y-4">
                  <div *ngFor="let exp of cv.experiences" [class.border-r-2]="isRtl" [class.pr-3]="isRtl" [class.border-l-2]="!isRtl" [class.pl-3]="!isRtl" [style.borderColor]="cv.themeColor">
                    <div class="flex justify-between font-bold text-xs text-slate-900">
                      <span>{{ exp.position }} &#64; {{ exp.company }}</span>
                      <span class="font-mono text-[11px] text-slate-500"><bdi>{{ exp.startDate }} - {{ exp.isCurrent ? labels.present : exp.endDate }}</bdi></span>
                    </div>
                    <p class="text-xs text-slate-600 mt-1 whitespace-pre-line leading-relaxed">{{ exp.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Education & References -->
              <div class="grid grid-cols-2 gap-4">
                <div *ngIf="cv.education?.length">
                  <h2 class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2"># {{ labels.education }}</h2>
                  <div *ngFor="let edu of cv.education" class="text-xs space-y-0.5">
                    <div class="font-bold text-slate-800">{{ edu.degree }} {{ labels.inDegree }} {{ edu.fieldOfStudy }}</div>
                    <div class="text-slate-500 text-[11px]">{{ edu.institution }} ({{ edu.graduationYear }})</div>
                  </div>
                </div>

                <div *ngIf="cv.references?.length">
                  <h2 class="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2"># {{ labels.references }}</h2>
                  <div *ngFor="let ref of cv.references" class="text-xs space-y-0.5">
                    <div class="font-bold text-slate-800">{{ ref.name }}</div>
                    <div class="text-slate-500 text-[11px]">{{ ref.jobTitle }} • {{ ref.company }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ==================== القالب 7: Golden Prestige (الذهبي الماسي) ==================== -->
            <div *ngIf="cv.templateId === 'golden-prestige'" class="space-y-6">
              <div class="text-center pb-6 border-b-2 border-amber-500/80">
                <div *ngIf="cv.personalInfo.avatarUrl" class="w-24 h-24 mx-auto rounded-full border-2 border-amber-500 p-1 mb-3 shadow-md">
                  <img [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-full h-full rounded-full object-cover">
                </div>
                <div *ngIf="!cv.personalInfo.avatarUrl" class="w-14 h-14 mx-auto rounded-full border-2 border-amber-500 flex items-center justify-center font-black text-xl text-amber-600 mb-2 shadow-sm">
                  {{ (cv.personalInfo.fullName || 'أ')[0] }}
                </div>
                <h1 
                  [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                  (blur)="onInlineTextChange('personalInfo.fullName', $event)" 
                  [class.canva-editable]="isCanvaMode"
                  class="text-3xl font-black text-slate-900 tracking-wide"
                >{{ cv.personalInfo.fullName || 'الاسم الكامل' }}</h1>
                <p 
                  [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                  (blur)="onInlineTextChange('personalInfo.jobTitle', $event)" 
                  [class.canva-editable]="isCanvaMode"
                  class="text-sm font-bold text-amber-700 tracking-wider mt-1 uppercase"
                >{{ cv.personalInfo.jobTitle || 'Senior Consultant' }}</p>
                
                <div class="flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-slate-500 mt-3">
                  <span *ngIf="cv.personalInfo.email"><bdi>{{ cv.personalInfo.email }}</bdi></span>
                  <span *ngIf="cv.personalInfo.phone">• <bdi>{{ cv.personalInfo.phone }}</bdi></span>
                  <span *ngIf="cv.personalInfo.address">• <bdi>{{ cv.personalInfo.address }}</bdi></span>
                  <span *ngIf="cv.personalInfo.linkedin">• LinkedIn</span>
                </div>
              </div>

              <div *ngIf="cv.personalInfo.summary" class="p-4 rounded-xl bg-amber-50/40 border border-amber-200/60">
                <h2 class="text-xs font-black uppercase tracking-wider text-amber-800 mb-1">{{ labels.consultingProfile }}</h2>
                <p 
                  [attr.contenteditable]="isCanvaMode ? 'true' : null" 
                  (blur)="onInlineTextChange('personalInfo.summary', $event)" 
                  [class.canva-editable]="isCanvaMode"
                  class="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify"
                >{{ cv.personalInfo.summary }}</p>
              </div>

              <div *ngIf="cv.experiences?.length">
                <h2 class="text-xs font-black uppercase tracking-wider text-amber-800 border-b border-amber-200 pb-1 mb-3">{{ labels.experience }}</h2>
                <div class="space-y-4">
                  <div *ngFor="let exp of cv.experiences" [class.border-r-2]="isRtl" [class.pr-3]="isRtl" [class.border-l-2]="!isRtl" [class.pl-3]="!isRtl" class="border-amber-500">
                    <div class="flex justify-between font-bold text-xs text-slate-900">
                      <span>{{ exp.position }} — {{ exp.company }}</span>
                      <span class="text-amber-700 font-semibold"><bdi>{{ exp.startDate }} - {{ exp.isCurrent ? labels.present : exp.endDate }}</bdi></span>
                    </div>
                    <p class="text-xs text-slate-600 mt-1 whitespace-pre-line leading-relaxed">{{ exp.description }}</p>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div *ngIf="cv.education?.length">
                  <h2 class="text-xs font-black uppercase tracking-wider text-amber-800 border-b border-amber-200 pb-1 mb-2">{{ labels.education }}</h2>
                  <div *ngFor="let edu of cv.education" class="text-xs space-y-0.5">
                    <div class="font-bold text-slate-800">{{ edu.degree }} {{ labels.inDegree }} {{ edu.fieldOfStudy }}</div>
                    <div class="text-slate-500 text-[11px]">{{ edu.institution }} ({{ edu.graduationYear }})</div>
                  </div>
                </div>

                <div *ngIf="cv.certifications?.length">
                  <h2 class="text-xs font-black uppercase tracking-wider text-amber-800 border-b border-amber-200 pb-1 mb-2">{{ labels.certifications }}</h2>
                  <div *ngFor="let c of cv.certifications" class="text-xs space-y-0.5">
                    <div class="font-bold text-slate-800">{{ c.name }}</div>
                    <div class="text-slate-500 text-[11px]">{{ c.issuer }} ({{ c.issueDate }})</div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div *ngIf="cv.skills?.length">
                  <h2 class="text-xs font-black uppercase tracking-wider text-amber-800 border-b border-amber-200 pb-1 mb-2">{{ labels.skills }}</h2>
                  <div class="flex flex-wrap gap-1.5">
                    <span *ngFor="let s of cv.skills" class="px-2.5 py-1 text-xs font-semibold rounded bg-amber-50 text-amber-900 border border-amber-200/60">
                      {{ s.name }}
                    </span>
                  </div>
                </div>

                <div *ngIf="cv.languages?.length">
                  <h2 class="text-xs font-black uppercase tracking-wider text-amber-800 border-b border-amber-200 pb-1 mb-2">{{ labels.languages }}</h2>
                  <div class="text-xs text-slate-700 space-y-1">
                    <div *ngFor="let l of cv.languages" class="flex justify-between">
                      <span>{{ l.name }}</span>
                      <span class="font-bold text-amber-800">{{ l.proficiency }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="cv.references?.length">
                <h2 class="text-xs font-black uppercase tracking-wider text-amber-800 border-b border-amber-200 pb-1 mb-2">{{ labels.references }}</h2>
                <div class="grid grid-cols-2 gap-3 text-xs">
                  <div *ngFor="let ref of cv.references" class="p-2.5 rounded bg-amber-50/30 border border-amber-100">
                    <div class="font-bold text-slate-900">{{ ref.name }}</div>
                    <div class="text-amber-800 text-[11px]">{{ ref.jobTitle }} • {{ ref.company }}</div>
                    <div *ngIf="ref.email || ref.phone" class="text-slate-500 text-[10px] mt-0.5"><bdi>{{ ref.email }} | {{ ref.phone }}</bdi></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- عناصر إضافية من كانفا ستوديو برو (QR Code & الختم والتوقيع الرقمي) -->
            <div *ngIf="hasCanvaElement('qr') || hasCanvaElement('signature')" class="mt-8 pt-6 border-t border-dashed border-slate-300 flex flex-wrap items-end justify-between gap-4">
              
              <!-- كود QR للملف الشخصي أو معرض الأعمال -->
              <div *ngIf="hasCanvaElement('qr')" class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-xs">
                <div class="w-14 h-14 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shadow-xs">
                  <span class="material-symbols-rounded text-4xl text-slate-800">qr_code_2</span>
                </div>
                <div class="text-[10px] text-slate-600 leading-tight">
                  <span class="font-bold text-slate-900 block text-xs flex items-center gap-1">
                    <span class="material-symbols-rounded text-sm text-blue-600">qr_code_scanner</span>
                    <span>{{ isRtl ? 'امسح الكود' : 'Scan QR Code' }}</span>
                  </span>
                  <span>{{ isRtl ? 'لزيارة المعرض والملف المهني' : 'Visit portfolio and profile' }}</span>
                </div>
              </div>

              <!-- التوقيع والاعتماد الرقمي -->
              <div *ngIf="hasCanvaElement('signature')" class="text-left ml-auto">
                <div class="font-serif italic text-base font-bold text-indigo-900 tracking-wider">
                  {{ cv.personalInfo.fullName || 'Digital Signature' }}
                </div>
                <div class="h-0.5 w-36 bg-indigo-600 my-1"></div>
                <div class="text-[9px] text-slate-400 font-mono">
                  <span>{{ isRtl ? 'تم الاعتماد والتحقق رقمياً • ' + todayDate : 'Digitally Verified & Certified • ' + todayDate }}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      <!-- ==================== مودال معرض القوالب والثيمات الاحترافي ==================== -->
      <div *ngIf="showGalleryModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-sans">
        <div class="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 relative animate-modal-in overflow-hidden">
          
          <!-- رأس المودال الفاخر -->
          <div class="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/80">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <span class="material-symbols-rounded text-2xl">palette</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">معرض القوالب الاحترافية</h3>
                  <span class="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">7 تصاميم معتمدة للـ ATS</span>
                </div>
                <p class="text-xs text-slate-500 mt-1 font-medium">تصاميم حديثة ومميزة تم إعدادها لتجاوز أنظمة الفرز الآلي وإبهار مسؤولي التوظيف</p>
              </div>
            </div>

            <!-- أزرار التبديل وزر الإغلاق -->
            <div class="flex items-center gap-2.5">
              <!-- أزرار نمط العرض (بطاقات أو معاينة مباشرة) -->
              <div class="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
                <button 
                  (click)="galleryViewMode = 'grid'" 
                  [class.bg-white]="galleryViewMode === 'grid'" 
                  [class.text-blue-700]="galleryViewMode === 'grid'"
                  [class.shadow-xs]="galleryViewMode === 'grid'"
                  class="px-3 py-1.5 rounded-lg text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span class="material-symbols-rounded text-sm">grid_view</span>
                  <span>شبكة القوالب</span>
                </button>
                <button 
                  (click)="galleryViewMode = 'livePreview'" 
                  [class.bg-white]="galleryViewMode === 'livePreview'" 
                  [class.text-blue-700]="galleryViewMode === 'livePreview'"
                  [class.shadow-xs]="galleryViewMode === 'livePreview'"
                  class="px-3 py-1.5 rounded-lg text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span class="material-symbols-rounded text-sm">visibility</span>
                  <span>معاينة حية مباشرة</span>
                </button>
              </div>

              <!-- زر الإغلاق -->
              <button 
                (click)="showGalleryModal = false" 
                title="إغلاق المعرض"
                class="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span class="material-symbols-rounded text-xl">close</span>
              </button>
            </div>
          </div>

          <!-- ================= نمط العرض 1: شبكة القوالب (Grid View) ================= -->
          <ng-container *ngIf="galleryViewMode === 'grid'">
            
            <!-- شريط الفلاتر والتبويبات -->
            <div class="px-6 py-3 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-4">
              <!-- تصنيفات القوالب -->
              <div class="flex flex-wrap items-center gap-2">
                <button 
                  *ngFor="let cat of templateCategories"
                  (click)="selectedCategory = cat.id"
                  [class.bg-blue-600]="selectedCategory === cat.id"
                  [class.text-white]="selectedCategory === cat.id"
                  [class.bg-slate-100]="selectedCategory !== cat.id"
                  [class.text-slate-600]="selectedCategory !== cat.id"
                  class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {{ cat.label }}
                </button>
              </div>

              <!-- فلتر مجاني / Pro -->
              <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button 
                  (click)="selectedTier = 'all'" 
                  [class.bg-white]="selectedTier === 'all'" 
                  [class.shadow-sm]="selectedTier === 'all'"
                  class="px-3 py-1 rounded-lg text-slate-700 cursor-pointer"
                >
                  الكل (7)
                </button>
                <button 
                  (click)="selectedTier = 'free'" 
                  [class.bg-white]="selectedTier === 'free'" 
                  [class.shadow-sm]="selectedTier === 'free'"
                  class="px-3 py-1 rounded-lg text-emerald-700 cursor-pointer"
                >
                  مجاني شامل (3)
                </button>
                <button 
                  (click)="selectedTier = 'pro'" 
                  [class.bg-white]="selectedTier === 'pro'" 
                  [class.shadow-sm]="selectedTier === 'pro'"
                  class="px-3 py-1 rounded-lg text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <span class="material-symbols-rounded text-xs text-amber-500">workspace_premium</span>
                  <span>Pro محترفين (4)</span>
                </button>
              </div>
            </div>

            <!-- شبكة عرض القوالب -->
            <div class="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/60">
              
              <div 
                *ngFor="let tmpl of filteredTemplates"
                [class.ring-2]="cv.templateId === tmpl.id"
                [class.ring-blue-600]="cv.templateId === tmpl.id"
                class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
              >
                
                <!-- مصغر ورقة الـ CV الواقعي بالحجم المناسب -->
                <div class="h-72 bg-gradient-to-b from-slate-100 via-slate-150 to-slate-200 p-4 flex items-center justify-center relative overflow-hidden group-hover:from-blue-50/40 group-hover:to-indigo-50/40 transition-colors">
                  
                  <!-- شارات علوية واضحة -->
                  <div class="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
                    <span class="badge bg-white/95 text-slate-700 text-[10px] font-bold py-1 px-2.5 rounded-lg shadow-sm border border-slate-200">
                      {{ tmpl.categoryLabel }}
                    </span>
                    <span *ngIf="tmpl.isPro" class="badge badge-pro text-[10px] font-bold py-1 px-2.5 shadow-sm inline-flex items-center gap-1">
                      <span class="material-symbols-rounded text-xs text-amber-500">workspace_premium</span>
                      <span>Pro محترفين</span>
                    </span>
                    <span *ngIf="!tmpl.isPro" class="badge badge-emerald text-[10px] font-bold py-1 px-2.5 shadow-sm inline-flex items-center gap-1">
                      <span class="material-symbols-rounded text-xs text-emerald-600">check</span>
                      <span>مجاني شامل</span>
                    </span>
                  </div>

                  <!-- ورقة السيرة المصغرة A4 الواقعية -->
                  <div class="w-52 h-64 bg-white rounded-xl shadow-lg border border-slate-300/80 p-3 text-right flex flex-col justify-between overflow-hidden relative select-none transform transition-transform duration-300 group-hover:scale-105">
                    
                    <!-- 1. القالب العصري Modern Vibrant -->
                    <div *ngIf="tmpl.id === 'modern-vibrant'" class="flex flex-col h-full justify-between">
                      <div>
                        <div class="h-1.5 bg-blue-600 -mx-3 -mt-3 mb-2"></div>
                        <div class="text-[9px] font-black text-blue-700 leading-tight">أحمد محمود</div>
                        <div class="text-[6.5px] font-bold text-slate-500 mb-1">مهندس برمجيات وتطبيقات سحابية</div>
                        <div class="flex gap-1.5 text-[5px] text-slate-400 pb-1.5 border-b border-slate-100">
                          <span>ahmed.dev</span>
                          <span>• فلسطين</span>
                        </div>
                        <div class="mt-2">
                          <div class="text-[6px] font-black text-blue-600 border-r-2 border-blue-600 pr-1 mb-1">الخبرات المهنية</div>
                          <div class="text-[5.5px] font-bold text-slate-800">Senior Full-Stack Developer</div>
                          <div class="text-[5px] text-slate-400">شركة الحلول الرقمية • 2023 - الآن</div>
                        </div>
                      </div>
                      <div>
                        <div class="text-[6px] font-black text-blue-600 border-r-2 border-blue-600 pr-1 mb-1">المهارات التقنية</div>
                        <div class="flex flex-wrap gap-1">
                          <span class="text-[5px] font-bold bg-blue-50 text-blue-700 px-1 py-0.5 rounded border border-blue-200">Angular</span>
                          <span class="text-[5px] font-bold bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded border border-indigo-200">Node.js</span>
                          <span class="text-[5px] font-bold bg-slate-100 text-slate-700 px-1 py-0.5 rounded">Docker</span>
                        </div>
                      </div>
                    </div>

                    <!-- 2. الأنيق البسيط Minimalist Nordic -->
                    <div *ngIf="tmpl.id === 'minimal-clean'" class="flex flex-col h-full justify-between">
                      <div>
                        <div class="text-[10px] font-black text-slate-900 tracking-wider">أحمد محمود</div>
                        <div class="text-[6px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Software Engineer</div>
                        <div class="border-b border-slate-300 my-1.5"></div>
                        <div class="text-[5px] text-slate-500 mb-2">Ramallah, Palestine • ahmed@example.com</div>
                        <div class="space-y-1.5">
                          <div class="text-[6px] font-bold text-slate-900 uppercase">EXPERIENCE</div>
                          <div class="text-[5.5px] font-bold text-slate-800">Senior Full-Stack Developer</div>
                          <div class="text-[5px] text-slate-500">Digital Solutions • 2023 - Present</div>
                        </div>
                      </div>
                      <div class="pt-2 border-t border-slate-100">
                        <div class="text-[6px] font-bold text-slate-900 uppercase mb-1">SKILLS</div>
                        <div class="text-[5px] text-slate-600">TypeScript, Node.js, MongoDB, Clean Architecture</div>
                      </div>
                    </div>

                    <!-- 3. الكلاسيكي الأكاديمي Classic Ivy -->
                    <div *ngIf="tmpl.id === 'classic-ivy'" class="flex flex-col h-full justify-between">
                      <div>
                        <div class="text-center pb-1">
                          <div class="text-[10px] font-black text-slate-900 font-serif">أحمد محمود</div>
                          <div class="text-[6px] text-slate-600 font-serif mt-0.5">بكالوريوس هندسة الحاسوب</div>
                          <div class="text-[5px] text-slate-500 mt-0.5">فلسطين • ahmed.dev@example.com</div>
                        </div>
                        <div class="border-b-2 border-double border-slate-800 my-1"></div>
                        <div class="text-center text-[6px] font-black text-slate-800 my-1 font-serif">— الخبرات الوظيفية والأكاديمية —</div>
                        <div class="space-y-1">
                          <div class="text-[5.5px] font-bold text-slate-900">مطور برمجيات متقدم</div>
                          <div class="text-[5px] text-slate-500">شركة النظم الحديثة • ٢٠٢١ - الآن</div>
                        </div>
                      </div>
                      <div class="border-t border-slate-200 pt-1 text-center">
                        <div class="text-[6px] font-serif text-slate-700">المؤهل: ممتاز مع مرتبة الشرف</div>
                      </div>
                    </div>

                    <!-- 4. التنفيذي الفاخر Executive Slate -->
                    <div *ngIf="tmpl.id === 'executive-slate'" class="flex flex-col h-full justify-between">
                      <div>
                        <div class="bg-slate-900 text-white -mx-3 -mt-3 p-2 mb-2 rounded-t-lg">
                          <div class="flex justify-between items-center">
                            <div>
                              <div class="text-[9px] font-black text-white">أحمد محمود</div>
                              <div class="text-[6px] font-semibold text-amber-400 uppercase tracking-wider">Chief Technology Officer</div>
                            </div>
                            <span class="text-[5px] bg-white/20 text-white px-1.5 py-0.5 rounded font-mono">EXEC</span>
                          </div>
                        </div>
                        <div class="p-1 bg-amber-50/50 border-r-2 border-amber-500 text-[5px] text-slate-700 leading-tight mb-2">
                          قيادي تقني يتمتع بخبرة استراتيجية في إدارة المشاريع السحابية وتطوير الحلول الكبرى.
                        </div>
                        <div class="text-[6px] font-black text-slate-900 mb-1">المحطات القيادية والمهنية</div>
                        <div class="text-[5.5px] font-bold text-slate-800">رئيس قطاع الحلول الرقمية</div>
                        <div class="text-[5px] text-slate-500">مجموعة الابتكار • 2022 - الآن</div>
                      </div>
                      <div class="border-t border-slate-200 pt-1">
                        <div class="text-[5.5px] font-bold text-amber-800">إدارة الفرق • قيادة التحول الرقمي</div>
                      </div>
                    </div>

                    <!-- 5. الإبداعي ثنائي الأعمدة Creative Two-Column -->
                    <div *ngIf="tmpl.id === 'creative-indigo'" class="flex h-full -m-3">
                      <!-- عمود جانبي 35% -->
                      <div class="w-[38%] bg-indigo-50 border-l border-indigo-100 p-2 flex flex-col justify-between">
                        <div>
                          <div class="w-6 h-6 rounded-full bg-indigo-600 text-white text-[7px] font-black flex items-center justify-center mx-auto mb-1.5 shadow-xs">
                            AM
                          </div>
                          <div class="text-[5.5px] font-black text-indigo-950 text-center mb-1">أحمد محمود</div>
                          <div class="text-[4.5px] text-indigo-700 text-center mb-2">Product Designer</div>
                          <div class="space-y-1">
                            <div class="text-[4.5px] font-bold text-indigo-900">المهارات:</div>
                            <div class="w-full bg-indigo-200 h-1 rounded"><div class="bg-indigo-600 h-full w-[90%] rounded"></div></div>
                            <div class="w-full bg-indigo-200 h-1 rounded"><div class="bg-indigo-600 h-full w-[80%] rounded"></div></div>
                          </div>
                        </div>
                        <div class="text-[4.5px] text-indigo-600 text-center">ahmed@ui</div>
                      </div>
                      <!-- محتوى رئيسي 65% -->
                      <div class="w-[62%] p-2 flex flex-col justify-between">
                        <div>
                          <div class="text-[6.5px] font-black text-indigo-900 mb-1 pb-0.5 border-b border-indigo-100">الخبرات العملية</div>
                          <div class="text-[5.5px] font-bold text-slate-800">UI/UX & Frontend Lead</div>
                          <div class="text-[5px] text-slate-500">Creative Hub • 2022 - الآن</div>
                          <div class="text-[5px] text-slate-600 mt-1">تصميم وتطوير واجهات تفاعلية حديثة</div>
                        </div>
                        <div>
                          <div class="text-[6px] font-black text-indigo-900 mb-1">المشاريع البارزة</div>
                          <div class="text-[5px] text-slate-700">• منصة سيرتي الذكية</div>
                        </div>
                      </div>
                    </div>

                    <!-- 6. التقني للمطورين Tech Developer -->
                    <div *ngIf="tmpl.id === 'tech-developer'" class="flex flex-col h-full justify-between">
                      <div>
                        <div class="bg-slate-900 text-white -mx-3 -mt-3 px-2 py-1 flex items-center justify-between mb-1.5 font-mono rounded-t-lg">
                          <div class="flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          </div>
                          <span class="text-[5px] text-emerald-400 font-mono">bash: ~/developer</span>
                        </div>
                        <div class="text-[8px] font-mono font-bold text-slate-900">$ whoami > Ahmed Dev</div>
                        <div class="text-[5.5px] font-mono text-emerald-600 mb-1.5">Senior Cloud & Backend Engineer</div>
                        <div class="flex flex-wrap gap-1 mb-2">
                          <span class="text-[4.5px] font-mono bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded font-bold">#TypeScript</span>
                          <span class="text-[4.5px] font-mono bg-blue-100 text-blue-800 px-1 py-0.5 rounded font-bold">#Docker</span>
                          <span class="text-[4.5px] font-mono bg-purple-100 text-purple-800 px-1 py-0.5 rounded font-bold">#GraphQL</span>
                        </div>
                        <div class="text-[5.5px] font-mono font-bold text-slate-800">> Experience: Tech Lead @ CloudOps</div>
                      </div>
                      <div class="border-t border-slate-200 pt-1 font-mono text-[5px] text-slate-500">
                        github.com/ahmed-dev
                      </div>
                    </div>

                    <!-- 7. الذهبي الماسي Golden Prestige -->
                    <div *ngIf="tmpl.id === 'golden-prestige'" class="border-2 border-amber-400 -m-2 p-2 bg-gradient-to-b from-amber-50/20 to-white flex-1 flex flex-col justify-between">
                      <div>
                        <div class="text-center pb-1">
                          <span class="material-symbols-rounded text-amber-500 text-xs">diamond</span>
                          <div class="text-[9px] font-black text-slate-900 font-serif tracking-wide">أحمد محمود</div>
                          <div class="text-[5.5px] text-amber-700 font-serif font-bold">SENIOR EXECUTIVE CONSULTANT</div>
                        </div>
                        <div class="border-b border-amber-300 my-1 text-center">
                          <span class="bg-white px-1 text-[4.5px] text-amber-600 relative -top-1">◆</span>
                        </div>
                        <div class="text-[5.5px] font-bold text-slate-900 font-serif mb-0.5">الخبرات الاستشارية والتنفيذية</div>
                        <div class="text-[5px] text-slate-600 font-serif">المستشار الاستراتيجي الأول للتحول المؤسسي</div>
                      </div>
                      <div class="text-center border-t border-amber-200 pt-1 text-[5px] text-amber-800 font-serif">
                        التميز المؤسسي • الاستشارات الدولية
                      </div>
                    </div>

                  </div>

                  <!-- طبقة التفاعل عند التحويم (Hover Action Overlay) -->
                  <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity p-4 z-20">
                    <button 
                      (click)="openFullPreview(tmpl)" 
                      class="btn bg-white hover:bg-slate-100 text-slate-900 text-xs py-2 px-3.5 font-black rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <span class="material-symbols-rounded text-sm">visibility</span>
                      <span>معاينة بالحجم الكامل</span>
                    </button>
                  </div>

                </div>

                <!-- بطاقة تفاصيل القالب -->
                <div class="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <!-- اسم القالب بالعربي والإنجليزي بدون أي تداخل أو انعكاس -->
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 class="text-base font-black text-slate-900 leading-snug">
                          {{ tmpl.arabicName }}
                        </h4>
                        <span dir="ltr" class="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60 inline-block mt-0.5">
                          {{ tmpl.englishName }}
                        </span>
                      </div>
                      <span *ngIf="cv.templateId === tmpl.id" class="badge badge-emerald text-[10px] py-1 px-2.5 shadow-xs inline-flex items-center gap-1">
                        <span class="material-symbols-rounded text-xs text-emerald-600">check</span>
                        <span>مفعّل حالياً</span>
                      </span>
                    </div>

                    <!-- نبذة عن القالب -->
                    <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3 font-medium">
                      {{ tmpl.description }}
                    </p>

                    <!-- لمن يصلح هذا القالب -->
                    <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs mb-3.5 flex items-center gap-1.5">
                      <span class="material-symbols-rounded text-sm text-indigo-600 flex-shrink-0">ads_click</span>
                      <span class="font-black text-slate-800">مثالي لـ: </span>
                      <span class="text-slate-600 font-medium">{{ tmpl.recommendedFor }}</span>
                    </div>

                    <!-- مزايا القالب -->
                    <div class="grid grid-cols-2 gap-1.5 mb-4 text-[11px] text-slate-600 font-medium">
                      <div *ngFor="let feat of tmpl.features.slice(0, 2)" class="flex items-center gap-1">
                        <span class="material-symbols-rounded text-xs text-emerald-500">check</span>
                        <span class="truncate">{{ feat }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- زر تطبيق القالب الثابت والواضح تماماً -->
                  <div class="pt-3 border-t border-slate-100 mt-auto">
                    <button 
                      *ngIf="cv.templateId === tmpl.id"
                      class="w-full py-2.5 px-4 rounded-xl font-black text-xs bg-emerald-500 text-white shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-default"
                    >
                      <span class="material-symbols-rounded text-sm">check_circle</span>
                      <span>القالب النشط حالياً</span>
                    </button>

                    <button 
                      *ngIf="cv.templateId !== tmpl.id && !tmpl.isPro"
                      (click)="applyTemplateFromGallery(tmpl)"
                      class="w-full py-2.5 px-4 rounded-xl font-black text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span class="material-symbols-rounded text-sm">rocket_launch</span>
                      <span>تطبيق هذا القالب (مجاني)</span>
                    </button>

                    <button 
                      *ngIf="cv.templateId !== tmpl.id && tmpl.isPro"
                      (click)="applyTemplateFromGallery(tmpl)"
                      class="w-full py-2.5 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span class="material-symbols-rounded text-sm">workspace_premium</span>
                      <span>اختيار وتفعيل قالب Pro</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </ng-container>

          <!-- ================= نمط العرض 2: المعاينة الحية المباشرة (Live Full Preview) ================= -->
          <ng-container *ngIf="galleryViewMode === 'livePreview'">
            
            <div class="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100">
              
              <!-- شريط جانبي لاختيار القالب -->
              <div class="w-full md:w-80 bg-white border-l border-slate-200 p-4 overflow-y-auto flex-shrink-0 flex flex-col gap-2">
                <div class="text-xs font-black text-slate-800 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>اختر قالباً للمعاينة الحية:</span>
                  <span class="text-[10px] text-slate-400 font-normal">بياناتك الفعلية</span>
                </div>

                <div 
                  *ngFor="let tmpl of templates"
                  (click)="previewTemplate = tmpl"
                  [class.ring-2]="previewTemplate.id === tmpl.id"
                  [class.ring-blue-600]="previewTemplate.id === tmpl.id"
                  [class.bg-blue-50/60]="previewTemplate.id === tmpl.id"
                  class="p-3 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between gap-3 text-right"
                >
                  <div>
                    <div class="font-bold text-xs text-slate-900">{{ tmpl.arabicName }}</div>
                    <div class="text-[10px] font-mono text-slate-500" dir="ltr">{{ tmpl.englishName }}</div>
                  </div>
                  <div class="flex items-center gap-1.5 flex-shrink-0">
                    <span *ngIf="tmpl.isPro" class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 inline-flex items-center gap-0.5">
                      <span class="material-symbols-rounded text-[10px] text-amber-600">workspace_premium</span>
                      <span>PRO</span>
                    </span>
                    <span *ngIf="!tmpl.isPro" class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">مجاني</span>
                    <span *ngIf="cv.templateId === tmpl.id" class="text-emerald-600 font-bold text-xs">
                      <span class="material-symbols-rounded text-sm">check_circle</span>
                    </span>
                  </div>
                </div>

                <!-- زر اعتماد القالب المختار -->
                <div class="mt-auto pt-3 border-t border-slate-100">
                  <button 
                    (click)="applyTemplateFromGallery(previewTemplate)"
                    class="btn btn-primary w-full py-3 text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span class="material-symbols-rounded text-sm">rocket_launch</span>
                    <span>اعتماد وتطبيق هذا القالب</span>
                  </button>
                </div>
              </div>

              <!-- مساحة المعاينة الحية بحجمها الكامل A4 -->
              <div class="flex-1 p-4 sm:p-8 overflow-y-auto flex items-start justify-center bg-slate-200/70">
                <div class="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-300 p-8 text-slate-800 min-h-[850px] relative">
                  
                  <!-- شارة القالب المعروض -->
                  <div class="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                    <div class="flex items-center gap-2">
                      <span>معاينة حية لقالب:</span>
                      <span class="text-blue-600 font-black">{{ previewTemplate.arabicName }}</span>
                      <span dir="ltr" class="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{{ previewTemplate.englishName }}</span>
                    </div>
                    <button 
                      (click)="applyTemplateFromGallery(previewTemplate)"
                      class="btn btn-primary text-xs py-1.5 px-3 shadow-xs flex items-center gap-1.5"
                    >
                      <span class="material-symbols-rounded text-sm">rocket_launch</span>
                      <span>تطبيق الآن</span>
                    </button>
                  </div>

                  <!-- معاينة القالب 1: Modern Vibrant -->
                  <div *ngIf="previewTemplate.id === 'modern-vibrant'" class="space-y-6">
                    <div class="border-b-2 pb-5 flex items-start justify-between gap-3" [style.borderColor]="previewTemplate.accentDefault">
                      <div>
                        <h1 class="text-2xl font-black" [style.color]="previewTemplate.accentDefault">{{ cv.personalInfo.fullName || 'أحمد محمود' }}</h1>
                        <p class="text-base font-bold text-slate-600 mt-1">{{ cv.personalInfo.jobTitle || 'مهندس برمجيات وتطبيقات سحابية' }}</p>
                      </div>
                      <img *ngIf="cv.personalInfo.avatarUrl" [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-16 h-16 rounded-xl object-cover border-2 shadow-xs" [style.borderColor]="previewTemplate.accentDefault">
                    </div>
                    <div class="flex flex-wrap gap-3 text-xs text-slate-500 -mt-3 mb-4">
                      <span *ngIf="cv.personalInfo.email" class="inline-flex items-center gap-1">
                        <span class="material-symbols-rounded text-xs text-blue-600">mail</span>
                        <span>{{ cv.personalInfo.email }}</span>
                      </span>
                      <span *ngIf="cv.personalInfo.phone" class="inline-flex items-center gap-1">
                        <span class="material-symbols-rounded text-xs text-blue-600">call</span>
                        <span>{{ cv.personalInfo.phone }}</span>
                      </span>
                      <span *ngIf="cv.personalInfo.address" class="inline-flex items-center gap-1">
                        <span class="material-symbols-rounded text-xs text-blue-600">location_on</span>
                        <span>{{ cv.personalInfo.address }}</span>
                      </span>
                    </div>
                    <div>
                      <h2 class="text-xs font-black uppercase tracking-wider mb-2" [style.color]="previewTemplate.accentDefault">النبذة المهنية</h2>
                      <p class="text-xs text-slate-600 leading-relaxed">{{ cv.personalInfo.summary || 'مهندس برمجيات شغوف ومبدع يتمتع بخبرة تزيد عن 4 سنوات في تطوير تطبيقات الويب الحديثة وحلول السحابة.' }}</p>
                    </div>
                    <div>
                      <h2 class="text-xs font-black uppercase tracking-wider mb-2" [style.color]="previewTemplate.accentDefault">الخبرات المهنية</h2>
                      <div class="border-r-2 pr-3 space-y-2" [style.borderColor]="previewTemplate.accentDefault">
                        <div class="font-bold text-xs text-slate-800">Senior Full-Stack Developer • شركة الحلول الرقمية</div>
                        <div class="text-[11px] text-slate-500 leading-relaxed">قيادة وتطوير تطبيقات الويب وتحسين سرعة الاستجابة بنسبة 45%.</div>
                      </div>
                    </div>
                  </div>

                  <!-- معاينة القالب 2: Minimal Nordic -->
                  <div *ngIf="previewTemplate.id === 'minimal-clean'" class="space-y-6">
                    <div class="pb-4 border-b border-slate-300 text-center">
                      <div *ngIf="cv.personalInfo.avatarUrl" class="mb-3 flex justify-center">
                        <img [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-16 h-16 rounded-full object-cover shadow-xs border border-slate-300">
                      </div>
                      <h1 class="text-2xl font-black text-slate-900 tracking-wide">{{ cv.personalInfo.fullName || 'أحمد محمود' }}</h1>
                      <p class="text-sm font-semibold text-slate-600 uppercase tracking-widest mt-1">{{ cv.personalInfo.jobTitle || 'Senior Software Engineer' }}</p>
                      <div class="flex justify-center gap-4 text-xs text-slate-500 mt-2 font-mono">
                        <span>{{ cv.personalInfo.email }}</span>
                        <span>{{ cv.personalInfo.phone }}</span>
                        <span>{{ cv.personalInfo.address }}</span>
                      </div>
                    </div>
                    <div>
                      <h2 class="text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">SUMMARY</h2>
                      <p class="text-xs text-slate-600 leading-relaxed">{{ cv.personalInfo.summary }}</p>
                    </div>
                    <div>
                      <h2 class="text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">EXPERIENCE</h2>
                      <div class="text-xs font-bold text-slate-800">Senior Developer — Digital Solutions Co.</div>
                      <div class="text-[11px] text-slate-600 mt-1">تطوير بنية برمجية قابلة للتوسع وتطبيق أفضل معايير الأمان.</div>
                    </div>
                  </div>

                  <!-- معاينة القالب 3: Classic Ivy -->
                  <div *ngIf="previewTemplate.id === 'classic-ivy'" class="space-y-6 font-serif">
                    <div class="text-center pb-4 border-b-2 border-double border-slate-900">
                      <div *ngIf="cv.personalInfo.avatarUrl" class="mb-3 flex justify-center">
                        <img [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-16 h-16 rounded-full object-cover shadow-xs border border-slate-400">
                      </div>
                      <h1 class="text-3xl font-black text-slate-900">{{ cv.personalInfo.fullName || 'أحمد محمود' }}</h1>
                      <p class="text-base text-slate-700 italic mt-1">{{ cv.personalInfo.jobTitle || 'مهندس برمجيات' }}</p>
                      <p class="text-xs text-slate-500 mt-2 font-sans">{{ cv.personalInfo.address }} • {{ cv.personalInfo.email }} • {{ cv.personalInfo.phone }}</p>
                    </div>
                    <div class="text-center">
                      <h2 class="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">— النبذة والهدف المهني —</h2>
                      <p class="text-xs text-slate-600 leading-relaxed font-sans">{{ cv.personalInfo.summary }}</p>
                    </div>
                  </div>

                  <!-- معاينة القالب 4: Executive Slate -->
                  <div *ngIf="previewTemplate.id === 'executive-slate'" class="space-y-6">
                    <div class="bg-slate-900 text-white -m-8 p-8 mb-6 rounded-t-2xl">
                      <div class="flex justify-between items-start">
                        <div class="flex items-center gap-3">
                          <img *ngIf="cv.personalInfo.avatarUrl" [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-14 h-14 rounded-xl object-cover border border-amber-400/80 shadow-md">
                          <div>
                            <h1 class="text-2xl font-black">{{ cv.personalInfo.fullName || 'أحمد محمود' }}</h1>
                            <p class="text-sm font-semibold text-amber-400 uppercase tracking-wider mt-1">{{ cv.personalInfo.jobTitle || 'Chief Technology Officer' }}</p>
                          </div>
                        </div>
                        <span class="badge bg-amber-500 text-slate-950 font-black text-xs px-3 py-1">EXECUTIVE</span>
                      </div>
                      <div class="flex gap-4 text-xs text-slate-300 mt-4">
                        <span class="inline-flex items-center gap-1">
                          <span class="material-symbols-rounded text-xs text-amber-400">mail</span>
                          <span>{{ cv.personalInfo.email }}</span>
                        </span>
                        <span class="inline-flex items-center gap-1">
                          <span class="material-symbols-rounded text-xs text-amber-400">call</span>
                          <span>{{ cv.personalInfo.phone }}</span>
                        </span>
                        <span class="inline-flex items-center gap-1">
                          <span class="material-symbols-rounded text-xs text-amber-400">location_on</span>
                          <span>{{ cv.personalInfo.address }}</span>
                        </span>
                      </div>
                    </div>
                    <div class="p-3 bg-slate-50 border-r-4 border-amber-500 rounded-lg">
                      <h2 class="text-xs font-black text-slate-900 mb-1">الرؤية والقيادة التنفيذية</h2>
                      <p class="text-xs text-slate-600 leading-relaxed">{{ cv.personalInfo.summary }}</p>
                    </div>
                  </div>

                  <!-- معاينة القالب 5: Creative Indigo -->
                  <div *ngIf="previewTemplate.id === 'creative-indigo'" class="grid grid-cols-12 gap-6 -m-8 min-h-[750px]">
                    <div class="col-span-4 bg-indigo-50/80 p-6 border-l border-indigo-100 flex flex-col justify-between rounded-r-2xl">
                      <div>
                        <img *ngIf="cv.personalInfo.avatarUrl" [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-14 h-14 rounded-2xl object-cover mx-auto mb-3 shadow-md border border-indigo-200">
                        <div *ngIf="!cv.personalInfo.avatarUrl" class="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-3 shadow-md">
                          {{ (cv.personalInfo.fullName || 'أ')[0] }}
                        </div>
                        <div class="text-center mb-4">
                          <h3 class="font-black text-indigo-950 text-sm">{{ cv.personalInfo.fullName }}</h3>
                          <p class="text-xs font-bold text-indigo-600">{{ cv.personalInfo.jobTitle }}</p>
                        </div>
                        <div class="space-y-2 text-xs text-slate-600">
                          <div class="flex items-center gap-1">
                            <span class="material-symbols-rounded text-xs text-indigo-600">location_on</span>
                            <span>{{ cv.personalInfo.address }}</span>
                          </div>
                          <div class="flex items-center gap-1">
                            <span class="material-symbols-rounded text-xs text-indigo-600">mail</span>
                            <span>{{ cv.personalInfo.email }}</span>
                          </div>
                          <div class="flex items-center gap-1">
                            <span class="material-symbols-rounded text-xs text-indigo-600">call</span>
                            <span>{{ cv.personalInfo.phone }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-span-8 p-6 space-y-5">
                      <div>
                        <h2 class="text-xs font-black text-indigo-900 border-b border-indigo-200 pb-1 mb-2">نبذة مهنية</h2>
                        <p class="text-xs text-slate-600 leading-relaxed">{{ cv.personalInfo.summary }}</p>
                      </div>
                      <div>
                        <h2 class="text-xs font-black text-indigo-900 border-b border-indigo-200 pb-1 mb-2">الخبرات الوظيفية</h2>
                        <div class="space-y-3">
                          <div *ngFor="let exp of cv.experiences" class="text-xs">
                            <div class="font-bold text-slate-800">{{ exp.position }}</div>
                            <div class="text-slate-500 text-[11px]">{{ exp.company }}</div>
                            <p class="text-slate-600 text-[11px] mt-1">{{ exp.description }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- معاينة القالب 6: Tech Developer -->
                  <div *ngIf="previewTemplate.id === 'tech-developer'" class="space-y-5 font-mono">
                    <div class="bg-slate-900 text-white -m-8 p-6 mb-4 rounded-t-2xl">
                      <div class="flex items-center gap-1.5 mb-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span class="text-xs text-slate-400 font-mono mr-2">bash: ~/profile.sh</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <img *ngIf="cv.personalInfo.avatarUrl" [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-14 h-14 rounded-xl object-cover border border-emerald-400 shadow-md">
                        <div>
                          <h1 class="text-2xl font-black text-emerald-400">$ whoami > {{ cv.personalInfo.fullName }}</h1>
                          <p class="text-sm text-slate-300 font-bold mt-1"># {{ cv.personalInfo.jobTitle }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span class="text-emerald-700 font-bold">// Overview: </span>
                      <span>{{ cv.personalInfo.summary }}</span>
                    </div>
                  </div>

                  <!-- معاينة القالب 7: Golden Prestige -->
                  <div *ngIf="previewTemplate.id === 'golden-prestige'" class="border-2 border-amber-400/90 -m-8 p-8 min-h-[750px] bg-gradient-to-b from-amber-50/20 to-white rounded-2xl flex flex-col justify-between font-serif">
                    <div class="space-y-6">
                      <div class="text-center pb-4">
                        <div *ngIf="cv.personalInfo.avatarUrl" class="w-16 h-16 mx-auto rounded-full border-2 border-amber-500 p-0.5 mb-2 shadow-sm">
                          <img [src]="cv.personalInfo.avatarUrl" alt="الصورة الشخصية" class="w-full h-full rounded-full object-cover">
                        </div>
                        <span *ngIf="!cv.personalInfo.avatarUrl" class="material-symbols-rounded text-2xl text-amber-500">diamond</span>
                        <h1 class="text-3xl font-black text-slate-900 tracking-wide">{{ cv.personalInfo.fullName }}</h1>
                        <p class="text-sm font-bold text-amber-700 mt-1 uppercase tracking-wider">{{ cv.personalInfo.jobTitle }}</p>
                        <div class="border-b border-amber-300 my-3 text-center">
                          <span class="bg-white px-2 text-xs text-amber-600 relative -top-2">◆</span>
                        </div>
                      </div>
                      <div>
                        <h2 class="text-xs font-black uppercase text-amber-800 tracking-wider mb-2 font-sans">الملف الاستشاري والشخصي</h2>
                        <p class="text-xs text-slate-600 leading-relaxed font-sans">{{ cv.personalInfo.summary }}</p>
                      </div>
                    </div>
                    <div class="text-center text-xs text-amber-800 font-sans border-t border-amber-200 pt-3">
                      {{ cv.personalInfo.email }} • {{ cv.personalInfo.phone }} • {{ cv.personalInfo.address }}
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </ng-container>

        </div>
      </div>

      <!-- مودال الاستيراد بالذكاء الاصطناعي السريع داخل المحرر -->
      <div *ngIf="showAiModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
        <div class="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative animate-fade-in">
          <button (click)="showAiModal = false" class="absolute top-6 left-6 text-slate-400 hover:text-slate-700 cursor-pointer">
            <span class="material-symbols-rounded text-lg">close</span>
          </button>

          <div class="text-center mb-6">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-md mb-3">
              <span class="material-symbols-rounded text-3xl">smart_toy</span>
            </div>
            <h3 class="text-xl font-black text-slate-900">استيراد بالذكاء الاصطناعي</h3>
            <p class="text-slate-500 text-xs mt-1">ارفع سيرتك الذاتية (PDF) لتعبئة هذا النموذج تلقائياً</p>
          </div>

          <div class="border-2 border-dashed border-purple-200 rounded-2xl p-6 text-center bg-purple-50/30 mb-4 relative cursor-pointer hover:border-purple-400 transition-colors">
            <input type="file" (change)="onFileSelected($event)" accept=".pdf,.txt" class="absolute inset-0 opacity-0 cursor-pointer">
            <div *ngIf="!selectedFile" class="text-xs text-purple-700 font-bold flex items-center justify-center gap-1.5">
              <span class="material-symbols-rounded text-base">cloud_upload</span>
              <span>اسحب ملف الـ PDF هنا أو انقر للاختيار</span>
            </div>
            <div *ngIf="selectedFile" class="text-xs text-purple-700 font-bold flex items-center justify-center gap-1.5">
              <span class="material-symbols-rounded text-base">description</span>
              <span>{{ selectedFile.name }}</span>
            </div>
          </div>

          <button 
            (click)="processAiUpload()" 
            [disabled]="!selectedFile || isParsingAi"
            class="btn btn-ai w-full py-2.5 text-xs font-bold shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span *ngIf="!isParsingAi" class="flex items-center gap-1">
              <span class="material-symbols-rounded text-base">auto_awesome</span>
              <span>استخراج وتعبئة البيانات الآن</span>
            </span>
            <span *ngIf="isParsingAi" class="flex items-center gap-1.5">
              <span class="material-symbols-rounded text-base animate-spin">refresh</span>
              <span>جاري المعالجة...</span>
            </span>
          </button>
        </div>
      </div>

      <!-- ==================== مودال اختيار وتغيير خط السيرة الذاتية ==================== -->
      <div *ngIf="showFontModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fade-in" dir="rtl">
        <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 relative animate-modal-in overflow-hidden">
          
          <!-- رأس المودال -->
          <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <span class="material-symbols-rounded text-2xl">font_download</span>
              </div>
              <div>
                <h3 class="text-xl font-black text-slate-900 tracking-tight">اختر خط السيرة الذاتية (CV Typography)</h3>
                <p class="text-xs text-slate-500 mt-0.5 font-medium">خطوط عربية ولاتينية احترافية مختارة ومعتمدة تضفي طابعاً مميزاً على سيرتك الذاتية</p>
              </div>
            </div>
            <button 
              (click)="showFontModal = false" 
              class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
            >
              <span class="material-symbols-rounded text-xl">close</span>
            </button>
          </div>

          <!-- قائمة الخطوط مع معاينة بصرية حية لكل خط -->
          <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-3.5 bg-slate-50/50">
            
            <div 
              *ngFor="let font of availableFonts"
              (click)="setFont(font.id)"
              [class.ring-2]="cv.fontFamily === font.id"
              [class.ring-indigo-600]="cv.fontFamily === font.id"
              [class.bg-indigo-50/40]="cv.fontFamily === font.id"
              class="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              
              <div class="flex-1 min-w-0">
                <!-- اسم وتصنيف الخط -->
                <div class="flex flex-wrap items-center gap-2 mb-1.5">
                  <span class="font-black text-slate-900 text-base" [style.fontFamily]="font.id">{{ font.name }}</span>
                  <span dir="ltr" class="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80">{{ font.englishName }}</span>
                  <span *ngIf="font.badge" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">{{ font.badge }}</span>
                </div>

                <!-- صندوق المعاينة الحية للخط بالنص العربي والإنجليزي -->
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 mt-2">
                  <div class="text-sm font-bold text-slate-800 leading-snug" [style.fontFamily]="font.id">
                    {{ font.sampleArabic }}
                  </div>
                  <div class="text-xs text-slate-500 font-medium mt-1" dir="ltr" [style.fontFamily]="font.id">
                    {{ font.sampleEnglish }}
                  </div>
                </div>

                <!-- لمن يصلح هذا الخط -->
                <div class="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                  <span class="material-symbols-rounded text-xs text-indigo-600 flex-shrink-0">ads_click</span>
                  <span class="font-bold text-slate-700">مناسب لـ:</span>
                  <span>{{ font.recommendedFor }}</span>
                </div>
              </div>

              <!-- زر الاختيار / الحالة -->
              <div class="flex-shrink-0 sm:self-center">
                <button 
                  *ngIf="cv.fontFamily === font.id"
                  class="btn bg-emerald-500 text-white text-xs py-2 px-4 rounded-xl font-black shadow-xs cursor-default flex items-center gap-1.5"
                >
                  <span class="material-symbols-rounded text-sm">check_circle</span>
                  <span>الخط المفعّل حالياً</span>
                </button>
                <button 
                  *ngIf="cv.fontFamily !== font.id"
                  class="btn btn-secondary group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 text-xs py-2 px-4 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span class="material-symbols-rounded text-sm">font_download</span>
                  <span>تطبيق هذا الخط</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      <!-- ==================== مودال اختيار وتغيير لغة السيرة الذاتية ==================== -->
      <div *ngIf="showLanguageModal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fade-in" dir="rtl">
        <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-modal-in overflow-hidden">
          
          <button (click)="showLanguageModal = false" class="absolute top-6 left-6 text-slate-400 hover:text-slate-700 cursor-pointer">
            <span class="material-symbols-rounded text-lg">close</span>
          </button>

          <!-- رأس المودال -->
          <div class="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <span class="material-symbols-rounded text-2xl">translate</span>
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 tracking-tight">لغة السيرة الذاتية (CV Language)</h3>
              <p class="text-xs text-slate-500 mt-0.5 font-medium">العربية والإنجليزية مجاناً، واللغات العالمية الإضافية متاحة لأعضاء باقة Pro</p>
            </div>
          </div>

          <!-- بطاقات اللغات -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div 
              *ngFor="let lang of availableLanguages"
              (click)="setLanguage(lang.id)"
              [class.ring-2]="(cv.language || 'ar') === lang.id"
              [class.ring-indigo-600]="(cv.language || 'ar') === lang.id"
              [class.bg-indigo-50_40]="(cv.language || 'ar') === lang.id"
              class="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {{ lang.nativeName }}
                  </span>
                  <span *ngIf="(cv.language || 'ar') === lang.id" class="text-indigo-600 font-bold">
                    <span class="material-symbols-rounded text-base">check_circle</span>
                  </span>
                </div>
                <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                  <span>الاتجاه: {{ lang.direction === 'rtl' ? 'من اليمين (RTL)' : 'من اليسار (LTR)' }}</span>
                </div>
              </div>

              <div>
                <span *ngIf="!lang.isPro" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  مجاني
                </span>
                <span *ngIf="lang.isPro" class="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-0.5">
                  <span class="material-symbols-rounded text-xs text-amber-600">workspace_premium</span>
                  <span>PRO</span>
                </span>
              </div>
            </div>
          </div>

          <!-- تنبيه توضيحي -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 mb-6 flex items-start gap-2.5">
            <span class="material-symbols-rounded text-indigo-600 text-lg flex-shrink-0 mt-0.5">info</span>
            <div class="leading-relaxed">
              <strong>ملاحظة هامة:</strong> تغيير لغة السيرة يقوم تلقائياً بضبط اتجاه الصفحة (RTL / LTR) وعناوين الأقسام (كالخبرات والتعليم والمهارات) لتتوافق 100% مع معايير أنظمة الفرز الآلي (ATS) للشركات الدولية.
            </div>
          </div>

          <!-- زر الإغلاق -->
          <div class="flex justify-end">
            <button (click)="showLanguageModal = false" class="btn btn-secondary text-xs py-2 px-5 cursor-pointer">
              إغلاق
            </button>
          </div>

        </div>
      </div>

    </div>
  `
})
export class CvBuilderComponent implements OnInit {
  authService = inject(AuthService);
  alertService = inject(AlertService);
  private cvService = inject(CvService);
  private aiService = inject(AiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  cv: CV = this.cvService.createEmptyCV();
  activeSection: 'personal' | 'experience' | 'education' | 'skills' | 'certifications' | 'projects' | 'references' = 'personal';
  isSaving = false;
  lastSaved: Date | null = null;
  isEnhancing = false;
  showAiModal = false;
  showGalleryModal = false;
  showLanguageModal = false;
  availableLanguages = AVAILABLE_CV_LANGUAGES;
  selectedFile: File | null = null;
  isParsingAi = false;

  get labels(): CVSectionLabels {
    return getCVSectionLabels(this.cv.language || 'ar');
  }

  get ui(): CVBuilderUI {
    return getCVBuilderUI(this.cv.language || 'ar');
  }

  get isRtl(): boolean {
    return (this.cv.language || 'ar') === 'ar';
  }

  getCurrentLanguageName(): string {
    const l = this.availableLanguages.find(lang => lang.id === (this.cv.language || 'ar'));
    return l ? l.name : 'العربية';
  }

  setLanguage(langId: string) {
    const langObj = this.availableLanguages.find(l => l.id === langId) || this.availableLanguages[0];

    if (langObj.isPro && this.authService.currentUser()?.plan === 'free') {
      this.promptUpgradeForLanguage(langObj);
      return;
    }

    const previousLang = this.cv.language || 'ar';
    this.cv.language = langId as any;

    if (langId === 'ar') {
      if (!this.cv.fontFamily || !this.cv.fontFamily.includes('Arabic')) {
        this.cv.fontFamily = '"IBM Plex Sans Arabic", system-ui, sans-serif';
      }
      if (previousLang !== 'ar') {
        this.translateSampleContentToArabic();
      }
    } else {
      if (!this.cv.fontFamily || this.cv.fontFamily.includes('Arabic')) {
        this.cv.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      }
      if (previousLang === 'ar') {
        this.translateSampleContentToEnglish();
      }
    }

    this.saveCV(false);
    this.showLanguageModal = false;
    this.alertService.success(
      langId === 'en' ? 'Language Changed' : 'تم تغيير لغة السيرة', 
      langId === 'en' ? `CV language switched to "${langObj.name}" successfully!` : `تم ضبط لغة السيرة الذاتية إلى "${langObj.name}" بنجاح!`
    );
  }

  translateSampleContentToEnglish() {
    if (!this.cv.personalInfo) return;
    if (this.cv.personalInfo.fullName === 'أحمد محمود') {
      this.cv.personalInfo.fullName = 'Ahmed Mahmoud';
    }
    if (this.cv.personalInfo.jobTitle === 'مهندس برمجيات وتطبيقات سحابية' || this.cv.personalInfo.jobTitle === 'Senior Software Engineer') {
      this.cv.personalInfo.jobTitle = 'Senior Full-Stack & Cloud Engineer';
    }
    if (this.cv.personalInfo.address === 'فلسطين - رام الله') {
      this.cv.personalInfo.address = 'Palestine - Ramallah';
    }
    if (this.cv.personalInfo.summary && this.cv.personalInfo.summary.includes('مهندس برمجيات شغوف')) {
      this.cv.personalInfo.summary = 'Passionate and creative software engineer with 4+ years of experience in building modern web applications and scalable cloud solutions. Proficient in problem solving, clean architectures, and CI/CD pipelines.';
    }
    if (this.cv.title === 'سيرتي الذاتية الجديدة') {
      this.cv.title = 'My Professional Resume';
    }

    if (this.cv.experiences?.length) {
      this.cv.experiences.forEach(exp => {
        if (exp.company === 'شركة الحلول الرقمية المتقدمة') exp.company = 'Advanced Digital Solutions Ltd';
        if (exp.company === 'مختبرات الابتكار التقني') exp.company = 'Tech Innovation Labs';
        if (exp.location === 'رام الله (هجين)') exp.location = 'Ramallah (Hybrid)';
        if (exp.location === 'عن بُعد') exp.location = 'Remote';
        if (exp.endDate === 'الآن') exp.endDate = 'Present';
        if (exp.description?.includes('قيادة فريق تطوير')) {
          exp.description = '• Leading the core web engineering team, reducing server response times by 45%.\n• Implemented modern security standards and automated CI/CD pipelines.';
        }
        if (exp.description?.includes('تصميم وبناء واجهات')) {
          exp.description = '• Architected interactive responsive web interfaces using Angular & TypeScript.\n• Enhanced conversion rate by 30% through intuitive UX workflows.';
        }
      });
    }

    if (this.cv.education?.length) {
      this.cv.education.forEach(edu => {
        if (edu.institution === 'جامعة النجاح الوطنية') edu.institution = 'An-Najah National University';
        if (edu.degree === 'بكالوريوس') edu.degree = 'B.Sc.';
        if (edu.fieldOfStudy === 'هندسة الحاسوب') edu.fieldOfStudy = 'Computer Engineering';
        if (edu.grade === 'امتياز مع مرتبة الشرف') edu.grade = 'Honors with Distinction';
      });
    }

    if (this.cv.languages?.length) {
      this.cv.languages.forEach(l => {
        if (l.name === 'العربية') { l.name = 'Arabic'; l.proficiency = 'Native'; }
        if (l.name === 'الإنجليزية') { l.name = 'English'; l.proficiency = 'Fluent'; }
      });
    }
  }

  translateSampleContentToArabic() {
    if (!this.cv.personalInfo) return;
    if (this.cv.personalInfo.fullName === 'Ahmed Mahmoud') {
      this.cv.personalInfo.fullName = 'أحمد محمود';
    }
    if (this.cv.personalInfo.jobTitle === 'Senior Full-Stack & Cloud Engineer') {
      this.cv.personalInfo.jobTitle = 'مهندس برمجيات وتطبيقات سحابية';
    }
    if (this.cv.personalInfo.address === 'Palestine - Ramallah') {
      this.cv.personalInfo.address = 'فلسطين - رام الله';
    }
    if (this.cv.personalInfo.summary?.includes('Passionate and creative software engineer')) {
      this.cv.personalInfo.summary = 'مهندس برمجيات شغوف ومبدع يتمتع بخبرة تزيد عن 4 سنوات في تطوير تطبيقات الويب الحديثة وحلول السحابة. بارع في حل المشكلات التقنية وبناء معماريات قابلة للتوسع.';
    }
    if (this.cv.title === 'My Professional Resume') {
      this.cv.title = 'سيرتي الذاتية الجديدة';
    }

    if (this.cv.experiences?.length) {
      this.cv.experiences.forEach(exp => {
        if (exp.company === 'Advanced Digital Solutions Ltd') exp.company = 'شركة الحلول الرقمية المتقدمة';
        if (exp.company === 'Tech Innovation Labs') exp.company = 'مختبرات الابتكار التقني';
        if (exp.location === 'Ramallah (Hybrid)') exp.location = 'رام الله (هجين)';
        if (exp.location === 'Remote') exp.location = 'عن بُعد';
        if (exp.endDate === 'Present') exp.endDate = 'الآن';
        if (exp.description?.includes('Leading the core web')) {
          exp.description = '• قيادة فريق تطوير تطبيقات الويب وتحديث البنية المعمارية للنظام مما ساهم في تحسين سرعة الاستجابة بنسبة 45%.\n• تطبيق معايير الأمان المتقدمة وأفضل ممارسات CI/CD.';
        }
        if (exp.description?.includes('Architected interactive responsive')) {
          exp.description = '• تصميم وبناء واجهات مستخدم تفاعلية وجذابة باستخدام Angular وTypeScript.\n• تحسين تجربة المستخدم ومعدل التحويل بنسبة 30%.';
        }
      });
    }

    if (this.cv.education?.length) {
      this.cv.education.forEach(edu => {
        if (edu.institution === 'An-Najah National University') edu.institution = 'جامعة النجاح الوطنية';
        if (edu.degree === 'B.Sc.') edu.degree = 'بكالوريوس';
        if (edu.fieldOfStudy === 'Computer Engineering') edu.fieldOfStudy = 'هندسة الحاسوب';
        if (edu.grade === 'Honors with Distinction') edu.grade = 'امتياز مع مرتبة الشرف';
      });
    }

    if (this.cv.languages?.length) {
      this.cv.languages.forEach(l => {
        if (l.name === 'Arabic') { l.name = 'العربية'; l.proficiency = 'اللغة الأم'; }
        if (l.name === 'English') { l.name = 'الإنجليزية'; l.proficiency = 'طلاقة'; }
      });
    }
  }

  promptUpgradeForLanguage(lang: CVLanguage) {
    this.alertService.confirm({
      title: 'اللغات الإضافية تتطلب باقة Pro',
      message: `لغة "${lang.name}" من اللغات الحصرية لباقة المحترفين Pro. تتضمن الباقة المجانية لغتي السيرة الذاتية الأساسيتين (العربية والإنجليزية). هل ترغب في الترقية لفتح كافة اللغات العالمية؟`,
      type: 'upgrade',
      badgeText: 'ميزة حصرية للمحترفين',
      perks: [
        'دعم كافة لغات السيرة الذاتية (الإنجليزية، الفرنسية، الألمانية، الإسبانية، التركية)',
        'تعديل اتجاه الورقة (RTL و LTR) وعناوين الأقسام وفق المعايير الدولية',
        'ترجمة ذكية للسير الذاتية وتصدير بعدة نسخ لغوية لشركات الخارج',
        'إنشاء عدد غير محدود من السير الذاتية لكافة الأسواق العالمية'
      ],
      confirmText: 'ترقية الحساب إلى Pro (19 ₪ فقط)',
      cancelText: 'إلغاء'
    }).then(upgrade => {
      if (upgrade) {
        this.authService.upgradePlan({ plan: 'pro' }).subscribe({
          next: () => {
            this.alertService.success('تهانينا!', 'تمت الترقية إلى باقة المحترفين بنجاح! تم تفعيل كافة اللغات.');
            this.cv.language = lang.id;
            this.saveCV(false);
            this.showLanguageModal = false;
          },
          error: () => {
            this.alertService.error('فشل الترقية', 'تعذر استكمال الترقية، يرجى المحاولة لاحقاً');
          }
        });
      }
    });
  }

  templates = AVAILABLE_TEMPLATES;
  selectedCategory: string = 'all';
  selectedTier: 'all' | 'free' | 'pro' = 'all';

  templateCategories = [
    { id: 'all', label: 'الكل (7)' },
    { id: 'modern', label: 'عصري' },
    { id: 'classic', label: 'كلاسيكي' },
    { id: 'executive', label: 'تنفيذي' },
    { id: 'creative', label: 'إبداعي' },
    { id: 'tech', label: 'تقني / مبرمجين' }
  ];

  themeColors = [
    '#2563eb', // Royal Blue
    '#1e3a8a', // Deep Navy
    '#059669', // Emerald
    '#d97706', // Gold / Amber
    '#e11d48', // Ruby Rose
    '#7c3aed', // Royal Violet
    '#0d9488', // Teal Ocean
    '#334155'  // Slate Charcoal
  ];

  galleryViewMode: 'grid' | 'livePreview' = 'grid';
  previewTemplate: TemplateInfo = AVAILABLE_TEMPLATES[0];

  showFontModal = false;
  availableFonts = AVAILABLE_CV_FONTS;

  // ==================== ميزات محرر كانفا البصري (Canva Studio Pro) ====================
  isCanvaMode = false;

  toggleCanvaMode() {
    const user = this.authService.currentUser();
    if (user?.plan === 'free') {
      this.alertService.confirm({
        title: 'محرر كانفا البصري (Canva Studio Pro)',
        message: 'يتيح لك وضع كانفا تحرير وتنسيق السيرة الذاتية بصرياً ومباشرة بالنقر على أي نص، مع أدوات متقدمة لتكبير وتصغير الخط وإضافة كود QR والتوقيع الرقمي. هذه الميزة حصرية لباقة المحترفين Pro.',
        type: 'upgrade',
        badgeText: 'ميزة حصرية للمحترفين',
        perks: [
          'تحرير مباشر وسلس لجميع نصوص السيرة على الورقة كالكانفا',
          'إضافة وتفعيل كود QR الذكي لمعرض أعمالك وملفك المهني',
          'توقيع رقمي رسمي مع ختم التاريخ والاعتماد الأمني',
          'تخصيص حجم الخط وألوان الثيم بلا حدود'
        ],
        confirmText: 'ترقية حسابي إلى Pro (19 ₪ فقط)',
        cancelText: 'لاحقاً'
      }).then(upgrade => {
        if (upgrade) {
          this.authService.upgradePlan({ plan: 'pro' }).subscribe({
            next: (res) => {
              this.alertService.success('مبروك الترقية!', 'تم تفعيل باقة Pro لحسابك بنجاح. أهلاً بك في محرر كانفا البصري!');
              this.isCanvaMode = true;
            },
            error: () => {
              this.alertService.error('فشل الترقية', 'تعذر استكمال الترقية، يرجى المحاولة لاحقاً');
            }
          });
        }
      });
      return;
    }

    this.isCanvaMode = !this.isCanvaMode;
    if (this.isCanvaMode) {
      this.alertService.info('وضع كانفا نشط', 'انقر على أي نص في ورقة السيرة الذاتية لتعديله فورياً!');
    }
  }

  adjustFontSize(delta: number) {
    const current = this.cv.customFontSize || 14;
    const next = Math.min(22, Math.max(10, current + delta));
    this.cv.customFontSize = next;
    this.saveCV(false);
  }

  hasCanvaElement(type: string): boolean {
    return !!this.cv.canvaElements?.some(el => el.type === type);
  }

  toggleCanvaElement(type: 'qr' | 'signature' | 'badge') {
    if (!this.cv.canvaElements) {
      this.cv.canvaElements = [];
    }
    const idx = this.cv.canvaElements.findIndex(el => el.type === type);
    if (idx > -1) {
      this.cv.canvaElements.splice(idx, 1);
      this.alertService.info('تمت الإزالة', `تم حذف ${type === 'qr' ? 'كود QR' : type === 'signature' ? 'التوقيع' : 'شارة التحقق'}`);
    } else {
      if (type === 'qr') {
        this.cv.canvaElements.push({ type: 'qr', label: 'كود QR', value: 'https://seerati.ai/cv/' + (this.cv._id || 'demo') });
        this.alertService.success('تمت الإضافة', 'تمت إضافة كود QR الذكي إلى السيرة الذاتية');
      } else if (type === 'signature') {
        this.cv.canvaElements.push({ type: 'signature', label: 'التوقيع الرقمي', value: this.cv.personalInfo.fullName || 'Signed' });
        this.alertService.success('تمت الإضافة', 'تمت إضافة التوقيع والاعتماد الرقمي');
      } else if (type === 'badge') {
        this.cv.canvaElements.push({ type: 'badge', label: 'شارة الاعتماد', value: 'VERIFIED' });
        this.alertService.success('تمت الإضافة', 'تمت إضافة شارة التحقق والاعتماد الرسمي');
      }
    }
    this.saveCV(false);
  }

  onInlineTextChange(path: string, event: Event) {
    const el = event.target as HTMLElement;
    if (!el) return;
    const value = el.innerText.trim();

    const parts = path.split('.');
    if (parts.length === 2 && parts[0] === 'personalInfo') {
      (this.cv.personalInfo as any)[parts[1]] = value;
      this.saveCV(false);
    }
  }

  get todayDate(): string {
    return new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // ==================== إدارة الصورة الشخصية (Profile Photo Management) ====================
  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.alertService.warning('تنبيه', 'يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.alertService.warning('حجم الملف كبير', 'يرجى اختيار صورة بحجم أقل من 5 ميغابايت');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          this.cv.personalInfo.avatarUrl = compressedDataUrl;
          this.saveCV(false);
          this.alertService.success('تم رفع الصورة', 'تم تحديث صورتك الشخصية في السيرة الذاتية بنجاح!');
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  removePhoto() {
    this.cv.personalInfo.avatarUrl = '';
    this.saveCV(false);
    this.alertService.info('تمت الإزالة', 'تم حذف الصورة الشخصية من السيرة الذاتية');
  }

  setFont(fontId: string) {
    this.cv.fontFamily = fontId;
    this.showFontModal = false;
    this.saveCV(false);
    const font = this.availableFonts.find(f => f.id === fontId);
    this.alertService.success('تم تغيير الخط', `تم تطبيق خط "${font?.name || fontId}" على سيرتك الذاتية بنجاح!`);
  }

  getSelectedFontName(): string {
    const clean = this.cv.fontFamily ? this.cv.fontFamily.replace(/"/g, '').split(',')[0].trim() : 'IBM Plex Sans Arabic';
    const f = this.availableFonts.find(item => item.id === clean || item.englishName.toLowerCase().includes(clean.toLowerCase()));
    return f ? f.englishName : clean;
  }

  openFullPreview(tmpl: TemplateInfo) {
    this.previewTemplate = tmpl;
    this.galleryViewMode = 'livePreview';
  }

  closeFullPreview() {
    this.galleryViewMode = 'grid';
  }

  get filteredTemplates(): TemplateInfo[] {
    return this.templates.filter(t => {
      const matchCat = this.selectedCategory === 'all' || t.category === this.selectedCategory;
      const matchTier = this.selectedTier === 'all' || (this.selectedTier === 'pro' ? t.isPro : !t.isPro);
      return matchCat && matchTier;
    });
  }

  getTemplateName(id: string): string {
    const t = this.templates.find(item => item.id === id);
    return t ? t.arabicName || t.name : 'العصري';
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.loadCV(id);
    }
  }

  loadCV(id: string) {
    this.cvService.getCVById(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.cv = res.data;
          if (!this.cv.fontFamily) {
            this.cv.fontFamily = 'IBM Plex Sans Arabic';
          } else {
            this.cv.fontFamily = this.cv.fontFamily.replace(/"/g, '').split(',')[0].trim();
          }
          if (!this.cv.language) {
            this.cv.language = 'ar';
          }
          // Ensure default languages if empty
          if (!this.cv.languages || this.cv.languages.length === 0) {
            this.cv.languages = [
              { name: 'العربية', proficiency: 'اللغة الأم' },
              { name: 'الإنجليزية', proficiency: 'طلاقة' }
            ];
          }
        }
      },
      error: () => {
        this.alertService.error('خطأ', 'تعذر تحميل بيانات السيرة الذاتية');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async applyTemplateFromGallery(tmpl: TemplateInfo) {
    if (tmpl.isPro && this.authService.currentUser()?.plan === 'free') {
      const upgrade = await this.alertService.confirm({
        title: `باقة المحترفين Pro مطلوبة`,
        message: `قالب "${tmpl.arabicName || tmpl.name}" متاح حصرياً لأعضاء باقة المحترفين Pro. هل ترغب في ترقية حسابك الآن للحصول على جميع القوالب الحصرية ورصيد غير محدود للذكاء الاصطناعي؟`,
        type: 'upgrade',
        confirmText: 'ترقية الحساب الآن (19 ₪ فقط)',
        cancelText: 'إلغاء'
      });

      if (upgrade) {
        this.authService.upgradePlan({ plan: 'pro', addCredits: 30 }).subscribe({
          next: () => {
            this.alertService.success('مبروك!', 'تمت ترقية حسابك إلى باقة المحترفين Pro بنجاح وفتح جميع القوالب!');
            this.cv.templateId = tmpl.id;
            this.cv.themeColor = tmpl.accentDefault;
            this.showGalleryModal = false;
            this.saveCV(false);
          }
        });
      }
      return;
    }

    this.cv.templateId = tmpl.id;
    this.cv.themeColor = tmpl.accentDefault;
    this.showGalleryModal = false;
    this.saveCV(false);
    this.alertService.success('تم تطبيق القالب بنجاح', `تم تفعيل ${tmpl.arabicName || tmpl.name} بنجاح!`);
  }

  setColor(color: string) {
    this.cv.themeColor = color;
    this.saveCV(false);
  }

  saveCV(showNotification = true) {
    this.isSaving = true;
    if (this.cv._id) {
      this.cvService.updateCV(this.cv._id, this.cv).subscribe({
        next: () => {
          this.isSaving = false;
          this.lastSaved = new Date();
          if (showNotification) {
            this.alertService.success('تم الحفظ بنجاح', 'تم تحديث سيرتك الذاتية وتخزين التغييرات');
          }
        },
        error: () => {
          this.isSaving = false;
          this.alertService.error('فشل الحفظ', 'حدث خطأ أثناء حفظ التعديلات');
        }
      });
    } else {
      this.cvService.createCV(this.cv).subscribe({
        next: (res) => {
          this.isSaving = false;
          this.lastSaved = new Date();
          if (res.data?._id) {
            this.cv._id = res.data._id;
            this.router.navigate(['/builder', res.data._id], { replaceUrl: true });
          }
          if (showNotification) {
            this.alertService.success('تم إنشاء السيرة', 'تم حفظ السيرة الذاتية بنجاح');
          }
        },
        error: () => {
          this.isSaving = false;
          this.alertService.error('فشل الإنشاء', 'تعذر حفظ السيرة الذاتية');
        }
      });
    }
  }

  enhanceSummary() {
    if (!this.cv.personalInfo.summary || !this.cv.personalInfo.summary.trim()) {
      this.alertService.warning('تنبيه', 'يرجى كتابة نبذة أولاً ليقوم الذكاء الاصطناعي بتحسينها');
      return;
    }

    this.isEnhancing = true;
    this.aiService.enhanceText(this.cv.personalInfo.summary, 'summary').subscribe({
      next: (res) => {
        this.isEnhancing = false;
        if (res.data?.enhanced) {
          this.cv.personalInfo.summary = res.data.enhanced;
          this.saveCV(false);
          this.alertService.success('تم تحسين النبذة', 'قام الذكاء الاصطناعي بصياغة النبذة بأسلوب مهني واحترافي');
        }
      },
      error: () => {
        this.isEnhancing = false;
        this.alertService.error('خطأ', 'فشل تحسين النص بالذكاء الاصطناعي');
      }
    });
  }

  addExperience() {
    if (!this.cv.experiences) this.cv.experiences = [];
    this.cv.experiences.unshift({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    });
  }

  removeExperience(index: number) {
    this.cv.experiences.splice(index, 1);
  }

  addEducation() {
    if (!this.cv.education) this.cv.education = [];
    this.cv.education.unshift({
      institution: '',
      degree: 'بكالوريوس',
      fieldOfStudy: '',
      graduationYear: '',
      grade: '',
      description: ''
    });
  }

  removeEducation(index: number) {
    this.cv.education.splice(index, 1);
  }

  addSkill() {
    if (!this.cv.skills) this.cv.skills = [];
    this.cv.skills.push({ name: '', level: 'متقدم' });
  }

  removeSkill(index: number) {
    this.cv.skills.splice(index, 1);
  }

  // ميزة اللغات: العربية والإنجليزية مجاناً، وإضافة لغة ثالثة تتطلب باقة Pro مدفوعة
  async addLanguageWithLimit() {
    if (!this.cv.languages) this.cv.languages = [];

    // إذا تجاوز المستخدم لغتين وكان في الباقة المجانية:
    if (this.cv.languages.length >= 2 && this.authService.currentUser()?.plan === 'free') {
      const upgrade = await this.alertService.confirm({
        title: 'اللغات الإضافية تتطلب باقة Pro',
        message: 'تتضمن السيرة الذاتية في الباقة المجانية لغتين أساسيتين (العربية والإنجليزية). لإضافة لغة ثالثة أو أكثر (كالفرنسية، الألمانية، التركية...) لفتح آفاق العمل الدولي، يرجى الترقية إلى باقة المحترفين Pro.',
        type: 'upgrade',
        confirmText: 'ترقية الحساب الآن (19 ₪ فقط)',
        cancelText: 'لاحقاً'
      });

      if (upgrade) {
        this.authService.upgradePlan({ plan: 'pro', addCredits: 30 }).subscribe({
          next: () => {
            this.alertService.success('تهانينا!', 'تم تفعيل باقة المحترفين بنجاح! يمكنك الآن إضافة لغات غير محدودة.');
            this.cv.languages.push({ name: '', proficiency: 'جيد' });
          }
        });
      }
      return;
    }

    this.cv.languages.push({ name: '', proficiency: 'جيد' });
  }

  removeLanguage(index: number) {
    this.cv.languages.splice(index, 1);
  }

  addCertification() {
    if (!this.cv.certifications) this.cv.certifications = [];
    this.cv.certifications.push({ name: '', issuer: '', issueDate: '', credentialUrl: '' });
  }

  removeCertification(index: number) {
    this.cv.certifications.splice(index, 1);
  }

  addProject() {
    if (!this.cv.projects) this.cv.projects = [];
    this.cv.projects.push({ title: '', description: '', link: '' });
  }

  removeProject(index: number) {
    this.cv.projects.splice(index, 1);
  }

  addReference() {
    if (!this.cv.references) this.cv.references = [];
    this.cv.references.push({
      name: '',
      jobTitle: '',
      company: '',
      email: '',
      phone: ''
    });
  }

  removeReference(index: number) {
    if (this.cv.references) {
      this.cv.references.splice(index, 1);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  processAiUpload() {
    if (!this.selectedFile) return;
    this.isParsingAi = true;

    this.aiService.parseResume(this.selectedFile).subscribe({
      next: (res) => {
        this.isParsingAi = false;
        this.showAiModal = false;
        if (res.data) {
          if (res.data.personalInfo) {
            this.cv.personalInfo = { ...this.cv.personalInfo, ...res.data.personalInfo };
          }
          if (res.data.experiences?.length) {
            this.cv.experiences = res.data.experiences;
          }
          if (res.data.education?.length) {
            this.cv.education = res.data.education;
          }
          if (res.data.skills?.length) {
            this.cv.skills = res.data.skills;
          }
          if (res.data.languages?.length) {
            this.cv.languages = res.data.languages;
          }
          this.saveCV(false);
          this.alertService.success('نجاح التحليل', 'تم استخراج بيانات السيرة الذاتية وتعبئتها بدقة بواسطة الذكاء الاصطناعي!');
        }
      },
      error: (err) => {
        this.isParsingAi = false;
        this.alertService.error('فشل التحليل', err.error?.message || 'تعذر تحليل الملف المرفوع');
      }
    });
  }

  exportPDF() {
    const originalTitle = document.title;
    const name = this.cv.personalInfo.fullName || 'سيرتي';
    document.title = `${name}_Resume`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  }
}
