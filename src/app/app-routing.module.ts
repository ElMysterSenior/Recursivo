import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BasicoComponent } from './basico/basico.component';
import { AdminComponent } from './admin/admin.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { AuthGuard } from './authguard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent,canActivate: [AuthGuard] },
  { path: 'consulta', component: ConsultaComponent,canActivate: [AuthGuard] },
  { path: 'basico', component: BasicoComponent,canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
