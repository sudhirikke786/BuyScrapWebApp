import { Component } from '@angular/core';

@Component({
  selector: 'app-super-admin-homedashboard',
  templateUrl: './super-admin-homedashboard.component.html',
  styleUrls: ['./super-admin-homedashboard.component.css']
})
export class SuperAdminHomedashboardComponent {


  actionList = [{
    iconcode: 'mdi-refresh',
    title: 'Refresh', 
     label:'Refresh'
  },
  {
    iconcode: 'mdi-ticket',
    title: 'New Oraganization',
    label:'New Oraganization'
  },
  
 
  ];
 users = [
    { name: 'John Doe', status:'Active', email: 'john.doe@example.com'  },
    { name: 'John Doe', status:'Inactive', email: 'john.doe@example.com' },
   
    // Add more users as needed
  ];



  getAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        
        break;
      case 'mdi-refresh':
       
        break;
      case 'mdi-ticket':
          break;
      case 'mdi-merge':
        
        break;
      default:
        break;
    }


  }
}
