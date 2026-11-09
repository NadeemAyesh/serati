import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JobService, BotChatMessage } from '../../../core/services/job.service';
import { JobItem, AvailableCountry } from '../../../core/models/job.model';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-job-bot',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Floating Job Scout Bot Trigger Button -->
    <div class="fixed bottom-6 left-6 z-50 flex items-center gap-3" dir="rtl">
      
      <!-- Mini Notification Pill (shows when closed and there are new jobs) -->
      <div 
        *ngIf="!jobService.isBotOpen() && jobService.newJobsCount() > 0" 
        (click)="jobService.toggleBot(true)"
        class="hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold py-2 px-3.5 rounded-full shadow-xl shadow-slate-900/30 border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition-all transform hover:-translate-y-0.5 animate-bounce-slow"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>وظائف جديدة في {{ jobService.selectedCountry() }}!</span>
      </div>

      <!-- Main Floating Bot Button -->
      <button
        (click)="jobService.toggleBot()"
        [attr.aria-label]="jobService.isBotOpen() ? 'إغلاق مساعد الوظائف' : 'فتح مساعد الوظائف'"
        class="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-600/40 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        <!-- Pulse effect ring -->
        <span class="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-40 blur group-hover:opacity-75 transition duration-500 animate-pulse"></span>
        
        <!-- Icon -->
        <div class="relative flex items-center justify-center">
          <span *ngIf="!jobService.isBotOpen()" class="material-symbols-rounded text-3xl transition-transform group-hover:rotate-12">smart_toy</span>
          <span *ngIf="jobService.isBotOpen()" class="material-symbols-rounded text-3xl">close</span>
        </div>

        <!-- Online Green Status Dot -->
        <span class="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>

        <!-- Badge Counter -->
        <span 
          *ngIf="jobService.newJobsCount() > 0 && !jobService.isBotOpen()"
          class="absolute -top-1 -left-1 bg-rose-500 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
        >
          {{ jobService.newJobsCount() }}
        </span>
      </button>

    </div>

    <!-- Slide-over Bot Panel / Drawer -->
    <div 
      *ngIf="jobService.isBotOpen()" 
      class="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm animate-fade-in flex justify-start"
      dir="rtl"
      (click)="onBackdropClick($event)"
    >
      <div 
        class="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-in relative"
        (click)="$event.stopPropagation()"
      >

        <!-- 1. ترويسة البوت (Bot Header) -->
        <div class="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col gap-3 shadow-md">
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <span class="material-symbols-rounded text-2xl">smart_toy</span>
                <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-black text-base text-white">مساعد الوظائف الذكي</h3>
                  <span class="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-400/30">Job Scout AI</span>
                </div>
                <div class="flex items-center gap-1.5 text-xs text-slate-300">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>رصد حي ومستمر للشواغر الموثوقة</span>
                </div>
              </div>
            </div>

            <!-- زر الإغلاق -->
            <button 
              (click)="jobService.toggleBot(false)"
              class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق"
            >
              <span class="material-symbols-rounded text-xl">close</span>
            </button>
          </div>

          <!-- اختيار الدولة مع التركيز على فلسطين كافتراضي -->
          <div class="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/10">
            <div class="flex items-center gap-2 text-xs font-bold text-slate-200">
              <span class="material-symbols-rounded text-base text-amber-400">public</span>
              <span>الدولة المستهدفة:</span>
            </div>

            <div class="relative">
              <select 
                [ngModel]="jobService.selectedCountry()" 
                (ngModelChange)="onCountryChange($event)"
                class="bg-slate-800 text-white font-bold text-xs rounded-lg px-3 py-1.5 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option *ngFor="let country of countries()" [value]="country.name">
                  {{ country.flag }} {{ country.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- شريط التبويبات الثلاثة -->
          <div class="grid grid-cols-3 gap-1 bg-slate-800/80 p-1 rounded-xl text-xs font-bold text-slate-300">
            <button 
              (click)="activeTab = 'chat'" 
              [class.bg-blue-600]="activeTab === 'chat'"
              [class.text-white]="activeTab === 'chat'"
              class="py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span class="material-symbols-rounded text-base">chat</span>
              <span>محادثة البوت</span>
            </button>

            <button 
              (click)="activeTab = 'feed'; loadLiveJobs()" 
              [class.bg-blue-600]="activeTab === 'feed'"
              [class.text-white]="activeTab === 'feed'"
              class="py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span class="material-symbols-rounded text-base">work</span>
              <span>الشواغر الحية</span>
            </button>

            <button 
              (click)="activeTab = 'alerts'" 
              [class.bg-blue-600]="activeTab === 'alerts'"
              [class.text-white]="activeTab === 'alerts'"
              class="py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span class="material-symbols-rounded text-base">notifications_active</span>
              <span>التنبيهات</span>
            </button>
          </div>

        </div>

        <!-- 2. محتوى التبويبات (Tab Contents) -->

        <!-- Tab 1: محادثة البوت الذكي (Chat) -->
        <div *ngIf="activeTab === 'chat'" class="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50">
          
          <div *ngFor="let msg of jobService.messages()" class="flex flex-col gap-2">
            
            <!-- رسالة البوت -->
            <div *ngIf="msg.sender === 'bot'" class="flex items-start gap-2 max-w-[90%]">
              <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <span class="material-symbols-rounded text-lg">smart_toy</span>
              </div>
              <div class="bg-white rounded-2xl rounded-tr-none p-3.5 shadow-sm border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                <p>{{ msg.text }}</p>

                <!-- بطاقات الوظائف المطابقة داخل الرسالة -->
                <div *ngIf="msg.matchedJobs && msg.matchedJobs.length > 0" class="mt-3 flex flex-col gap-2">
                  <div 
                    *ngFor="let job of msg.matchedJobs"
                    class="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 transition-colors flex flex-col gap-1.5"
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-xs text-blue-700 line-clamp-1">{{ job.title }}</span>
                      <span *ngIf="job.isNew" class="badge badge-primary text-[10px] py-0.5 px-2">جديد</span>
                    </div>
                    <div class="flex items-center gap-3 text-[11px] text-slate-500 font-semibold">
                      <span class="flex items-center gap-1">
                        <span class="material-symbols-rounded text-xs text-slate-400">domain</span>
                        <span>{{ job.company }}</span>
                      </span>
                      <span class="flex items-center gap-1">
                        <span class="material-symbols-rounded text-xs text-slate-400">location_on</span>
                        <span>{{ job.city }}</span>
                      </span>
                    </div>
                    <div class="flex items-center justify-between pt-1 border-t border-slate-200/60 mt-1">
                      <span class="text-[11px] font-bold text-emerald-600">{{ job.salaryRange || 'راتب مجزٍ' }}</span>
                      <div class="flex items-center gap-1">
                        <a 
                          [href]="job.applyUrl" 
                          target="_blank" 
                          rel="noopener"
                          class="btn btn-primary text-[10px] py-1 px-2.5 shadow-none"
                        >
                          تقديم مباشر
                        </a>
                        <button 
                          (click)="openJobDetail(job)"
                          class="btn btn-secondary text-[10px] py-1 px-2"
                        >
                          تفاصيل
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- أزرار الإجراءات السريعة المقترحة -->
                <div *ngIf="msg.quickActions && msg.quickActions.length > 0" class="mt-3 flex flex-wrap gap-1.5">
                  <button 
                    *ngFor="let action of msg.quickActions"
                    (click)="sendQuickPrompt(action)"
                    class="text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-1 px-2.5 rounded-lg border border-indigo-200/60 transition-colors cursor-pointer"
                  >
                    {{ action }}
                  </button>
                </div>

              </div>
            </div>

            <!-- رسالة المستخدم -->
            <div *ngIf="msg.sender === 'user'" class="flex items-start justify-end gap-2">
              <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tl-none p-3 shadow-md text-xs sm:text-sm font-semibold max-w-[85%]">
                {{ msg.text }}
              </div>
            </div>

          </div>

          <!-- مؤشر الكتابة للذكاء الاصطناعي -->
          <div *ngIf="isBotTyping" class="flex items-center gap-2 text-xs text-slate-500 font-bold bg-white p-2.5 rounded-xl border border-slate-200 w-fit">
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            <span>البوت يبحث عن أفضل الوظائف المطابقة في {{ jobService.selectedCountry() }}...</span>
          </div>

        </div>

        <!-- Chat Input Bar -->
        <div *ngIf="activeTab === 'chat'" class="p-3 bg-white border-t border-slate-200">
          <form (ngSubmit)="sendUserMessage()" class="flex items-center gap-2">
            <input 
              type="text" 
              [(ngModel)]="userInputText" 
              name="botMessage"
              placeholder="اكتب استفسارك (مثال: وظائف محاسبة في رام الله، أو أونروا)..."
              class="flex-1 input text-xs sm:text-sm py-2.5 px-3 focus:ring-2 focus:ring-blue-500 border border-slate-300 rounded-xl"
              [disabled]="isBotTyping"
            />
            <button 
              type="submit" 
              [disabled]="!userInputText.trim() || isBotTyping"
              class="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-md shadow-blue-500/20"
            >
              <span class="material-symbols-rounded text-xl">send</span>
            </button>
          </form>
        </div>

        <!-- Tab 2: خلاصة الوظائف المباشرة (Live Feed) -->
        <div *ngIf="activeTab === 'feed'" class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
          
          <!-- فلتر المدن والتحديث التلقائي -->
          <div class="flex flex-col gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>فرص عمل نشطة ({{ liveJobs().length }})</span>
              </span>
              <button 
                (click)="loadLiveJobs()"
                class="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span class="material-symbols-rounded text-base" [class.animate-spin]="isLoadingJobs">refresh</span>
                <span>تحديث</span>
              </button>
            </div>

            <!-- فلاتر المدن -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button 
                *ngFor="let city of currentCountryCities()"
                (click)="selectedCityFilter = city; filterLiveJobs()"
                [class.bg-blue-600]="selectedCityFilter === city"
                [class.text-white]="selectedCityFilter === city"
                [class.bg-slate-100]="selectedCityFilter !== city"
                [class.text-slate-600]="selectedCityFilter !== city"
                class="px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors cursor-pointer"
              >
                {{ city }}
              </button>
            </div>
          </div>

          <!-- قائمة بطاقات الوظائف -->
          <div *ngIf="isLoadingJobs" class="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
            <span class="material-symbols-rounded text-3xl animate-spin text-blue-600">progress_activity</span>
            <span class="text-xs font-bold">جاري تحميل الشواغر الحية...</span>
          </div>

          <div *ngIf="!isLoadingJobs && filteredLiveJobs().length === 0" class="text-center py-12 text-slate-400">
            <span class="material-symbols-rounded text-4xl mb-2">work_off</span>
            <p class="text-xs font-bold">لا توجد وظائف حالياً مطابقة لهذا الفلتر</p>
          </div>

          <div 
            *ngFor="let job of filteredLiveJobs()"
            class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-2.5 relative"
          >
            <!-- شارات الحالة -->
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <span class="material-symbols-rounded text-xs">schedule</span>
                <span>{{ job.postedTimeAgo }}</span>
              </span>
              <div class="flex items-center gap-1">
                <span *ngIf="job.isHot" class="badge badge-pro text-[10px] py-0.5 px-2">🔥 فرصة مميزة</span>
                <span *ngIf="job.isNew" class="badge badge-primary text-[10px] py-0.5 px-2">جديد</span>
              </div>
            </div>

            <!-- المسمى والشركة -->
            <div>
              <h4 class="font-black text-sm text-slate-800 leading-snug">{{ job.title }}</h4>
              <p class="text-xs font-bold text-blue-600 mt-0.5 flex items-center gap-1">
                <span class="material-symbols-rounded text-sm">domain</span>
                <span>{{ job.company }}</span>
              </p>
            </div>

            <!-- تفاصيل الموقع والدوام والراتب -->
            <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-semibold">
              <span class="bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <span class="material-symbols-rounded text-xs text-slate-400">location_on</span>
                <span>{{ job.city }}</span>
              </span>
              <span class="bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <span class="material-symbols-rounded text-xs text-slate-400">badge</span>
                <span>{{ job.jobType }}</span>
              </span>
              <span class="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md">
                {{ job.salaryRange || 'راتب منافس' }}
              </span>
            </div>

            <!-- الأزرار -->
            <div class="flex items-center gap-2 pt-2 border-t border-slate-100 mt-1">
              <a 
                [href]="job.applyUrl" 
                target="_blank" 
                rel="noopener"
                class="flex-1 btn btn-primary text-xs py-2 shadow-sm text-center flex items-center justify-center gap-1"
              >
                <span>تقديم سريع</span>
                <span class="material-symbols-rounded text-sm">open_in_new</span>
              </a>
              <button 
                (click)="openJobDetail(job)"
                class="btn btn-secondary text-xs py-2 px-3 flex items-center justify-center gap-1"
              >
                <span>التفاصيل</span>
              </button>
              <a 
                routerLink="/interviews-exams" 
                (click)="jobService.toggleBot(false)"
                title="تجهيز للمقابلة والامتحان"
                class="btn btn-ai text-xs py-2 px-2.5 flex items-center justify-center"
              >
                <span class="material-symbols-rounded text-sm">quiz</span>
              </a>
            </div>

          </div>

        </div>

        <!-- Tab 3: التنبيهات ومطابقة السيرة (Alerts & Match) -->
        <div *ngIf="activeTab === 'alerts'" class="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50">
          
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex flex-col gap-2">
            <div class="flex items-center gap-2 text-blue-900 font-black text-sm">
              <span class="material-symbols-rounded text-blue-600">notifications_active</span>
              <span>تنبيهات الوظائف الفورية</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed font-medium">
              يقوم البوت برصد أي وظيفة جديدة تنشر في <strong>{{ jobService.selectedCountry() }}</strong> وتنبيهك بها على الفور في الموقع.
            </p>
          </div>

          <!-- تفضيلات التنبيه -->
          <div class="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col gap-3 shadow-sm">
            <h4 class="font-bold text-xs text-slate-800">تخصيص تنبيهاتك حسب مجالك:</h4>
            
            <div class="space-y-2 text-xs font-semibold text-slate-600">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="alertPrefs.tech" class="rounded text-blue-600" />
                <span>وظائف التكنولوجيا والبرمجة والاتصالات</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="alertPrefs.banking" class="rounded text-blue-600" />
                <span>وظائف البنوك والمحاسبة والمالية</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="alertPrefs.unrwa" class="rounded text-blue-600" />
                <span>وظائف الأونروا والمؤسسات والمنظمات الدولية (NGOs)</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="alertPrefs.education" class="rounded text-blue-600" />
                <span>وظائف التعليم والتدريس</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" [(ngModel)]="alertPrefs.internships" class="rounded text-blue-600" />
                <span>برامج التدريب لخريجي الجامعات الجدد</span>
              </label>
            </div>

            <button 
              (click)="saveAlertPreferences()"
              class="btn btn-primary text-xs py-2.5 mt-2 flex items-center justify-center gap-1 shadow-sm"
            >
              <span class="material-symbols-rounded text-sm">save</span>
              <span>حفظ تفضيلات التنبيهات</span>
            </button>
          </div>

          <!-- زر الانتقال لبنك الأسئلة والامتحانات -->
          <div class="bg-white rounded-2xl p-4 border border-indigo-100 flex items-center justify-between gap-3 shadow-sm">
            <div>
              <h5 class="font-bold text-xs text-indigo-950">هل تم استدعاؤك لمقابلة؟</h5>
              <p class="text-[11px] text-slate-500 font-medium">تدرّب على أسئلة المقابلات ونماذج الامتحانات الرسمية</p>
            </div>
            <a 
              routerLink="/interviews-exams" 
              (click)="jobService.toggleBot(false)"
              class="btn btn-ai text-xs py-2 px-3 shrink-0 flex items-center gap-1"
            >
              <span>دخول القسم</span>
              <span class="material-symbols-rounded text-sm">arrow_back</span>
            </a>
          </div>

        </div>

        <!-- 3. نافذة تفاصيل الوظيفة المنبثقة (Job Detail Modal) -->
        <div 
          *ngIf="selectedJobDetail"
          class="absolute inset-0 z-20 bg-white flex flex-col animate-fade-in"
          dir="rtl"
        >
          <div class="p-4 bg-slate-900 text-white flex items-center justify-between">
            <h4 class="font-bold text-sm">تفاصيل الوظيفة</h4>
            <button 
              (click)="selectedJobDetail = null" 
              class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
            >
              <span class="material-symbols-rounded text-base">close</span>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-xs sm:text-sm">
            <div>
              <span class="text-xs font-bold text-blue-600 block">{{ selectedJobDetail.company }}</span>
              <h3 class="text-base font-black text-slate-900 mt-0.5">{{ selectedJobDetail.title }}</h3>
            </div>

            <div class="flex flex-wrap gap-2 text-xs font-semibold">
              <span class="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">📍 {{ selectedJobDetail.city }}</span>
              <span class="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">💼 {{ selectedJobDetail.jobType }}</span>
              <span class="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg">⏱️ {{ selectedJobDetail.experienceLevel }}</span>
              <span class="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg">💰 {{ selectedJobDetail.salaryRange }}</span>
            </div>

            <div>
              <h5 class="font-bold text-slate-800 mb-1">الوصف الوظيفي:</h5>
              <p class="text-slate-600 leading-relaxed">{{ selectedJobDetail.description }}</p>
            </div>

            <div>
              <h5 class="font-bold text-slate-800 mb-1">المتطلبات والمؤهلات:</h5>
              <ul class="list-disc list-inside space-y-1 text-slate-600">
                <li *ngFor="let req of selectedJobDetail.requirements">{{ req }}</li>
              </ul>
            </div>

            <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 text-xs">
              <span class="font-bold block mb-0.5">⚠️ آخر موعد للتقديم:</span>
              <span>{{ selectedJobDetail.deadline }} (عبر {{ selectedJobDetail.source }})</span>
            </div>

            <div class="mt-auto pt-4 flex gap-2">
              <a 
                [href]="selectedJobDetail.applyUrl" 
                target="_blank" 
                rel="noopener"
                class="flex-1 btn btn-primary py-3 text-center text-xs font-bold flex items-center justify-center gap-1"
              >
                <span>تقديم طلب توظيف الآن</span>
                <span class="material-symbols-rounded text-base">open_in_new</span>
              </a>
              <a 
                routerLink="/interviews-exams" 
                (click)="selectedJobDetail = null; jobService.toggleBot(false)"
                class="btn btn-secondary py-3 text-xs font-bold flex items-center gap-1"
              >
                <span>أسئلة المقابلة للمجال</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class JobBotComponent implements OnInit, OnDestroy {
  jobService = inject(JobService);
  alertService = inject(AlertService);

  activeTab: 'chat' | 'feed' | 'alerts' = 'chat';
  userInputText = '';
  isBotTyping = false;

  countries = signal<AvailableCountry[]>([]);
  liveJobs = signal<JobItem[]>([]);
  filteredLiveJobs = signal<JobItem[]>([]);
  isLoadingJobs = false;

  selectedCityFilter = 'الكل';
  selectedJobDetail: JobItem | null = null;

  alertPrefs = {
    tech: true,
    banking: true,
    unrwa: true,
    education: false,
    internships: true
  };

  private pollInterval: any = null;

  ngOnInit() {
    this.loadCountries();
    this.loadLiveJobs();
    this.startLivePolling();
  }

  ngOnDestroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  onBackdropClick(e: MouseEvent) {
    this.jobService.toggleBot(false);
  }

  loadCountries() {
    this.jobService.getCountries().subscribe({
      next: res => {
        if (res.success) {
          this.countries.set(res.data);
        }
      },
      error: () => {}
    });
  }

  currentCountryCities(): string[] {
    const target = this.countries().find(c => c.name === this.jobService.selectedCountry());
    return target?.cities || ['الكل'];
  }

  onCountryChange(countryName: string) {
    this.jobService.setCountry(countryName);
    this.selectedCityFilter = 'الكل';
    this.loadLiveJobs();
    
    // إشعار البوت في المحادثة
    this.jobService.messages.update(msgs => [
      ...msgs,
      {
        id: `change-${Date.now()}`,
        sender: 'bot',
        text: `تم ضبط الدولة المستهدفة إلى: ${countryName}. سأرصد لك كافة الشواغر الحديثة فيها. يمكنك الآن السؤال عن أي تخصص في هذه الدولة!`,
        timestamp: new Date(),
        quickActions: [
          `أحدث وظائف اليوم في ${countryName}`,
          'وظائف تكنولوجيا ومعلومات',
          'وظائف بنوك ومحاسبة'
        ]
      }
    ]);
  }

  loadLiveJobs() {
    this.isLoadingJobs = true;
    this.jobService.getJobs({ country: this.jobService.selectedCountry() }).subscribe({
      next: res => {
        this.isLoadingJobs = false;
        if (res.success) {
          this.liveJobs.set(res.data);
          this.filterLiveJobs();
        }
      },
      error: () => {
        this.isLoadingJobs = false;
      }
    });
  }

  filterLiveJobs() {
    if (this.selectedCityFilter === 'الكل') {
      this.filteredLiveJobs.set(this.liveJobs());
    } else {
      this.filteredLiveJobs.set(
        this.liveJobs().filter(j => j.city.includes(this.selectedCityFilter))
      );
    }
  }

  openJobDetail(job: JobItem) {
    this.selectedJobDetail = job;
  }

  sendQuickPrompt(promptText: string) {
    this.userInputText = promptText;
    this.sendUserMessage();
  }

  sendUserMessage() {
    const text = this.userInputText.trim();
    if (!text || this.isBotTyping) return;

    // إضافة رسالة المستخدم
    const userMsg: BotChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    this.jobService.messages.update(msgs => [...msgs, userMsg]);
    this.userInputText = '';
    this.isBotTyping = true;

    this.jobService.askJobBot(text, this.jobService.selectedCountry()).subscribe({
      next: res => {
        this.isBotTyping = false;
        if (res.success) {
          const botMsg: BotChatMessage = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: res.botReply,
            timestamp: new Date(),
            matchedJobs: res.matchedJobs,
            quickActions: res.quickActions
          };
          this.jobService.messages.update(msgs => [...msgs, botMsg]);
        }
      },
      error: () => {
        this.isBotTyping = false;
        const errorMsg: BotChatMessage = {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'عذراً، حدث خطأ مؤقت في الاتصال بالخادم. يرجى إعادة المحاولة.',
          timestamp: new Date()
        };
        this.jobService.messages.update(msgs => [...msgs, errorMsg]);
      }
    });
  }

  saveAlertPreferences() {
    this.alertService.success('تم الحفظ', 'تم تفعيل تنبيهات الوظائف المخصصة بنجاح!');
  }

  private startLivePolling() {
    // محاكاة رصد وظائف جديدة كل دقيقتين دون إزعاج
    if (typeof window !== 'undefined') {
      this.pollInterval = setInterval(() => {
        if (!this.jobService.isBotOpen()) {
          this.jobService.newJobsCount.update(c => Math.min(c + 1, 9));
        }
      }, 120000);
    }
  }
}
