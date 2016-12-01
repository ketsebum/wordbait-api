import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';

import { AuthenticationService } from './index';
import { User } from '../_models/index';

@Injectable()
export class UserService {
  private token: string;
  private loggedIn = new Subject<string>();
  user: User;

  currentUser$ = this.loggedIn.asObservable();

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService) {
  }
  getUser(): User {
    let user = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).user : false;
    if(user) {
      this.user = user;
      this.loggedIn.next(user);
    } else {
      console.log("Not Logged In");
      // this.getUserService()
      //   .subscribe(user => {
      //   this.user = user;
      // });
    }
    return this.user;
  }

  getUserService(): Observable<User> {
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers: headers });

    // get users from api
    return this.http.get('/account', options)
      .map((response: Response) => response.json());
  }
}
