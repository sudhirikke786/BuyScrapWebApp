import { Component } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {

  constructor(public commonService:CommonService){

  }
  organizationName: any = localStorage.getItem('orgName');;

  menuList = [
      {
        title: 'Home/Tickets',
        url: '/home',
        icon: '/assets/images/custom/icons/home.png'
      },
      {
        title:'Sellers/Buyers',
        url:'/sellers-buyers',
        icon:'/assets/images/custom/icons/seller-buyer.png'
      },
      {
        title:'Ship Out',
        url:'/ship-out',
        icon:'/assets/images/custom/icons/ship-out.png'
      },
      {
        title:'Materials',
        url:'/materials',
        icon:'/assets/images/custom/icons/materials.png'
      },
      {
        title:'Adjustment',
        url:'/adjustment',
        icon:'/assets/images/custom/icons/adjustment.png'
      },
      {
        title:'Regrade',
        url:'/regrade',
        icon:'/assets/images/custom/icons/regrade.png'
      },
      {
        title:'Certificates of Destruction',
        url:'/certificates',
        icon:'/assets/images/custom/icons/certificate.png'
      },
      {
        title:'Cash Drawer',
        url:'/cash-drawer',
        icon:'/assets/images/custom/icons/cash-drawer.png'
      },
      {
        title:'Reports',
        url:'/reports',
        icon:'/assets/images/custom/icons/reports.png'
      },
      {
        title:'Admin',
        url:'/admin',
        icon:'/assets/images/custom/icons/admin.png'
      }
  ]
}
