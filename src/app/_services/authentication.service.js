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
var index_1 = require('../_models/index');
require('rxjs/add/operator/map');
require('rxjs/add/operator/share');
var AuthenticationService = (function () {
    function AuthenticationService(http) {
        this.http = http;
        this.object = {};
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }
    AuthenticationService.prototype.login = function (email, password) {
        var _this = this;
        //Setting the Login Parameters
        var loginURL = '/login';
        var body = JSON.stringify({ email: email, password: password });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(loginURL, body, options)
            .map(function (response) {
            // login successful if there's a jwt token in the response
            var token = response.json() && response.json().token;
            if (token) {
                // set token property
                _this.token = token;
                // store email and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(response.json()));
                // return true to indicate successful login
                return true;
            }
            else {
                // return false to indicate failed login
                return false;
            }
        });
    };
    AuthenticationService.prototype.googleSignIn = function (googleUser) {
        var _this = this;
        var signUpURL = '/signup';
        // let body = JSON.stringify({name: name, email: email, password: password});
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        this.object.user = new index_1.User();
        (function (u, p) {
            u.id = p.getId();
            u.name = p.getName();
            u.email = p.getEmail();
            // u.imageUrl      = p.getImageUrl();
            // u.givenName     = p.getGivenName();
            // u.familyName    = p.getFamilyName();
        })(this.object.user, googleUser.getBasicProfile());
        (function (u, r) {
            u.token = r.id_token;
        })(this.object, googleUser.getAuthResponse());
        this.object.google = true;
        // user.save();
        // localStorage.setItem('currentUser', JSON.stringify(this.object));
        var body = JSON.stringify(this.object);
        return this.http.post(signUpURL, body, options)
            .map(function (response) {
            // login successful if there's a jwt token in the response
            localStorage.setItem('currentUser', JSON.stringify(_this.object));
            return true;
        });
    };
    AuthenticationService.prototype.signup = function (name, email, password) {
        var _this = this;
        //Setting the Login Parameters
        var signUpURL = '/signup';
        var body = JSON.stringify({ name: name, email: email, password: password, google: false });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(signUpURL, body, options)
            .map(function (response) {
            // login successful if there's a jwt token in the response
            var token = response.json() && response.json().token;
            if (token) {
                // set token property
                _this.token = token;
                // store email and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(response.json()));
                // return true to indicate successful login
                return true;
            }
            else {
                // return false to indicate failed login
                return false;
            }
        });
    };
    AuthenticationService.prototype.deleteCookie = function (name) {
        this.setCookie(name, "", -1);
    };
    AuthenticationService.prototype.setCookie = function (name, value, expireDays, path) {
        if (path === void 0) { path = ""; }
        var d = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
        var expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + "; " + expires + (path.length > 0 ? "; path=" + path : "");
    };
    AuthenticationService.prototype.logout = function () {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        this.deleteCookie("auth");
    };
    AuthenticationService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map