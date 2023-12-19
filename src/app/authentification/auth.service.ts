import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint: string = 'http://localhost:3001/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private http: HttpClient, public router: Router) {}

  signUp(user: User): Observable<any> {
    let api = `${this.endpoint}/users/register/`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }

  signIn(user: any) {
    return this.http
      .post<any>(`${this.endpoint}/users/login`, user)
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('access_token', res.token);
          localStorage.setItem('refresh_token', res.refreshToken);
        },
        error: (e: any) => {
          console.log(e);
          alert('Erreur !');
        },
        complete: () => {
          this.router.navigate(['products']);
        }
      });
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  getisLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    if (removeToken == null) {
      this.router.navigate(['login']);
    }
  }

  refreshToken(token: string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(`${this.endpoint}/users/refreshToken/`, { refreshToken: token }, httpOptions);
  }

  getUserDetails(): Observable<any> {
    const authToken = localStorage.getItem('access_token');
    if (authToken) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Authorization': `Bearer ${authToken}` })
      };
      return this.http.get<any>(`${this.endpoint}/users/username`, httpOptions)
        .pipe(catchError(this.handleError));
    } else {
      return throwError('Pas de jeton d\'authentification');
    }
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = error.error.message;
    } else {
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
