import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.css']
})
export class HomeDashboardComponent implements OnInit {

  constructor(public commonService:CommonService, private stroarge: StorageService,private authService: AuthService,private route: ActivatedRoute,
    private router: Router){

  }
  organizationName: any = localStorage.getItem('orgName');

  menuItemList = [
      {
        title: 'Home/Tickets',
        url: '/home',
        icon: '/assets/images/custom/icons/home.png',
        role: ['Administrator','Scale','Cashier']
      },
      {
        title:'Sellers/Buyers',
        url:'/sellers-buyers',
        icon:'/assets/images/custom/icons/seller-buyer.png',
        role: ['Administrator','Cashier']
      },
      {
        title:'Invoice',
        url:'/invoice',
        icon:'/assets/images/leftmenu/invoice.png',
        role: ['Administrator','Scale','Cashier']
      },
      {
        title:'Ship Out',
        url:'/ship-out',
        icon:'/assets/images/custom/icons/dispatch.png',       
        role: ['Administrator','Cashier']
      },
      {
        title:'Materials',
        url:'/materials',
        icon:'/assets/images/custom/icons/materials.png',
        role: ['Administrator','Cashier']
      },
      {
        title:'Dispatch',
        url:'/dispatch',
        icon:'/assets/images/custom/icons/ship-out.png',
        role: ['Administrator','Cashier']
      },
      {
        title:'Adjustment',
        url:'/adjustment',
        icon:'/assets/images/custom/icons/adjustment.png',
        role: ['Administrator','Cashier']
      },
      {
        title:'Regrade',
        url:'/regrade',
        icon:'/assets/images/custom/icons/regrade.png',
        role: ['Administrator','Cashier']
      },
      {
        title:'Certificates of Destruction',
        url:'/certificates',
        icon:'/assets/images/custom/icons/certificate.png',
        role: ['Administrator','Cashier']
      },
      {
        title:'Cash Drawer',
        url:'/cash-drawer',
        icon:'/assets/images/custom/icons/cash-drawer.png',
        role: ['Administrator','Cashier']
      },
      {
        title:'Reports',
        url:'/reports',
        icon:'/assets/images/custom/icons/reports.png',
        role: ['Administrator','Cashier']
      },
      {
        title:'Admin',
        url:'/admin',
        icon:'/assets/images/custom/icons/admin.png',
        role: ['Administrator']
      }
  ]

  orgName: any;

  menuList: any = [];


  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    
    const _dataObj: any = this.stroarge.getLocalStorage('systemInfo');
    if (_dataObj) {
      const isScaleUser = _dataObj.filter((item: any) => item?.keys?.toLowerCase() == 'isscalemanageseller')[0];

      if(isScaleUser?.values.toLowerCase()=='true'){
          const menuIndex = this.menuItemList.findIndex((item:any) => item.url == '/sellers-buyers');
          let roleName  = this.menuItemList[menuIndex].role;
          roleName = [...roleName,'Scale']
          this.menuItemList[menuIndex].role = roleName;
          this.menuItemList = [...this.menuItemList];
      }     
    }
    //alert(this.orgName.toLowerCase());

    if (this.orgName.toLowerCase() != 'prodtest' && this.orgName.toLowerCase() != 'siddhi eneterprise') {
      this.menuList = this.menuItemList.filter(function(el) { return (el.title.toString() != "Invoice" && el.title.toString() != "Dispatch"); }); 
    } else {
      this.menuList = this.menuItemList;     
    }
  }

  showMenu(roleName:any):boolean{
    return this.authService.hasRoleActive(roleName)
  }

  navigatePage(item:any){
    this.commonService.showHidePanel('sidemenu');
    if(item.url == '/home'){
      this.router.navigate([`/${this.organizationName}/home`]);
      // window.location.href = '/home';
    }else{
      this.router.navigate([`/${this.organizationName}/${item.url}`]);
    }
   
  //  this.route.navigate(`${organizationName}/${item.url}`)
   // routerLink="/{{organizationName}}{{item.url}}"
  }
}