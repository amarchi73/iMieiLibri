import { Component, OnInit } from '@angular/core';
import {ModaleComponent} from '../ricerca/modale/modale.component';
import {WebsocketService} from '../websocket.service';
import {GochatService} from '../gochat.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
providers: [WebsocketService, GochatService]

@Component({
  selector: 'app-inserimento',
  templateUrl: './inserimento.component.html',
  styleUrls: ['./inserimento.component.css']
})
export class InserimentoComponent implements OnInit {
  elencoLibri = []; // = myLibri;
  scansioni = [];
  modaleComp = ModaleComponent;
  navItems: any;
  barcode: any;
  scanActive = false;
  message = 'ciao a tutti';
  conta = 1;
  scansione = 0;

  constructor(private httpBoh:  HttpClient, private chatService: GochatService ) {
    chatService.messages.subscribe(msg => {
      this.scansioni=[];
      this.elencoLibriScansionati();
      console.log("Response from websocket: ");
      console.log(msg);
      /* if(this.scansione==0) {
        this.elencoLibri=[];
        this.scansioni=[];
      } */
      /* this.scansione = 1;
      this.trovaInfoLibro(msg, 0); */
    });
  }

  ngOnInit(): void {
    this.elencoLibriScansionati();
  }

  private messageFunc = {
    author: "tutorialedge",
    message: "this is a test message"
  };

  elencoLibriScansionati(){
    this.httpBoh.get('http://localhost:8080/libri?quali=vuoti').subscribe(data => {
      //window.alert(data[0]['title']);
      //this.scansioni = data;
      for(var i in data){
        console.log("===");
        console.log(data[i]);
        var id;
        if(data[i].Id==undefined) id=0;
        else id=data[i].Id;
        this.trovaInfoLibro(data[i].Isbn, id);
      }
    });
  }
  trovaInfoLibro(isbn, id){
    var msg=isbn;
    this.httpBoh.get('https://www.googleapis.com/books/v1/volumes?q=isbn:'+msg).subscribe(data => {
      for (var i = 0; i < data["items"].length; i++) {
        var curLibro=data["items"][i];
        this.httpBoh.get('https://www.googleapis.com/books/v1/volumes/' + curLibro.id).subscribe(dataDesc => {
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

  sendMsg() {
    console.log("new message from client to websocket: ", this.message);
    this.chatService.messages.next(this.messageFunc);
    this.conta++;
    this.messageFunc.message = "ciao "+this.conta;
  }

  salvaLibro(l){
    const httpOptions = {
      headers: new HttpHeaders({
        /*'Content-Type':  'multipart/form-data; boundary=---WebKitFormBoundary7MA4YWxkTrZu0gW',*/
        /* 'Content-Type':  'form-data', */
      })
    };
    console.log(l);
    var formData = new FormData();
    Object.keys(l).forEach(
        (key) => {
          formData.append(key, l[key]);
        }
    );
    var ind=this.scansioni.indexOf(l);
    //alert(ind);
    var ok = this.httpBoh.post<any>('http://localhost:8080/libriset', formData).subscribe(
        (res) => {
          window.console.log(res);
          //this.scansioni[ind].Id=res;
          this.scansioni.splice(ind,1);
        },
        (err) => window.console.log(err)
    );
  }

  eliminaLibro(l){
    var okk=confirm("Eliminare "+l.titolo+"?");
    if(!okk) return;
    var ok = this.httpBoh.get<any>('http://localhost:8080/libriset?delID='+l.Id).subscribe(
        (res) => {
          window.console.log(res);
        },
        (err) => window.console.log(err)
    );
  }
}
