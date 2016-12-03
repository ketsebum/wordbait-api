"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by ketse on 11/30/16.
 */
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var GameService = (function () {
    function GameService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.apiURL = '/_ah/api/word_bait/v1/'; // URL to web api
        this.gamesURL = 'games';
        this.gamesUserURL = 'games/active/';
        this.newGameURL = 'game';
    }
    GameService.prototype.getGames = function () {
        return this.http.get(this.apiURL + this.gamesURL)
            .toPromise()
            .then(function (response) { return response.json().items; })
            .catch(this.handleError);
    };
    GameService.prototype.getUserGames = function (name) {
        return this.http.get(this.apiURL + this.gamesUserURL + name)
            .toPromise()
            .then(function (response) { return response.json().items; })
            .catch(this.handleError);
    };
    // getHero(id: number): Promise<Hero> {
    //     return this.getHeroes()
    //         .then(heroes => heroes.find(hero => hero.id === id));
    // }
    GameService.prototype.newGame = function (name) {
        var url = this.apiURL + this.newGameURL;
        return this.http.post(url, JSON.stringify({ user_name: name }), { headers: this.headers })
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
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
    GameService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    GameService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], GameService);
    return GameService;
}());
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map