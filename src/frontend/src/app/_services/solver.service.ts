import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";

const SOLVER_API = 'http://localhost:4200/api/v1/solvers';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class SolverService {

  constructor(private http: HttpClient) { }

  getSolvers(): Observable<any> {
    return this.http.get(SOLVER_API, httpOptions);
  }
}
