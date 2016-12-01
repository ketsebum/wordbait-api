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
var HeaderComponent = (function () {
    function HeaderComponent(userService) {
        var _this = this;
        this.userService = userService;
        this.showHamburgerMenu = true;
        this.loggedIn = false;
        this.subscription = userService.currentUser$.subscribe(function (user) {
            // TODO: DO THIS BETTER
            _this.user = JSON.parse(localStorage.getItem('currentUser')).user;
            _this.loggedIn = true;
        });
    }
    HeaderComponent.prototype.toggleMenu = function () {
        this.showHamburgerMenu = !this.showHamburgerMenu;
    };
    HeaderComponent.prototype.updateUser = function () {
        this.user = this.userService.getUser();
    };
    HeaderComponent.prototype.logout = function () {
        this.loggedIn = false;
    };
    HeaderComponent.prototype.ngOnInit = function () {
        this.user = this.userService.getUser();
        if (this.user !== undefined) {
            this.loggedIn = true;
        }
        else {
            this.loggedIn = false;
        }
    };
    HeaderComponent = __decorate([
        core_1.Component({
            selector: 'headercomponent',
            templateUrl: 'app/header/header.component.html',
            styleUrls: ['app/menu.css']
        }), 
        __metadata('design:paramtypes', [index_1.UserService])
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=header.component.js.map