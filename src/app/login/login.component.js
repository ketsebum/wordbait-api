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
var index_1 = require('../_models/index');
var index_2 = require('../_services/index');
var LoginComponent = (function () {
    function LoginComponent(router, authenticationService) {
        this.router = router;
        this.authenticationService = authenticationService;
        this.loggingIn = new core_1.EventEmitter();
        this.model = {};
        this.object = {};
        this.loading = false;
        this.error = '';
    }
    LoginComponent.prototype.ngOnInit = function () {
        // reset login status
        this.authenticationService.logout();
        var googleUser = {};
        var startApp = function () {
            gapi.load('auth2', function () {
                // Retrieve the singleton for the GoogleAuth library and set up the client.
                // added let to auth2 not sure if it should be there
                var auth2 = gapi.auth2.init({
                    client_id: '1066114691418-nm0p4krul7jenj0vck20glcrh23nm1lm.apps.googleusercontent.com',
                });
            });
        };
    };
    LoginComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        gapi.signin2.render('my-signin2', {
            'scope': 'profile email',
            'width': 240,
            'height': 50,
            'longtitle': true,
            'theme': 'light',
            'onsuccess': function (param) { return _this.onSignIn(param); }
        });
    };
    LoginComponent.prototype.onSignIn = function (googleUser) {
        var user = new index_1.User();
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
        // user.save();
        localStorage.setItem('currentUser', JSON.stringify(this.object));
        // this.loggingIn.emit(true);
        this.router.navigate(['/']);
    };
    LoginComponent.prototype.signUp = function () {
        this.router.navigate(['/signup']);
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(function (result) {
            if (result === true) {
                _this.loggingIn.emit(true);
                _this.router.navigate(['/']);
            }
            else {
                _this.error = 'Username or password is incorrect';
                _this.loading = false;
            }
        });
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], LoginComponent.prototype, "loggingIn", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/login/login.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.Router, index_2.AuthenticationService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map