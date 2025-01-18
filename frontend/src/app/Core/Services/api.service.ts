import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponse } from '../models/generic-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  public get<T>(endpoint: string): Observable<GenericResponse<T>> {
    return this.http.get<GenericResponse<T>>(`${this.baseUrl}/${endpoint}`);
  }
}
