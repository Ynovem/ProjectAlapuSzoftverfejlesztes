import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { SolverComponent } from "./solver/solver.component";
import { DesignerComponent } from "./designer/designer.component";
import { LayoutsComponent } from "./layouts/layouts.component";
import { RulesComponent } from "./rules/rules.component";

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'layouts', component: LayoutsComponent },
  { path: 'designer', component: DesignerComponent },
  { path: 'solver', component: SolverComponent },
  { path: 'rules', component: RulesComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
