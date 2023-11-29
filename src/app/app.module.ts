import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Importa FormsModule o ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BasicoComponent } from './basico/basico.component';
import { AdminComponent } from './admin/admin.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { FilterUsuariosPipe } from './filter-usuarios.pipe';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BasicoComponent,
    AdminComponent,
    ConsultaComponent,
    FilterUsuariosPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,  // Agrega FormsModule o ReactiveFormsModule aquí
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
