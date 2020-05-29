import { Component, OnInit } from '@angular/core';
import { apiKey } from '../apiKey';

@Component({
  selector: 'app-myhome',
  templateUrl: './myhome.component.html',
  styleUrls: ['./myhome.component.css']
})
export class MyhomeComponent implements OnInit {
  apikey: string;

  constructor() { }

  ngOnInit(): void {
    this.apikey = apiKey[0].chiave;
  }

}
