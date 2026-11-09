import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  InterviewQuestion,
  ExamPaperSummary,
  ExamPaperDetail,
  ExamSubmitResult,
  InstitutionTipsMap
} from '../models/interview.model';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/interviews-exams`;

  getQuestions(category?: string, difficulty?: string, search?: string): Observable<{
    success: boolean;
    count: number;
    data: InterviewQuestion[];
  }> {
    let params = new HttpParams();
    if (category && category !== 'all') params = params.set('category', category);
    if (difficulty && difficulty !== 'all') params = params.set('difficulty', difficulty);
    if (search && search.trim()) params = params.set('search', search.trim());

    return this.http.get<any>(`${this.apiUrl}/questions`, { params });
  }

  getExams(): Observable<{
    success: boolean;
    count: number;
    data: ExamPaperSummary[];
  }> {
    return this.http.get<any>(`${this.apiUrl}/exams`);
  }

  getExamById(id: string): Observable<{
    success: boolean;
    data: ExamPaperDetail;
  }> {
    return this.http.get<any>(`${this.apiUrl}/exams/${id}`);
  }

  submitExam(id: string, userAnswers: Record<string, number>): Observable<{
    success: boolean;
    result: ExamSubmitResult;
  }> {
    return this.http.post<any>(`${this.apiUrl}/exams/${id}/submit`, { userAnswers });
  }

  getTips(): Observable<{
    success: boolean;
    data: InstitutionTipsMap;
  }> {
    return this.http.get<any>(`${this.apiUrl}/tips`);
  }
}
