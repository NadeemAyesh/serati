import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { JobService } from '../../core/services/job.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      
      <!-- 1. الترويسة وشريط التنقل العلوي الزجاجي (Navigation Bar) -->
      <nav class="sticky top-0 z-50 glass-nav transition-all">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <!-- الشعار Logo -->
          <div class="flex items-center gap-3 cursor-pointer" routerLink="/">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <span class="material-symbols-rounded text-2xl">description</span>
            </div>
            <div>
              <span class="text-2xl font-black bg-gradient-to-l from-blue-700 via-indigo-600 to-slate-900 bg-clip-text text-transparent">سِيرَتي</span>
              <span class="text-xs font-bold text-indigo-600 block -mt-1 tracking-wider uppercase">Seerati AI</span>
            </div>
          </div>

          <!-- الروابط في المنتصف Desktop Links -->
          <div class="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-600">
            <a href="#concept" class="hover:text-blue-600 transition-colors">الفكرة</a>
            <a href="#features" class="hover:text-blue-600 transition-colors">المزايا</a>
            <a href="#steps" class="hover:text-blue-600 transition-colors">خطوات العمل</a>
            <a href="#templates" class="hover:text-blue-600 transition-colors">القوالب</a>
            <a routerLink="/interviews-exams" class="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              <span class="material-symbols-rounded text-sm">quiz</span>
              <span>المقابلات والامتحانات</span>
            </a>
          </div>

          <!-- أزرار الحساب والدخول وبوت الوظائف -->
          <div class="flex items-center gap-2.5">
            <!-- زر بوت الوظائف السريع -->
            <button 
              (click)="jobService.toggleBot(true)"
              class="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-indigo-700 text-xs font-bold py-2 px-3 rounded-xl border border-indigo-200 transition-all cursor-pointer shadow-xs"
            >
              <span class="material-symbols-rounded text-sm text-indigo-600">smart_toy</span>
              <span>وظائف فلسطين 🇵🇸</span>
            </button>

            <ng-container *ngIf="authService.isAuthenticated(); else guestButtons">
              <a routerLink="/dashboard" class="btn btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4 shadow-md flex items-center gap-1.5">
                <span>لوحة التحكم</span>
                <span class="material-symbols-rounded text-sm">arrow_back</span>
              </a>
            </ng-container>
            <ng-template #guestButtons>
              <a routerLink="/login" class="btn btn-secondary text-xs sm:text-sm py-2 px-3">تسجيل الدخول</a>
              <a routerLink="/register" class="btn btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4 shadow-blue-500/20">حساب مجاني</a>
            </ng-template>
          </div>

        </div>
      </nav>

      <!-- 2. الواجهة الرئيسية (Hero Section) -->
      <section class="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        <!-- خلفية جمالية مائلة وجزيئات متدرجة -->
        <div class="absolute inset-0 -z-10 overflow-hidden">
          <div class="absolute -top-40 right-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute top-20 left-10 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto">
            
            <!-- شارة الذكاء الاصطناعي -->
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-ai mb-6 animate-fade-in shadow-sm">
              <span class="flex h-2.5 w-2.5 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600"></span>
              </span>
              <span class="text-xs sm:text-sm font-bold">الجيل الجديد من صانع السير الذاتية المدعوم بالذكاء الاصطناعي</span>
            </div>

            <!-- العنوان الرئيسي -->
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.55] sm:leading-[1.5] lg:leading-[1.48] mb-6 pb-1">
              اصنع سيرتك الذاتية <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">الاحترافية بذكاء</span> واقتنص وظيفة أحلامك
            </h1>

            <!-- الوصف التوضيحي -->
            <p class="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
              توقف عن إضاعة الساعات في التنسيق اليدوي! ارفع سيرتك السابقة ودع الذكاء الاصطناعي يستخرج بياناتك وينسقها في قوالب عصرية متوافقة 100% مع أنظمة الفرز (ATS).
            </p>

            <!-- أزرار الإجراء السريع CTA -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <a routerLink="/register" class="btn btn-primary text-base py-3.5 px-8 w-full sm:w-auto shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                <span>ابدأ الآن مجاناً</span>
                <span class="material-symbols-rounded text-lg">arrow_back</span>
              </a>
              <a routerLink="/login" class="btn btn-ai text-base py-3.5 px-8 w-full sm:w-auto flex items-center justify-center gap-2">
                <span class="material-symbols-rounded text-lg text-purple-300">auto_awesome</span>
                <span>ارفع سيرتك بالذكاء الاصطناعي</span>
              </a>
            </div>

            <!-- شريط الوصول السريع للقسم الجديد وبوت الوظائف -->
            <div class="flex flex-wrap items-center justify-center gap-3 mb-12">
              <a routerLink="/interviews-exams" class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-800 font-bold text-xs sm:text-sm py-2.5 px-5 rounded-2xl border border-indigo-200 shadow-sm transition-all">
                <span class="material-symbols-rounded text-indigo-600 text-lg">quiz</span>
                <span>جديد: بنك أسئلة المقابلات وامتحانات التوظيف المؤسسية</span>
                <span class="material-symbols-rounded text-sm">arrow_back</span>
              </a>
              <button (click)="jobService.toggleBot(true)" class="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-2xl shadow-md transition-all cursor-pointer">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span class="material-symbols-rounded text-amber-400 text-lg">smart_toy</span>
                <span>بوت شواغر فلسطين الحية 🇵🇸</span>
              </button>
            </div>

            <!-- مؤشرات الثقة والأمان -->
            <div class="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-500">
              <div class="flex items-center gap-2">
                <span class="material-symbols-rounded text-lg text-emerald-500">verified</span>
                <span>معتمد ومتوافق مع ATS</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-rounded text-lg text-blue-500">picture_as_pdf</span>
                <span>تصدير فوري PDF عالي الدقة</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-rounded text-lg text-purple-500">auto_awesome</span>
                <span>تحليل فوري بالذكاء الاصطناعي</span>
              </div>
            </div>

          </div>

          <!-- بطاقة المعاينة البصرية الحية للـ CV في الهيرو -->
          <div class="mt-16 max-w-4xl mx-auto relative animate-fade-in">
            <div class="p-3 bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-2xl">
              <div class="rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-inner p-6 sm:p-8">
                
                <!-- بار علوي مصغر -->
                <div class="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl">
                      أ
                    </div>
                    <div>
                      <h3 class="text-xl font-black text-slate-800">أحمد محمود</h3>
                      <p class="text-sm font-semibold text-blue-600">Senior Full-Stack Engineer</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="badge badge-emerald">توافق ATS: 98%</span>
                    <span class="badge badge-ai">مُحلل بالذكاء الاصطناعي</span>
                  </div>
                </div>

                <!-- شبكة سريعة للمعاينة -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div class="md:col-span-2 space-y-4">
                    <div>
                      <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">النبذة المهنية</h4>
                      <p class="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        مهندس برمجيات متخصص في بناء تطبيقات الويب عالية الأداء وقابلة للتوسع باستخدام أحدث التقنيات. خبرة واسعة في قيادة المشاريع وتحسين أداء النظم بنسبة 40%.
                      </p>
                    </div>
                    <div>
                      <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">أبرز الخبرات الوظيفية</h4>
                      <div class="space-y-2">
                        <div class="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div class="flex justify-between font-bold text-slate-800 text-xs sm:text-sm">
                            <span>Senior Full-Stack Developer</span>
                            <span class="text-blue-600 text-xs">2023 - الآن</span>
                          </div>
                          <p class="text-slate-500 text-xs mt-1">تطوير منصات SaaS وتوسيع نطاق الخدمات السحابية</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-4 border-r md:border-r border-slate-100 pr-0 md:pr-6">
                    <div>
                      <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">المهارات التقنية</h4>
                      <div class="flex flex-wrap gap-1.5">
                        <span class="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md">Angular</span>
                        <span class="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md">Node.js</span>
                        <span class="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-md">MongoDB</span>
                        <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md">TypeScript</span>
                        <span class="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-md">Docker</span>
                      </div>
                    </div>
                    <div>
                      <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">اللغات</h4>
                      <div class="text-xs text-slate-600 space-y-1">
                        <div class="flex justify-between"><span>العربية</span><span class="font-bold text-emerald-600">اللغة الأم</span></div>
                        <div class="flex justify-between"><span>الإنجليزية</span><span class="font-bold text-blue-600">طلاقة تامة</span></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- 3. قسم الفكرة العامة (The Concept) -->
      <section id="concept" class="py-20 bg-white border-y border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-primary mb-4 text-xs font-bold">
                <span class="material-symbols-rounded text-sm">lightbulb</span>
                <span>الفكرة بشكل عام</span>
              </div>
              <h2 class="text-3xl sm:text-4xl font-black text-slate-900 leading-snug mb-6">
                لماذا قمنا ببناء <span class="text-blue-600">سيرتي</span>؟ لأن البحث عن وظيفة لا يجب أن يبدأ بمعاناة!
              </h2>
              <p class="text-slate-600 text-base leading-relaxed mb-6">
                معظم الباحثين عن عمل يواجهون مشكلتين رئيسيتين: صعوبة تنسيق السيرة الذاتية بدون برامج معقدة، ورفض السير الذاتية آلياً بواسطة أنظمة الفرز (ATS) قبل أن يراها أي مسؤول توظيف.
              </p>
              <p class="text-slate-600 text-base leading-relaxed mb-8">
                فكرة منصة **سيرتي** هي الجمع بين **معالج إدخال مقسم وبديهي للغاية**، وتقنيات **الذكاء الاصطناعي المتقدم** التي تقرأ سيرتك القديمة وتعبئها بدلاً منك، مع قوالب هندسية مدروسة تضمن لك تخطي الفرز الآلي والظهور بمظهر المحترف الحقيقي.
              </p>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div class="text-2xl font-black text-blue-600 mb-1">3 دقائق</div>
                  <div class="text-xs font-bold text-slate-500">متوسط وقت تجهيز السيرة الذاتية</div>
                </div>
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div class="text-2xl font-black text-purple-600 mb-1">100%</div>
                  <div class="text-xs font-bold text-slate-500">تعبئة ذكية للملفات المرفوعة</div>
                </div>
              </div>
            </div>

            <!-- بطاقة إيضاحية للمقارنة -->
            <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div class="text-lg font-bold text-slate-300 mb-6">الفرق بين الطريقة التقليدية و سيرتي:</div>
              
              <div class="space-y-4">
                <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-slate-300">
                  <div class="flex items-center gap-1.5 font-bold text-red-400 text-sm mb-1">
                    <span class="material-symbols-rounded text-base">cancel</span>
                    <span>الطرق التقليدية (Word / التصاميم العشوائية):</span>
                  </div>
                  <p class="text-xs leading-relaxed text-slate-400">ساعات طويلة من التعديل، انهيار التنسيق عند الحفظ، واستبعاد فوري في أنظمة ATS لعدم توافق الهيكلية.</p>
                </div>
                <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-200">
                  <div class="flex items-center gap-1.5 font-bold text-emerald-400 text-sm mb-1">
                    <span class="material-symbols-rounded text-base">check_circle</span>
                    <span>منصة سيرتي (MEAN + AI):</span>
                  </div>
                  <p class="text-xs leading-relaxed text-slate-300">إدخال مقسم وسهل، ذكاء اصطناعي يحلل سيرتك القديمة تلقائياً، وقوالب موثوقة جاهزة للطباعة والتنزيل فوراً.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- 4. المزايا التنافسية (Features) -->
      <section id="features" class="py-24 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="badge badge-primary mb-3 inline-flex items-center gap-1">
              <span class="material-symbols-rounded text-xs">bolt</span>
              <span>مزايا استثنائية</span>
            </span>
            <h2 class="text-3xl sm:text-4xl font-black text-slate-900">كل ما تحتاجه لتتألق في سوق العمل</h2>
            <p class="text-slate-600 text-base mt-4">صُممت كل أداة في المنصة لمساعدتك على إبراز خبراتك بأبسط طريقة وأعلى تأثير.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <!-- ميزة 1: الذكاء الاصطناعي للاستيراد -->
            <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <span class="material-symbols-rounded text-2xl">auto_awesome</span>
              </div>
              <h3 class="text-xl font-black text-slate-800 mb-3">مساعد الذكاء الاصطناعي (AI Importer)</h3>
              <p class="text-slate-600 text-sm leading-relaxed">
                ارفع سيرتك الذاتية الحالية بأي صيغة (PDF)، وسيقوم الذكاء الاصطناعي بقراءتها وتفكيكها وتعبئة كافة الأقسام تلقائياً في ثوانٍ.
              </p>
            </div>

            <!-- ميزة 2: إدخال مقسم وبديهي -->
            <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <span class="material-symbols-rounded text-2xl">dashboard_customize</span>
              </div>
              <h3 class="text-xl font-black text-slate-800 mb-3">أقسام منظمة وسهلة التعبئة</h3>
              <p class="text-slate-600 text-sm leading-relaxed">
                تقسيم مرن وواضح يشمل البيانات الشخصية، التعليم، الخبرات الوظيفية، اللغات، والشهادات، مع إضافة وتعديل العناصر بسهولة تامة.
              </p>
            </div>

            <!-- ميزة 3: متوافقة مع ATS -->
            <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <span class="material-symbols-rounded text-2xl">verified</span>
              </div>
              <h3 class="text-xl font-black text-slate-800 mb-3">قوالب متوافقة مع أنظمة ATS</h3>
              <p class="text-slate-600 text-sm leading-relaxed">
                قوالب معتمدة تقرأها أنظمة الفرز الآلي للشركات الكبرى بسلاسة بدون تشويش على العناوين أو التواريخ أو المسميات الوظيفية.
              </p>
            </div>

            <!-- ميزة 4: المعاينة اللحظية -->
            <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <span class="material-symbols-rounded text-2xl">visibility</span>
              </div>
              <h3 class="text-xl font-black text-slate-800 mb-3">معاينة مباشرة في الوقت الفعلي</h3>
              <p class="text-slate-600 text-sm leading-relaxed">
                شاهد سيرتك الذاتية تتحدث مباشرة مع كل كلمة تكتبها، مع إمكانية تبديل القوالب والألوان وتغيير الخطوط فورياً.
              </p>
            </div>

            <!-- ميزة 5: تحسين الصياغة الاحترافية -->
            <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <span class="material-symbols-rounded text-2xl">draw</span>
              </div>
              <h3 class="text-xl font-black text-slate-800 mb-3">مُحسّن الصياغة بالذكاء الاصطناعي</h3>
              <p class="text-slate-600 text-sm leading-relaxed">
                زر سحري يحول الكلمات العادية إلى جمل إنجاز قوية وجذابة مدعومة بأفعال التأثير المهني الموصى بها عالمياً.
              </p>
            </div>

            <!-- ميزة 6: تنزيل فوري PDF -->
            <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <span class="material-symbols-rounded text-2xl">download</span>
              </div>
              <h3 class="text-xl font-black text-slate-800 mb-3">تصدير وطباعة PDF عالية الجودة</h3>
              <p class="text-slate-600 text-sm leading-relaxed">
                تنزيل بنقرة واحدة لملف PDF بدقة متناهية مع نصوص قابلة للبحث والنسخ وروابط نشطة لحساباتك ومشاريعك.
              </p>
            </div>

          </div>

        </div>
      </section>

      <!-- 5. خطوات العمل بأسلوب عصري (How It Works) -->
      <section id="steps" class="py-24 bg-white border-y border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="badge badge-primary mb-3 inline-flex items-center gap-1">
              <span class="material-symbols-rounded text-xs">rocket_launch</span>
              <span>طريقة العمل</span>
            </span>
            <h2 class="text-3xl sm:text-4xl font-black text-slate-900">سيرتك الذاتية في 4 خطوات بسيطة جداً</h2>
            <p class="text-slate-600 text-base mt-4">مسار مدروس بعناية لينقلك من الفكرة إلى ملف التقديم للوظيفة بسلاسة مطلقة.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            <!-- الخطوة 1 -->
            <div class="text-center relative">
              <div class="w-16 h-16 mx-auto rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
                1
              </div>
              <h3 class="text-lg font-black text-slate-900 mb-2">أنشئ حسابك المجاني</h3>
              <p class="text-slate-600 text-sm leading-relaxed">سجل في أقل من دقيقة لتصل إلى لوحة تحكم سريعة ونظيفة لحفظ وإدارة سيرك الذاتية.</p>
            </div>

            <!-- الخطوة 2 -->
            <div class="text-center relative">
              <div class="w-16 h-16 mx-auto rounded-2xl bg-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6">
                2
              </div>
              <h3 class="text-lg font-black text-slate-900 mb-2">ارفع ملفك أو أدخل بياناتك</h3>
              <p class="text-slate-600 text-sm leading-relaxed">دع الذكاء الاصطناعي يستخرج بياناتك آلياً، أو عبئ أقسام التعليم والخبرة عبر معالج بسيط.</p>
            </div>

            <!-- الخطوة 3 -->
            <div class="text-center relative">
              <div class="w-16 h-16 mx-auto rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6">
                3
              </div>
              <h3 class="text-lg font-black text-slate-900 mb-2">اختر القالب وخصّص الألوان</h3>
              <p class="text-slate-600 text-sm leading-relaxed">اختر من تشكيلة قوالب أنيقة ونسّق اللون والخط ليعكس شخصيتك المهنية بدقة.</p>
            </div>

            <!-- الخطوة 4 -->
            <div class="text-center relative">
              <div class="w-16 h-16 mx-auto rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6">
                4
              </div>
              <h3 class="text-lg font-black text-slate-900 mb-2">حمّل PDF وقدّم بثقة</h3>
              <p class="text-slate-600 text-sm leading-relaxed">احصل فوراً على سيرتك الذاتية بصيغة PDF الاحترافية الجاهزة للإرسال لمسؤولي التوظيف.</p>
            </div>

          </div>

        </div>
      </section>

      <!-- 6. معرض القوالب (Templates Preview) -->
      <section id="templates" class="py-24 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="badge badge-primary mb-3 inline-flex items-center gap-1">
              <span class="material-symbols-rounded text-xs">palette</span>
              <span>قوالب احترافية</span>
            </span>
            <h2 class="text-3xl sm:text-4xl font-black text-slate-900">مصممة بعناية فائقة لتلفت الأنظار</h2>
            <p class="text-slate-600 text-base mt-4">مجموعة متنوعة من القوالب التي تلائم المهندسين، الإداريين، الأطباء والمصممين.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <!-- قالب 1 -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center">
              <div class="h-56 bg-slate-100 rounded-xl mb-4 overflow-hidden border border-slate-200 relative group flex items-center justify-center p-4">
                <div class="w-full h-full bg-white rounded shadow-sm p-3 text-right text-[8px] text-slate-400 overflow-hidden">
                  <div class="w-1/3 h-2 bg-blue-600 rounded mb-2"></div>
                  <div class="w-1/2 h-1 bg-slate-200 rounded mb-4"></div>
                  <div class="space-y-1">
                    <div class="w-full h-1 bg-slate-100 rounded"></div>
                    <div class="w-full h-1 bg-slate-100 rounded"></div>
                    <div class="w-3/4 h-1 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
              <h3 class="font-bold text-slate-900">القالب العصري (Modern Vibrant)</h3>
              <span class="badge badge-emerald mt-2">مجاني شامل</span>
            </div>

            <!-- قالب 2 -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center">
              <div class="h-56 bg-slate-100 rounded-xl mb-4 overflow-hidden border border-slate-200 relative group flex items-center justify-center p-4">
                <div class="w-full h-full bg-white rounded shadow-sm p-3 text-right text-[8px] text-slate-400 overflow-hidden border-t-4 border-slate-800">
                  <div class="w-1/3 h-2 bg-slate-800 rounded mb-2"></div>
                  <div class="w-1/2 h-1 bg-slate-200 rounded mb-4"></div>
                  <div class="space-y-1">
                    <div class="w-full h-1 bg-slate-100 rounded"></div>
                    <div class="w-full h-1 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
              <h3 class="font-bold text-slate-900">القالب التنفيذي (Executive Slate)</h3>
              <span class="badge badge-pro mt-2 inline-flex items-center gap-1">
                <span class="material-symbols-rounded text-xs text-amber-500">workspace_premium</span>
                <span>Pro باقة المحترفين</span>
              </span>
            </div>

            <!-- قالب 3 -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center">
              <div class="h-56 bg-slate-100 rounded-xl mb-4 overflow-hidden border border-slate-200 relative group flex items-center justify-center p-4">
                <div class="w-full h-full bg-white rounded shadow-sm p-3 text-right text-[8px] text-slate-400 overflow-hidden flex gap-2">
                  <div class="w-1/3 bg-slate-50 h-full p-1 rounded">
                    <div class="w-4 h-4 rounded-full bg-purple-200 mb-2"></div>
                    <div class="w-full h-1 bg-purple-300 rounded mb-1"></div>
                  </div>
                  <div class="w-2/3">
                    <div class="w-1/2 h-2 bg-purple-600 rounded mb-2"></div>
                    <div class="w-full h-1 bg-slate-100 rounded mb-1"></div>
                  </div>
                </div>
              </div>
              <h3 class="font-bold text-slate-900">القالب الإبداعي (Creative Indigo)</h3>
              <span class="badge badge-pro mt-2 inline-flex items-center gap-1">
                <span class="material-symbols-rounded text-xs text-amber-500">workspace_premium</span>
                <span>Pro باقة المحترفين</span>
              </span>
            </div>

            <!-- قالب 4 -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-all text-center">
              <div class="h-56 bg-slate-100 rounded-xl mb-4 overflow-hidden border border-slate-200 relative group flex items-center justify-center p-4">
                <div class="w-full h-full bg-white rounded shadow-sm p-3 text-right text-[8px] text-slate-400 overflow-hidden">
                  <div class="w-1/4 h-1.5 bg-emerald-600 rounded mb-3"></div>
                  <div class="w-full h-1 bg-slate-100 rounded mb-1"></div>
                  <div class="w-full h-1 bg-slate-100 rounded mb-1"></div>
                  <div class="w-2/3 h-1 bg-slate-100 rounded"></div>
                </div>
              </div>
              <h3 class="font-bold text-slate-900">القالب الأنيق (Minimal Clean)</h3>
              <span class="badge badge-emerald mt-2">مجاني شامل</span>
            </div>

          </div>

        </div>
      </section>

      <!-- 7. خطط الأسعار والاشتراكات (Pricing & Plans) -->
      <section id="pricing" class="py-24 bg-white border-y border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div class="text-center max-w-3xl mx-auto mb-16">
            <span class="badge badge-primary mb-3 inline-flex items-center gap-1">
              <span class="material-symbols-rounded text-xs">workspace_premium</span>
              <span>باقات الاشتراك</span>
            </span>
            <h2 class="text-3xl sm:text-4xl font-black text-slate-900">استثمر في مستقبلك المهني بالخيار الأنسب لك</h2>
            <p class="text-slate-600 text-base mt-4">ابدأ مجاناً، أو قم بالترقية للحصول على قوة الذكاء الاصطناعي وتصميمات لا محدودة.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <!-- الباقة المجانية -->
            <div class="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 class="text-xl font-black text-slate-800 mb-2">الباقة المجانية</h3>
                <p class="text-slate-500 text-xs mb-6">مثالية لتجربة المنصة وبناء سيرة ذاتية قياسية</p>
                <div class="text-4xl font-black text-slate-900 mb-6 flex items-baseline gap-1">
                  <span>0 ₪</span>
                  <span class="text-sm font-normal text-slate-500">/ مجاناً دائماً</span>
                </div>
                
                <ul class="space-y-3 text-sm text-slate-600 mb-8">
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-500">check_circle</span>
                    <span>سيرة ذاتية واحدة فقط (1 CV مجاناً)</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-500">check_circle</span>
                    <span>القوالب الأساسية المجانية</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-500">check_circle</span>
                    <span>لغتان أساسيتان (عربي وإنجليزي)</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-500">check_circle</span>
                    <span>تصدير PDF قياسي عالي الدقة</span>
                  </li>
                  <li class="flex items-center gap-2 text-slate-400">
                    <span class="material-symbols-rounded text-base text-purple-500">check_circle</span>
                    <span class="text-purple-700 font-semibold">3 تجارب ذكاء اصطناعي مجانية</span>
                  </li>
                </ul>
              </div>
              <a routerLink="/register" class="btn btn-secondary w-full">ابدأ مجاناً</a>
            </div>

            <!-- باقة المحترفين والذكاء الاصطناعي Pro AI -->
            <div class="bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-3xl p-8 border-2 border-indigo-400 shadow-2xl relative flex flex-col justify-between transform lg:-translate-y-2">
              <div class="absolute -top-4 right-8 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <span>الأكثر طلباً وتوفيراً</span>
                <span class="material-symbols-rounded text-xs">local_fire_department</span>
              </div>
              <div>
                <h3 class="text-xl font-black mb-2">باقة المحترفين (Pro AI)</h3>
                <p class="text-indigo-200 text-xs mb-6">قوة الذكاء الاصطناعي الكاملة وقوالب VIP الحصرية</p>
                <div class="text-4xl font-black mb-6 flex items-baseline gap-1">
                  <span>19 ₪</span>
                  <span class="text-sm font-normal text-indigo-300">/ شهرياً</span>
                </div>
                
                <ul class="space-y-3 text-sm text-indigo-100 mb-8">
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-400">check_circle</span>
                    <span class="font-bold text-white">إنشاء وتكرار سير ذاتية بلا حدود (Unlimited CVs)</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-400">check_circle</span>
                    <span class="font-bold text-white">محرر كانفا البصري (Canva Studio Pro) وتعديل مباشر</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-400">check_circle</span>
                    <span class="font-bold text-white">تحليل ورفع السير بالذكاء الاصطناعي بلا حدود</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-400">check_circle</span>
                    <span>فتح كافة القوالب الحصرية الحديثة (7 قوالب VIP)</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-400">check_circle</span>
                    <span>إضافة لغات غير محدودة وتصدير متعدد اللغات</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-400">check_circle</span>
                    <span>تخصيص كامل للألوان وكافة الخطوط الاحترافية</span>
                  </li>
                </ul>
              </div>
              <a routerLink="/register" class="btn bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold w-full shadow-lg">
                اشترك في باقة Pro الآن (19 ₪ فقط)
              </a>
            </div>

            <!-- باقة مدى الحياة -->
            <div class="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 class="text-xl font-black text-slate-800 mb-2">الباقة الدائمة (Lifetime)</h3>
                <p class="text-slate-500 text-xs mb-6">دفعة واحدة بسيطة لامتلاك كل المزايا إلى الأبد</p>
                <div class="text-4xl font-black text-slate-900 mb-6 flex items-baseline gap-1">
                  <span>49 ₪</span>
                  <span class="text-sm font-normal text-slate-500">/ لمرة واحدة فقط</span>
                </div>
                
                <ul class="space-y-3 text-sm text-slate-600 mb-8">
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-500">check_circle</span>
                    <span>وصول دائم لكافة القوالب الحالية والقادمة</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-500">check_circle</span>
                    <span>رصيد ذكاء اصطناعي مفتوح مدى الحياة</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-500">check_circle</span>
                    <span>تعديل وتحميل السير الذاتية في أي وقت بلا قيود</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-rounded text-base text-emerald-500">check_circle</span>
                    <span>دعم فني مباشر وأولوية التحديثات</span>
                  </li>
                </ul>
              </div>
              <a routerLink="/register" class="btn btn-secondary w-full">احصل على الباقة الدائمة (49 ₪)</a>
            </div>

          </div>

        </div>
      </section>

      <!-- 8. قسم من نحن (About Us) -->
      <section id="about" class="py-24 bg-slate-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl mx-auto text-center">
            
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold mb-4">
              <span class="material-symbols-rounded text-sm">groups</span>
              <span>من نحن</span>
            </span>
            <h2 class="text-3xl sm:text-4xl font-black mb-6">
              فريق شغوف بتمكين الكفاءات وتسهيل رحلة التوظيف
            </h2>
            <p class="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
              نحن فريق من المطورين وخبراء الموارد البشرية والذكاء الاصطناعي، انطلقنا بهدف كسر الحواجز التقنية التي تواجه الباحثين عن عمل عند صياغة سيرتهم الذاتية. نؤمن بأن كل شخص يمتلك مهارات فريدة تستحق أن تُعرض بأبهى صورة وبأعلى احترافية تقنية وعصرية.
            </p>
            
            <div class="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/60 max-w-xl mx-auto">
              <div class="text-indigo-400 font-bold mb-2">رؤيتنا:</div>
              <p class="text-slate-300 text-sm leading-relaxed">
                أن نكون المنصة العربية الأولى والأكثر موثوقية في بناء وتطوير الهوية المهنية باستخدام أحدث تقنيات الويب والذكاء الاصطناعي.
              </p>
            </div>

          </div>
        </div>
      </section>

      <!-- 9. تذييل الصفحة (Footer) -->
      <footer class="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-2">
            <span class="text-xl font-black text-white">سِيرَتي</span>
            <span class="text-xs text-indigo-400 font-bold">Seerati AI</span>
            <span class="text-xs text-slate-500 mr-2">© 2026 جميع الحقوق محفوظة</span>
          </div>
          <div class="flex items-center gap-6 text-xs">
            <a href="#concept" class="hover:text-white transition-colors">الفكرة</a>
            <a href="#features" class="hover:text-white transition-colors">المزايا</a>
            <a routerLink="/interviews-exams" class="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">المقابلات والامتحانات</a>
            <a href="#pricing" class="hover:text-white transition-colors">الأسعار</a>
            <a href="#about" class="hover:text-white transition-colors">من نحن</a>
          </div>
        </div>
      </footer>

    </div>
  `
})
export class LandingComponent {
  authService = inject(AuthService);
  jobService = inject(JobService);
}
