import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { SolverComponent } from "./solver/solver.component";
import { DesignerComponent } from "./designer/designer.component";
import { LayoutsComponent } from "./layouts/layouts.component";
import { FabrictestComponent} from "./fabrictest/fabrictest.component";

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'layouts', component: LayoutsComponent },
  { path: 'designer', component: DesignerComponent },
  { path: 'solver', component: SolverComponent },
  { path: 'fabric-test', component: FabrictestComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
