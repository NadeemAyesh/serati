import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CvBuilderComponent } from './features/cv-builder/cv-builder.component';
import { InterviewsExamsComponent } from './features/interviews-exams/interviews-exams.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'builder/:id', component: CvBuilderComponent, canActivate: [authGuard] },
  { path: 'interviews-exams', component: InterviewsExamsComponent },
  { path: '**', redirectTo: '' }
];
