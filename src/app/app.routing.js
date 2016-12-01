"use strict";
var router_1 = require('@angular/router');
var index_1 = require('./login/index');
var index_2 = require('./signup/index');
var index_3 = require('./home/index');
var index_4 = require('./_guards/index');
var appRoutes = [
    { path: 'login', component: index_1.LoginComponent },
    { path: 'signup', component: index_2.SignUpComponent },
    { path: '', component: index_3.WelcomeComponent, canActivate: [index_4.AuthGuard] },
    { path: '**', redirectTo: '' }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map