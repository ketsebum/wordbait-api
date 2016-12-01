import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Injectable()
export class AuthenticationService {
  public token: string;

  constructor(private http: Http) {
    // set token if saved in local storage
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  login(email, password): Observable<boolean> {
    //Setting the Login Parameters
    let loginURL = '/login';
    let body = JSON.stringify({ email: email, password: password});
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers});

    return this.http.post(loginURL, body, options)
      .map((response: Response) => {
      // login successful if there's a jwt token in the response
      let token = response.json() && response.json().token;
      if (token) {
        // set token property
        this.token = token;

        // store email and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(response.json()));

        // return true to indicate successful login
        return true;
      } else {
        // return false to indicate failed login
        return false;
      }
    });
  }

  signup(name, email, password): Observable<boolean> {
    //Setting the Login Parameters
    let signUpURL = '/signup';
    let body = JSON.stringify({ name: name, email: email, password: password});
    let headers = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers});

    return this.http.post(signUpURL, body, options)
      .map((response: Response) => {
      // login successful if there's a jwt token in the response
      let token = response.json() && response.json().token;
      if (token) {
        // set token property
        this.token = token;

        // store email and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(response.json()));

        // return true to indicate successful login
        return true;
      } else {
        // return false to indicate failed login
        return false;
      }
    });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
