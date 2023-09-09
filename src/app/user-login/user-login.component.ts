import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../core/services/common.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../core/interfaces/common-interfaces';
import { MessageService } from 'primeng/api';
import { StorageService } from '../core/services/storage.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  providers: [MessageService]
})
export class UserLoginComponent implements OnInit {

  loginForm!: FormGroup
  
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
  inputType: string  = 'password';
  isSubmit: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http:HttpClient,
              private localService:StorageService,
              private fb:FormBuilder,
              private messageService: MessageService,
              private commonService: CommonService) { }

  ngOnInit() {
    this.user.macID = "defaultMacId"
    this.getIPAddress();
    this.route.params.subscribe((param)=>{ 
      this.organizationName = param["orgName"] || 'prodTest';
      this.getOrgLocation();
    });


    this.loginForm = this.fb.group({
      userName: '',
      password: '',
      locID: null,
      isActive: true,
      isConfirm: true
    })
  }
  
  btnClick(): void {
  
  //  this.localService.setLocalStorage('locId', this.locationId); 
    this.validateUser();
    
    // this.router.navigateByUrl(`/${this.organizationName}/home`);
  };

  changeInput() {
    this.inputType = this.inputType == 'password' ? 'text' : 'password';
  }

  backToOrgLogin() {
    localStorage.clear();
    this.router.navigateByUrl(`/organization-login`);
  }
  
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
       //   this.locationId =  this.locations[0].rowId;
          this.user.locID = this.locations[0].rowId;
          this.loginForm.patchValue(this.user)
        },
        (err: any) => {
          // this.errorMsg = 'Error occured';
        }
      );
  }
  
  validateUser() { 
    this.isSubmit =  false;
    if(this.loginForm.invalid){
      this.isSubmit =  true;
      return false;
    }
    const req = {...this.loginForm.value,locID:Number(this.loginForm.value.locID)};
    this.commonService.validateUserCredentials(req).subscribe(data => {
      this.localService.setLocalStorage('locId',Number(this.loginForm.value.locID)); 
          if (data?.body.token!='' && data?.body.userdto.userName) {
            this.localService.setLocalStorage('userObj',data?.body);       
            this.router.navigateByUrl(`/${this.organizationName}/home`);
          } else {
            alert('Invalid User Credentials.');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid credentials or No user found.' });
          }
          
        },
        (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'error', detail: 'Invalid User Credentials' });
        
          this.errorMsg = 'Error occured';
        }
      );
  }

}
