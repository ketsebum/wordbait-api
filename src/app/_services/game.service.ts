/**
 * Created by ketse on 11/30/16.
 */
import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GameService {
    private headers = new Headers({'Content-Type': 'application/json'});
    private apiURL = '/_ah/api/word_bait/v1/';  // URL to web api
    private gamesURL = 'games';
    private gamesUserURL = 'games/active/';
    private newGameURL = 'game';
    constructor(private http: Http) { }
    getGames(): Promise<any> {
        return this.http.get(this.apiURL + this.gamesURL)
            .toPromise()
            .then(response => response.json().items)
            .catch(this.handleError);
    }
    getUserGames(name: string): Promise<any> {
        return this.http.get(this.apiURL + this.gamesUserURL + name)
            .toPromise()
            .then(response => response.json().items)
            .catch(this.handleError);
    }
    // getHero(id: number): Promise<Hero> {
    //     return this.getHeroes()
    //         .then(heroes => heroes.find(hero => hero.id === id));
    // }
    newGame(name: string): Promise<any> {
        const url = this.apiURL + this.newGameURL;
        return this.http.post(url, JSON.stringify({user_name: name}), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    // create(name: string): Promise<Hero> {
    //     return this.http
    //         .post(this.apiURL, JSON.stringify({name: name}), {headers: this.headers})
    //         .toPromise()
    //         .then(res => res.json().data)
    //         .catch(this.handleError);
    // }
    // update(hero: Hero): Promise<Hero> {
    //     const url = `${this.apiURL}/${hero.id}`;
    //     return this.http
    //         .put(url, JSON.stringify(hero), {headers: this.headers})
    //         .toPromise()
    //         .then(() => hero)
    //         .catch(this.handleError);
    // }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
