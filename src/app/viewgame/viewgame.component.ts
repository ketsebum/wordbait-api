/**
 * Created by ketse on 12/2/16.
 */
import 'rxjs/add/operator/switchMap';
import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {User, Game, Move} from '../_models/index';
import {UserService, GameService} from '../_services/index';

@Component({
    // moduleId: module.id,
    templateUrl: './viewgame.component.html'
})

export class ViewGameComponent implements OnInit {
    user: User;
    users: any = {};
    game: Game;
    move: Move = {
        user_name: "",
        urlsafe_key: "",
        final_guess: false,
        word: ""
    };

    constructor(private route: ActivatedRoute,
                private userService: UserService,
                private gameService: GameService) {
    }

    makeMove(guess: boolean) {
        this.move.user_name = this.user.email;
        this.move.urlsafe_key = this.game.urlsafe_key;
        this.move.final_guess = guess;
        this.gameService.makeMove(this.move);
    }

    ngOnInit() {
        this.user = this.userService.getUser();
        this.route.params
            .switchMap((params: Params) => this.gameService.getGame(params['id']))
            .subscribe(game => this.game = game);
    }
}
