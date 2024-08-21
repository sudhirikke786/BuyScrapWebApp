import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../core/services/common.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../core/interfaces/common-interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StorageService } from '../core/services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class UserLoginComponent implements OnInit {

  loginForm!: FormGroup
  consentForm!: FormGroup;
  
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

  showPrivacy = false;
  isMandatoryConsentAccepted = false;
  latestPublishDate: any;
  displayWarningDialog = false;
  displayUserConsent = false;
  showPrivacyConsent = false;
  warningMessage = '';
  submitted  =  false;
  registrationForm!: FormGroup;
  userData: any;

  byPassConsent: boolean = false;
  consetInfo: any;
  consetData: any;
  
  consentLoading = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private http:HttpClient,
              private localService:StorageService,
              private fb:FormBuilder,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
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
    this.getGetOrganisationConsent();
  

    this.loginForm = this.fb.group({
      userName: '',
      password: '',
      locID: null,
      locationName: '',
      isActive: true,
      isConfirm: true
    });

    this.consentForm = this.fb.group({
      consent1: [false, Validators.requiredTrue],
      consent2: [false, Validators.requiredTrue],
      consent3: [false]
    });
  
    this.consentForm.statusChanges.subscribe(() => {
      this.updateSubmitButtonState();
    });

  }

  // Check if the button should be enabled
  isSubmitEnabled(): boolean {
    return this.consentForm.get('consent1')?.value && this.consentForm.get('consent2')?.value;
  }

  updateSubmitButtonState() {
    const isEnabled = this.isSubmitEnabled();
    // Logic to enable/disable the button
    // You might not need this method if you bind directly to `isSubmitEnabled()` in the template
  }

  onSubmit() {
    if (this.consentForm.valid) {
      // Handle form submission
      alert('valid form')
    }
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
    this.http.get("https://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.user.macID = '131312236';
    });
  }
  
  getGetOrganisationConsent(){

    this.commonService.GetOrganisationConsent({OrganisationName:this.organizationName}).subscribe((res) =>{
      this.isMandatoryConsentAccepted = res?.data?.isMandatoryConsentAccepted ==  false ? true :  false;
      this.byPassConsent = true;
    })

    
    if (this.organizationName.toLowerCase() != 'prodtest') {
      this.isMandatoryConsentAccepted = true;
      this.byPassConsent = true;
      this.latestPublishDate = '08/17/2024';       
    } else {
      this.isMandatoryConsentAccepted = false;
      this.byPassConsent = true;
      this.latestPublishDate = '08/17/2024';     
    }


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
    const req = {...this.loginForm.value,locID:Number(this.loginForm.value.locID)};
    this.commonService.validateUserCredentials(req).subscribe((data) => {
          if (data?.body.token!='' && data?.body.userdto.userName) {
            this.displayOrganisationConsent(data);
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

  private displayOrganisationConsent(data: any) {
    // Convert the string to a Date object
    let date = new Date(this.latestPublishDate);

    // Add 10 days to the date
    date.setDate(date.getDate() + 5);

    // Format the new date back to 'MM/dd/yyyy'
    const latestAcceptanceDate = this.FormatDate(date);

    console.log(latestAcceptanceDate); // Outputs: 08/27/2024
    this.userData = data;
        

    if (!this.isMandatoryConsentAccepted) {      
      if (data?.body.userdto.role == 'Administrator') {
        // display waring window to Scale & Cashier to intimate Administrator
        // OnClick or OnCancel of pop-up window we will allow user to redirect on Home page 
        // till 10 days after Publish date        
        this.displayUserConsent = true;
        this.getConsetInfo();
        // TO DO : API call to get consent data
        // https://api.buyscrapapp.com/Consent/GetConsentDetails
      } else {
        // display waring window to Scale & Cashier to intimate Administrator
        // OnClick or OnCancel of pop-up window we will allow user to redirect on Home page
        // till 10 days after Publish date 
        this.warningMessage = "As per the new policy changes, the Administrator needs to accept the Privacy Policy and End User License Agreement by " + latestAcceptanceDate + ". Otherwise, the user will not be able to log in after " + latestAcceptanceDate + ".";
        this.displayWarningDialog = true;
      }
    } else {
      this.redirectToHomePage(data);
    }
  }


  showConsentModal(consetInfo:any){
    this.consetData = consetInfo.htmlContent
    this.showPrivacyConsent=true
  }


  getConsetInfo(){


    this.consentLoading = true;

    this.commonService.GetConsentDetails({}).subscribe((res) =>{

      this.consentLoading = false;

      this.consetInfo = res.body.data;
        console.log(this.consetInfo);
    },(error) =>{
      this.consentLoading = false;

    })
  }

  agreeConsents() {
    //alert('agree')
    this.displayUserConsent = false;   
    this.displayWarningDialog = false;

    // const reqgObj = {
    //   "rowId": 0,
    //   "consentIds":"1,2",
    //   "organisationId": 1,
    //   "isAccepted": true,
    //   "consentGivenDate": "2024-08-17T18:14:02.693Z",
    //   "consentGivenBy": 1 //loged in user id
    // }
    // this.commonService.insertConsentdetail(reqgObj).subscribe((res) =>{
        //this.redirectToHomePage(this.userData);
    // });
    
  }

  closeWarningDialog() {
    //alert('close');
    this.warningMessage = "";     
    this.displayUserConsent = false;   
    this.displayWarningDialog = false;
    this.redirectToHomePage(this.userData);
  }

  private FormatDate(date: Date) {
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
    let yyyy = date.getFullYear();

    const latestAcceptanceDate = mm + '/' + dd + '/' + yyyy;
    return latestAcceptanceDate;
  }

  redirectToHomePage(data: any) {    
    // Convert the string to a Date object
    let date = new Date(this.latestPublishDate);

    // Add 5 days to the date
    date.setDate(date.getDate() + 5);

    // Format the new date back to 'MM/dd/yyyy'
    const latestAcceptanceDate = this.FormatDate(date);
    
    let todayDate = new Date();
    const today = this.FormatDate(todayDate);

    if (this.organizationName.toLowerCase() == 'prodtest' && data?.body.userdto.role != 'Administrator' && today >= latestAcceptanceDate) {
      this.messageService.add({ severity: 'error', summary: 'error', detail: 'Your access is restricted. Please contact the Administrator to accept the updated Privacy Policy and End User License Agreement to regain access.' });
      return;
    }

    //Local setting efore redirecting to home page
    this.localService.setLocalStorage('locId',Number(this.loginForm.value.locID)); 
    const locationName = this.loginForm.value.locationName;
    localStorage.setItem('locationName',locationName);
    localStorage.setItem('currencyCode',this.selectedLocation?.currencyCode || 'USD'); 
    this.localService.setLocalStorage('userObj', data?.body);

    let reqObj = {
      Key:'',
      ManageByStore:true
    }
    this.commonService.GetSystemPreferencesValue(reqObj).subscribe((systemInfo) => {      
      console.log(systemInfo?.body?.data);
      if (systemInfo?.body?.data) {
        this.localService.setLocalStorage('systemInfo', systemInfo?.body?.data);
      }
      this.router.navigateByUrl(`/${this.organizationName}/home`);
    },
    (err: any) => {
      this.router.navigateByUrl(`/${this.organizationName}/home`);
    });

  }
   

  

}
