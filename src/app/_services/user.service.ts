import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Subject}    from 'rxjs/Subject';
import 'rxjs/add/operator/catch';

import {AuthenticationService} from './index';
import {User} from '../_models/index';
import {ConnectableObservable, Subscription} from "rxjs";

@Injectable()
export class UserService {
    private apiURL = '/_ah/api/word_bait/v1/';  // URL to web api
    private allURL = 'all/users';  // URL to web api
    private accountURL = '/api/account?id=';
    private token: string;
    private loggedIn = new Subject<string>();
    user: User;
    errorMessage: string;
    connUser: ConnectableObservable<User>;


    currentUser$ = this.loggedIn.asObservable();

    constructor(private http: Http,
                private authenticationService: AuthenticationService) {
    }

    getUser(): User {
        if (this.user) return this.user;
        let user = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : false;

        // this.connUser.
        if (user) {
            if (user.verified) {
                this.user = user;
                this.loggedIn.next(user);
            } else {
                this.user = user;
                this.loggedIn.next(user);
                this.getUserService(user).subscribe(
                    user => this.user = user,
                    error => this.errorMessage = <any>error);
                    // .then(user => {
                    // localStorage.setItem('currentUser', JSON.stringify(user))
                // });
            }
        } else {
            // USER LOST CURRENT USER
            // this.getUserService().then(user => this.user = user);
        }
        return this.user;
    }

    getUserService(user: User): Observable<User> {
        // add authorization header with jwt token
        let headers = new Headers({'Authorization': 'Bearer ' + this.authenticationService.token});
        let options = new RequestOptions({headers: headers});

        // get user from api
        return this.http.get(this.accountURL + user.id, options)
            .map(response => response.json())
            .catch(this.handleError);
            // .toPromise()
            // .then(response => response.json() as User)
    }

    getUsersService(): Promise<any> {
        // add authorization header with jwt token
        let headers = new Headers({'Authorization': 'Bearer ' + this.authenticationService.token});
        let options = new RequestOptions({headers: headers});

        // get users from api
        return this.http.get(this.apiURL + this.allURL, options)
            .toPromise();
            // .then(response => response.json().items)
            // .catch();
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
