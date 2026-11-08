import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, ToastMessage } from '../../core/services/alert.service';

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- ========================================================================= -->
    <!-- 1. Floating Toasts Container (Top-Left corner with glassmorphic cards)     -->
    <!-- ========================================================================= -->
    <div 
      class="fixed top-5 left-5 z-[99999] flex flex-col gap-3.5 max-w-md w-[calc(100vw-2.5rem)] sm:w-96 pointer-events-none select-none"
      dir="rtl"
    >
      <div 
        *ngFor="let toast of alertService.toasts(); trackBy: trackById"
        class="toast-item pointer-events-auto bg-white/95 backdrop-blur-2xl rounded-2xl p-4 shadow-xl border relative overflow-hidden transition-all duration-300 animate-toast-in hover:shadow-2xl hover:-translate-y-0.5"
        [ngClass]="{
          'border-emerald-300/80 shadow-[0_12px_36px_-6px_rgba(16,185,129,0.22)] ring-1 ring-emerald-500/10': toast.type === 'success',
          'border-rose-300/80 shadow-[0_12px_36px_-6px_rgba(244,63,94,0.22)] ring-1 ring-rose-500/10': toast.type === 'error',
          'border-amber-300/80 shadow-[0_12px_36px_-6px_rgba(245,158,11,0.22)] ring-1 ring-amber-500/10': toast.type === 'warning',
          'border-blue-300/80 shadow-[0_12px_36px_-6px_rgba(59,130,246,0.22)] ring-1 ring-blue-500/10': toast.type === 'info',
          'border-amber-400/90 shadow-[0_12px_36px_-6px_rgba(245,158,11,0.32)] ring-2 ring-amber-400/20': toast.type === 'upgrade'
        }"
      >
        
        <!-- Glowing side line accent -->
        <div 
          class="absolute top-0 right-0 bottom-0 w-1.5 rounded-r-2xl"
          [ngClass]="{
            'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]': toast.type === 'success',
            'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]': toast.type === 'error',
            'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]': toast.type === 'warning',
            'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]': toast.type === 'info',
            'bg-gradient-to-b from-amber-400 to-yellow-500 shadow-[0_0_12px_rgba(245,158,11,0.9)]': toast.type === 'upgrade'
          }"
        ></div>

        <div class="flex items-start gap-3.5 pr-2">
          
          <!-- Modern Vector Badge Icon with Glowing Ring -->
          <div 
            class="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-300 group-hover:scale-105"
            [ngClass]="{
              'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-emerald-500/30': toast.type === 'success',
              'bg-gradient-to-tr from-rose-500 to-red-500 text-white shadow-rose-500/30': toast.type === 'error',
              'bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-amber-500/30': toast.type === 'warning',
              'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-blue-500/30': toast.type === 'info',
              'bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-500 text-white shadow-amber-500/40 animate-pulse-halo': toast.type === 'upgrade'
            }"
          >
            <!-- Success Checkmark -->
            <span *ngIf="toast.type === 'success'" class="material-symbols-rounded text-2xl">check_circle</span>

            <!-- Error Cross -->
            <span *ngIf="toast.type === 'error'" class="material-symbols-rounded text-2xl">cancel</span>

            <!-- Warning Triangle -->
            <span *ngIf="toast.type === 'warning'" class="material-symbols-rounded text-2xl">warning</span>

            <!-- Info Sparkle -->
            <span *ngIf="toast.type === 'info'" class="material-symbols-rounded text-2xl">info</span>

            <!-- Upgrade Crown / Star -->
            <span *ngIf="toast.type === 'upgrade'" class="material-symbols-rounded text-2xl">workspace_premium</span>
          </div>

          <!-- Body Text -->
          <div class="flex-1 min-w-0 pt-0.5">
            <div class="flex items-center gap-1.5">
              <span class="font-black text-slate-900 text-sm leading-snug truncate">
                {{ toast.title }}
              </span>
              <span *ngIf="toast.type === 'upgrade'" class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                PRO
              </span>
            </div>
            <p *ngIf="toast.message" class="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close Action -->
          <button 
            (click)="alertService.removeToast(toast.id)" 
            title="إغلاق التنبيه"
            class="w-7 h-7 -mt-1 -ml-1 rounded-xl bg-slate-100/70 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
          >
            <span class="material-symbols-rounded text-base">close</span>
          </button>

        </div>

        <!-- Animated Progress Countdown Bar -->
        <div class="absolute bottom-0 inset-x-0 h-1 bg-slate-100/80 rounded-b-2xl overflow-hidden">
          <div 
            class="toast-progress-bar h-full rounded-b-2xl"
            [style.animation]="'progressShrink ' + toast.duration + 'ms linear forwards'"
            [ngClass]="{
              'bg-emerald-500': toast.type === 'success',
              'bg-rose-500': toast.type === 'error',
              'bg-amber-500': toast.type === 'warning',
              'bg-blue-500': toast.type === 'info',
              'bg-gradient-to-l from-amber-400 to-yellow-500': toast.type === 'upgrade'
            }"
          ></div>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- 2. Luxurious Glassmorphic Modal Dialog (Confirmations, Delete & Pro Pass) -->
    <!-- ========================================================================= -->
    <div 
      *ngIf="alertService.confirmDialog().isOpen"
      class="fixed inset-0 z-[99998] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      dir="rtl"
    >
      <div 
        class="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-white/60 text-center relative overflow-hidden animate-modal-in"
      >
        
        <!-- Ambient Glowing Aura in Background -->
        <div 
          *ngIf="alertService.confirmDialog().type === 'upgrade'"
          class="absolute -top-24 -right-24 w-56 h-56 bg-gradient-to-br from-amber-400/30 to-purple-500/20 rounded-full blur-3xl pointer-events-none"
        ></div>
        <div 
          *ngIf="alertService.confirmDialog().type === 'danger'"
          class="absolute -top-24 -right-24 w-56 h-56 bg-gradient-to-br from-rose-500/25 to-red-600/20 rounded-full blur-3xl pointer-events-none"
        ></div>

        <!-- Floating 3D Badge Icon with Double Rings -->
        <div class="relative mb-5 inline-block">
          <div 
            class="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-xl relative z-10 animate-float-gentle"
            [ngClass]="{
              'bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-500 text-white shadow-amber-500/40 ring-8 ring-amber-100/70': alertService.confirmDialog().type === 'upgrade',
              'bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-rose-500/30 ring-8 ring-rose-100/70': alertService.confirmDialog().type === 'danger',
              'bg-gradient-to-tr from-amber-500 to-orange-400 text-white shadow-amber-500/30 ring-8 ring-amber-100/70': alertService.confirmDialog().type === 'warning',
              'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-blue-500/30 ring-8 ring-blue-100/70': alertService.confirmDialog().type === 'info'
            }"
          >
            <!-- Upgrade Crown / Star -->
            <span *ngIf="alertService.confirmDialog().type === 'upgrade'" class="material-symbols-rounded text-5xl">workspace_premium</span>

            <!-- Trash Danger Icon -->
            <span *ngIf="alertService.confirmDialog().type === 'danger'" class="material-symbols-rounded text-5xl">delete_forever</span>

            <!-- Warning Triangle -->
            <span *ngIf="alertService.confirmDialog().type === 'warning'" class="material-symbols-rounded text-5xl">warning</span>

            <!-- Info Sparkle -->
            <span *ngIf="alertService.confirmDialog().type === 'info'" class="material-symbols-rounded text-5xl">info</span>
          </div>
        </div>

        <!-- Optional Badge Pill -->
        <div class="mb-2">
          <span 
            *ngIf="alertService.confirmDialog().type === 'upgrade'"
            class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-amber-200/80 shadow-sm"
          >
            <span class="material-symbols-rounded text-sm text-amber-600">workspace_premium</span>
            <span>باقة المحترفين PRO الحصرية</span>
          </span>
          <span 
            *ngIf="alertService.confirmDialog().type === 'danger'"
            class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-200/80 shadow-sm"
          >
            <span class="material-symbols-rounded text-sm text-rose-600">warning</span>
            <span>إجراء نهائي لا يمكن التراجع عنه</span>
          </span>
        </div>

        <!-- Title -->
        <h3 class="text-2xl font-black text-slate-900 mb-2.5 tracking-tight leading-snug">
          {{ alertService.confirmDialog().title }}
        </h3>

        <!-- Description -->
        <p class="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
          {{ alertService.confirmDialog().message }}
        </p>

        <!-- Exclusive Perks List for Upgrade Modals -->
        <div 
          *ngIf="alertService.confirmDialog().type === 'upgrade' && alertService.confirmDialog().perks?.length"
          class="bg-gradient-to-br from-amber-50/80 to-orange-50/50 border border-amber-200/90 rounded-2xl p-4 mb-6 text-right space-y-2.5 shadow-sm"
        >
          <div class="text-xs font-black text-amber-900 mb-1 flex items-center gap-1.5">
            <span class="material-symbols-rounded text-amber-600 text-base">verified</span>
            <span>المزايا التي ستحصل عليها فوراً:</span>
          </div>

          <div 
            *ngFor="let perk of alertService.confirmDialog().perks" 
            class="flex items-start gap-2.5 text-xs text-slate-700 font-medium"
          >
            <div class="w-4 h-4 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
              <span class="material-symbols-rounded text-xs">check</span>
            </div>
            <span>{{ perk }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center gap-3">
          
          <button 
            (click)="alertService.closeConfirm(true)"
            class="w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            [ngClass]="{
              'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/35 hover:shadow-amber-500/50': alertService.confirmDialog().type === 'upgrade',
              'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-rose-500/30 hover:shadow-rose-500/40': alertService.confirmDialog().type === 'danger',
              'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30': alertService.confirmDialog().type !== 'upgrade' && alertService.confirmDialog().type !== 'danger'
            }"
          >
            <span *ngIf="alertService.confirmDialog().type === 'upgrade'" class="material-symbols-rounded text-lg">workspace_premium</span>
            <span>{{ alertService.confirmDialog().confirmText }}</span>
          </button>

          <button 
            (click)="alertService.closeConfirm(false)"
            class="w-full sm:w-auto py-3.5 px-6 rounded-2xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {{ alertService.confirmDialog().cancelText }}
          </button>

        </div>

      </div>
    </div>
  `
})
export class CustomAlertComponent {
  alertService = inject(AlertService);

  trackById(index: number, item: ToastMessage): string {
    return item.id;
  }
}
