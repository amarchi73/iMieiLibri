import {Component, OnInit} from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { NgbdModalComponent} from '../../sections/modal/modal.component';

@Component({
  selector: 'app-riga',
  templateUrl: './riga.component.html',
  styleUrls: ['./riga.component.css']
})
export class RigaComponent implements OnInit {
  @Input() libri;
  @Input() scansioni;
  @Input() modale;
  @Output() salva = new EventEmitter<any>();
  @Output() salvaLibro = new EventEmitter<any>();
  @Output() eliminaLibro  = new EventEmitter<any>();

  alert = { mostra: 0, icon: 'ni ni-like-2', type: 'success', strong: 'OK', message: 'Salvato' };

  constructor() { }

  xclick() {
    window.alert("xclick");
  }
  onXclick(){
    //window.alert("xclick");
  }

  ngOnInit(): void {
  }

  onSalva(n) {
    this.salva.emit(n);
  }

  onSalvaLibro(l){
    this.salvaLibro.emit(l);
    l.mostraAvviso=1;
  }

  onEliminaLibro(l){
    var i=this.scansioni.indexOf(l);
    this.scansioni.splice(i,1);
    this.eliminaLibro.emit(l);
  }

  close(l){
    l.mostraAvviso = 0;
  }
}
