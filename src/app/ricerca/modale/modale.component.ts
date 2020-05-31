import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup , Validators , FormControl } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modale',
  templateUrl: './modale.component.html',
  styleUrls: ['./modale.component.css']
})
export class ModaleComponent implements OnInit {
  @Input() name;
  formval: any;
  nomeValore = new FormControl();
  @Output() salva = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.formval=this.name;
    //this.nomeValore.setValue(this.name.title);
  }

  onChange() {
    //this.name.title = this.nomeValore.value;
  }

  setData(){
    alert("ok");
    this.salva.emit(this.formval);
  }
}
