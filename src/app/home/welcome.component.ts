import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';

@Component({
  templateUrl: 'app/home/welcome.component.html'
})

export class WelcomeComponent implements OnInit {
  users: User[] = [];
  user: User;
  token: String = JSON.parse(localStorage.getItem('currentUser')).token;

  constructor(private userService: UserService) {
    this.user = userService.getUser();
  }

  test() {
    console.log("Here is a list of the entire API");
    console.log(gapi.client.word_bait);
    gapi.client.word_bait.get_games().execute(
        function (resp) {
            if (resp.result) {
              console.log(resp);
            }
        });
  }

  ngOnInit() {

    var apisToLoad;
    var callback = function () {
        if (--apisToLoad === 0) {
            // google.devrel.samples.hello.enableButtons();
        }
    };

    apisToLoad = 1; // must match number of calls to gapi.client.load()
    gapi.client.load('word_bait', 'v1', callback, 'http://localhost:8080/_ah/api/');
  }
}