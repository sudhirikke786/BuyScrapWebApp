
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { RegexPattern } from 'src/app/core/pattern/regex-patterns';
import { CommonService } from 'src/app/core/services/common.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-superadminlayout',
  templateUrl: './superadminlayout.component.html',
  styleUrls: ['./superadminlayout.component.css']
})
export class SuperadminlayoutComponent {

  organizationName: any;


    
 

  constructor(public commonService: CommonService, public router:Router) {
    this.organizationName = localStorage.getItem('orgName');
    
  }

  menuItemList = [
    {
      title: 'Home',
      url: '/superadmin/home',
      icon: '/assets/images/custom/icons/home.png',
     
    }
]

orgName: any;

menuList: any = [];


ngOnInit() {
  this.menuList = this.menuItemList;    
  
}
backToUserLogin() {
  
  const orgName = localStorage.getItem('orgName');
  localStorage.removeItem('userObj');
  localStorage.removeItem('locId');
  localStorage.removeItem('locationName');
  localStorage.removeItem('currencyCode');
  localStorage.removeItem('ticketPagination');
  localStorage.removeItem('filterObj');
  this.router.navigateByUrl(`${orgName}/user-login`);
}


navigatePage(item:any){
  this.commonService.showHidePanel('sidemenu');
  if(item.url == '/home'){
    this.router.navigate([`/superadmin/home`]);
    // window.location.href = '/home';
  }
 
//  this.route.navigate(`${organizationName}/${item.url}`)
 // routerLink="/{{organizationName}}{{item.url}}"
}
}
