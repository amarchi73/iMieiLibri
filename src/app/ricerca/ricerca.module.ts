import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionsModule } from '../sections/sections.module';
import { RicercaComponent } from './ricerca.component';
import { NgbdModalComponent} from '../sections/modal/modal.component';
import { ModaleComponent } from './modale/modale.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [ModaleComponent],
  imports: [
    CommonModule,
    SectionsModule,
    ReactiveFormsModule,
  ],
})
export class RicercaModule { }
