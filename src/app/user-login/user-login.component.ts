import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../core/services/common.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../core/interfaces/common-interfaces';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  
  organizationName: any;
  locations: any;
  errorMsg: any;
  user: User = {
    userName: '',
    password: '',
    locID: 0,
    macID: '',    
    isActive: true,
    isConfirm: true
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http:HttpClient,
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
    alert(JSON.stringify(this.user));
    this.validateUser();
    // this.router.navigateByUrl(`/${this.organizationName}/home`);
  };
  
  getIPAddress()
  {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.user.macID = res.ip;
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
          this.locations = data.body;
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }
  
  validateUser() {  

    this.commonService.validateUserCredentials(this.user)
      .subscribe(data => {
          console.log('validateUserCredentials :: ');
          console.log(data);          
          if (data.body.userdto.userName) {
            this.router.navigateByUrl(`/${this.organizationName}/home`);
          } else {
            alert('Invalid User Credentials');
          }
          
        },
        (err: any) => {
          this.errorMsg = 'Error occured';
        }
      );
  }

}
