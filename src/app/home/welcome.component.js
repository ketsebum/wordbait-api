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
var router_1 = require('@angular/router');
var index_1 = require('../_services/index');
var WelcomeComponent = (function () {
    function WelcomeComponent(userService, gameService, router) {
        this.userService = userService;
        this.gameService = gameService;
        this.router = router;
        this.users = [];
        this.token = JSON.parse(localStorage.getItem('currentUser')).token;
        this.user = userService.getUser();
        this.games = gameService.getUserGames(this.user.email);
        console.log(this.user);
    }
    WelcomeComponent.prototype.test = function () {
        console.log(this.games);
    };
    WelcomeComponent.prototype.newGame = function () {
        this.router.navigate(['/newgame']);
    };
    WelcomeComponent.prototype.confirmGame = function () {
        // gameService.confirmGame();
    };
    WelcomeComponent.prototype.ngOnInit = function () {
        this.games = this.gameService.getUserGames(this.user.email);
    };
    WelcomeComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/home/welcome.component.html'
        }), 
        __metadata('design:paramtypes', [index_1.UserService, index_1.GameService, router_1.Router])
    ], WelcomeComponent);
    return WelcomeComponent;
}());
exports.WelcomeComponent = WelcomeComponent;
//# sourceMappingURL=welcome.component.js.map