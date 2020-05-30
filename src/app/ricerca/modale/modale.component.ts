import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup , Validators , FormControl } from '@angular/forms';

@Component({
  selector: 'app-modale',
  templateUrl: './modale.component.html',
  styleUrls: ['./modale.component.css']
})
export class ModaleComponent implements OnInit {
  @Input() name;
  nomeValore = new FormControl('ciao');


  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.nomeValore.value=this.name.title;
  }

  onChange() {
    this.name.title=this.nomeValore.value;
  }
}
