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
 * Created by ketse on 12/2/16.
 */
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var index_1 = require('../_services/index');
var NewGameComponent = (function () {
    function NewGameComponent(router, userService, gameService) {
        this.router = router;
        this.userService = userService;
        this.gameService = gameService;
        this.loggingIn = new core_1.EventEmitter();
        this.users = {};
        this.users = userService.getUsersService();
        this.user = userService.getUser();
    }
    NewGameComponent.prototype.ngOnInit = function () {
    };
    NewGameComponent.prototype.createGame = function () {
        var _this = this;
        this.gameService
            .newGame(this.user.name)
            .then(function (result) {
            if (result) {
                console.log(result);
            }
            _this.router.navigate(['/']);
        });
        // this.router.navigate(['/']);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], NewGameComponent.prototype, "loggingIn", void 0);
    NewGameComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/new_game/new_game.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.Router, index_1.UserService, index_1.GameService])
    ], NewGameComponent);
    return NewGameComponent;
}());
exports.NewGameComponent = NewGameComponent;
//# sourceMappingURL=new_game.component.js.map