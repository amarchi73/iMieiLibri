import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

const RICERCA_GOOGLE = 'https://www.googleapis.com/books/v1/volumes';
const SERVER_LIBRI = 'http://localhost:8080';

export interface Libri {
  "Id": number;
  "Titolo": string;
  "Autore": string;
  "Desc": string;
  "Img": string;
  "Isbn": string;
  "Categorie": any;
}

@Injectable({
  providedIn: 'root'
})
export class LibriService {
  scansioni: any;

  constructor(private httpBoh:  HttpClient) { }

  elencoLibriObservable(x) {
    return new Observable((observer) => {
      this.httpBoh.get('http://localhost:8080/libri').subscribe(data => {
        console.log("il valore di X "+x);
        observer.next(data);
      });
    });
  }

  elencoLibri(){
    return this.httpBoh.get('http://localhost:8080/libri');
  }
  elencoLibriScansionati(){
    this.httpBoh.get(SERVER_LIBRI + '/libri?quali=vuoti').subscribe(data => {
      //window.alert(data[0]['title']);
      //this.scansioni = data;
      for(var i in data){
        console.log("===");
        console.log(data[i]);
        var id;
        if(data[i].Id === undefined){
          id = 0;
        }else{
          id = data[i].Id;
        }
        this.trovaInfoLibro(data[i].Isbn, id);
      }
    });
  }
  trovaInfoLibro(isbn, id){
    var msg=isbn;
    return this.httpBoh.get(RICERCA_GOOGLE+'?q=isbn:'+msg).subscribe(data => {
      for (var i = 0; i < data["items"].length; i++) {
        var curLibro=data["items"][i];
        this.httpBoh.get(RICERCA_GOOGLE + '/' + curLibro.id).subscribe(dataDesc => {
          console.log(dataDesc);
          var dd = {
            "Id": id,
            "Titolo": curLibro.volumeInfo.title,
            "Autore": curLibro.volumeInfo.authors.join(),
            "Desc": dataDesc["volumeInfo"].description,
            "Img": curLibro.volumeInfo.imageLinks.thumbnail,
            "Isbn": msg,
            "Categorie": dataDesc["volumeInfo"].categories.join(','),

            mostraAvviso: 0, // per gli alert di salvataggio
          };
          this.scansioni[this.scansioni.length] = dd;
        });
      }
    });
  }

  salvaLibro(l){
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    console.log(l);
    var formData = new FormData();
    Object.keys(l).forEach(
        (key) => {
          formData.append(key, l[key]);
        }
    );

    return this.httpBoh.post<any>(SERVER_LIBRI+'/libriset', formData);
  }

  eliminaLibro(l){
    var okk=confirm("Eliminare "+l.titolo+"?");
    if(!okk) return;
    var ok = this.httpBoh.get<any>(SERVER_LIBRI+'/libriset?delID='+l.Id).subscribe(
        (res) => {
          window.console.log(res);
        },
        (err) => window.console.log(err)
    );
  }
}
