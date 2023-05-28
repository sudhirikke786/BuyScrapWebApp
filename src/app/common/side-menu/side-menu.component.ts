import { Component } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  organizationName: any = 'abc';

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
        url:'/home/adjustment',
        icon:'/assets/images/custom/icons/adjustment.png'
      },
      {
        title:'Regrade',
        url:'/home/regrade',
        icon:'/assets/images/custom/icons/regrade.png'
      },
      {
        title:'Certificates of Destruction',
        url:'/assets/images/custom/icons/certificate.png',
        icon:'/home/certificate'
      },
      {
        title:'Cash Drawer',
        url:'/home/cash-drawer',
        icon:'/assets/images/custom/icons/cash-drawer.png'
      },
      {
        title:'Reports',
        url:'/home/reports',
        icon:'/assets/images/custom/icons/reports.png'
      },
      {
        title:'Admin',
        url:'/home/admin',
        icon:'/assets/images/custom/icons/admin.png'
      }
  ]
}
