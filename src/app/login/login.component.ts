import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {Router} from '@angular/router';

import { User } from '../_models/index';
import {AuthenticationService} from '../_services/index';

@Component({
    templateUrl: 'app/login/login.component.html'
})

export class LoginComponent implements OnInit {
    @Output() loggingIn = new EventEmitter<boolean>();
    model: any = {};
    object: any = {};
    loading = false;
    error = '';

    constructor(private router: Router,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
        let googleUser = {};
        let startApp = function () {
            gapi.load('auth2', function () {
                // Retrieve the singleton for the GoogleAuth library and set up the client.
                // added let to auth2 not sure if it should be there
                let auth2 = gapi.auth2.init({
                    client_id: '1066114691418-nm0p4krul7jenj0vck20glcrh23nm1lm.apps.googleusercontent.com',
                    // cookiepolicy: 'single_host_origin',
                    // Request scopes in addition to 'profile' and 'email'
                    //scope: 'additional_scope'
                });
            });
        };
    }

    ngAfterViewInit() {
        gapi.signin2.render('my-signin2', {
            'scope': 'profile email',
            'width': 240,
            'height': 50,
            'longtitle': true,
            'theme': 'light',
            'onsuccess': param => this.onSignIn(param)
        });
    }

    onSignIn(googleUser) {
        let user : User = new User();
        this.object.user = new User();

        ((u, p) => {
            u.id            = p.getId();
            u.name          = p.getName();
            u.email         = p.getEmail();
            // u.imageUrl      = p.getImageUrl();
            // u.givenName     = p.getGivenName();
            // u.familyName    = p.getFamilyName();
        })(this.object.user, googleUser.getBasicProfile());

        ((u, r) => {
            u.token         = r.id_token
        })(this.object, googleUser.getAuthResponse());

        // user.save();
        localStorage.setItem('currentUser', JSON.stringify(this.object));
        // this.loggingIn.emit(true);
        this.router.navigate(['/']);
    }

    signUp() {
        this.router.navigate(['/signup']);
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                if (result === true) {
                    this.loggingIn.emit(true);
                    this.router.navigate(['/']);
                } else {
                    this.error = 'Username or password is incorrect';
                    this.loading = false;
                }
            });
    }

}
