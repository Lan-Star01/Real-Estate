import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {

  private baseUrl = `${environment.apiBaseUrl}/agents`;

  constructor(private http: HttpClient) {}

  getAgents(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  createAgent(agent: any): Observable<any> {
    return this.http.post(this.baseUrl, agent);
  }

}
