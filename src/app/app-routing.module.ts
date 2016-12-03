import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/index';
import { SignUpComponent } from './signup/index';
import { NewGameComponent } from './new_game/index';
import { WelcomeComponent } from './home/index';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'newgame', component: NewGameComponent },
  { path: '', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}