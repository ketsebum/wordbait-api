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
var LoginComponent = (function () {
    function LoginComponent(router, authenticationService) {
        this.router = router;
        this.authenticationService = authenticationService;
        this.loggingIn = new core_1.EventEmitter();
        this.model = {};
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
                auth2 = gapi.auth2.init({
                    client_id: '1066114691418-nm0p4krul7jenj0vck20glcrh23nm1lm.apps.googleusercontent.com',
                    cookiepolicy: 'single_host_origin',
                });
                attachSignin(document.getElementById('customBtn'));
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
    LoginComponent.prototype.authenticate = function (type) {
        if (type === 'google') {
        }
    };
    LoginComponent.prototype.attachSignin = function (element) {
        console.log(element.id);
        auth2.attachClickHandler(element, {}, function (googleUser) {
            document.getElementById('name').innerText = "Signed in: " +
                googleUser.getBasicProfile().getName();
        }, function (error) {
            alert(JSON.stringify(error, undefined, 2));
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
        __metadata('design:paramtypes', [router_1.Router, index_1.AuthenticationService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map