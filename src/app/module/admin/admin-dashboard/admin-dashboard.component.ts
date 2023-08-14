import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

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
  

  visible = false;

  orgName: any;
  locId: any;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.orgName = localStorage.getItem('orgName');
    this.locId = this.commonService.getProbablyNumberFromLocalStorage('locId');
  }

  showModel(){
    this.visible =  true;
  }

  hideModel() {
    this.visible = false;
  }
  //-location

  getAction(actionCode: any) {
    switch (actionCode?.iconcode) {
      case 'mdi-plus':
        this.showModel();
        break;
        case 'mdi-map-marker':
         this.router.navigateByUrl('/abc/admin/admin-location')
       break;
      default:
        break;
    }
  }

}
