import { TestBed, async, } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule }  from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/index';
import { SignUpComponent } from './signup/index';
import { NewGameComponent } from './new_game/index';
import { ViewGameComponent } from './viewgame/index';
import { WelcomeComponent } from './home/index';

import { AuthGuard } from './_guards/index';
import { AuthenticationService, UserService, GameService } from './_services/index';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'newgame', component: NewGameComponent },
  { path: 'game/:id', component: ViewGameComponent },
  { path: '', component: WelcomeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        LoginComponent,
        SignUpComponent,
        NewGameComponent,
        ViewGameComponent,
        WelcomeComponent
      ],
      imports: [
        RouterTestingModule,
        RouterModule.forRoot(appRoutes),
        FormsModule,
        HttpModule
      ],
      providers: [
        AuthGuard,
        AuthenticationService,
        GameService,
        UserService,
        {provide: APP_BASE_HREF, useValue: '/'}
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render the header element with Word Bait', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('headercomponent').textContent).toContain('Word Bait');
  }));

  it('should render the footer element with Word Bait', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('footercomponent').textContent).toContain('Word Bait');
  }));
});
