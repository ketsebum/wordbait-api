import {Component, OnInit} from '@angular/core';

import {User} from '../_models/index';
import {UserService, GameService} from '../_services/index';

@Component({
    templateUrl: 'app/home/welcome.component.html'
})

export class WelcomeComponent implements OnInit {
    users: User[] = [];
    user: User;
    games: any;
    token: String = JSON.parse(localStorage.getItem('currentUser')).token;

    constructor(private userService: UserService, private gameService: GameService) {
        this.user = userService.getUser();
        this.games = gameService.getUserGames(this.user.name);
        console.log(this.user);
    }

    test() {
        console.log(this.games);
    }

    newGame() {
        this.gameService.newGame(this.user.name);
        this.games = this.gameService.getUserGames(this.user.name);
    }

    ngOnInit() {
    }
}