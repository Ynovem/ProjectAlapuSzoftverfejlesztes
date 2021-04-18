import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AdminComponent} from "./admin/admin.component";
import {UserDetailComponent} from "./user-detail/user-detail.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LoginComponent} from "./login/login.component";
import { SeatmapComponent } from "./seatmap/seatmap.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";
import {SolverComponent} from "./solver/solver.component";
import {DesignerComponent} from "./designer/designer.component";

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'designer', component: DesignerComponent },
  { path: 'solver', component: SolverComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user/:id', component: UserDetailComponent },
  { path: 'seatmap', component: SeatmapComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
