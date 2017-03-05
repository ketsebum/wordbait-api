import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {User} from '../_models/index';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Injectable()
export class AuthenticationService {
    public token: string;
    object: any = {};

    constructor(private http: Http) {
        // set token if saved in local storage
        let localUser = localStorage.getItem('currentUser');
        let currentUser = localUser !== 'undefined' ? JSON.parse(localUser) : false;
        this.token = currentUser && currentUser.token;
    }

    login(email, password): Observable<boolean> {
        //Setting the Login Parameters
        let loginURL = '/api/login';
        let body = JSON.stringify({email: email, password: password});
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

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

    googleSignIn(googleUser): Observable<boolean> {
        let signUpURL = '/api/signup';
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

        this.object.user = new User();
        ((u, p) => {
            u.gid = p.getId();
            u.name = p.getName();
            u.email = p.getEmail();
            // u.imageUrl      = p.getImageUrl();
            // u.givenName     = p.getGivenName();
            // u.familyName    = p.getFamilyName();
        })(this.object.user, googleUser.getBasicProfile());

        ((u, r) => {
            u.gtoken = r.id_token
        })(this.object, googleUser.getAuthResponse());
        this.object.google = true;

        let body = JSON.stringify(this.object);

        return this.http.post(signUpURL, body, options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                this.object.user.id = response.json().id;
                this.object.user.token = response.json().token;
                this.token = response.json().token;
                localStorage.setItem('currentUser', JSON.stringify(this.object));
                return true;
            });
    }

    signup(name, email, password): Observable<boolean> {
        //Setting the Login Parameters
        let signUpURL = '/api/signup';
        let body = JSON.stringify({name: name, email: email, password: password, google: false});
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});

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

    private deleteCookie(name) {
        this.setCookie(name, "", -1);
    }

    private setCookie(name: string, value: string, expireDays: number, path: string = "") {
        let d: Date = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
        let expires: string = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + "; " + expires + (path.length > 0 ? "; path=" + path : "");
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        this.deleteCookie("auth");
    }
}
