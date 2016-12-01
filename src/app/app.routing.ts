import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/index';
import { SignUpComponent } from './signup/index';
import { WelcomeComponent } from './home/index';
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: '', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
