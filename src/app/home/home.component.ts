import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from 'animations/slide-in-out.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [slideInOutAnimation],
  host: { '[@slideInOutAnimation]': '' }
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
