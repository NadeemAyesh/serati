import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobItem, AvailableCountry, BotAskResponse } from '../models/job.model';

export interface BotChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  matchedJobs?: JobItem[];
  quickActions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/jobs`;

  // Persistent Selected Country (Defaults to 'فلسطين')
  private defaultCountry = 'فلسطين';
  selectedCountry = signal<string>(this.getSavedCountry());

  // Bot Drawer open/close state
  isBotOpen = signal<boolean>(false);

  // New jobs badge / notification count
  newJobsCount = signal<number>(3);

  // Chat conversation state
  messages = signal<BotChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: 'مرحباً بك! 👋 أنا مساعد الوظائف الذكي (Job Scout Bot). أرصد لك أحدث الشواغر الموثوقة والامتحانات التوظيفية لحظة بلحظة، مع تركيز خاص على فلسطين والمؤسسات الكبرى (الأونروا، بنك فلسطين، الاتصالات، ديوان الموظفين، وشركات التكنولوجيا). ما تخصصك أو الوظيفة التي تبحث عنها اليوم؟',
      timestamp: new Date(),
      quickActions: [
        '🇵🇸 أحدث وظائف اليوم في فلسطين',
        '💻 وظائف تكنولوجيا وبرمجة',
        '🏦 وظائف بنوك ومحاسبة',
        '🏢 وظائف الأونروا والمؤسسات',
        '🎓 شواغر تدريب لحديثي التخرج',
        '🌐 وظائف عن بُعد (Remote)'
      ]
    }
  ]);

  constructor() {}

  private getSavedCountry(): string {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('seerati_target_country');
      if (saved) return saved;
    }
    return this.defaultCountry;
  }

  setCountry(country: string) {
    this.selectedCountry.set(country);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('seerati_target_country', country);
    }
  }

  toggleBot(open?: boolean) {
    if (open !== undefined) {
      this.isBotOpen.set(open);
    } else {
      this.isBotOpen.update(v => !v);
    }
    if (this.isBotOpen()) {
      this.newJobsCount.set(0);
    }
  }

  getJobs(filters: {
    country?: string;
    city?: string;
    field?: string;
    search?: string;
    jobType?: string;
    experience?: string;
  } = {}): Observable<{
    success: boolean;
    count: number;
    country: string;
    data: JobItem[];
  }> {
    let params = new HttpParams();
    const country = filters.country || this.selectedCountry();
    params = params.set('country', country);

    if (filters.city && filters.city !== 'الكل') params = params.set('city', filters.city);
    if (filters.field && filters.field !== 'الكل') params = params.set('field', filters.field);
    if (filters.jobType && filters.jobType !== 'الكل') params = params.set('jobType', filters.jobType);
    if (filters.experience && filters.experience !== 'الكل') params = params.set('experience', filters.experience);
    if (filters.search && filters.search.trim()) params = params.set('search', filters.search.trim());

    return this.http.get<any>(this.apiUrl, { params });
  }

  getLatestJobs(country?: string, limit: number = 4): Observable<{
    success: boolean;
    timestamp: string;
    count: number;
    data: JobItem[];
  }> {
    let params = new HttpParams()
      .set('country', country || this.selectedCountry())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}/latest`, { params });
  }

  getCountries(): Observable<{
    success: boolean;
    data: AvailableCountry[];
  }> {
    return this.http.get<any>(`${this.apiUrl}/countries`);
  }

  getJobById(id: string): Observable<{
    success: boolean;
    data: JobItem;
  }> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  askJobBot(message: string, country?: string): Observable<BotAskResponse> {
    return this.http.post<BotAskResponse>(`${this.apiUrl}/bot-ask`, {
      message,
      country: country || this.selectedCountry()
    });
  }
}
