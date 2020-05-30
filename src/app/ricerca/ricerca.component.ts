import { Component, OnInit } from '@angular/core';
import { myLibri } from '../apiKey';
import { SectionsModule } from '../sections/sections.module';
import { ModaleComponent } from './modale/modale.component';

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.css']
})
export class RicercaComponent implements OnInit {
  elencoLibri = myLibri;
  modaleComp = ModaleComponent;

  constructor() { }

  ngOnInit(): void {

  }

}
