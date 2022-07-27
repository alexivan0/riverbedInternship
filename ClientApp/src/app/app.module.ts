import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'
import { AppDataService } from 'src/app/services/app-data.service';
import { TradeTrackerComponent } from './trade-tracker/trade-tracker.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AssetsComponent } from './assets/assets.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { DatePipe } from '@angular/common';

export function tokenGetter() {
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    AssetsComponent,
    TradeTrackerComponent,
    LoginComponent,
    PortfolioComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'portfolio', component: AssetsComponent, canActivate: [AuthGuardService] },
      { path: 'trade-tracker', component: TradeTrackerComponent, canActivate: [AuthGuardService] },
      { path: 'login', component: LoginComponent }
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["https://localhost:44429"],
        disallowedRoutes: []
      }
    }),
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [AppDataService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
