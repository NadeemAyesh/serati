import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CV } from '../models/cv.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) {}

  parseResume(file: File): Observable<{
    success: boolean;
    message: string;
    remainingCredits: number;
    data: Partial<CV>;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/parse-resume`, formData);
  }

  enhanceText(text: string, type: 'summary' | 'experience' = 'summary'): Observable<{
    success: boolean;
    data: { original: string; enhanced: string };
  }> {
    return this.http.post<any>(`${this.apiUrl}/enhance-text`, { text, type });
  }
}
