import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';

// import { BaseRequestOptions } from '@angular/http';
// import { fakeBackendProvider } from './_helpers/index';
// import { MockBackend, MockConnection } from '@angular/http/testing';

import { AppComponent }  from './app.component';
import { HeaderComponent } from './header/index';
import { FooterComponent } from './footer/index';
import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from './_guards/index';
import { AuthenticationService, UserService, GameService } from './_services/index';
import { LoginComponent } from './login/index';
import { SignUpComponent } from './signup/index';
import { NewGameComponent } from './new_game/index';
import { ViewGameComponent } from './viewgame/index';
import { WelcomeComponent } from './home/index';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SignUpComponent,
    NewGameComponent,
    ViewGameComponent,
    WelcomeComponent
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
