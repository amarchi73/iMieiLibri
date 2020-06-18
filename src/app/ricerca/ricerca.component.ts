import { Component, OnInit } from '@angular/core';
import { myLibri } from '../apiKey';
import { SectionsModule } from '../sections/sections.module';
import { ModaleComponent } from './modale/modale.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { BarcodeFormat } from '@zxing/library';
import { ContenitoreComponent} from './contenitore/contenitore.component';
import {WebsocketService} from '../websocket.service';
import {GochatService} from '../gochat.service';

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.css'],
  providers: [WebsocketService, GochatService]
})
export class RicercaComponent implements OnInit {
  elencoLibri: any; // = myLibri;
  modaleComp = ModaleComponent;
  navItems: any;
  barcode: any;
  scanActive = false;
  message = 'ciao a tutti';
  conta = 1;

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.QR_CODE,
  ];
  constructor( private httpBoh:  HttpClient, private chatService: GochatService ) {
    chatService.messages.subscribe(msg => {
      console.log("Response from websocket: ");
      console.log(msg);
    });
  }

  ngOnInit(): void {
    console.log('caricati?');

    this.httpBoh.get('https://www.googleapis.com/books/v1/volumes?q=isbn:9788815247902').subscribe(data => {
      //window.alert(data[0]['title']);
      console.log(data);
    });

    this.httpBoh.get('http://localhost:8080/libri').subscribe(data => {
      //window.alert(data[0]['title']);
      this.elencoLibri = data;
    });
    this.barcode = "barcoode";
  }

  private messageFunc = {
    author: "tutorialedge",
    message: "this is a test message"
  };

  sendMsg() {
    console.log("new message from client to websocket: ", this.message);
    this.chatService.messages.next(this.messageFunc);
    this.conta++;
    this.messageFunc.message = "ciao "+this.conta;
  }

  toggleScan() {
    this.scanActive = !this.scanActive;
  }

  scanSuccessHandler(e: string) {
    this.barcode = e;
    console.log("arrivato");
  }

  scanErrorHandler(event){
    console.log(event);
  }
  scanFailureHandler(event){
    console.log(event);
  }

  setData(n){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'multipart/form-data; boundary=---WebKitFormBoundary7MA4YWxkTrZu0gW',
      })
    };

    /*
     var jsonData = {
   name: 'starwars',
   year: 1977,
   data: [{
    'id': 'c5f6d301-328e-4167-8e13-504afb9a030e',
    'item': 'bc4db36e-9e7c-478d-93a2-d4be32dacec1',
    'qty': '1'
  },
  {
    'id': 'c5f6d301-328e-4167-8e13-504afb9a030e',
    'item': 'bc4db36e-9e7c-478d-93a2-d4be32dacec1',
    'qty': '1'
  },
 ],
};
var formData = new FormData();
Object.keys(jsonData).forEach((key)=>{formData.append(key,jsonData[key])});
    formData.append('uno', n);
    formData.append('due', "due");

     */

    var formData = new FormData();
    Object.keys(n).forEach(
        (key) => {
          formData.append(key, n[key]);
        }
    );

    var ok = this.httpBoh.post<any>('http://localhost:8080/libriset', formData).subscribe(
        (res) => window.console.log(res),
        (err) => window.console.log(err)
    );
    //window.alert('set xxx' + n + "--" + ok);
  }
}
