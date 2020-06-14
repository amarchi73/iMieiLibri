import {Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'app-contenitore',
  templateUrl: './contenitore.component.html',
  styleUrls: ['./contenitore.component.css']
})
export class ContenitoreComponent implements OnInit {
  @Output() emetti = new EventEmitter();
  @Input() inval: any;

  constructor() { }

  ngOnInit(): void {
  }


}
