import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Subscription}   from 'rxjs/Subscription';

import {User} from '../_models/index';
import {UserService, AuthenticationService} from '../_services/index';

@Component({
    selector: 'headercomponent',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
    loggedIn = false;
    user: User;

    constructor(private userService: UserService, private authenticationService: AuthenticationService,
                private appRef: ChangeDetectorRef) {
    }

    updateUser(): void {
        this.user = this.userService.getUser();
        this.appRef.detectChanges();
    }

    logout(): void {
        this.loggedIn = false;
        this.authenticationService.logout();
    }

    updateLogInStatus(): void {
        if (this.user !== undefined) {
            this.loggedIn = true;
        } else {
            this.loggedIn = false;
        }
    }

    ngOnInit() {
        this.updateUser();
        this.updateLogInStatus();
        this.authenticationService.loginEvent$.subscribe((loginStatus)=> {
            this.loggedIn = loginStatus;
            this.updateUser();
        });
    }
}
