import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "https://e-xam.herokuapp.com/";

  constructor(private http: HttpClient, private router: Router) {
  }

  login(credentials) {
    return this.http.post(this.url + "login", credentials)
      .pipe(
        map((response) => {
          console.log(response);
          if (response[0].user_id) {
            localStorage.setItem('token', response[0].name);
            return true;
          }
          return false;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('');
  }

  public currentUserValue(){
    return localStorage.getItem('token');
  }
}
