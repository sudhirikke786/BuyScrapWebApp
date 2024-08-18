import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'BuyScrapWebApp';
  
  constructor(private router: Router) {}

  ngOnInit() {
    // if (location.protocol !== 'https:') {
    //   location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    // }
  }
}
