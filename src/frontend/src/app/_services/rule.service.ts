import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";

const RULE_API = 'http://localhost:4200/api/v1/rules';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RuleService {

  constructor(private http: HttpClient) { }

  getRules(): Observable<any> {
    return this.http.get(RULE_API, httpOptions);
  }

  saveRule(body: any): Observable<any> {
    return this.http.post(RULE_API, body, httpOptions);
  }
}
