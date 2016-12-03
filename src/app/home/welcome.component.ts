import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {User, Game} from '../_models/index';
import {UserService, GameService} from '../_services/index';

@Component({
    templateUrl: 'app/home/welcome.component.html',
    styleUrls: ['app/home/welcome.component.css']
})

export class WelcomeComponent implements OnInit {
    users: User[] = [];
    user: User;
    games: Game[];
    token: String = JSON.parse(localStorage.getItem('currentUser')).token;

    constructor(private userService: UserService, private gameService: GameService, private router: Router) {
        this.user = userService.getUser();
    }

    test() {
    }

    newGame() {
        this.router.navigate(['/newgame']);
    }

    confirmGame(confirm: Game) {
        this.gameService
            .confirmGame(confirm.urlsafe_key)
            .then(() => this.updateGame(confirm));
    }

    updateGame(update: Game) {
        for(let i = 0, l = this.games.length; i < l; i++) {
            if (this.games[i].urlsafe_key === update.urlsafe_key) this.games[i].confirmed = true;
        }
    }

    getGames() {
        this.gameService
            .getUserGames(this.user.email)
            .then(games => this.games = games);
    }

    ngOnInit() {
        this.getGames();
    }
}