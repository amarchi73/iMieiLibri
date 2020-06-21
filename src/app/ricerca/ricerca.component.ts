import { Component, OnInit } from '@angular/core';
import { myLibri } from '../apiKey';
import { SectionsModule } from '../sections/sections.module';
import { ModaleComponent } from './modale/modale.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { ContenitoreComponent} from './contenitore/contenitore.component';
import { LibriService } from '../servizi/libri.service';

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.css'],
})
export class RicercaComponent implements OnInit {
  elencoLibri: any; // = myLibri;
  scansioni: any;
  modaleComp = ModaleComponent;
  navItems: any;
  barcode: any;
  scanActive = false;
  message = 'ciao a tutti';
  conta = 1;
  scansione = 0;

  constructor( private httpBoh:  HttpClient, private mieiLibri: LibriService ) {

  }

  ngOnInit(): void {
    console.log('caricati?');

    /*this.httpBoh.get('https://www.googleapis.com/books/v1/volumes?q=isbn:9788815247902').subscribe(data => {
      //window.alert(data[0]['title']);
      console.log(data);
    });

    this.httpBoh.get('http://localhost:8080/libri').subscribe(data => {
      //window.alert(data[0]['title']);
      this.elencoLibri = data;
    });
    this.barcode = "barcoode"; */
    var t=this;
    var sub = this.mieiLibri.elencoLibriObservable(40).subscribe({
      next(data){
        console.log("=====");
        console.log(data);
        console.log("=====");
        t.elencoLibri = data;
      }
    });

    /*this.mieiLibri.elencoLibri().subscribe(data => {
      //window.alert(data[0]['title']);
      this.elencoLibri = data;
    });*/
  }

  salvaLibro(l){
    var ind=this.elencoLibri.indexOf(l);
    this.mieiLibri.salvaLibro(l).subscribe(
        (res) => {
          window.console.log(res);
          this.scansioni[ind].Id = res;
        },
        (err) => window.console.log(err)
    );
  }

}
