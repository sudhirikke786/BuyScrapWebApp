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
  selectedLocation: any;
  errorMsg: any;
  user: User = {
    userName: '',
    password: '',
    locID: 1,
    locationName: '',
    macID: '',    
    isActive: true,
    isConfirm: true
  };
  locationId: number = 1;
  inputType: string  = 'password';
  isSubmit: boolean = false;
  isShow = false;
  currencyCode: string  = 'USD';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http:HttpClient,
              private localService:StorageService,
              private fb:FormBuilder,
              private messageService: MessageService,
              private commonService: CommonService) { }

  ngOnInit() {
    this.user.macID = "defaultMacId"

    const userObjectExist = this.localService.getLocalStorage('userObj');
    if(userObjectExist){
      this.router.navigateByUrl(`/${this.organizationName}/home`);
    }
    this.getIPAddress();
    this.route.params.subscribe((param)=>{ 
      this.organizationName = param["orgName"];
      this.getOrgLocation();
    });
    if(userObjectExist){
      this.router.navigateByUrl(`/${this.organizationName}/home`);
    }

  

    this.loginForm = this.fb.group({
      userName: '',
      password: '',
      locID: null,
      locationName: '',
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
    this.isShow = true;
    this.commonService.getOrgLocation()
      .subscribe(data => {
        this.isShow = false;
          console.log('getOrgLocation :: ');
          console.log(data);
          this.locations = data.body.data;
          this.selectedLocation = this.locations[0];
          this.locationId =  this.locations[0].rowId;
          this.user.locID = this.locations[0].rowId;
          this.user.locationName = this.locations[0].locationName;
          this.loginForm.patchValue(this.user)
        },
        (err: any) => {
          this.isShow = false;
          // this.errorMsg = 'Error occured';
        }
      );
  }

  changeLocationChange(locationId: any) {
    // alert(locationId);
    this.selectedLocation = this.locations.filter((item:any) => item.rowId == locationId)[0];
    // alert(JSON.stringify(this.selectedLocation));
  }
  
  validateUser() { 
    this.isSubmit =  false;
    if(this.loginForm.invalid){
      this.isSubmit =  true;
      return false;
    }    
    const locationName = this.loginForm.value.locationName;
    const req = {...this.loginForm.value,locID:Number(this.loginForm.value.locID)};
    this.commonService.validateUserCredentials(req).subscribe(async(data) => {
      this.localService.setLocalStorage('locId',Number(this.loginForm.value.locID)); 
      localStorage.setItem('locationName',locationName);
      localStorage.setItem('currencyCode',this.selectedLocation?.currencyCode); 
          if (data?.body.token!='' && data?.body.userdto.userName) {
            this.localService.setLocalStorage('userObj',data?.body);     
            
               const systemInfo = await this.getSystemPreferencesValue(); 

            //  const obj =  systemInfo?.body?.data?.reduce((result:any,item:any) => {
            //   const keyValue = item['keys'];

            //   // If the key doesn't exist in the result, create an empty array for it
            //   if (!result[keyValue]) {
            //     result[keyValue] = [];
            //   }
          
            //   // Push the current item into the array for the corresponding key
            //   result[keyValue].push(item);
          
            //   return result;
            // },{})
            // console.log(obj)

            if(systemInfo?.body?.data){
              this.localService.setLocalStorage('systemInfo',systemInfo?.body?.data)   
            }
           
           console.log(systemInfo?.body?.data);  
            this.router.navigateByUrl(`/${this.organizationName}/home`);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid credentials or No user found.' });
          }
          
        },
        (err: any) => {
          this.messageService.add({ severity: 'error', summary: 'error', detail: 'Invalid User Credentials' });
        
          this.errorMsg = 'Error occured';
        }
      );
  }

  getSystemPreferencesValue(){
    let reqObj = {
      Key:'',
      ManageByStore:true
    }
    return this.commonService.GetSystemPreferencesValue(reqObj).toPromise()

   }
   

  

}
