
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
     
    },
    // {
    //   title: 'Credential',
    //   url: '/superadmin/credential',
    //   icon: '/assets/images/custom/icons/pw@2x.png',
     
    // },
    {
      title: 'SysPref',
      url: '/superadmin/syspref',
      icon: '/assets/images/custom/icons/settings.png',
     
    },
    {
      title: 'Feedback',
      url: '/superadmin/feedback',
      icon: '/assets/images/custom/icons/certificate.png',
     
    },
    {
      title: 'Suggestion',
      url: '/superadmin/suggestion',
      icon: '/assets/images/custom/icons/reports.png',
     
    },
    {
      title: 'Country',
      url: '/superadmin/country',
      icon: '/assets/images/custom/icons/country-2.png',
     
    },
    {
        title: 'Currency',
       url: '/superadmin/currency',
      icon: '/assets/images/custom/icons/cash-drawer.png',
    },
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


  navigatePage(item: any) {
    this.commonService.showHidePanel('sidemenu');
    this.router.navigate([item.url]); // Navigate using the item's URL directly
  }

  tooChangePass(){
    this.router.navigateByUrl(`/superadmin/credential`);
  }
}
