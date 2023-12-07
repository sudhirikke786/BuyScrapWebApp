import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {

  constructor(public commonService:CommonService,private authService: AuthService){

  }
  organizationName: any = localStorage.getItem('orgName');

  menuList = [
      {
        title: 'Home/Tickets',
        url: '/home',
        icon: '/assets/images/custom/icons/home.png',
        role: ['Administrator','Cashier']
      },
      {
        title:'Sellers/Buyers',
        url:'/sellers-buyers',
        icon:'/assets/images/custom/icons/seller-buyer.png',
        role: ['Administrator','Cashier']
      },
      {
        title:'Ship Out',
        url:'/ship-out',
        icon:'/assets/images/custom/icons/ship-out.png',
        role: ['Administrator','Cashier']
      },
      {
        title:'Materials',
        url:'/materials',
        icon:'/assets/images/custom/icons/materials.png',
        role: ['Administrator','Cashier']
      },
      {
        title:'Adjustment',
        url:'/adjustment',
        icon:'/assets/images/custom/icons/adjustment.png',
        role: ['Administrator','Scale','Cashier']
      },
      {
        title:'Regrade',
        url:'/regrade',
        icon:'/assets/images/custom/icons/regrade.png',
        role: ['Administrator','Scale','Cashier']
      },
      {
        title:'Certificates of Destruction',
        url:'/certificates',
        icon:'/assets/images/custom/icons/certificate.png',
        role: ['Administrator','Scale','Cashier']
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


  showMenu(roleName:any):boolean{
    return this.authService.hasRoleActive(roleName)
  }

}
