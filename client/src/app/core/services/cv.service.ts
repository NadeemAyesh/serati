import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CV } from '../models/cv.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private apiUrl = `${environment.apiUrl}/cv`;

  constructor(private http: HttpClient) {}

  getAllCVs(): Observable<{ success: boolean; count: number; data: CV[] }> {
    return this.http.get<{ success: boolean; count: number; data: CV[] }>(this.apiUrl);
  }

  getCVById(id: string): Observable<{ success: boolean; data: CV }> {
    return this.http.get<{ success: boolean; data: CV }>(`${this.apiUrl}/${id}`);
  }

  createCV(cvData: Partial<CV>): Observable<{ success: boolean; data: CV }> {
    return this.http.post<{ success: boolean; data: CV }>(this.apiUrl, cvData);
  }

  updateCV(id: string, cvData: Partial<CV>): Observable<{ success: boolean; data: CV }> {
    return this.http.put<{ success: boolean; data: CV }>(`${this.apiUrl}/${id}`, cvData);
  }

  deleteCV(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  duplicateCV(id: string): Observable<{ success: boolean; data: CV }> {
    return this.http.post<{ success: boolean; data: CV }>(`${this.apiUrl}/${id}/duplicate`, {});
  }

  createEmptyCV(): CV {
    return {
      title: 'سيرتي الذاتية الجديدة',
      templateId: 'modern-vibrant',
      themeColor: '#2563eb',
      fontFamily: '"IBM Plex Sans Arabic", system-ui, sans-serif',
      language: 'ar',
      personalInfo: {
        fullName: 'أحمد محمود',
        jobTitle: 'مهندس برمجيات وتطبيقات سحابية',
        email: 'ahmed.dev@example.com',
        phone: '+970 59 900 1234',
        address: 'فلسطين - رام الله',
        summary: 'مهندس برمجيات شغوف ومبدع يتمتع بخبرة تزيد عن 4 سنوات في تطوير تطبيقات الويب الحديثة وحلول السحابة. بارع في حل المشكلات التقنية وبناء معماريات قابلة للتوسع.',
        avatarUrl: '',
        website: 'https://ahmed.dev',
        linkedin: 'https://linkedin.com/in/ahmed-dev',
        github: 'https://github.com/ahmed-dev'
      },
      experiences: [
        {
          company: 'شركة الحلول الرقمية المتقدمة',
          position: 'Senior Full-Stack Developer',
          location: 'رام الله (هجين)',
          startDate: '2023-01',
          endDate: 'الآن',
          isCurrent: true,
          description: '• قيادة فريق تطوير تطبيقات الويب وتحديث البنية المعمارية للنظام مما ساهم في تحسين سرعة الاستجابة بنسبة 45%.\n• تطبيق معايير الأمان المتقدمة وأفضل ممارسات CI/CD.'
        },
        {
          company: 'مختبرات الابتكار التقني',
          position: 'Frontend Developer',
          location: 'عن بُعد',
          startDate: '2021-06',
          endDate: '2022-12',
          isCurrent: false,
          description: '• تصميم وبناء واجهات مستخدم تفاعلية وجذابة باستخدام Angular وTypeScript.\n• تحسين تجربة المستخدم ومعدل التحويل بنسبة 30%.'
        }
      ],
      education: [
        {
          institution: 'جامعة النجاح الوطنية',
          degree: 'بكالوريوس',
          fieldOfStudy: 'هندسة أنظمة الحاسوب',
          graduationYear: '2021',
          grade: 'ممتاز مع مرتبة الشرف',
          description: 'مشروع التخرج: نظام ذكي للرصد الموزع الحائز على جائزة أفضل مشروع تخرج كلي.'
        }
      ],
      skills: [
        { name: 'Angular / TypeScript', level: 'خبير' },
        { name: 'Node.js & Express', level: 'متقدم' },
        { name: 'MongoDB / SQL', level: 'متقدم' },
        { name: 'REST APIs & GraphQL', level: 'متقدم' },
        { name: 'Docker & Git', level: 'متوسط' },
        { name: 'إدارة وتوجيه الفرق', level: 'متقدم' }
      ],
      languages: [
        { name: 'العربية', proficiency: 'اللغة الأم' },
        { name: 'الإنجليزية', proficiency: 'طلاقة واحتراف' }
      ],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          issueDate: '2023',
          credentialUrl: 'https://aws.amazon.com'
        }
      ],
      projects: [
        {
          title: 'منصة إدارة المهام الذكية SaaS',
          description: 'تطبيق ويب متكامل يتيح إدارة المشاريع السريعة مع ميزات التحليل الفوري وتوزيع الموارد.',
          link: 'https://github.com/ahmed-dev/task-saas'
        }
      ],
      references: [
        {
          name: 'م. خالد عبد الرحمن',
          jobTitle: 'مدير قطاع التكنولوجيا (CTO)',
          company: 'شركة الابتكار الرقمي',
          email: 'khaled.cto@example.com',
          phone: '+970 59 912 3456'
        }
      ],
      sectionOrder: ['summary', 'experiences', 'education', 'skills', 'languages', 'certifications', 'projects', 'references'],
      canvaElements: [],
      customFontSize: 14
    };
  }
}
