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
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Subject_1 = require('rxjs/Subject');
var index_1 = require('./index');
var UserService = (function () {
    function UserService(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
        this.apiURL = '/_ah/api/word_bait/v1/'; // URL to web api
        this.allURL = 'all/users'; // URL to web api
        this.loggedIn = new Subject_1.Subject();
        this.currentUser$ = this.loggedIn.asObservable();
    }
    UserService.prototype.getUser = function () {
        var user = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).user : false;
        if (user) {
            if (user.verified) {
                this.user = user;
                this.loggedIn.next(user);
            }
            else {
                this.user = user;
                this.loggedIn.next(user);
                this.getUserService(user).subscribe(function (user) { return localStorage.setItem('currentUser', JSON.stringify(user)); });
            }
        }
        else {
        }
        return this.user;
    };
    UserService.prototype.getUserService = function (user) {
        // add authorization header with jwt token
        var headers = new http_1.Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new http_1.RequestOptions({ headers: headers });
        var url = '/account?id=' + user.id;
        // get users from api
        return this.http.get(url, options)
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.getUsersService = function () {
        // add authorization header with jwt token
        var headers = new http_1.Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        var options = new http_1.RequestOptions({ headers: headers });
        // get users from api
        return this.http.get(this.apiURL + this.allURL, options)
            .toPromise()
            .then(function (response) { return response.json().items; })
            .catch();
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, index_1.AuthenticationService])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map