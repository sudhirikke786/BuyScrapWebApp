import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../core/services/common.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../core/interfaces/common-interfaces';
import { MessageService } from 'primeng/api';
import { StorageService } from '../core/services/storage.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  providers: [MessageService]
})
export class UserLoginComponent implements OnInit {
  
  organizationName: any;
  locations: any;
  errorMsg: any;
  user: User = {
    userName: '',
    password: '',
    locID: 1,
    macID: '',    
    isActive: true,
    isConfirm: true
  };
  locationId: number = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http:HttpClient,
              private localService:StorageService,
              private messageService: MessageService,
              private commonService: CommonService) { }

  ngOnInit() {
    this.user.macID = "defaultMacId"
    this.getIPAddress();
    this.route.params.subscribe((param)=>{ 
      this.organizationName = param["orgName"] || 'prodTest';
      this.getOrgLocation();
    });
  }
  
  btnClick(): void {
    this.user.locID =  Number(this.locationId);
    this.localService.setLocalStorage('locId', this.locationId); 
    this.validateUser();
    // this.router.navigateByUrl(`/${this.organizationName}/home`);
  };
  
  getIPAddress(){
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.user.macID = '131312236';
    });
  }

  /**
   * Get the data by calling WebAPI to fetch the details for organization login
   */
  getOrgLocation() {
    this.commonService.getOrgLocation()
      .subscribe(data => {
          console.log('getOrgLocation :: ');
          console.log(data);
          this.locations = data.body.data;
          this.locationId =  this.locations[0].rowId;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }
  
  validateUser() { 
    this.commonService.validateUserCredentials(this.user).subscribe(data => {
         
          if (data?.body.token && data?.body.userdto.userName) {
            this.localService.setLocalStorage('userObj',data?.body);       
            this.router.navigateByUrl(`/${this.organizationName}/home`);
          } else {
            this.messageService.add({ severity: 'error', summary: 'error', detail: 'Invalid User Credentials' });
          }
          
        },
        (err: any) => {
          this.errorMsg = 'Error occured';
        }
      );
  }

}
