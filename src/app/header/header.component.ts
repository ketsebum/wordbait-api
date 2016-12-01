import { Component, OnInit } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import { User } from '../_models/index';
import { UserService } from '../_services/index';

@Component({
  selector: 'headercomponent',
  templateUrl: 'app/header/header.component.html',
  styleUrls: ['app/menu.css']
})

export class HeaderComponent implements OnInit {
  showHamburgerMenu: boolean = true;
  loggedIn: boolean = false;
  subscription: Subscription;
  user: User;

  constructor(private userService: UserService) {
    this.subscription = userService.currentUser$.subscribe( user => {
      // TODO: DO THIS BETTER
      this.user = JSON.parse(localStorage.getItem('currentUser')).user;
      this.loggedIn = true;
    });
  }

  toggleMenu(): void {
    this.showHamburgerMenu = !this.showHamburgerMenu;
  }

  updateUser(): void {
    this.user = this.userService.getUser();
  }

  logout(): void {
    this.loggedIn = false;
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    if (this.user !== undefined) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }
}
