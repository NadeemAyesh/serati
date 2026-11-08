import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
          <h2 class="text-2xl font-black text-slate-800 mt-6">مرحباً بك مجدداً</h2>
          <p class="text-slate-500 text-sm mt-1">سجّل دخولك للوصول إلى لوحة التحكم وسيرك الذاتية</p>
        </div>

        <!-- بطاقة النموذج -->
        <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
          
          <div *ngIf="errorMessage" class="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold flex items-center gap-2">
            <span class="material-symbols-rounded text-lg flex-shrink-0">warning</span>
            <span>{{ errorMessage }}</span>
          </div>

          <form (ngSubmit)="onSubmit()">
            
            <div class="form-group">
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
              <label class="form-label">
                <span>كلمة المرور</span>
              </label>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password" 
                required 
                placeholder="••••••••"
                class="form-control"
              >
            </div>

            <button 
              type="submit" 
              [disabled]="isLoading"
              class="btn btn-primary w-full mt-6 py-3 font-bold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span *ngIf="!isLoading">تسجيل الدخول</span>
              <span *ngIf="isLoading" class="flex items-center gap-2">
                <span class="material-symbols-rounded text-lg animate-spin">refresh</span>
                <span>جاري التحقق...</span>
              </span>
            </button>

            <!-- زر تجربة الحساب السريع بنقرة واحدة -->
            <button 
              type="button" 
              (click)="demoLogin()"
              class="btn btn-secondary w-full mt-3 py-2.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-rounded text-sm">bolt</span>
              <span>تجربة الحساب التجريبي بنقرة واحدة (Demo Login)</span>
            </button>

          </form>

          <div class="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
            ليس لديك حساب بعد؟ 
            <a routerLink="/register" class="text-blue-600 font-bold hover:underline mr-1">إنشاء حساب جديد مجاناً</a>
          </div>

        </div>

      </div>

    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  demoLogin() {
    this.email = 'demo@seerati.ai';
    this.password = 'Seerati2026!';
    this.onSubmit(true);
  }

  onSubmit(isDemo = false) {
    if (!this.email || !this.password) {
      this.errorMessage = 'يرجى إدخال البريد الإلكتروني وكلمة المرور';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        // If demo user doesn't exist yet, auto-register it!
        if (isDemo && err.status === 401) {
          this.authService.register({
            name: 'مستخدم تجريبي',
            email: 'demo@seerati.ai',
            password: 'Seerati2026!'
          }).subscribe({
            next: () => {
              this.isLoading = false;
              this.router.navigate(['/dashboard']);
            },
            error: (regErr) => {
              this.isLoading = false;
              this.errorMessage = 'حدث خطأ في تفعيل الحساب التجريبي';
            }
          });
          return;
        }

        this.isLoading = false;
        this.errorMessage = err.error?.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة ثانية';
      }
    });
  }
}
