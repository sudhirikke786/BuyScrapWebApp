import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-superadmin-sidemenu',
  templateUrl: './superadmin-sidemenu.component.html',
  styleUrls: ['./superadmin-sidemenu.component.css'],
})
export class SuperadminSidemenuComponent {

  
  menuItemList = [
    {
      title: 'Home',
      url: '/superadmin/home',
      icon: '/assets/images/custom/icons/home.png',
    } 
    
  ];

  constructor(
    public commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    
  }

  orgName: any;

  menuList: any = [];

  navigatePage(item: any) {
    this.router.navigate([`/superadmin/${item.url}`]);
  }


  showMenu(roleName:any):boolean{
    return true
  }
}
