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
  @Input() modale;


  constructor() { }

  xclick() {
    window.alert("xclick");
  }
  onXclick(){
    //window.alert("xclick");
  }

  ngOnInit(): void {
  }

}
