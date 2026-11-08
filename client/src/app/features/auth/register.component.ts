import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      
      <div class="w-full max-w-md">
        
        <!-- الشعار -->
        <div class="text-center mb-8">
          <div routerLink="/" class="inline-flex items-center gap-3 cursor-pointer">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <span class="material-symbols-rounded text-2xl">description</span>
            </div>
            <div class="text-right">
              <span class="text-2xl font-black bg-gradient-to-l from-blue-700 via-indigo-600 to-slate-900 bg-clip-text text-transparent">سِيرَتي</span>
              <span class="text-xs font-bold text-indigo-600 block -mt-1 tracking-wider uppercase">Seerati AI</span>
            </div>
          </div>
          <h2 class="text-2xl font-black text-slate-800 mt-6">إنشاء حساب جديد</h2>
          <p class="text-slate-500 text-sm mt-1">ابدأ بصناعة سيرتك الذاتية في أقل من دقيقة مجاناً</p>
        </div>

        <!-- بطاقة النموذج -->
        <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
          
          <div *ngIf="errorMessage" class="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold flex items-center gap-2">
            <span class="material-symbols-rounded text-lg flex-shrink-0">warning</span>
            <span>{{ errorMessage }}</span>
          </div>

          <form (ngSubmit)="onSubmit()">
            
            <div class="form-group">
              <label class="form-label">الاسم الكامل</label>
              <input 
                type="text" 
                [(ngModel)]="name" 
                name="name" 
                required 
                placeholder="أحمد محمود"
                class="form-control"
              >
            </div>

            <div class="form-group mt-4">
              <label class="form-label">البريد الإلكتروني</label>
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email" 
                required 
                placeholder="name@example.com"
                class="form-control"
              >
            </div>

            <div class="form-group mt-4">
              <label class="form-label">كلمة المرور (6 أحرف على الأقل)</label>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password" 
                required 
                minlength="6"
                placeholder="••••••••"
                class="form-control"
              >
            </div>

            <button 
              type="submit" 
              [disabled]="isLoading"
              class="btn btn-primary w-full mt-6 py-3 font-bold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span *ngIf="!isLoading">إنشاء الحساب ومتابعة</span>
              <span *ngIf="isLoading" class="flex items-center gap-2">
                <span class="material-symbols-rounded text-lg animate-spin">refresh</span>
                <span>جاري إنشاء الحساب...</span>
              </span>
            </button>

          </form>

          <div class="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
            لديك حساب بالفعل؟ 
            <a routerLink="/login" class="text-blue-600 font-bold hover:underline mr-1">تسجيل الدخول</a>
          </div>

        </div>

      </div>

    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'يرجى تعبئة كافة الحقول المطلوبة';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'يجب ألا تقل كلمة المرور عن 6 أحرف';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'حدث خطأ أثناء التسجيل، يرجى المحاولة لاحقاً';
      }
    });
  }
}
