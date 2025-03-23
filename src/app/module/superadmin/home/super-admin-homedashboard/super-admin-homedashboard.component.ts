import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-super-admin-homedashboard',
  templateUrl: './super-admin-homedashboard.component.html',
  styleUrls: ['./super-admin-homedashboard.component.css']
})
export class SuperAdminHomedashboardComponent  implements OnInit {

  orgName: any;
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
 
  users: any[] = [];
  deletedUsers: any[] = [];
  showDeletedPopup: boolean = false;
  deletedUsersLoader: boolean = true;
  isDeletedUserVisible: boolean = false;
  constructor(private commonService: CommonService,private route: ActivatedRoute,
    private router: Router,) {} 

  ngOnInit(): void {
    this.fetchOrganizations();
    // this.users = [
    //   { name: 'John Doe', status:'Active', email: 'john.doe@example.com'  },
    //   { name: 'John Doe', status:'Inactive', email: 'john.doe@example.com' },
     
    //   // Add more users as needed
    // ]
  }

  getlocations(organizationName:string){
    const paramObject = {
      clientName:organizationName
    };
    this.commonService.getAdminOrganisaction(paramObject)
      .subscribe(data => {
          console.log('GetAllOrganisations :: ');
          console.log(data);
          this.users = data.body.data;
         
        },
        (err: any) => {
         
        },
        () => {
          
        }
      );
    console.log("Location button clicked!",organizationName);
    this.router.navigate(['/superadmin/home/superadmin-loc'], { queryParams: { orgName: organizationName } });
    
  }

  fetchOrganizations() {
   
    const paramObject = {
     
    };
    this.commonService.GetAllOrganisations(paramObject)
      .subscribe(data => {
          console.log('GetAllOrganisations :: ');
          console.log(data);
          this.users = data.body.data;
         
        },
        (err: any) => {
         
        },
        () => {
          
        }
      );
  }
 
  showDeletedOrganizations() {
    this.commonService.GetAllDeletedOrganisations({}).subscribe(
      (data) => {
        console.log('GetAllDeletedOrganisations:', data);
        this.deletedUsers = data.body.data ; 
        this.showDeletedPopup = true; 
      },
      (err) => {
        console.error('Error fetching deleted organizations', err);
      }
    );
  }

  closeDeletedPopup() {
    this.showDeletedPopup = false;
  }
  getAction(actionCode: any) {

    switch (actionCode?.iconcode) {
      case 'mdi-magnify':
        
        break;
      case 'mdi-refresh':
       this.fetchOrganizations();
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
