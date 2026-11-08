import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'upgrade';
  title: string;
  message: string;
  duration: number; // in milliseconds
  createdAt: number;
}

export interface ConfirmDialogData {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'warning' | 'info' | 'upgrade' | 'danger';
  badgeText?: string;
  perks?: string[];
  confirmText?: string;
  cancelText?: string;
  resolve?: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  toasts = signal<ToastMessage[]>([]);
  confirmDialog = signal<ConfirmDialogData>({
    isOpen: false,
    title: '',
    message: ''
  });

  private soundEnabled = true;

  constructor() {
    // Check if user has audio context support
  }

  // Play delicate harmonic UI chime using Web Audio API (Zero external assets required)
  private playAudio(type: 'success' | 'error' | 'warning' | 'info' | 'upgrade' | 'danger') {
    if (!this.soundEnabled || typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      if (type === 'success') {
        // Two warm harmonious sine pings (F5 -> A5)
        [698.46, 880].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.035, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.3);
        });
      } else if (type === 'upgrade') {
        // Celestial rising major arpeggio (C5 -> E5 -> G5 -> C6)
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.045, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.35);
        });
      } else if (type === 'error' || type === 'danger') {
        // Subtle soft double low alert
        [330, 246.94].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.04, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.28);
        });
      } else {
        // Soft informative bubble chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // Audio autoplay policy or browser restriction fallback
    }
  }

  private addToast(
    type: 'success' | 'error' | 'warning' | 'info' | 'upgrade',
    title: string,
    message: string = '',
    duration: number = 4200
  ) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = {
      id,
      type,
      title,
      message,
      duration,
      createdAt: Date.now()
    };

    this.playAudio(type);

    this.toasts.update(list => [...list, newToast]);

    setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  removeToast(id: string) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  success(title: string, message: string = '', duration: number = 4200) {
    this.addToast('success', title, message, duration);
  }

  error(title: string, message: string = '', duration: number = 5000) {
    this.addToast('error', title, message, duration);
  }

  warning(title: string, message: string = '', duration: number = 4500) {
    this.addToast('warning', title, message, duration);
  }

  info(title: string, message: string = '', duration: number = 4200) {
    this.addToast('info', title, message, duration);
  }

  upgrade(title: string, message: string = '', duration: number = 5500) {
    this.addToast('upgrade', title, message, duration);
  }

  confirm(options: {
    title: string;
    message: string;
    type?: 'warning' | 'info' | 'upgrade' | 'danger';
    badgeText?: string;
    perks?: string[];
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> {
    this.playAudio(options.type || 'warning');

    // Default perks if this is an upgrade alert
    let perks = options.perks;
    if (options.type === 'upgrade' && (!perks || perks.length === 0)) {
      perks = [
        'عدد غير محدود من لغات السيرة الذاتية (عربي، إنجليزي، فرنسي، ألماني...) مع تصدير ثنائي اللغة',
        'فتح كافة قوالب السيرة الذاتية السبعة الحصرية والفاخرة (Executive, Tech, Prestige...) مجاناً',
        '50 رصيد إضافي للذكاء الاصطناعي لتحليل الـ PDF وتعبئة الحقول وصياغة النبذة تلقائياً',
        'تصدير وطباعة Vector PDF عالي الدقة بدون أي قيود أو علامات مائية'
      ];
    }

    return new Promise((resolve) => {
      this.confirmDialog.set({
        isOpen: true,
        title: options.title,
        message: options.message,
        type: options.type || 'warning',
        badgeText: options.badgeText,
        perks,
        confirmText: options.confirmText || 'تأكيد ومتابعة',
        cancelText: options.cancelText || 'إلغاء',
        resolve
      });
    });
  }

  closeConfirm(result: boolean) {
    const current = this.confirmDialog();
    if (current.resolve) {
      current.resolve(result);
    }
    this.confirmDialog.set({
      isOpen: false,
      title: '',
      message: ''
    });
  }
}
