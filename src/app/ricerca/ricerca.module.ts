import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionsModule } from '../sections/sections.module';
import { RicercaComponent } from './ricerca.component';
import { NgbdModalComponent} from '../sections/modal/modal.component';

import {ReactiveFormsModule} from '@angular/forms';
import { ContenitoreComponent } from './contenitore/contenitore.component';

@NgModule({
  declarations: [ContenitoreComponent],
  imports: [
    CommonModule,
    SectionsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ContenitoreComponent
  ]
})
export class RicercaModule { }
