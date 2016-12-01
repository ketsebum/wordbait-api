import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/index';
import { User } from '../_models/index';

@Component({
  templateUrl: 'app/signup/signup.component.html'
})

export class SignUpComponent implements OnInit {
  user: any = {};
  @Output() loggingIn = new EventEmitter<boolean>();
  loading: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    // reset login status
    this.user = {name: "", email: "", password: ""};
  }

  signup() {
    this.loading = true;
    this.authenticationService.signup(this.user.name, this.user.email, this.user.password)
      .subscribe(result => {
      if (result === true) {
        this.loggingIn.emit(true);
        this.router.navigate(['/']);
      } else {
        // this.error = 'Username or password is incorrect';
        this.loading = false;
      }
    });
  }
}
