import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { SolverComponent } from './solver/solver.component';
import { DesignerComponent } from './designer/designer.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { FabrictestComponent } from './fabrictest/fabrictest.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    SolverComponent,
    DesignerComponent,
    LayoutsComponent,
    FabrictestComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
