import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {User, Game} from '../_models/index';
import {UserService, GameService} from '../_services/index';

@Component({
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.css']
})

//TODO: STOP USING EMAILS AS COMPARISON CHANGE TO USING ID

export class WelcomeComponent implements OnInit {
    users: User[] = [];
    user: User;
    games: Game[];
    selectedGame: Game;
    token: String = JSON.parse(localStorage.getItem('currentUser')).token;

    constructor(private userService: UserService,
                private gameService: GameService,
                private router: Router) {
    }

    test() {
    }

    newGame() {
        this.router.navigate(['/newgame']);
    }

    viewGame(game: Game) {
        this.router.navigate(['/game', game.urlsafe_key]);
    }

    confirmGame(confirm: Game) {
        this.gameService
            .confirmGame(confirm.urlsafe_key)
            .then(() => this.updateGame(confirm));
    }

    updateGame(update: Game) {
        for (let i = 0, l = this.games.length; i < l; i++) {
            if (this.games[i].urlsafe_key === update.urlsafe_key) this.games[i].confirmed = true;
        }
    }

    getGames() {
        this.gameService
            .getUserGames(this.user.email)
            .then(games => this.games = games);
    }

    ngOnInit() {
        this.user = this.userService.getUser();
        this.getGames();
    }
}
