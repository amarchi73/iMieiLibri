import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';
import { MyHomeModule} from './myhome/myhome.module';

import { NgbdModalComponent } from './sections/modal/modal.component';
import { RicercaComponent } from './ricerca/ricerca.component';
import { RigaComponent } from './ricerca/riga/riga.component';
import { ModaleComponent } from './ricerca/modale/modale.component';
import {SectionsModule} from './sections/sections.module';

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {RicercaModule} from './ricerca/ricerca.module';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    RicercaComponent,
    RigaComponent,
    ModaleComponent,
  ],
    imports: [
        BrowserModule,
        NgbModule,
        FormsModule,
        RouterModule,
        AppRoutingModule,
        HomeModule,
        MyHomeModule,
        SectionsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ZXingScannerModule,

        RicercaModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
