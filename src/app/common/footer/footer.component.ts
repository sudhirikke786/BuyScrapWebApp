import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

footerUrl = [
  {
    name:'About',
    url:'https://buyscrapapp.com/about/'
  },
  {
    name:'Support',
    url:'https://buyscrapapp.com/support/'
  },
  {
    name:'Contact Us',
    url:'https://buyscrapapp.com/contact-us/'
  }
]
years : any;
constructor(){
  this.years = new Date().getFullYear();
}

}
