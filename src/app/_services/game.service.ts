/**
 * Created by ketse on 11/30/16.
 */
import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {Game} from '../_models/index';

@Injectable()
export class GameService {
    private headers = new Headers({'Content-Type': 'application/json'});
    private apiURL = '/_ah/api/word_bait/v1/';  // URL to web api
    private gamesURL = 'games';
    private gamesUserURL = 'games/active/';
    private newGameURL = 'game';
    private confirmURL = 'confirm/';
    constructor(private http: Http) { }
    getGames(): Promise<Game[]> {
        return this.http.get(this.apiURL + this.gamesURL)
            .toPromise()
            .then(response => response.json().items)
            .catch(this.handleError);
    }
    getUserGames(name: string): Promise<Game[]> {
        return this.http.get(this.apiURL + this.gamesUserURL + name)
            .toPromise()
            .then(response => response.json().items)
            .catch(this.handleError);
    }
    confirmGame(urlSafeKey: string): Promise<Game> {
        return this.http.get(this.apiURL + this.confirmURL + urlSafeKey)
            .toPromise()
            .then(response => response.json() as Game)
            .catch(this.handleError);
    }
    newGame(name: string): Promise<Game> {
        const url = this.apiURL + this.newGameURL;
        return this.http.post(url, JSON.stringify({user_name: name}), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
