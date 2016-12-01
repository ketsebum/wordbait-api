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
var index_1 = require('../_services/index');
var WelcomeComponent = (function () {
    function WelcomeComponent(userService) {
        this.userService = userService;
        this.users = [];
        this.token = JSON.parse(localStorage.getItem('currentUser')).token;
        this.user = userService.getUser();
    }
    WelcomeComponent.prototype.test = function () {
        console.log("Here is a list of the entire API");
        console.log(gapi.client.word_bait);
        gapi.client.word_bait.get_games().execute(function (resp) {
            if (resp.result) {
                console.log(resp);
            }
        });
    };
    WelcomeComponent.prototype.ngOnInit = function () {
        var apisToLoad;
        var callback = function () {
            if (--apisToLoad === 0) {
            }
        };
        apisToLoad = 1; // must match number of calls to gapi.client.load()
        gapi.client.load('word_bait', 'v1', callback, 'https://gaming-140419.appspot.com/_ah/api/');
    };
    WelcomeComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/home/welcome.component.html'
        }), 
        __metadata('design:paramtypes', [index_1.UserService])
    ], WelcomeComponent);
    return WelcomeComponent;
}());
exports.WelcomeComponent = WelcomeComponent;
//# sourceMappingURL=welcome.component.js.map