import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

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

    constructor(private userService: UserService, private gameService: GameService, private router: Router) {
        this.user = userService.getUser();
        this.games = gameService.getUserGames(this.user.email);
        console.log(this.user);
    }

    test() {
        console.log(this.games);
    }

    newGame() {
        this.router.navigate(['/newgame']);
    }

    confirmGame() {
        // gameService.confirmGame();
    }

    ngOnInit() {
        this.games = this.gameService.getUserGames(this.user.email);
    }
}