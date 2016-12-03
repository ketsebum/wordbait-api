/**
 * Created by ketse on 12/2/16.
 */
import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {Router} from '@angular/router';

import { User } from '../_models/index';
import {UserService, GameService} from '../_services/index';

@Component({
    templateUrl: 'app/new_game/new_game.component.html'
})

export class NewGameComponent implements OnInit {
    @Output() loggingIn = new EventEmitter<boolean>();
    user: User;
    users: any = {};

    constructor(private router: Router,
                private userService: UserService,
                private gameService: GameService) {
        this.users = userService.getUsersService();
        this.user = userService.getUser();
    }

    ngOnInit() {

    }

    createGame() {
        this.gameService
            .newGame(this.user.email)
            .then(result => {
                if (result) { console.log(result);}
                this.router.navigate(['/']);
            });
        // this.router.navigate(['/']);
    }

}
