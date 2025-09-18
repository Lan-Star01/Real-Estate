import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.local';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getCities(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cities`);
  }

  getRegions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/regions`);
  }
}
