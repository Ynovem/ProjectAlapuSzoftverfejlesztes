import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";

const LAYOUT_API = 'http://localhost:4200/api/v1/layouts';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient) { }

  getLayouts(): Observable<any> {
    return this.http.get(LAYOUT_API, httpOptions);
  }

  saveLayout(body: any): Observable<any> {
    return this.http.post(LAYOUT_API, body, httpOptions);
  }
}
