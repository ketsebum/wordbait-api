/**
 * Created by ketse on 12/2/16.
 */
import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {Router} from '@angular/router';

import { User } from '../_models/index';
import {AuthenticationService} from '../_services/index';

@Component({
    templateUrl: 'app/new_game/new_game.component.html'
})

export class NewGameComponent implements OnInit {
    @Output() loggingIn = new EventEmitter<boolean>();
    model: any = {};
    object: any = {};
    loading = false;
    error = '';

    constructor(private router: Router,
                private authenticationService: AuthenticationService) {
    }

    ngOnInit() {

    }

    createGame() {

    }

}
