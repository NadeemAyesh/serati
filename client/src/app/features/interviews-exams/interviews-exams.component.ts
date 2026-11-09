import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InterviewService } from '../../core/services/interview.service';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import {
  InterviewQuestion,
  ExamPaperSummary,
  ExamPaperDetail,
  ExamSubmitResult,
  InstitutionTipsMap
} from '../../core/models/interview.model';

@Component({
  selector: 'app-interviews-exams',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" dir="rtl">
      
      <!-- 1. شريط التنقل العلوي الزجاجي (Navigation Bar) -->
      <nav class="sticky top-0 z-40 glass-nav transition-all">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <!-- Logo -->
          <div class="flex items-center gap-3 cursor-pointer" routerLink="/">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <span class="material-symbols-rounded text-2xl">description</span>
            </div>
            <div>
              <span class="text-xl font-black text-slate-900">سِيرَتي</span>
              <span class="text-[10px] font-bold text-indigo-600 block -mt-1 uppercase tracking-wider">Career Prep</span>
            </div>
          </div>

          <!-- الروابط السريعة -->
          <div class="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
            <button 
              (click)="activeMainTab = 'interviews'" 
              [class.text-blue-600]="activeMainTab === 'interviews'"
              class="hover:text-blue-600 transition-colors cursor-pointer"
            >
              أسئلة المقابلات
            </button>
            <button 
              (click)="activeMainTab = 'exams'" 
              [class.text-blue-600]="activeMainTab === 'exams'"
              class="hover:text-blue-600 transition-colors cursor-pointer"
            >
              امتحانات المؤسسات
            </button>
            <button 
              (click)="activeMainTab = 'tips'" 
              [class.text-blue-600]="activeMainTab === 'tips'"
              class="hover:text-blue-600 transition-colors cursor-pointer"
            >
              دليل لجان التوظيف
            </button>
          </div>

          <!-- أزرار الإجراءات -->
          <div class="flex items-center gap-3">
            <a 
              *ngIf="authService.isAuthenticated()" 
              routerLink="/dashboard" 
              class="btn btn-secondary text-xs sm:text-sm py-2 px-3 sm:px-4 flex items-center gap-1.5"
            >
              <span class="material-symbols-rounded text-base">dashboard</span>
              <span>لوحة التحكم</span>
            </a>
            <a 
              *ngIf="!authService.isAuthenticated()" 
              routerLink="/login" 
              class="btn btn-secondary text-xs sm:text-sm py-2 px-3"
            >
              تسجيل الدخول
            </a>
            <a 
              *ngIf="!authService.isAuthenticated()" 
              routerLink="/register" 
              class="btn btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4 shadow-sm"
            >
              إنشاء حساب
            </a>
          </div>

        </div>
      </nav>

      <!-- 2. الترويسة الرئيسية والبانر التعريفي (Hero Header) -->
      <header class="relative bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl">
        <!-- أشكال خلفية جمالية -->
        <div class="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs sm:text-sm font-bold mb-5">
            <span class="material-symbols-rounded text-base text-amber-400">verified</span>
            <span>بوابتك لاجتياز مقابلات واختبارات التوظيف في فلسطين والوطن العربي</span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            بنك أسئلة المقابلات ونماذج <span class="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">امتحانات التوظيف المؤسسية</span>
          </h1>

          <p class="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed font-normal mb-8">
            تدرّب على أسئلة المقابلات السلوكية والتخصصية، ونماذج امتحانات التوظيف المعتمدة لدى ديوان الموظفين العام، وكالة الغوث (الأونروا)، البنوك، وشركات التكنولوجيا، مع إجابات نموذجية وشروحات تفصيلية.
          </p>

          <!-- أزرار التبديل الرئيسية الكبيرة بين الأقسام -->
          <div class="bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80 flex flex-wrap gap-2 justify-center shadow-lg">
            <button 
              (click)="activeMainTab = 'interviews'"
              [class.bg-blue-600]="activeMainTab === 'interviews'"
              [class.text-white]="activeMainTab === 'interviews'"
              [class.text-slate-300]="activeMainTab !== 'interviews'"
              class="py-2.5 px-5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <span class="material-symbols-rounded text-lg">psychology</span>
              <span>أسئلة المقابلات الشخصية ({{ questions().length }})</span>
            </button>

            <button 
              (click)="activeMainTab = 'exams'"
              [class.bg-blue-600]="activeMainTab === 'exams'"
              [class.text-white]="activeMainTab === 'exams'"
              [class.text-slate-300]="activeMainTab !== 'exams'"
              class="py-2.5 px-5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <span class="material-symbols-rounded text-lg">quiz</span>
              <span>امتحانات التوظيف التفاعلية ({{ exams().length }})</span>
            </button>

            <button 
              (click)="activeMainTab = 'tips'"
              [class.bg-blue-600]="activeMainTab === 'tips'"
              [class.text-white]="activeMainTab === 'tips'"
              [class.text-slate-300]="activeMainTab !== 'tips'"
              class="py-2.5 px-5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <span class="material-symbols-rounded text-lg">lightbulb</span>
              <span>أدلة لجان التوظيف حسب المؤسسة</span>
            </button>
          </div>

        </div>
      </header>

      <!-- 3. المحتوى الرئيسي (Main Content Sections) -->
      <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <!-- ==================== القسم 1: أسئلة المقابلات الشخصية ==================== -->
        <section *ngIf="activeMainTab === 'interviews'" class="flex flex-col gap-8 animate-fade-in">
          
          <!-- شريط الفلاتر والبحث -->
          <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col gap-4">
            
            <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <!-- حقل البحث -->
              <div class="relative flex-1">
                <span class="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery" 
                  (input)="filterQuestions()"
                  placeholder="ابحث في الأسئلة أو الكلمات المفتاحية (مثال: STAR، راتب، أونروا، ميزانية، كود)..."
                  class="input pr-11 py-2.5 text-xs sm:text-sm border-slate-200 focus:border-blue-500 rounded-xl w-full"
                />
              </div>

              <!-- فلتر الصعوبة -->
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-500 shrink-0">مستوى الصعوبة:</span>
                <select 
                  [(ngModel)]="selectedDifficulty" 
                  (change)="filterQuestions()"
                  class="bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">جميع المستويات</option>
                  <option value="مبتدئ">مبتدئ</option>
                  <option value="متوسط">متوسط</option>
                  <option value="متقدم">متقدم</option>
                </select>
              </div>
            </div>

            <!-- أزرار التخصصات والفئات (Pills) -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button 
                *ngFor="let cat of interviewCategories"
                (click)="selectedCategory = cat.key; filterQuestions()"
                [class.bg-blue-600]="selectedCategory === cat.key"
                [class.text-white]="selectedCategory === cat.key"
                [class.bg-slate-100]="selectedCategory !== cat.key"
                [class.text-slate-700]="selectedCategory !== cat.key"
                class="px-3 py-1.5 rounded-xl font-bold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer hover:bg-slate-200"
              >
                <span class="material-symbols-rounded text-sm">{{ cat.icon }}</span>
                <span>{{ cat.label }}</span>
              </button>
            </div>

          </div>

          <!-- قائمة بطاقات أسئلة المقابلات -->
          <div *ngIf="isLoadingQuestions" class="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <span class="material-symbols-rounded text-4xl animate-spin text-blue-600">progress_activity</span>
            <span class="text-sm font-bold">جاري تحميل بنك الأسئلة...</span>
          </div>

          <div *ngIf="!isLoadingQuestions && filteredQuestions().length === 0" class="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <span class="material-symbols-rounded text-5xl text-slate-300 mb-2">search_off</span>
            <h3 class="text-base font-bold text-slate-700">لم نعثر على أسئلة تطابق بحثك</h3>
            <p class="text-xs text-slate-400 mt-1">جرّب تغيير فلاتر التخصص أو الصعوبة</p>
          </div>

          <div class="grid grid-cols-1 gap-5">
            <div 
              *ngFor="let q of filteredQuestions(); let i = index"
              class="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <!-- ترويسة السؤال -->
              <div 
                (click)="toggleQuestionExpand(q.id)" 
                class="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 hover:bg-blue-50/30 transition-colors"
              >
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {{ i + 1 }}
                  </div>
                  <div>
                    <div class="flex flex-wrap items-center gap-2 mb-1.5">
                      <span class="badge badge-primary text-[10px] py-0.5 px-2.5">{{ q.categoryName }}</span>
                      <span class="text-[11px] font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span class="material-symbols-rounded text-xs text-slate-400">domain</span>
                        <span>{{ q.institutionTarget }}</span>
                      </span>
                      <span 
                        [ngClass]="{
                          'bg-emerald-100 text-emerald-700': q.difficulty === 'مبتدئ',
                          'bg-amber-100 text-amber-700': q.difficulty === 'متوسط',
                          'bg-rose-100 text-rose-700': q.difficulty === 'متقدم'
                        }"
                        class="text-[10px] font-bold px-2 py-0.5 rounded-md"
                      >
                        {{ q.difficulty }}
                      </span>
                    </div>
                    <h3 class="text-base font-black text-slate-900 leading-snug">{{ q.title }}</h3>
                  </div>
                </div>

                <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span class="text-xs font-bold text-blue-600 hidden sm:inline">
                    {{ expandedQuestionIds.has(q.id) ? 'إخفاء التفاصيل' : 'عرض الإجابة والتحليل' }}
                  </span>
                  <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <span class="material-symbols-rounded text-xl transition-transform" [class.rotate-180]="expandedQuestionIds.has(q.id)">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              <!-- تفاصيل السؤال القابلة للتوسيع -->
              <div *ngIf="expandedQuestionIds.has(q.id)" class="p-5 border-t border-slate-200/80 bg-white flex flex-col gap-4 text-xs sm:text-sm animate-fade-in">
                
                <!-- السياق والهدف -->
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span class="font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                    <span class="material-symbols-rounded text-base text-blue-600">help_center</span>
                    <span>الهدف من طرح هذا السؤال:</span>
                  </span>
                  <p class="text-slate-600 leading-relaxed">{{ q.context }}</p>
                </div>

                <!-- نصيحة لجان التوظيف وما تبحث عنه -->
                <div class="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-amber-950">
                  <span class="font-bold block mb-1 flex items-center gap-1.5 text-amber-800">
                    <span class="material-symbols-rounded text-base text-amber-600">psychology</span>
                    <span>ما الذي تبحث عنه لجنة المقابلة في إجابتك؟</span>
                  </span>
                  <p class="leading-relaxed">{{ q.evaluatorAdvice }}</p>
                </div>

                <!-- زر كشف الإجابة النموذجية أو إخفاؤها (للاختبار الذاتي) -->
                <div class="border border-indigo-100 rounded-2xl p-4 bg-gradient-to-br from-indigo-50/40 to-blue-50/30">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-bold text-indigo-950 flex items-center gap-1.5">
                      <span class="material-symbols-rounded text-base text-indigo-600">check_circle</span>
                      <span>الإجابة النموذجية المقترحة:</span>
                    </span>
                    <button 
                      (click)="toggleRevealAnswer(q.id)"
                      class="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1 rounded-lg border border-indigo-200 shadow-xs cursor-pointer"
                    >
                      {{ revealedAnswerIds.has(q.id) ? 'إخفاء الإجابة النموذجية' : 'كشف الإجابة النموذجية' }}
                    </button>
                  </div>

                  <div *ngIf="revealedAnswerIds.has(q.id)" class="text-slate-800 leading-relaxed p-3 bg-white rounded-xl border border-indigo-100 shadow-sm animate-fade-in">
                    <p class="whitespace-pre-line">{{ q.modelAnswer }}</p>
                  </div>
                  <div *ngIf="!revealedAnswerIds.has(q.id)" class="text-slate-400 text-xs italic py-2 text-center bg-white/60 rounded-xl border border-dashed border-indigo-200">
                    💡 الإجابة مخفية لتتمكن من التمرن ومحاولة الإجابة بنفسك أولاً. اضغط زر "كشف الإجابة" للمقارنة.
                  </div>
                </div>

                <!-- أخطاء شائعة يجب تجنبها -->
                <div class="p-3 bg-rose-50/60 rounded-xl border border-rose-200/60 text-rose-950">
                  <span class="font-bold block mb-1 flex items-center gap-1.5 text-rose-700">
                    <span class="material-symbols-rounded text-base text-rose-600">warning</span>
                    <span>أخطاء شائعة قاتلة يجب تجنبها:</span>
                  </span>
                  <p class="leading-relaxed">{{ q.commonMistakes }}</p>
                </div>

                <!-- صندوق التدرب الذاتي على الصياغة -->
                <div class="pt-2">
                  <button 
                    (click)="togglePracticeBox(q.id)"
                    class="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span class="material-symbols-rounded text-sm">edit_note</span>
                    <span>{{ activePracticeId === q.id ? 'إغلاق مساحة التدرب' : 'تدرّب واكتب صياغتك الخاصة هنا' }}</span>
                  </button>

                  <div *ngIf="activePracticeId === q.id" class="mt-2 flex flex-col gap-2 animate-fade-in">
                    <textarea 
                      [(ngModel)]="practiceNotes[q.id]"
                      rows="3"
                      placeholder="اكتب هنا صياغتك لإجابة هذا السؤال بناءً على خبراتك الحقيقية، ثم قارنها بالإجابة النموذجية..."
                      class="input text-xs sm:text-sm p-3 border-slate-300 rounded-xl w-full"
                    ></textarea>
                    <div class="flex justify-end">
                      <button 
                        (click)="savePracticeNote(q.id)"
                        class="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        <span class="material-symbols-rounded text-xs">save</span>
                        <span>حفظ الصياغة مؤقتاً</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </section>


        <!-- ==================== القسم 2: امتحانات التوظيف المؤسسية ==================== -->
        <section *ngIf="activeMainTab === 'exams'" class="flex flex-col gap-8 animate-fade-in">
          
          <div class="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="max-w-2xl">
              <div class="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-blue-200 mb-3">
                <span class="material-symbols-rounded text-base text-amber-400">timer</span>
                <span>محاكي الامتحانات التنافسية المحوسبة</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black mb-2">نماذج اختبارات التوظيف التنافسية الرسمية</h2>
              <p class="text-sm text-blue-100 leading-relaxed font-normal">
                اختبر معلوماتك في نماذج امتحانات ديوان الموظفين العام، كفايات وكالة الغوث (الأونروا)، امتحانات البنوك، واختبارات هندسة البرمجيات والمحاسبة بنظام التوقيت والتصحيح التلقائي والشروحات الفورية.
              </p>
            </div>

            <div class="flex items-center gap-3">
              <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/15 min-w-[120px]">
                <span class="text-3xl font-black text-amber-300 block">{{ exams().length }}</span>
                <span class="text-xs font-bold text-blue-200">نماذج امتحانات</span>
              </div>
              <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/15 min-w-[120px]">
                <span class="text-3xl font-black text-emerald-300 block">100%</span>
                <span class="text-xs font-bold text-blue-200">تصحيح وشروحات</span>
              </div>
            </div>
          </div>

          <!-- قائمة نماذج الامتحانات -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              *ngFor="let exam of exams()"
              class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div class="p-6 flex flex-col gap-4">
                
                <!-- أيقونة وشارات الامتحان -->
                <div class="flex items-center justify-between">
                  <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <span class="material-symbols-rounded text-2xl">{{ exam.icon }}</span>
                  </div>
                  <span class="badge badge-primary text-xs py-1 px-3">{{ exam.institutionTag }}</span>
                </div>

                <!-- عنوان المؤسسة والامتحان -->
                <div>
                  <span class="text-xs font-bold text-slate-400 block mb-1">{{ exam.institution }}</span>
                  <h3 class="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {{ exam.title }}
                  </h3>
                </div>

                <p class="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {{ exam.description }}
                </p>

                <!-- مؤشرات الامتحان: الوقت، الأسئلة، درجة النجاح -->
                <div class="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl text-center text-xs font-bold">
                  <div>
                    <span class="text-slate-400 block text-[10px]">المدة</span>
                    <span class="text-slate-700">{{ exam.durationMinutes }} دقيقة</span>
                  </div>
                  <div class="border-x border-slate-200">
                    <span class="text-slate-400 block text-[10px]">الأسئلة</span>
                    <span class="text-slate-700">{{ exam.questionsCount }} أسئلة</span>
                  </div>
                  <div>
                    <span class="text-slate-400 block text-[10px]">النجاح</span>
                    <span class="text-emerald-600 font-black">%{{ exam.passingScorePercentage }}</span>
                  </div>
                </div>

              </div>

              <!-- أزرار الإجراءات -->
              <div class="p-5 bg-slate-50/60 border-t border-slate-100 flex flex-col gap-2">
                <button 
                  (click)="startTimedExam(exam.id)"
                  class="btn btn-primary text-xs py-3 w-full shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span class="material-symbols-rounded text-base">timer</span>
                  <span>بدء الاختبار التفاعلي المؤقت</span>
                </button>

                <button 
                  (click)="startStudyMode(exam.id)"
                  class="btn btn-secondary text-xs py-2 w-full flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span class="material-symbols-rounded text-base">menu_book</span>
                  <span>تصفح الأسئلة مع الحلول والشروحات</span>
                </button>
              </div>

            </div>
          </div>

        </section>


        <!-- ==================== القسم 3: أدلة لجان التوظيف ==================== -->
        <section *ngIf="activeMainTab === 'tips'" class="flex flex-col gap-6 animate-fade-in">
          
          <div class="text-center max-w-3xl mx-auto mb-4">
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mb-2">أدلة إرشادات لجان المقابلات حسب طبيعة المؤسسة</h2>
            <p class="text-slate-600 text-sm">
              تختلف المعايير التقييمية باختلاف جهة التوظيف. إليك أهم ما تركز عليه لجان الفرز والمقابلات في أشهر 4 قطاعات:
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- ديوان الموظفين -->
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <span class="material-symbols-rounded text-2xl">account_balance</span>
                </div>
                <div>
                  <h3 class="font-black text-base text-slate-900">ديوان الموظفين العام والوزارات</h3>
                  <span class="text-xs font-bold text-emerald-600">قطاع الوظيفة العمومية والخدمة المدنية</span>
                </div>
              </div>
              <ul class="space-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                <li *ngFor="let tip of tipsData?.civilService?.tips" class="flex items-start gap-2">
                  <span class="material-symbols-rounded text-emerald-500 text-base mt-0.5 shrink-0">check_circle</span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>

            <!-- وكالة الغوث -->
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <span class="material-symbols-rounded text-2xl">public</span>
                </div>
                <div>
                  <h3 class="font-black text-base text-slate-900">وكالة الغوث الدولية (الأونروا) والـ NGOs</h3>
                  <span class="text-xs font-bold text-blue-600">المنظمات الإنسانية والتعليمية</span>
                </div>
              </div>
              <ul class="space-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                <li *ngFor="let tip of tipsData?.unrwa?.tips" class="flex items-start gap-2">
                  <span class="material-symbols-rounded text-blue-500 text-base mt-0.5 shrink-0">check_circle</span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>

            <!-- البنوك والقطاع المصرفي -->
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <span class="material-symbols-rounded text-2xl">account_balance_wallet</span>
                </div>
                <div>
                  <h3 class="font-black text-base text-slate-900">البنوك والمصارف وسلطة النقد</h3>
                  <span class="text-xs font-bold text-amber-600">القطاع المصرفي والمالي</span>
                </div>
              </div>
              <ul class="space-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                <li *ngFor="let tip of tipsData?.banks?.tips" class="flex items-start gap-2">
                  <span class="material-symbols-rounded text-amber-500 text-base mt-0.5 shrink-0">check_circle</span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>

            <!-- شركات التكنولوجيا -->
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <span class="material-symbols-rounded text-2xl">terminal</span>
                </div>
                <div>
                  <h3 class="font-black text-base text-slate-900">شركات التكنولوجيا والبرمجيات</h3>
                  <span class="text-xs font-bold text-purple-600">القطاع التقني والاتصالات</span>
                </div>
              </div>
              <ul class="space-y-2.5 text-xs sm:text-sm text-slate-600 font-medium">
                <li *ngFor="let tip of tipsData?.tech?.tips" class="flex items-start gap-2">
                  <span class="material-symbols-rounded text-purple-500 text-base mt-0.5 shrink-0">check_circle</span>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>

          </div>

        </section>

      </main>


      <!-- ==================== نافذة محاكي الاختبار التفاعلي المؤقت (Exam Modal) ==================== -->
      <div 
        *ngIf="activeExamDetail && isExamRunning" 
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        dir="rtl"
      >
        <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col animate-scale-up border border-slate-200">
          
          <!-- ترويسة الامتحان والمؤقت -->
          <div class="bg-slate-900 text-white p-5 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-blue-300 block">{{ activeExamDetail.institution }}</span>
              <h3 class="text-base font-black">{{ activeExamDetail.title }}</h3>
            </div>

            <!-- العداد التنازلي -->
            <div class="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-xl">
              <span class="material-symbols-rounded text-amber-400 text-lg">timer</span>
              <span class="font-mono font-black text-sm text-amber-300">{{ formattedRemainingTime }}</span>
            </div>
          </div>

          <!-- شريط التقدم -->
          <div class="w-full bg-slate-100 h-2">
            <div 
              class="bg-blue-600 h-2 transition-all duration-300" 
              [style.width.%]="((currentQuestionIndex + 1) / activeExamDetail.questions.length) * 100"
            ></div>
          </div>

          <!-- مساحة السؤال والخيارات الأربعة -->
          <div class="p-6 flex-1 flex flex-col gap-6">
            
            <div class="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>السؤال {{ currentQuestionIndex + 1 }} من {{ activeExamDetail.questions.length }}</span>
              <span>درجة النجاح المطلوبة: %{{ activeExamDetail.passingScorePercentage }}</span>
            </div>

            <!-- نص السؤال -->
            <h4 class="text-base sm:text-lg font-black text-slate-900 leading-relaxed">
              {{ activeExamDetail.questions[currentQuestionIndex].text }}
            </h4>

            <!-- الخيارات -->
            <div class="space-y-3">
              <label 
                *ngFor="let opt of activeExamDetail.questions[currentQuestionIndex].options; let optIdx = index"
                [class.border-blue-600]="userAnswers[activeExamDetail.questions[currentQuestionIndex].id] === optIdx"
                [class.bg-blue-50]="userAnswers[activeExamDetail.questions[currentQuestionIndex].id] === optIdx"
                class="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-slate-50 cursor-pointer transition-all"
              >
                <input 
                  type="radio" 
                  [name]="activeExamDetail.questions[currentQuestionIndex].id"
                  [value]="optIdx"
                  [(ngModel)]="userAnswers[activeExamDetail.questions[currentQuestionIndex].id]"
                  class="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-xs sm:text-sm font-bold text-slate-800">{{ opt }}</span>
              </label>
            </div>

          </div>

          <!-- أزرار التنقل بين الأسئلة والتسليم -->
          <div class="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button 
              (click)="previousQuestion()"
              [disabled]="currentQuestionIndex === 0"
              class="btn btn-secondary text-xs py-2 px-4 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
            >
              <span class="material-symbols-rounded text-base">arrow_forward</span>
              <span>السابق</span>
            </button>

            <div class="flex items-center gap-2">
              <button 
                *ngIf="currentQuestionIndex < activeExamDetail.questions.length - 1"
                (click)="nextQuestion()"
                class="btn btn-primary text-xs py-2 px-5 flex items-center gap-1 cursor-pointer"
              >
                <span>التالي</span>
                <span class="material-symbols-rounded text-base">arrow_back</span>
              </button>

              <button 
                (click)="submitExam()"
                class="btn btn-ai text-xs py-2 px-5 font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-500/20"
              >
                <span class="material-symbols-rounded text-base">send</span>
                <span>تسليم وتصحيح الامتحان</span>
              </button>
            </div>
          </div>

        </div>
      </div>


      <!-- ==================== نافذة نتائج الامتحان والتصحيح الشامل (Result Modal) ==================== -->
      <div 
        *ngIf="examResult" 
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        dir="rtl"
      >
        <div class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up border border-slate-200">
          
          <!-- بطاقة النتيجة العلوية -->
          <div 
            [ngClass]="examResult.hasPassed ? 'bg-gradient-to-r from-emerald-600 to-teal-700' : 'bg-gradient-to-r from-rose-600 to-pink-700'"
            class="p-6 text-white text-center flex flex-col items-center gap-2 relative"
          >
            <button 
              (click)="examResult = null; activeExamDetail = null"
              class="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer"
            >
              <span class="material-symbols-rounded text-lg">close</span>
            </button>

            <span class="text-4xl">
              {{ examResult.hasPassed ? '🎉' : '📚' }}
            </span>
            <h3 class="text-2xl font-black">
              {{ examResult.hasPassed ? 'مبروك! لقد اجتزت الامتحان بنجاح' : 'لم تجتز درجة النجاح المطلوبة' }}
            </h3>
            <p class="text-xs text-white/90 max-w-md">{{ examResult.evaluationFeedback }}</p>

            <div class="flex items-center gap-4 mt-3 bg-white/10 backdrop-blur-md rounded-2xl py-2 px-6 border border-white/20">
              <div>
                <span class="text-xs text-white/80 block">النسبة المئوية</span>
                <span class="text-2xl font-black">{{ examResult.scorePercentage }}%</span>
              </div>
              <div class="border-r border-white/30 pr-4">
                <span class="text-xs text-white/80 block">الإجابات الصحيحة</span>
                <span class="text-2xl font-black">{{ examResult.correctCount }} / {{ examResult.totalQuestions }}</span>
              </div>
              <div class="border-r border-white/30 pr-4">
                <span class="text-xs text-white/80 block">حد النجاح</span>
                <span class="text-2xl font-black">{{ examResult.passingScorePercentage }}%</span>
              </div>
            </div>
          </div>

          <!-- استعراض تفصيلي للأسئلة مع الشروحات -->
          <div class="p-6 flex-1 overflow-y-auto flex flex-col gap-4 bg-slate-50">
            <h4 class="font-black text-sm text-slate-800">مراجعة الإجابات والشروحات التوضيحية:</h4>

            <div 
              *ngFor="let item of examResult.breakdown; let idx = index"
              [class.border-emerald-200]="item.isCorrect"
              [class.border-rose-200]="!item.isCorrect"
              class="p-4 rounded-2xl bg-white border shadow-xs flex flex-col gap-2.5"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-400">السؤال {{ idx + 1 }}</span>
                <span 
                  [ngClass]="item.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'"
                  class="text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"
                >
                  <span class="material-symbols-rounded text-xs">{{ item.isCorrect ? 'check' : 'close' }}</span>
                  <span>{{ item.isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة' }}</span>
                </span>
              </div>

              <h5 class="font-bold text-sm text-slate-900">{{ item.questionText }}</h5>

              <div class="text-xs space-y-1">
                <p [class.text-rose-600]="!item.isCorrect" [class.text-emerald-700]="item.isCorrect" class="font-bold">
                  إجابتك: {{ item.userAnswerText }}
                </p>
                <p *ngIf="!item.isCorrect" class="font-bold text-emerald-700">
                  الإجابة الصحيحة: {{ item.correctAnswerText }}
                </p>
              </div>

              <!-- الشرح والتوضيح القانوني/الفني -->
              <div class="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs text-slate-700 leading-relaxed">
                <span class="font-bold text-blue-900 block mb-0.5">💡 الشرح والسند العلمي:</span>
                <p>{{ item.explanation }}</p>
              </div>

            </div>
          </div>

          <!-- تذييل النافذة -->
          <div class="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
            <button 
              (click)="examResult = null; startTimedExam(activeExamDetail?.id || '')"
              class="btn btn-primary text-xs py-2 px-4 flex items-center gap-1 cursor-pointer"
            >
              <span class="material-symbols-rounded text-sm">restart_alt</span>
              <span>إعادة الاختبار</span>
            </button>

            <button 
              (click)="examResult = null; activeExamDetail = null"
              class="btn btn-secondary text-xs py-2 px-5 cursor-pointer"
            >
              إغلاق
            </button>
          </div>

        </div>
      </div>


      <!-- ==================== نافذة نمط الدراسة السريع والشروحات (Study Mode Modal) ==================== -->
      <div 
        *ngIf="activeExamDetail && isStudyMode" 
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        dir="rtl"
      >
        <div class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up border border-slate-200">
          
          <div class="bg-slate-900 text-white p-5 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-blue-300">{{ activeExamDetail.institution }}</span>
              <h3 class="text-base font-black">أسئلة الامتحان مع الشروحات (نمط المراجعة السريعة)</h3>
            </div>
            <button 
              (click)="isStudyMode = false; activeExamDetail = null"
              class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
            >
              <span class="material-symbols-rounded text-lg">close</span>
            </button>
          </div>

          <div class="p-6 flex-1 overflow-y-auto flex flex-col gap-5 bg-slate-50">
            <div 
              *ngFor="let q of activeExamDetail.questions; let i = index"
              class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col gap-3"
            >
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                  {{ i + 1 }}
                </span>
                <h4 class="font-black text-sm text-slate-900">{{ q.text }}</h4>
              </div>

              <!-- الخيارات مع تظليل الإجابة الصحيحة -->
              <div class="space-y-1.5 text-xs font-semibold">
                <div 
                  *ngFor="let opt of q.options; let optIdx = index"
                  [class.bg-emerald-50]="optIdx === q.correctIndex"
                  [class.text-emerald-800]="optIdx === q.correctIndex"
                  [class.border-emerald-300]="optIdx === q.correctIndex"
                  [class.font-bold]="optIdx === q.correctIndex"
                  class="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <span>{{ opt }}</span>
                  <span *ngIf="optIdx === q.correctIndex" class="badge badge-success text-[10px] py-0.5 px-2">الإجابة الصحيحة</span>
                </div>
              </div>

              <!-- الشرح والسند العلمي -->
              <div class="p-3 bg-blue-50/80 rounded-xl border border-blue-200/60 text-xs text-slate-700 leading-relaxed">
                <span class="font-bold text-blue-900 block mb-0.5">💡 التفسير والسند المعتمد:</span>
                <p>{{ q.explanation }}</p>
              </div>
            </div>
          </div>

          <div class="p-4 bg-white border-t border-slate-200 flex justify-end">
            <button 
              (click)="isStudyMode = false; startTimedExam(activeExamDetail.id)"
              class="btn btn-primary text-xs py-2 px-5 flex items-center gap-1 cursor-pointer"
            >
              <span class="material-symbols-rounded text-base">timer</span>
              <span>خوض الامتحان المؤقت الآن</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  `
})
export class InterviewsExamsComponent implements OnInit, OnDestroy {
  interviewService = inject(InterviewService);
  authService = inject(AuthService);
  alertService = inject(AlertService);

  activeMainTab: 'interviews' | 'exams' | 'tips' = 'interviews';

  // أسئلة المقابلات
  questions = signal<InterviewQuestion[]>([]);
  filteredQuestions = signal<InterviewQuestion[]>([]);
  isLoadingQuestions = false;
  selectedCategory = 'all';
  selectedDifficulty = 'all';
  searchQuery = '';

  expandedQuestionIds = new Set<string>();
  revealedAnswerIds = new Set<string>();
  activePracticeId: string | null = null;
  practiceNotes: Record<string, string> = {};

  // امتحانات التوظيف
  exams = signal<ExamPaperSummary[]>([]);
  activeExamDetail: ExamPaperDetail | null = null;
  isExamRunning = false;
  isStudyMode = false;
  currentQuestionIndex = 0;
  userAnswers: Record<string, number> = {};
  examResult: ExamSubmitResult | null = null;

  // المؤقت
  remainingSeconds = 0;
  timerInterval: any = null;
  formattedRemainingTime = '20:00';

  // نصائح لجان التوظيف
  tipsData: InstitutionTipsMap | null = null;

  interviewCategories = [
    { key: 'all', label: 'الكل', icon: 'apps' },
    { key: 'hr', label: 'الموارد البشرية والسلوكية', icon: 'person' },
    { key: 'it', label: 'تكنولوجيا ومعلومات وبرمجة', icon: 'code' },
    { key: 'accounting', label: 'محاسبة ومالية وبنوك', icon: 'account_balance' },
    { key: 'civilService', label: 'ديوان الموظفين والوظائف الحكومية', icon: 'gavel' },
    { key: 'unrwa', label: 'وكالة الغوث (الأونروا) والمنظمات', icon: 'public' },
    { key: 'engineering', label: 'هندسة وإدارة مشاريع', icon: 'engineering' }
  ];

  ngOnInit() {
    this.loadQuestions();
    this.loadExams();
    this.loadTips();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  loadQuestions() {
    this.isLoadingQuestions = true;
    this.interviewService.getQuestions().subscribe({
      next: res => {
        this.isLoadingQuestions = false;
        if (res.success) {
          this.questions.set(res.data);
          this.filterQuestions();
          // افتراضياً افتح أول سؤالين
          if (res.data.length > 0) {
            this.expandedQuestionIds.add(res.data[0].id);
          }
        }
      },
      error: () => {
        this.isLoadingQuestions = false;
      }
    });
  }

  loadExams() {
    this.interviewService.getExams().subscribe({
      next: res => {
        if (res.success) {
          this.exams.set(res.data);
        }
      },
      error: () => {}
    });
  }

  loadTips() {
    this.interviewService.getTips().subscribe({
      next: res => {
        if (res.success) {
          this.tipsData = res.data;
        }
      },
      error: () => {}
    });
  }

  filterQuestions() {
    let list = this.questions();

    if (this.selectedCategory !== 'all') {
      list = list.filter(q => q.category.toLowerCase() === this.selectedCategory.toLowerCase());
    }

    if (this.selectedDifficulty !== 'all') {
      list = list.filter(q => q.difficulty === this.selectedDifficulty);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      list = list.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        item.institutionTarget.toLowerCase().includes(q) ||
        item.modelAnswer.toLowerCase().includes(q)
      );
    }

    this.filteredQuestions.set(list);
  }

  toggleQuestionExpand(id: string) {
    if (this.expandedQuestionIds.has(id)) {
      this.expandedQuestionIds.delete(id);
    } else {
      this.expandedQuestionIds.add(id);
    }
  }

  toggleRevealAnswer(id: string) {
    if (this.revealedAnswerIds.has(id)) {
      this.revealedAnswerIds.delete(id);
    } else {
      this.revealedAnswerIds.add(id);
    }
  }

  togglePracticeBox(id: string) {
    this.activePracticeId = this.activePracticeId === id ? null : id;
  }

  savePracticeNote(id: string) {
    this.alertService.success('تم الحفظ', 'تم حفظ صياغتك بنجاح لتراجعها لاحقاً!');
  }

  // --- إدارة الامتحانات التفاعلية ---
  startTimedExam(examId: string) {
    this.interviewService.getExamById(examId).subscribe({
      next: res => {
        if (res.success) {
          this.activeExamDetail = res.data;
          this.isExamRunning = true;
          this.isStudyMode = false;
          this.currentQuestionIndex = 0;
          this.userAnswers = {};
          this.examResult = null;
          this.startTimer(this.activeExamDetail.durationMinutes * 60);
        }
      },
      error: () => {
        this.alertService.error('خطأ', 'فشل في تحميل الامتحان، يرجى المحاولة لاحقاً');
      }
    });
  }

  startStudyMode(examId: string) {
    this.interviewService.getExamById(examId).subscribe({
      next: res => {
        if (res.success) {
          this.activeExamDetail = res.data;
          this.isStudyMode = true;
          this.isExamRunning = false;
        }
      },
      error: () => {}
    });
  }

  nextQuestion() {
    if (this.activeExamDetail && this.currentQuestionIndex < this.activeExamDetail.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitExam() {
    if (!this.activeExamDetail) return;
    this.stopTimer();

    this.interviewService.submitExam(this.activeExamDetail.id, this.userAnswers).subscribe({
      next: res => {
        if (res.success) {
          this.isExamRunning = false;
          this.examResult = res.result;
        }
      },
      error: () => {
        this.alertService.error('خطأ', 'فشل تصحيح الامتحان');
      }
    });
  }

  private startTimer(seconds: number) {
    this.stopTimer();
    this.remainingSeconds = seconds;
    this.updateFormattedTime();

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      this.updateFormattedTime();

      if (this.remainingSeconds <= 0) {
        this.stopTimer();
        this.alertService.warning('انتهى الوقت!', 'انتهى الوقت المخصص للامتحان وسيتم تصحيحه تلقائياً.');
        this.submitExam();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private updateFormattedTime() {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    this.formattedRemainingTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
