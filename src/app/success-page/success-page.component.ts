import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.css']
})
export class SuccessPageComponent {

    pageType:any

  constructor(private route : Router, private activeRoute: ActivatedRoute){

    this.activeRoute.queryParams.subscribe((res) => {
       this.pageType = res;
    })

  }

}
