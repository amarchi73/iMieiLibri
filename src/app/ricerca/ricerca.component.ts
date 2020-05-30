import { Component, OnInit } from '@angular/core';
import { myLibri } from '../apiKey';
import { SectionsModule } from '../sections/sections.module';
import { ModaleComponent } from './modale/modale.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.css']
})
export class RicercaComponent implements OnInit {
  elencoLibri: any; // = myLibri;
  modaleComp = ModaleComponent;
  navItems: any;

  constructor( private httpBoh:  HttpClient ) { }

  ngOnInit(): void {
    console.log('caricati?');
    this.httpBoh.get('http://localhost:8080/libri').subscribe(data => {
      //window.alert(data[0]['title']);
      this.elencoLibri = data;
    });
  }

  setData(n){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data; boundary=---WebKitFormBoundary7MA4YWxkTrZu0gW',
      })
    };
    const formData = new FormData();
    formData.append('uno', n);
    formData.append('due', "due");

    var ok = this.httpBoh.post<any>('http://localhost:8080/libriset', formData).subscribe(
        (res) => window.console.log(res),
        (err) => window.console.log(err)
    );
    //window.alert('set xxx' + n + "--" + ok);
  }
}
