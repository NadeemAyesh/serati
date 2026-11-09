import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { timeout, catchError, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CvService } from '../../core/services/cv.service';
import { AiService } from '../../core/services/ai.service';
import { JobService } from '../../core/services/job.service';
import { AlertService } from '../../core/services/alert.service';
import { CV } from '../../core/models/cv.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col">
      
      <!-- Top Navigation -->
      <header class="glass-nav sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div class="flex items-center gap-3 cursor-pointer" routerLink="/">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <span class="material-symbols-rounded text-2xl">description</span>
            </div>
            <div>
              <span class="text-xl font-black text-slate-800">سِيرَتي</span>
              <span class="text-[10px] font-bold text-indigo-600 block -mt-1 uppercase">Dashboard</span>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <!-- رصيد الذكاء الاصطناعي وشارة الباقة -->
            <div class="hidden sm:flex items-center gap-2">
              <div class="badge badge-ai py-1.5 px-3 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                <span class="material-symbols-rounded text-sm text-purple-700">bolt</span>
                <span>رصيد AI: {{ authService.currentUser()?.aiCredits || 0 }}</span>
              </div>
              <span *ngIf="authService.currentUser()?.plan === 'pro'" class="badge badge-pro py-1.5 px-3 flex items-center gap-1">
                <span class="material-symbols-rounded text-sm text-amber-500">workspace_premium</span>
                <span>عضوية Pro</span>
              </span>
              <span *ngIf="authService.currentUser()?.plan === 'free'" class="badge badge-primary py-1.5 px-3">
                باقة مجانية
              </span>
            </div>

            <!-- رابط المقابلات والامتحانات -->
            <a 
              routerLink="/interviews-exams" 
              class="hidden md:flex items-center gap-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 text-xs font-bold py-2 px-3 rounded-xl border border-indigo-200 transition-colors"
            >
              <span class="material-symbols-rounded text-base text-indigo-600">quiz</span>
              <span>المقابلات والامتحانات</span>
            </a>

            <!-- زر بوت الوظائف -->
            <button 
              (click)="jobService.toggleBot(true)" 
              class="hidden sm:flex items-center gap-1.5 text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-bold py-2 px-3 rounded-xl transition-colors cursor-pointer"
            >
              <span class="material-symbols-rounded text-base text-amber-500">smart_toy</span>
              <span>وظائف فلسطين 🇵🇸</span>
            </button>

            <!-- زر الترقية السريع -->
            <button 
              *ngIf="authService.currentUser()?.plan !== 'pro'" 
              (click)="showUpgradeModal = true"
              class="btn btn-ai text-xs py-2 px-3 shadow-sm flex items-center gap-1"
            >
              <span class="material-symbols-rounded text-sm">bolt</span>
              <span>ترقية لـ Pro</span>
            </button>

            <!-- معلومات المستخدم وتسجيل الخروج -->
            <div class="flex items-center gap-3 border-r border-slate-200 pr-4">
              <div class="text-left hidden sm:block">
                <div class="text-sm font-bold text-slate-800">{{ authService.currentUser()?.name }}</div>
                <div class="text-xs text-slate-400">{{ authService.currentUser()?.email }}</div>
              </div>
              <button 
                (click)="logout()" 
                title="تسجيل الخروج"
                class="w-10 h-10 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span class="material-symbols-rounded text-xl">logout</span>
              </button>
            </div>

          </div>

        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <!-- Welcome Banner & Quick Action Cards -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <span>أهلاً بك، {{ authService.currentUser()?.name }}</span>
              <span class="material-symbols-rounded text-amber-500 text-3xl">waving_hand</span>
            </h1>
            <p class="text-slate-500 text-sm mt-1">
              لوحة تحكم خفيفة ونظيفة لإدارة سيرك الذاتية وبنائها بالذكاء الاصطناعي
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <!-- زر الاستيراد السحري بالذكاء الاصطناعي -->
            <button 
              (click)="showAiModal = true"
              class="btn btn-ai py-2.5 px-5 shadow-md shadow-purple-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span class="material-symbols-rounded text-xl">auto_awesome</span>
              <span>استيراد بالذكاء الاصطناعي</span>
            </button>

            <!-- زر إنشاء سيرة جديدة فارغة -->
            <button 
              (click)="createNewCV()"
              class="btn btn-primary py-2.5 px-5 shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span class="material-symbols-rounded text-xl">add</span>
              <span>إنشاء سيرة جديدة</span>
            </button>
          </div>
        </div>

        <!-- إحصائيات سريعة خفيفة -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          
          <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-slate-400">إجمالي السير الذاتية</span>
              <div class="flex items-baseline gap-2 mt-1">
                <span class="text-3xl font-black text-slate-800">{{ cvList.length }}</span>
                <span *ngIf="authService.currentUser()?.plan === 'free'" class="text-xs font-bold" [class.text-amber-600]="cvList.length >= 1" [class.text-slate-400]="cvList.length < 1">
                  / 1 (حد المجاني)
                </span>
                <span *ngIf="authService.currentUser()?.plan === 'pro'" class="text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                  <span class="material-symbols-rounded text-xs text-amber-500">workspace_premium</span>
                  <span>غير محدود PRO</span>
                </span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <span class="material-symbols-rounded text-2xl">description</span>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-slate-400">رصيد الذكاء الاصطناعي المتبقي</span>
              <div class="text-3xl font-black text-purple-600 mt-1">{{ authService.currentUser()?.aiCredits || 0 }}</div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <span class="material-symbols-rounded text-2xl">bolt</span>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-slate-400">حالة الاشتراك الحالي</span>
              <div class="text-xl font-black text-slate-800 mt-2 flex items-center gap-1.5">
                <span *ngIf="authService.currentUser()?.plan === 'pro'" class="text-amber-600 flex items-center gap-1">
                  <span class="material-symbols-rounded text-base text-amber-500">workspace_premium</span>
                  <span>باقة Pro مفعلة</span>
                </span>
                <span *ngIf="authService.currentUser()?.plan === 'free'" class="text-slate-600">باقة مجانية</span>
              </div>
            </div>
            <button (click)="showUpgradeModal = true" class="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
              تغيير
            </button>
          </div>

        </div>

        <!-- بانر التجهيز للتوظيف وبوت الوظائف -->
        <div class="mb-10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div class="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div class="max-w-2xl relative z-10">
            <div class="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-blue-400/30">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>جديد: مركز التجهيز للتوظيف وشواغر العمل الحية</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black mb-2">استعد للمقابلات واكتشف أحدث الوظائف في فلسطين</h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              تدرّب على أسئلة المقابلات الشخصية، وخُض نماذج امتحانات ديوان الموظفين، الأونروا، والبنوك التفاعلية، ودع بوت الوظائف الذكي يجلب لك شواغر تخصصك باستمرار!
            </p>
          </div>

          <div class="flex flex-wrap sm:flex-nowrap items-center gap-3 relative z-10 w-full md:w-auto">
            <a 
              routerLink="/interviews-exams" 
              class="btn btn-primary py-3 px-5 text-xs sm:text-sm w-full sm:w-auto text-center shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              <span class="material-symbols-rounded text-base">quiz</span>
              <span>بنك المقابلات والامتحانات</span>
            </a>
            <button 
              (click)="jobService.toggleBot(true)" 
              class="btn btn-secondary py-3 px-5 text-xs sm:text-sm w-full sm:w-auto text-center flex items-center justify-center gap-2 cursor-pointer bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <span class="material-symbols-rounded text-base text-amber-400">smart_toy</span>
              <span>بوت وظائف فلسطين 🇵🇸</span>
            </button>
          </div>
        </div>

        <!-- قسم عرض السير الذاتية -->
        <div>
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-black text-slate-800">سيرك الذاتية المحفوظة</h2>
              <button 
                (click)="loadCVs()" 
                [disabled]="isLoading"
                title="تحديث قائمة السير الذاتية"
                class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer text-xs"
              >
                <span class="material-symbols-rounded text-base" [class.animate-spin]="isLoading">refresh</span>
              </button>
            </div>
            <span class="text-xs text-slate-400 font-bold">{{ cvList.length }} سير ذاتية</span>
          </div>

          <!-- حالة التحميل -->
          <div *ngIf="isLoading" class="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p class="text-slate-600 text-sm font-bold">جاري تحميل السير الذاتية...</p>
            <p class="text-slate-400 text-xs mt-1">يتم جلب بياناتك من الخادم</p>
          </div>

          <!-- حالة عدم وجود سير بعد (Empty State) -->
          <div *ngIf="!isLoading && cvList.length === 0" class="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div class="w-20 h-20 mx-auto rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <span class="material-symbols-rounded text-4xl">post_add</span>
            </div>
            <h3 class="text-xl font-black text-slate-800 mb-2">لم تقم بإنشاء أي سيرة ذاتية بعد!</h3>
            <p class="text-slate-500 text-sm max-w-md mx-auto mb-8">
              يمكنك رفع سيرتك الذاتية القديمة وسيقوم الذكاء الاصطناعي بتعبئتها بدلاً منك، أو البدء بإدخال بياناتك خطوة بخطوة.
            </p>
            <div class="flex flex-wrap items-center justify-center gap-4">
              <button (click)="showAiModal = true" class="btn btn-ai py-2.5 px-6 flex items-center gap-2 cursor-pointer">
                <span class="material-symbols-rounded text-base">auto_awesome</span>
                <span>استيراد بالذكاء الاصطناعي</span>
              </button>
              <button (click)="createNewCV()" class="btn btn-primary py-2.5 px-6 flex items-center gap-2 cursor-pointer">
                <span class="material-symbols-rounded text-base">add</span>
                <span>إنشاء يدوي جديد</span>
              </button>
            </div>
          </div>

          <!-- شبكة بطاقات السير الذاتية -->
          <div *ngIf="!isLoading && cvList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div *ngFor="let cv of cvList" class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
              
              <!-- رأس البطاقة ومصغر القالب -->
              <div class="p-6">
                <div class="flex items-start justify-between gap-3 mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <span class="material-symbols-rounded text-xl">description</span>
                    </div>
                    <div>
                      <h3 class="font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {{ cv.title || 'سيرة ذاتية بدون عنوان' }}
                      </h3>
                      <span class="text-xs text-slate-400">
                        {{ cv.updatedAt | date:'mediumDate' }}
                      </span>
                    </div>
                  </div>
                  
                  <span class="badge badge-primary text-[10px]">
                    {{ cv.templateId }}
                  </span>
                </div>

                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1 mb-4">
                  <div class="flex justify-between">
                    <span class="text-slate-400">الاسم:</span>
                    <span class="font-bold">{{ cv.personalInfo.fullName || 'غير محدد' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">المسمى:</span>
                    <span class="font-bold">{{ cv.personalInfo.jobTitle || 'غير محدد' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">الخبرات:</span>
                    <span class="font-bold">{{ cv.experiences?.length || 0 }} خبرات</span>
                  </div>
                </div>
              </div>

              <!-- أزرار الإجراءات في أسفل البطاقة -->
              <div class="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <a [routerLink]="['/builder', cv._id]" class="btn btn-primary text-xs py-1.5 px-3 flex-1 text-center flex items-center justify-center gap-1 cursor-pointer">
                  <span class="material-symbols-rounded text-sm">edit</span>
                  <span>تعديل</span>
                </a>
                <button (click)="duplicateCV(cv._id!)" title="تكرار نسخة" class="btn btn-secondary text-xs py-1.5 px-3 flex items-center justify-center cursor-pointer">
                  <span class="material-symbols-rounded text-sm">content_copy</span>
                </button>
                <button (click)="deleteCV(cv._id!)" title="حذف" class="btn btn-danger text-xs py-1.5 px-3 flex items-center justify-center cursor-pointer">
                  <span class="material-symbols-rounded text-sm">delete</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </main>

      <!-- مودال الاستيراد بالذكاء الاصطناعي (AI Resume Parser Modal) -->
      <div *ngIf="showAiModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative animate-fade-in">
          
          <button (click)="showAiModal = false" class="absolute top-6 left-6 text-slate-400 hover:text-slate-700 cursor-pointer">
            <span class="material-symbols-rounded text-lg">close</span>
          </button>

          <div class="text-center mb-6">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-3xl mb-4">
              <span class="material-symbols-rounded text-3xl">smart_toy</span>
            </div>
            <h3 class="text-2xl font-black text-slate-900">مساعد الذكاء الاصطناعي الذكي</h3>
            <p class="text-slate-500 text-sm mt-1">
              ارفع سيرتك الذاتية (ملف PDF) وسيقوم الذكاء الاصطناعي باستخراج الاسم، التعليم، الخبرات، والمهارات وتعبئتها فوراً في المنصة!
            </p>
          </div>

          <div *ngIf="aiError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl">
            {{ aiError }}
          </div>

          <!-- منطقة سحب الملف Drag & Drop -->
          <div class="border-2 border-dashed border-purple-200 hover:border-purple-500 rounded-2xl p-8 text-center bg-purple-50/30 transition-colors cursor-pointer mb-6 relative">
            <input 
              type="file" 
              (change)="onFileSelected($event)" 
              accept=".pdf,.txt" 
              class="absolute inset-0 opacity-0 cursor-pointer"
            >
            <div *ngIf="!selectedFile">
              <span class="material-symbols-rounded text-4xl text-purple-500 mb-2">cloud_upload</span>
              <div class="text-sm font-bold text-slate-700">اسحب ملف السيرة الذاتية هنا أو انقر للاختيار</div>
              <div class="text-xs text-slate-400 mt-1">يدعم ملفات PDF و Text حتى 10MB</div>
            </div>

            <div *ngIf="selectedFile" class="text-purple-700 font-bold text-sm flex items-center justify-center gap-1.5">
              <span class="material-symbols-rounded text-base">description</span>
              <span>تم اختيار الملف: {{ selectedFile.name }}</span>
            </div>
          </div>

          <!-- زر بدء التحليل -->
          <button 
            (click)="processAiUpload()" 
            [disabled]="!selectedFile || isParsingAi"
            class="btn btn-ai w-full py-3 text-base font-bold shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span *ngIf="!isParsingAi" class="flex items-center gap-1.5">
              <span class="material-symbols-rounded text-lg">auto_awesome</span>
              <span>بدء التحليل والتعبئة التلقائية</span>
            </span>
            <span *ngIf="isParsingAi" class="flex items-center gap-2">
              <span class="material-symbols-rounded text-lg animate-spin">refresh</span>
              <span>الذكاء الاصطناعي يقوم بالتحليل الآن...</span>
            </span>
          </button>

        </div>
      </div>

      <!-- مودال الترقية وشراء المزايا / القوالب (Upgrade & Templates Modal) -->
      <div *ngIf="showUpgradeModal" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative animate-fade-in">
          
          <button (click)="showUpgradeModal = false" class="absolute top-6 left-6 text-slate-400 hover:text-slate-700 cursor-pointer">
            <span class="material-symbols-rounded text-lg">close</span>
          </button>

          <div class="text-center mb-6">
            <span class="badge badge-pro py-1 px-4 mb-3 inline-flex items-center gap-1">
              <span class="material-symbols-rounded text-xs text-amber-500">workspace_premium</span>
              <span>الترقية للاشتراك الاحترافي Pro</span>
            </span>
            <h3 class="text-2xl font-black text-slate-900">فتح كافة المزايا والقوالب</h3>
            <p class="text-slate-500 text-sm mt-1">
              استمتع برصيد ذكاء اصطناعي غير محدود وقوالب VIP الحصرية
            </p>
            <div class="mt-3 inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200/80 px-4 py-1.5 rounded-full text-xs font-black shadow-sm">
              <span class="material-symbols-rounded text-base text-amber-600">sell</span>
              <span>عرض خاص: 19 ₪ شهرياً فقط (أو 49 ₪ مدى الحياة)</span>
            </div>
          </div>

          <div class="space-y-3 mb-8">
            <div class="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center gap-3">
              <span class="material-symbols-rounded text-2xl text-amber-600">bolt</span>
              <div>
                <div class="font-bold text-slate-800 text-sm">مساعد الذكاء الاصطناعي غير محدود</div>
                <div class="text-xs text-slate-500">رفع السير الذاتية وتحسين الصياغة بلا أي قيود</div>
              </div>
            </div>
            <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/60 flex items-center gap-3">
              <span class="material-symbols-rounded text-2xl text-blue-600">palette</span>
              <div>
                <div class="font-bold text-slate-800 text-sm">جميع القوالب VIP مفتوحة</div>
                <div class="text-xs text-slate-500">القالب التنفيذي، القالب الإبداعي وكافة التحديثات</div>
              </div>
            </div>
          </div>

          <!-- زر تفعيل مباشر للتجربة السلسة -->
          <button 
            (click)="confirmUpgrade()" 
            class="btn btn-primary w-full py-3 text-base font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-rounded text-lg">rocket_launch</span>
            <span>تفعيل باقة Pro الآن (19 ₪ فقط)</span>
          </button>

        </div>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  jobService = inject(JobService);
  private cvService = inject(CvService);
  private aiService = inject(AiService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  cvList: CV[] = [];
  isLoading = true;

  showAiModal = false;
  showUpgradeModal = false;
  selectedFile: File | null = null;
  isParsingAi = false;
  aiError = '';

  ngOnInit() {
    this.loadCVs();
  }

  loadCVs() {
    this.isLoading = true;
    this.cvService.getAllCVs().pipe(
      timeout(6000),
      catchError((err) => {
        console.error('Error loading CVs:', err);
        this.isLoading = false;
        this.alertService.error('تنبيه', 'تعذر تحميل السير الذاتية، يرجى المحاولة مرة أخرى');
        return of({ success: false, count: 0, data: [] });
      })
    ).subscribe({
      next: (res) => {
        this.cvList = res.data || [];
        this.isLoading = false;
      }
    });
  }

  createNewCV() {
    // التحقق من حد السير الذاتية للباقة المجانية (1 CV فقط)
    if (this.authService.currentUser()?.plan === 'free' && this.cvList.length >= 1) {
      this.promptUpgradeForCvLimit('إنشاء سيرة جديدة');
      return;
    }

    const emptyCV = this.cvService.createEmptyCV();
    this.cvService.createCV(emptyCV).subscribe({
      next: (res) => {
        if (res.data?._id) {
          this.router.navigate(['/builder', res.data._id]);
        }
      },
      error: (err) => {
        if (err.status === 403 && err.error?.requireUpgrade) {
          this.promptUpgradeForCvLimit('إنشاء سيرة جديدة');
        } else {
          this.alertService.error('خطأ', err.error?.message || 'تعذر إنشاء سيرة ذاتية جديدة');
        }
      }
    });
  }

  duplicateCV(id: string) {
    // التحقق من حد السير الذاتية للباقة المجانية
    if (this.authService.currentUser()?.plan === 'free' && this.cvList.length >= 1) {
      this.promptUpgradeForCvLimit('تكرار السيرة الذاتية');
      return;
    }

    this.cvService.duplicateCV(id).subscribe({
      next: () => {
        this.alertService.success('تم النسخ', 'تم إنشاء نسخة مكررة بنجاح');
        this.loadCVs();
      },
      error: (err) => {
        if (err.status === 403 && err.error?.requireUpgrade) {
          this.promptUpgradeForCvLimit('تكرار السيرة الذاتية');
        } else {
          this.alertService.error('خطأ', err.error?.message || 'تعذر تكرار السيرة الذاتية');
        }
      }
    });
  }

  promptUpgradeForCvLimit(action = 'إنشاء سيرة جديدة') {
    this.alertService.confirm({
      title: 'حد السير الذاتية في الباقة المجانية',
      message: 'تسمح الباقة المجانية بإنشاء وحفظ سيرة ذاتية واحدة فقط (1 CV). قم بالترقية إلى باقة المحترفين Pro للتمكن من إنشاء وتكرار عدد غير محدود من السير الذاتية لكافة الوظائف والشركات!',
      type: 'upgrade',
      badgeText: 'ميزة حصرية للمحترفين',
      perks: [
        'إنشاء وتكرار عدد غير محدود من السير الذاتية (Unlimited CVs)',
        'فتح كافة قوالب السيرة الذاتية السبعة ومحرر كانفا البصري (Canva Studio Pro)',
        'إضافة لغات غير محدودة للسيرة مع تصدير متعدد اللغات',
        '50 رصيد إضافي للذكاء الاصطناعي لتحليل الـ PDF وتعبئة الحقول آلياً'
      ],
      confirmText: 'ترقية حسابي إلى Pro',
      cancelText: 'لاحقاً'
    }).then(upgrade => {
      if (upgrade) {
        this.authService.upgradePlan({ plan: 'pro' }).subscribe({
          next: () => {
            this.alertService.success('مبروك الترقية!', 'تم تفعيل باقة Pro بنجاح. يمكنك الآن إنشاء عدد لا محدود من السير الذاتية!');
            this.loadCVs();
          },
          error: () => {
            this.alertService.error('فشل الترقية', 'تعذر استكمال الترقية، يرجى المحاولة لاحقاً');
          }
        });
      }
    });
  }

  async deleteCV(id: string) {
    const confirmed = await this.alertService.confirm({
      title: 'حذف السيرة الذاتية',
      message: 'هل أنت متأكد من رغبتك في حذف هذه السيرة الذاتية نهائياً؟ لا يمكن التراجع عن هذا الإجراء.',
      type: 'danger',
      confirmText: 'نعم، احذف',
      cancelText: 'إلغاء'
    });

    if (confirmed) {
      this.cvService.deleteCV(id).subscribe({
        next: () => {
          this.alertService.success('تم الحذف', 'تم حذف السيرة الذاتية بنجاح');
          this.loadCVs();
        },
        error: () => {
          this.alertService.error('خطأ', 'فشلت عملية الحذف');
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.aiError = '';
    }
  }

  processAiUpload() {
    if (!this.selectedFile) return;

    // فحص حد السيرة الذاتية المجانية
    if (this.authService.currentUser()?.plan === 'free' && this.cvList.length >= 1) {
      this.showAiModal = false;
      this.promptUpgradeForCvLimit('استيراد بالذكاء الاصطناعي');
      return;
    }

    this.isParsingAi = true;
    this.aiError = '';

    this.aiService.parseResume(this.selectedFile).subscribe({
      next: (res) => {
        this.isParsingAi = false;
        this.showAiModal = false;

        // Create new CV with the AI-parsed data!
        const parsedCV = {
          ...this.cvService.createEmptyCV(),
          title: `سيرة ذاتية - ${res.data.personalInfo?.fullName || 'مستوردة بالذكاء الاصطناعي'}`,
          ...res.data
        };

        this.cvService.createCV(parsedCV).subscribe({
          next: (created) => {
            if (created.data?._id) {
              this.alertService.success('اكتمل التحليل!', 'تم قراءة سيرتك الذاتية وتعبئة الحقول بذكاء.');
              this.router.navigate(['/builder', created.data._id]);
            }
          },
          error: (err) => {
            if (err.status === 403 && err.error?.requireUpgrade) {
              this.promptUpgradeForCvLimit('استيراد بالذكاء الاصطناعي');
            } else {
              this.alertService.error('خطأ', err.error?.message || 'تعذر حفظ السيرة الذاتية المستوردة');
            }
          }
        });
      },
      error: (err) => {
        this.isParsingAi = false;
        this.aiError = err.error?.message || 'فشل في تحليل الملف، يرجى المحاولة ثانية';
        this.alertService.error('فشل الاستيراد', this.aiError);
      }
    });
  }

  confirmUpgrade() {
    this.authService.upgradePlan({ plan: 'pro', addCredits: 50 }).subscribe({
      next: () => {
        this.showUpgradeModal = false;
        this.alertService.success('مبروك!', 'تم تفعيل باقة المحترفين Pro بنجاح وإضافة 50 رصيد ذكاء اصطناعي!');
      },
      error: () => {
        this.alertService.error('خطأ', 'تعذر ترقية الحساب، يرجى المحاولة لاحقاً');
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
