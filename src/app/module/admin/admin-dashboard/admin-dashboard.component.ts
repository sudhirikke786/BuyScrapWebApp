import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {

  actionList = [
    {
      iconcode:'mdi-plus',
      title:'Add New User'
    },
    {
      iconcode:'mdi-map-marker',
      title:'Location Management'
    }
  ];

  admins = [
    {
      firstName: 'Alex',
      lastName: 'Junior',
      username: 'alexj',
      userPermission: 'Administrator'
    },
    {
      firstName: 'Sanket',
      lastName: 'Yoshi',
      username: 'sankety',
      userPermission: 'Administrator'
    },
    {
      firstName: 'Scrap',
      lastName: 'User',
      username: 'scrapu',
      userPermission: 'Employee'
    },
    {
      firstName: 'John',
      lastName: 'Junior',
      username: 'johnj',
      userPermission: 'Scale'
    },
    {
      firstName: 'Graeme',
      lastName: 'Smith',
      username: 'graemes',
      userPermission: 'Cashier'
    },
    {
      firstName: 'Allan',
      lastName: 'Border',
      username: 'allanb',
      userPermission: 'Administrator'
    },
    {
      firstName: 'Mark',
      lastName: 'Junior',
      username: 'markj',
      userPermission: 'Administrator'
    }	
  ];
  
}
