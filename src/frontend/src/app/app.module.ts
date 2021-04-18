// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';

import { authInterceptorProviders } from "./_helpers/auth.interceptor";
import { SeatmapComponent } from './seatmap/seatmap.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SolverComponent } from './solver/solver.component';
import { DesignerComponent } from './designer/designer.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AdminComponent,
    UserDetailComponent,
    MessagesComponent,
    DashboardComponent,
    SeatmapComponent,
    LandingPageComponent,
    SolverComponent,
    DesignerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
