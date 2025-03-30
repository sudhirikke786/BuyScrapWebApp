import { Component } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-superadminheader',
  templateUrl: './superadminheader.component.html',
  styleUrls: ['./superadminheader.component.css']
})
export class SuperadminheaderComponent {
  orgName: any;

  constructor(public commonService: CommonService, public router:Router) {
    this.orgName = localStorage.getItem('orgName');
    
  }

  backToUserLogin() {
    document.querySelectorAll('iframe').forEach(
      function(elem: any){
        elem.parentNode.removeChild(elem);
    });
    const orgName = localStorage.getItem('orgName');
    localStorage.removeItem('userObj');
    localStorage.removeItem('locId');
    localStorage.removeItem('locationName');
    localStorage.removeItem('currencyCode');
    localStorage.removeItem('ticketPagination');
    localStorage.removeItem('filterObj');
    this.router.navigateByUrl(`/organization-login`);
  }
  click(){
    console.log("Button Clicked");
  }
}
