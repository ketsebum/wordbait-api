import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/index';
import { FooterComponent } from './footer/index';
import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from './_guards/index';
import {AuthenticationService, UserService, GameService } from './_services/index';
import { LoginComponent } from './login/index';
import { SignUpComponent } from './signup/index';
import { NewGameComponent } from './new_game/index';
import { ViewGameComponent } from './viewgame/index';
import { WelcomeComponent } from './home/index';
import { TesterComponent } from './tester/tester.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SignUpComponent,
    NewGameComponent,
    ViewGameComponent,
    WelcomeComponent,
    TesterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    GameService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  loggingIn(loggedIn: boolean) {
    console.log(loggedIn);
  }
}
